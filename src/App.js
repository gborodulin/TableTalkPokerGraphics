import React, { useState } from "react";
import io from "socket.io-client";
import "./App.css";
import Player from "./Player";
import Console from "./Console";
import CardDictionary from "./CardDictionary.js";
import useHistoryState from "use-history-state";
import { TexasHoldem } from "poker-odds-calc";

function App(props) {
  let socket = io("http://localhost:8888", { transports: ["websocket"] });

  let storedCards = [];

  socket.on("serialdata", (serialdata) => {
    const player = serialdata.data.split("antenna: ")[1][0];
    const cardUID = serialdata.data.split("UID: ")[1].split(",")[0];
    // console.log("player: ", player);
    // console.log("cardUID: ", cardUID);
    const cardValue = getCardValue(cardUID);
    console.log(cardValue);

    if (!storedCards.includes(cardValue)) {
      storedCards.push(cardValue);
      console.log("Value added: ", cardValue, storedCards);

      const playerGraphicsState = getCorrectGraphicsState(player);
      const playerGraphicsSetState = getCorrectGraphicsSetState(player);

      if (!playerGraphicsState.card1) {
        playerGraphicsSetState({ ...playerGraphicsState, card1: cardValue });
      } else if (
        !playerGraphicsState.card2 &&
        playerGraphicsState.card1 !== cardValue
      ) {
        playerGraphicsSetState({ ...playerGraphicsState, card2: cardValue });
      }
    }
  });

  const [player1Graphics, setPlayer1Graphics] = useHistoryState(
    {
      action: "",
      card1: null,
      card2: null,
      inHand: true,
      name: "Greg",
      percent: null,
      currentPlayerBet: 0,
    },
    "player1Graphics"
  );
  const [player2Graphics, setPlayer2Graphics] = useHistoryState(
    {
      action: "",
      card1: null,
      card2: null,
      inHand: true,
      name: "Josh",
      percent: null,
      currentPlayerBet: 0,
    },
    "player2Graphics"
  );
  const [player3Graphics, setPlayer3Graphics] = useHistoryState(
    {
      action: "",
      card1: null,
      card2: null,
      inHand: true,
      name: "David",
      percent: null,
      currentPlayerBet: 0,
    },
    "player3Graphics"
  );
  const [player4Graphics, setPlayer4Graphics] = useHistoryState(
    {
      action: "",
      card1: null,
      card2: null,
      inHand: true,
      name: "Michael",
      percent: null,
      currentPlayerBet: 0,
    },
    "player4Graphics"
  );
  const [player5Graphics, setPlayer5Graphics] = useHistoryState(
    {
      action: "",
      card1: null,
      card2: null,
      inHand: true,
      name: "Andrew",
      percent: null,
      currentPlayerBet: 0,
    },
    "player5Graphics"
  );

  const [pot, setPot] = useHistoryState(0, "pot");

  const [currentBet, setCurrentBet] = useHistoryState(0, "currentBet");

  const [inHandPlayers, setInHandPlayers] = useHistoryState(
    ["1", "2", "3", "4", "5"],
    "inHandPlayers"
  );

  const [round, setRound] = useHistoryState("PreFlop", "round");

  const setNextRound = () => {
    if (round === "PreFlop") setRound("Flop");
    if (round === "Flop") setRound("Turn");
    if (round === "Turn") setRound("River");
    if (round === "River") setRound("PreFlop");
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

  const getCardValue = (cardUID) => {
    return CardDictionary[cardUID];
  };

  const getCorrectGraphicsState = (player) => {
    if (player === "1") return player1Graphics;
    if (player === "2") return player2Graphics;
    if (player === "3") return player3Graphics;
    if (player === "4") return player4Graphics;
    if (player === "5") return player5Graphics;
  };

  const getCorrectGraphicsSetState = (player) => {
    if (player === "1") return setPlayer1Graphics;
    if (player === "2") return setPlayer2Graphics;
    if (player === "3") return setPlayer3Graphics;
    if (player === "4") return setPlayer4Graphics;
    if (player === "5") return setPlayer5Graphics;
  };

  const setPlayerGraphicsAction = (player, actionText) => {
    const playerGraphicsState = getCorrectGraphicsState(player);
    const playerGraphicsSetState = getCorrectGraphicsSetState(player);

    playerGraphicsSetState({ ...playerGraphicsState, action: actionText });
  };

  const setPlayerInHand = (player, inHand) => {
    const playerGraphicsState = getCorrectGraphicsState(player);
    const playerGraphicsSetState = getCorrectGraphicsSetState(player);

    playerGraphicsSetState({ ...playerGraphicsState, inHand: inHand });
  };

  const newHand = () => {
    setPlayer1Graphics({
      ...player1Graphics,
      action: "",
      card1: null,
      card2: null,
      inHand: true,
      currentPlayerBet: 0,
    });
    setPlayer2Graphics({
      ...player2Graphics,
      action: "",
      card1: null,
      card2: null,
      inHand: true,
      currentPlayerBet: 0,
    });
    setPlayer3Graphics({
      ...player3Graphics,
      action: "",
      card1: null,
      card2: null,
      inHand: true,
      currentPlayerBet: 0,
    });
    setPlayer4Graphics({
      ...player4Graphics,
      action: "",
      card1: null,
      card2: null,
      inHand: true,
      currentPlayerBet: 0,
    });
    setPlayer5Graphics({
      ...player5Graphics,
      action: "",
      card1: null,
      card2: null,
      inHand: true,
      currentPlayerBet: 0,
    });

    setCurrentBet(0);

    setPot(0);

    storedCards = [];
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
  };

  const handleCheck = (player) => {
    const playerGraphicsState = getCorrectGraphicsState(player);
    const playerGraphicsSetState = getCorrectGraphicsSetState(player);

    playerGraphicsSetState({ ...playerGraphicsState, action: "Check" });
  };

  const removePlayerFromHand = (player) => {
    const newArray = inHandPlayers.filter((item) => item !== player);
    setInHandPlayers(newArray);
  };

  return (
    <div className="App">
      <div className="playerGraphics">
        {player1Graphics.inHand ? <Player graphics={player1Graphics} /> : null}
        {player2Graphics.inHand ? <Player graphics={player2Graphics} /> : null}
        {player3Graphics.inHand ? <Player graphics={player3Graphics} /> : null}
        {player4Graphics.inHand ? <Player graphics={player4Graphics} /> : null}
        {player5Graphics.inHand ? <Player graphics={player5Graphics} /> : null}

        {/* <div className="pot">POT: {pot}</div>
        <div className="pot">Current Highest Bet: {currentBet}</div> */}
      </div>

      <Console
        player1Graphics={player1Graphics}
        player2Graphics={player2Graphics}
        player3Graphics={player3Graphics}
        player4Graphics={player4Graphics}
        player5Graphics={player5Graphics}
        newHand={newHand}
        setPlayerGraphicsAction={setPlayerGraphicsAction}
        setPlayerInHand={setPlayerInHand}
        handleBet={handleBet}
        handleCall={handleCall}
        handleCheck={handleCheck}
        inHandPlayers={inHandPlayers}
        removePlayerFromHand={removePlayerFromHand}
      />
    </div>
  );
}

export default App;
