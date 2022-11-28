import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./App.css";
import Player from "./Player";
import Console from "./Console";
import Card from "./Card";
import CardDictionary from "./CardDictionary.js";
import { TexasHoldem } from "poker-odds-calc";

const antenna2Player = {
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
};
let storedCards = [];
const playersAtTable = ["1", "2", "3", "4", "5"];
const smallBlind = 1;
const bigBlind = 2;

function App(props) {
  //SOCKET
  let socket = io("http://localhost:8888", { transports: ["websocket"] });

  useEffect(() => {
    socket.off("serialdata").on("serialdata", (serialdata) => {
      const antenna = serialdata.data.split("antenna: ")[1][0];
      const cardUID = serialdata.data.split("UID: ")[1].split(",")[0];

      if (!storedCards.includes(cardUID)) {
        storedCards.push(cardUID);

        const player = antenna2Player[antenna];
        const cardValue = getCardValue(cardUID);

        // console.log("player", player);
        // console.log("cardValue", cardValue);
        if (
          player === "1" ||
          player === "2" ||
          player === "3" ||
          player === "4" ||
          player === "5"
        ) {
          addPlayerCardGraphics(player, cardValue);
        } else if (player === "6" || player === "7" || player === "8") {
          addCommunityCardsGraphics(cardValue);
        }
      }
    });
  }, []);

  //STATE
  const [button, setButton] = useState("5");

  const [communityCards, _setCommunityCards] = useState([]);
  const communityCardsRef = useRef(communityCards);

  const setCommunityCards = (data) => {
    _setCommunityCards(data);
    communityCardsRef.current = data;
  };

  const [player1Graphics, _setPlayer1Graphics] = useState({
    action: "",
    card1: null,
    card2: null,
    name: "Greg",
    percent: null,
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
    name: "Josh",
    percent: null,
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
    name: "David",
    percent: null,
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
    name: "Michael",
    percent: null,
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
    name: "Andrew",
    percent: null,
    currentPlayerBet: 0,
  });
  const player5GraphicsRef = useRef(player5Graphics);
  const setPlayer5Graphics = (data) => {
    _setPlayer5Graphics(data);
    player5GraphicsRef.current = data;
  };

  const [pot, setPot] = useState(0);

  const [currentBet, setCurrentBet] = useState(0);

  const [inHandPlayers, setInHandPlayers] = useState(playersAtTable);

  const [round, setRound] = useState("Break");

  const [graphicsFocusPlayer, setGraphicsFocusPlayer] = useState("1");

  //FUNCTIONS

  const addPlayerCardGraphics = (player, cardValue) => {
    console.log("player", player);
    console.log("cardValue", cardValue);

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

  const setNextRound = () => {
    if (round === "Break") {
      //sets to pre-flop in newHand
      newHand();
    } else if (round === "PreFlop") {
      setRound("Flop");
      clearInHandPlayersOnRound();
      setCurrentBet(0);
    } else if (round === "Flop") {
      setRound("Turn");
      clearInHandPlayersOnRound();
      setCurrentBet(0);
    } else if (round === "Turn") {
      setRound("River");
      clearInHandPlayersOnRound();
      setCurrentBet(0);
    } else if (round === "River") {
      setRound("Break");
      clearInHandPlayersOnRound();
      setCurrentBet(0);
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

  const setPreviousGraphicsFocusPlayer = () => {
    var i = inHandPlayers.indexOf(graphicsFocusPlayer);
    var len = inHandPlayers.length;

    var current = inHandPlayers[i];
    var previous = inHandPlayers[(i + len - 1) % len];
    var next = inHandPlayers[(i + 1) % len];

    setGraphicsFocusPlayer(previous);
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
      action: `$${smallBlind}`,
    });

    const bigBlindPlayerState = getCorrectGraphicsState(bigBlindPlayer);
    const bigBlindPlayerSetState = getCorrectGraphicsSetState(bigBlindPlayer);

    bigBlindPlayerSetState({
      ...bigBlindPlayerState,
      action: `$${bigBlind}`,
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

    setCurrentBet(bigBlind);

    setPot(smallBlind + bigBlind);

    storedCards = [];

    setRound("PreFlop");

    setCommunityCards([]);

    //this should be split up into clear cards / clear action
    playersAtTable.forEach((player) => {
      const playerGraphicsState = getCorrectGraphicsState(player);
      const playerGraphicsSetState = getCorrectGraphicsSetState(player);

      playerGraphicsSetState({
        ...playerGraphicsState,
        action: "",
        card1: null,
        card2: null,
        currentPlayerBet: 0,
      });
    });

    setNextButton_sb_bb_focus();
  };

  const forceBreak = () => {
    setRound("Break");
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

    setNextGraphicsFocusPlayer();
  };

  const handleCheck = (player) => {
    const playerGraphicsState = getCorrectGraphicsState(player);
    const playerGraphicsSetState = getCorrectGraphicsSetState(player);

    playerGraphicsSetState({ ...playerGraphicsState, action: "Check" });
    setNextGraphicsFocusPlayer();
  };

  const handleFold = (player) => {
    removePlayerFromHand(player);
    setNextGraphicsFocusPlayer();
  };

  const removePlayerFromHand = (player) => {
    const newArray = inHandPlayers.filter((item) => item !== player);
    setInHandPlayers(newArray);
  };

  return (
    <div className="App">
      {round !== "Break" ? (
        <div className="playerGraphics">
          {inHandPlayers.includes("1") ? (
            <Player graphics={player1Graphics} />
          ) : null}
          {inHandPlayers.includes("2") ? (
            <Player graphics={player2Graphics} />
          ) : null}
          {inHandPlayers.includes("3") ? (
            <Player graphics={player3Graphics} />
          ) : null}
          {inHandPlayers.includes("4") ? (
            <Player graphics={player4Graphics} />
          ) : null}
          {inHandPlayers.includes("5") ? (
            <Player graphics={player5Graphics} />
          ) : null}
        </div>
      ) : null}

      {round !== "Break" ? (
        <div className="pot_community">
          <div className="pot">POT: ${pot}</div>
          <div className="community">
            {communityCards.map((cardValue) => (
              <Card cardValue={cardValue} />
            ))}
          </div>
        </div>
      ) : null}

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
        addPlayerCardGraphics={addPlayerCardGraphics}
      />
    </div>
  );
}

export default App;
