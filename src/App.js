import { TexasHoldem } from "poker-odds-calc";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import CardDictionary from "./CardDictionary.js";
import Community from "./Community";
import Console from "./Console";

import Player from "./Player";

const antenna2Player = {
  1: "3",
  2: "2",
  3: "1",
  4: "6",
  5: "4",
  6: "8",
  7: "7",
  8: "5",
};
let storedCards = [];
let playersAtTable = ["1", "2", "3", "4"];
let smallBlind = 0.5;
let bigBlind = 1;

function App(props) {
  //STATE
  const [socket, setSocket] = useState(null);

  const [button, setButton] = useState("5");

  const [player1Graphics, _setPlayer1Graphics] = useState({
    action: "",
    card1: null,
    card2: null,
    name: "Leon",
    percent: 23,
    currentPlayerBet: 0,
  });
  const player1GraphicsRef = useRef(player1Graphics);
  const setPlayer1Graphics = (data) => {
    _setPlayer1Graphics(data);
    player1GraphicsRef.current = data;
  };

  const [player2Graphics, _setPlayer2Graphics] = useState({
    action: "",
    card1: null,
    card2: null,
    name: "Jules",
    percent: 23,
    currentPlayerBet: 0,
  });
  const player2GraphicsRef = useRef(player2Graphics);
  const setPlayer2Graphics = (data) => {
    _setPlayer2Graphics(data);
    player2GraphicsRef.current = data;
  };

  const [player3Graphics, _setPlayer3Graphics] = useState({
    action: "",
    card1: null,
    card2: null,
    name: "Mike",
    percent: 23,
    currentPlayerBet: 0,
  });
  const player3GraphicsRef = useRef(player3Graphics);
  const setPlayer3Graphics = (data) => {
    _setPlayer3Graphics(data);
    player3GraphicsRef.current = data;
  };

  const [player4Graphics, _setPlayer4Graphics] = useState({
    action: "",
    card1: null,
    card2: null,
    name: "Vas",
    percent: 23,
    currentPlayerBet: 0,
  });
  const player4GraphicsRef = useRef(player4Graphics);
  const setPlayer4Graphics = (data) => {
    _setPlayer4Graphics(data);
    player4GraphicsRef.current = data;
  };

  const [player5Graphics, _setPlayer5Graphics] = useState({
    action: "",
    card1: null,
    card2: null,
    name: "",
    percent: 23,
    currentPlayerBet: 0,
  });
  const player5GraphicsRef = useRef(player5Graphics);
  const setPlayer5Graphics = (data) => {
    _setPlayer5Graphics(data);
    player5GraphicsRef.current = data;
  };

  const [communityCards, _setCommunityCards] = useState([]);
  const communityCardsRef = useRef(communityCards);
  const setCommunityCards = (data) => {
    _setCommunityCards(data);
    communityCardsRef.current = data;
  };

  const [inHandPlayers, _setInHandPlayers] = useState(playersAtTable);
  const inHandPlayersRef = useRef(inHandPlayers);
  const setInHandPlayers = (data) => {
    _setInHandPlayers(data);
    inHandPlayersRef.current = data;
  };

  const [allInPlayers, _setAllInPlayers] = useState([]);
  const allInPlayersRef = useRef(allInPlayers);
  const setAllInPlayers = (data) => {
    _setAllInPlayers(data);
    allInPlayersRef.current = data;
  };

  const [pot, setPot] = useState(0);

  const [currentBet, setCurrentBet] = useState(0);

  const [round, setRound] = useState("Break");

  const [graphicsFocusPlayer, setGraphicsFocusPlayer] = useState("1");

  //Use Effect

  useEffect(() => {
    //SOCKET
    setSocket("http://localhost:8888", { transports: ["websocket"] });

    socket.off("sendState").on("sendState", (state) => {
      // console.log(state.state.players);
      state.state.players.forEach((player) => {
        const playerGraphicsRef = getCorrectGraphicsRef(player.id);
        const playerGraphicsSetState = getCorrectGraphicsSetState(player.id);

        playerGraphicsSetState({
          ...playerGraphicsRef.current,
          card1: player.card1,
          card2: player.card2,
        });
      });

      setCommunityCards(state.state.communityCards);

      recalculateAllPercentages();
    });
  }, []);

  // useEffect(() => {
  //   try {
  //     recalculateAllPercentages();
  //   } catch (e) {}
  // }, [communityCards]);

  useEffect(() => {
    try {
      recalculateAllPercentages();
    } catch (e) {}
  }, [inHandPlayers]);

  useEffect(() => {
    socket.emit("roundChange", round);
  }, [round]);

  //FUNCTIONS

  const isRoundOver = () => {
    let roundOver = true;

    inHandPlayers.forEach((player) => {
      const playerGraphicsRef = getCorrectGraphicsRef(player);
      if (
        !playerGraphicsRef.current.action ||
        playerGraphicsRef.current.action.includes("BTN") ||
        playerGraphicsRef.current.action.includes("SB") ||
        playerGraphicsRef.current.action.includes("BB")
      ) {
        roundOver = false;
      }
      console.log(playerGraphicsRef.current.action);
    });

    if (roundOver) {
      setGraphicsFocusPlayer(null);
    } else {
      setNextGraphicsFocusPlayer();
    }
  };

  const addPlayerCardGraphics = (player, cardValue) => {
    // console.log("player", player);
    // console.log("cardValue", cardValue);

    const playerGraphicsRef = getCorrectGraphicsRef(player);
    const playerGraphicsSetState = getCorrectGraphicsSetState(player);

    // console.log(playerGraphicsRef);

    if (!playerGraphicsRef.current.card1) {
      playerGraphicsSetState({
        ...playerGraphicsRef.current,
        card1: cardValue,
      });
    } else if (!playerGraphicsRef.current.card2) {
      playerGraphicsSetState({
        ...playerGraphicsRef.current,
        card2: cardValue,
      });
    }
  };

  const addCommunityCardsGraphics = (cardValue) => {
    if (communityCardsRef.current.length <= 5) {
      setCommunityCards([...communityCardsRef.current, cardValue]);
    }
  };

  const recalculateAllPercentages = () => {
    const Table = new TexasHoldem();

    inHandPlayersRef.current.forEach((player) => {
      const playerGraphicsRef = getCorrectGraphicsRef(player);

      if (playerGraphicsRef.current.card2) {
        Table.setPlayerHand(
          [playerGraphicsRef.current.card1, playerGraphicsRef.current.card2],
          player
        );
      }
    });

    allInPlayersRef.current.forEach((player) => {
      const playerGraphicsRef = getCorrectGraphicsRef(player);

      if (playerGraphicsRef.current.card2) {
        Table.setPlayerHand(
          [playerGraphicsRef.current.card1, playerGraphicsRef.current.card2],
          player
        );
      }
    });

    if (communityCardsRef.current.length > 0) {
      Table.setBoard([...communityCardsRef.current]);
    }

    const Result = Table.calculate();
    console.log("percent Results", Result);

    Result.getPlayers().forEach((playerResult) => {
      const player = playerResult.getName().split("Player #")[1][0];
      const playerGraphicsRef = getCorrectGraphicsRef(player);
      const playerGraphicsSetState = getCorrectGraphicsSetState(player);

      playerGraphicsSetState({
        ...playerGraphicsRef.current,
        percent: playerResult.getWinsPercentageString(),
      });
    });
  };

  const setNextRound = () => {
    if (round === "Break") {
      //sets to pre-flop in newHand
      newHand();
    } else if (round === "PreFlop") {
      setRound("Flop");
      clearInHandPlayersOnRound();
      setCurrentBet(0);
      setGraphicsFocusPlayerOnRound();
    } else if (round === "Flop") {
      setRound("Turn");
      clearInHandPlayersOnRound();
      setCurrentBet(0);
      setGraphicsFocusPlayerOnRound();
    } else if (round === "Turn") {
      setRound("River");
      clearInHandPlayersOnRound();
      setCurrentBet(0);
      setGraphicsFocusPlayerOnRound();
    } else if (round === "River") {
      setRound("Break");

      clearInHandPlayersOnRound();
      setCurrentBet(0);
      clearAllLoadedCards();
    }
  };

  const setNextGraphicsFocusPlayer = () => {
    var i = inHandPlayers.indexOf(graphicsFocusPlayer);
    var len = inHandPlayers.length;

    var current = inHandPlayers[i];
    var previous = inHandPlayers[(i + len - 1) % len];
    var next = inHandPlayers[(i + 1) % len];

    setGraphicsFocusPlayer(next);
  };

  const setGraphicsFocusPlayerOnRound = () => {
    let playerStillInHand = false;
    let i = playersAtTable.indexOf(button);

    while (!playerStillInHand) {
      var len = playersAtTable.length;

      var next = playersAtTable[(i + 1) % len];

      if (inHandPlayers.includes(next)) {
        setGraphicsFocusPlayer(next);
        playerStillInHand = true;
      } else {
        i = playersAtTable.indexOf(next);
      }
    }
  };

  const setNextButton_sb_bb_focus = () => {
    var i = playersAtTable.indexOf(button);
    var len = playersAtTable.length;

    var newButton = playersAtTable[(i + 1) % len];
    var smallBlindPlayer = playersAtTable[(i + 2) % len];
    var bigBlindPlayer = playersAtTable[(i + 3) % len];
    var focusPlayer = playersAtTable[(i + 4) % len];

    setButton(newButton);
    setGraphicsFocusPlayer(focusPlayer);

    const smallBlindPlayerState = getCorrectGraphicsState(smallBlindPlayer);
    const smallBlindPlayerSetState =
      getCorrectGraphicsSetState(smallBlindPlayer);

    smallBlindPlayerSetState({
      ...smallBlindPlayerState,
      action: "SB",
      currentPlayerBet: smallBlind,
    });

    const bigBlindPlayerState = getCorrectGraphicsState(bigBlindPlayer);
    const bigBlindPlayerSetState = getCorrectGraphicsSetState(bigBlindPlayer);

    bigBlindPlayerSetState({
      ...bigBlindPlayerState,
      action: "BB",
      currentPlayerBet: bigBlind,
    });

    playersAtTable.forEach((player) => {
      if (player === newButton) {
        const playerGraphicsState = getCorrectGraphicsState(player);
        const playerGraphicsSetState = getCorrectGraphicsSetState(player);

        playerGraphicsSetState({
          ...playerGraphicsState,

          action: "BTN",
          currentPlayerBet: 0,
        });
      } else if (player !== bigBlindPlayer && player !== smallBlindPlayer) {
        const playerGraphicsState = getCorrectGraphicsState(player);
        const playerGraphicsSetState = getCorrectGraphicsSetState(player);

        playerGraphicsSetState({
          ...playerGraphicsState,

          action: "",
          currentPlayerBet: 0,
        });
      }
    });
  };

  const clearInHandPlayersOnBet = (better, amount) => {
    inHandPlayers.forEach((player) => {
      if (player !== better) {
        const correctGraphicsState = getCorrectGraphicsState(player);
        const correctGraphicsSetState = getCorrectGraphicsSetState(player);

        correctGraphicsSetState({
          ...correctGraphicsState,
          // action: `${amount - correctGraphicsState.currentPlayerBet} to Call`,
          action: "",
        });
      }
    });
  };

  const clearInHandPlayersOnRound = () => {
    inHandPlayers.forEach((player) => {
      const correctGraphicsState = getCorrectGraphicsState(player);
      const correctGraphicsSetState = getCorrectGraphicsSetState(player);

      correctGraphicsSetState({
        ...correctGraphicsState,
        // action: `${amount - correctGraphicsState.currentPlayerBet} to Call`,
        action: "",
        currentPlayerBet: 0,
      });
    });
  };

  const getCardValue = (cardUID) => {
    return CardDictionary[cardUID];
  };

  const getCorrectGraphicsState = (player) => {
    if (player === "1") return player1Graphics;
    if (player === "2") return player2Graphics;
    if (player === "3") return player3Graphics;
    if (player === "4") return player4Graphics;
    if (player === "5") return player5Graphics;
    if (player === "6" || player === "7" || player === "8")
      return communityCards;
  };

  const getCorrectGraphicsSetState = (player) => {
    if (player === "1") return setPlayer1Graphics;
    if (player === "2") return setPlayer2Graphics;
    if (player === "3") return setPlayer3Graphics;
    if (player === "4") return setPlayer4Graphics;
    if (player === "5") return setPlayer5Graphics;
    if (player === "6" || player === "7" || player === "8")
      return setCommunityCards;
  };

  const getCorrectGraphicsRef = (player) => {
    if (player === "1") return player1GraphicsRef;
    if (player === "2") return player2GraphicsRef;
    if (player === "3") return player3GraphicsRef;
    if (player === "4") return player4GraphicsRef;
    if (player === "5") return player5GraphicsRef;
    if (player === "6" || player === "7" || player === "8")
      return communityCardsRef;
  };

  const setPlayerGraphicsAction = (player, actionText) => {
    const playerGraphicsState = getCorrectGraphicsState(player);
    const playerGraphicsSetState = getCorrectGraphicsSetState(player);

    playerGraphicsSetState({ ...playerGraphicsState, action: actionText });
  };

  const newHand = () => {
    setInHandPlayers(playersAtTable);

    setAllInPlayers([]);

    setCurrentBet(bigBlind);

    setPot(smallBlind + bigBlind);

    setNextButton_sb_bb_focus();

    setTimeout(() => {
      setRound("PreFlop");
    }, [700]);
  };

  const clearAllLoadedCards = () => {
    playersAtTable.forEach((player) => {
      const playerGraphicsState = getCorrectGraphicsState(player);
      const playerGraphicsSetState = getCorrectGraphicsSetState(player);

      playerGraphicsSetState({
        ...playerGraphicsState,
        card1: null,
        card2: null,
        percent: null,
      });
    });

    setCommunityCards([]);
    storedCards = [];
    socket.emit("clearAllCards", {});
  };

  const clearAllPlayerActions = () => {
    playersAtTable.forEach((player) => {
      const playerGraphicsState = getCorrectGraphicsState(player);
      const playerGraphicsSetState = getCorrectGraphicsSetState(player);

      playerGraphicsSetState({
        ...playerGraphicsState,
        action: "",
      });
    });
  };

  const clearAllPlayerCurrentBet = () => {
    playersAtTable.forEach((player) => {
      const playerGraphicsState = getCorrectGraphicsState(player);
      const playerGraphicsSetState = getCorrectGraphicsSetState(player);

      playerGraphicsSetState({
        ...playerGraphicsState,
        currentPlayerBet: 0,
      });
    });
  };

  const forceBreak = () => {
    setRound("Break");
    clearAllLoadedCards();
  };

  const moveButton = () => {
    var i = playersAtTable.indexOf(button);
    var len = playersAtTable.length;

    var current = playersAtTable[i];
    var previous = playersAtTable[(i + len - 1) % len];
    var next = playersAtTable[(i + 1) % len];

    setButton(next);
  };

  const handleBet = (player, amount) => {
    const playerGraphicsState = getCorrectGraphicsState(player);
    const playerGraphicsSetState = getCorrectGraphicsSetState(player);

    if (currentBet === 0) {
      playerGraphicsSetState({
        ...playerGraphicsState,
        currentPlayerBet: amount,
        action: `Bet $${amount}`,
      });

      setCurrentBet(amount);

      setPot(pot + amount);
    } else {
      const newPot = pot + (amount - playerGraphicsState.currentPlayerBet);

      playerGraphicsSetState({
        ...playerGraphicsState,
        currentPlayerBet: amount,
        action: `Raise to $${amount}`,
      });
      setCurrentBet(amount);
      setPot(newPot);
    }

    clearInHandPlayersOnBet(player, amount);
    setNextGraphicsFocusPlayer();
  };

  const handleCall = (player) => {
    const playerGraphicsState = getCorrectGraphicsState(player);
    const playerGraphicsSetState = getCorrectGraphicsSetState(player);

    const trueAmount = currentBet - playerGraphicsState.currentPlayerBet;
    const newPlayerCurrentPlayerBet =
      trueAmount + playerGraphicsState.currentPlayerBet;

    playerGraphicsSetState({
      ...playerGraphicsState,
      currentPlayerBet: newPlayerCurrentPlayerBet,
      action: "Call",
    });

    const newPotSize = trueAmount + pot;
    setPot(newPotSize);

    isRoundOver();
  };

  const handleCheck = (player) => {
    const playerGraphicsState = getCorrectGraphicsState(player);
    const playerGraphicsSetState = getCorrectGraphicsSetState(player);

    playerGraphicsSetState({ ...playerGraphicsState, action: "Check" });
    isRoundOver();
  };

  const handleFold = (player) => {
    removePlayerFromHand(player);
    isRoundOver();
  };

  const handleAllIn = (player) => {
    const playerGraphicsState = getCorrectGraphicsState(player);
    const playerGraphicsSetState = getCorrectGraphicsSetState(player);

    playerGraphicsSetState({
      ...playerGraphicsState,
      action: "All-In",
    });

    removePlayerFromHand(player);
    setNextGraphicsFocusPlayer();
    setAllInPlayers([...allInPlayers, player]);
    clearInHandPlayersOnBet(player);
  };

  const removePlayerFromHand = (player) => {
    const newArray = inHandPlayers.filter((item) => item !== player);
    setInHandPlayers(newArray);
  };

  const changePlayerName = (player, newName) => {
    const playerGraphicsState = getCorrectGraphicsState(player);
    const playerGraphicsSetState = getCorrectGraphicsSetState(player);

    playerGraphicsSetState({
      ...playerGraphicsState,
      name: newName,
    });
  };

  const changePlayersAtTable = (seatsArray) => {
    playersAtTable = seatsArray;
  };

  const changeBlinds = (small, big) => {
    smallBlind = small;
    bigBlind = big;
  };

  let playerGraphicsClass =
    "playerGraphics" + (round !== "Break" ? " alive" : "");

  return (
    <div className="App">
      <div className={playerGraphicsClass}>
        <Player
          focus={graphicsFocusPlayer === "1"}
          graphics={player1Graphics}
          display={inHandPlayers.includes("1") || allInPlayers.includes("1")}
        />
        <Player
          focus={graphicsFocusPlayer === "2"}
          graphics={player2Graphics}
          display={inHandPlayers.includes("2") || allInPlayers.includes("2")}
        />
        <Player
          focus={graphicsFocusPlayer === "3"}
          graphics={player3Graphics}
          display={inHandPlayers.includes("3") || allInPlayers.includes("3")}
        />
        <Player
          focus={graphicsFocusPlayer === "4"}
          graphics={player4Graphics}
          display={inHandPlayers.includes("4") || allInPlayers.includes("4")}
        />
        <Player
          focus={graphicsFocusPlayer === "5"}
          graphics={player5Graphics}
          display={inHandPlayers.includes("5") || allInPlayers.includes("5")}
        />
      </div>

      <Community pot={pot} cards={communityCards} round={round} />

      <Console
        player1Graphics={player1Graphics}
        player2Graphics={player2Graphics}
        player3Graphics={player3Graphics}
        player4Graphics={player4Graphics}
        player5Graphics={player5Graphics}
        newHand={newHand}
        setPlayerGraphicsAction={setPlayerGraphicsAction}
        handleBet={handleBet}
        handleCall={handleCall}
        handleCheck={handleCheck}
        handleFold={handleFold}
        inHandPlayers={inHandPlayers}
        removePlayerFromHand={removePlayerFromHand}
        round={round}
        setNextRound={setNextRound}
        graphicsFocusPlayer={graphicsFocusPlayer}
        forceBreak={forceBreak}
        button={button}
        moveButton={moveButton}
        clearAllLoadedCards={clearAllLoadedCards}
        handleAllIn={handleAllIn}
        changePlayerName={changePlayerName}
        changePlayersAtTable={changePlayersAtTable}
        changeBlinds={changeBlinds}
      />
    </div>
  );
}

export default App;
