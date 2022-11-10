import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import io from "socket.io-client";
import "./App.css";
import Player from "./Player";
import Console from "./Console";
import CardDictionary from "./CardDictionary.js"



function App(props) {
  let socket = io("http://localhost:8888", { transports: ["websocket"] });

  socket.on("serialdata", (serialdata) => {
    const player = serialdata.data.split("antenna: ")[1][0]
    const cardUID = serialdata.data.split("UID: ")[1].split(",")[0]
    // console.log("player: ", player)
    // console.log("cardUID: ", cardUID)

    const cardvalue = getCardValue(cardUID)
    console.log(cardvalue)
    const playerGraphicsState = getCorrectGraphicsState(player)
    const playerGraphicsSetState = getCorrectGraphicsSetState(player)

    console.log('card2', playerGraphicsState.card2)

    

    if(!playerGraphicsState.card1){
      playerGraphicsSetState({...playerGraphicsState, card1: cardvalue})
    }else if(!playerGraphicsState.card2 && playerGraphicsState.card1 !== cardvalue){
      playerGraphicsSetState({...playerGraphicsState, card2: cardvalue})
    }else{}
    
  });

  const [player1Graphics, setPlayer1Graphics] = useState({name: "Greg", action: "", card1: null, card2: null})
  const [player2Graphics, setPlayer2Graphics] = useState({name: "Josh", action: "", card1: null, card2: null})
  const [player3Graphics, setPlayer3Graphics] = useState({name: "David", action: "", card1: null, card2: null})
  const [player4Graphics, setPlayer4Graphics] = useState({name: "Michael", action: "", card1: null, card2: null})
  const [player5Graphics, setPlayer5Graphics] = useState({name: "Andrew", action: "", card1: null, card2: null})

  const getCardValue = (cardUID) => {
    return CardDictionary[cardUID]
 }
  const getCorrectGraphicsState = (player) => {
    if(player === '1') return player1Graphics
    if(player === '2') return player2Graphics
    if(player === '3') return player3Graphics
    if(player === '4') return player4Graphics
    if(player === '5') return player5Graphics
  }

  const getCorrectGraphicsSetState = (player) => {
    if(player === '1') return setPlayer1Graphics
    if(player === '2') return setPlayer2Graphics
    if(player === '3') return setPlayer3Graphics
    if(player === '4') return setPlayer4Graphics
    if(player === '5') return setPlayer5Graphics
  }

  const setPlayerGraphicsAction = (player, actionText) => {
    const playerGraphicsState = getCorrectGraphicsState(player)
    const playerGraphicsSetState = getCorrectGraphicsSetState(player)

    playerGraphicsSetState({...playerGraphicsState, action: actionText})
  }

  return (
    
          <div>
            <div className="graphics">
              <div className="player-cont">
                <Player graphics={player1Graphics}/>
                <Player graphics={player2Graphics}/>
                <Player graphics={player3Graphics}/>
                <Player graphics={player4Graphics}/>
                <Player graphics={player5Graphics}/>
              </div>
             </div>

             <Console setPlayerGraphicsAction={setPlayerGraphicsAction}/>
           </div>
        

        


      
    )
}

export default App;