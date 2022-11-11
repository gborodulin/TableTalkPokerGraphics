import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import io from "socket.io-client";
import "./App.css";
import Player from "./Player";
import Console from "./Console";
import CardDictionary from "./CardDictionary.js";

function App(props) {
  let socket = io("http://localhost:8888", { transports: ["websocket"] });

  socket.on("serialdata", (serialdata) => {
    const player = serialdata.data.split("antenna: ")[1][0];
    const cardUID = serialdata.data.split("UID: ")[1].split(",")[0];
    // console.log("player: ", player)
    // console.log("cardUID: ", cardUID)

    const cardvalue = getCardValue(cardUID);
    console.log(cardvalue);
    const playerGraphicsState = getCorrectGraphicsState(player);
    const playerGraphicsSetState = getCorrectGraphicsSetState(player);

    console.log("card2", playerGraphicsState.card2);

    if (!playerGraphicsState.card1) {
      playerGraphicsSetState({ ...playerGraphicsState, card1: cardvalue });
    } else if (
      !playerGraphicsState.card2 &&
      playerGraphicsState.card1 !== cardvalue
    ) {
      playerGraphicsSetState({ ...playerGraphicsState, card2: cardvalue });
    } else {
    }
  });

  const [player1Graphics, setPlayer1Graphics] = useState({
    action: "",
    card1: null,
    card2: null,
    inHand: false,
    name: "Greg",
  });
  const [player2Graphics, setPlayer2Graphics] = useState({
    action: "",
    card1: null,
    card2: null,
    inHand: false,
    name: "Josh",
  });
  const [player3Graphics, setPlayer3Graphics] = useState({
    action: "",
    card1: null,
    card2: null,
    inHand: false,
    name: "David",
  });
  const [player4Graphics, setPlayer4Graphics] = useState({
    action: "",
    card1: null,
    card2: null,
    inHand: false,
    name: "Michael",
  });
  const [player5Graphics, setPlayer5Graphics] = useState({
    action: "",
    card1: null,
    card2: null,
    inHand: false,
    name: "Andrew",
  });

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
    });
    setPlayer2Graphics({
      ...player2Graphics,
      action: "",
      card1: null,
      card2: null,
      inHand: true,
    });
    setPlayer3Graphics({
      ...player3Graphics,
      action: "",
      card1: null,
      card2: null,
      inHand: true,
    });
    setPlayer4Graphics({
      ...player4Graphics,
      action: "",
      card1: null,
      card2: null,
      inHand: true,
    });
    setPlayer5Graphics({
      ...player5Graphics,
      action: "",
      card1: null,
      card2: null,
      inHand: true,
    });
  };

  return (
    <div>
      <div className="graphics">
        <div className="player-cont">
          {player1Graphics.inHand ? (
            <Player graphics={player1Graphics} />
          ) : null}
          {player2Graphics.inHand ? (
            <Player graphics={player2Graphics} />
          ) : null}
          {player3Graphics.inHand ? (
            <Player graphics={player3Graphics} />
          ) : null}
          {player4Graphics.inHand ? (
            <Player graphics={player4Graphics} />
          ) : null}
          {player5Graphics.inHand ? (
            <Player graphics={player5Graphics} />
          ) : null}
        </div>
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
      />
    </div>
  );
}

export default App;
