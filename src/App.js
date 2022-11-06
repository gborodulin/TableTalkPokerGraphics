import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import io from "socket.io-client";
import "./App.css";
import Player from "./Player";
import Console from "./Console";



function App(props) {
  const [serialdata, setSerialData] = useState({});

  // let socket = io("http://localhost:8888", { transports: ["websocket"] });

  // socket.on("serialdata", (serialdata) => {
    // setSerialData(serialdata);
  // });

    const [player1Graphics, setPlayer1Graphics] = useState({name: "Greg", action: ""})
    const [player2Graphics, setPlayer2Graphics] = useState({name: "Josh", action: ""})
    const [player3Graphics, setPlayer3Graphics] = useState({name: "David", action: ""})
    const [player4Graphics, setPlayer4Graphics] = useState({name: "Michael", action: ""})
    const [player5Graphics, setPlayer5Graphics] = useState({name: "Andrew", action: "here"})

    const setPlayerGraphicsAction = (player, actionText) => {
        if(player === 'player1') setPlayer1Graphics({...player1Graphics, action: actionText})
        if(player === 'player2') setPlayer2Graphics({...player2Graphics, action: actionText})
        if(player === 'player3') setPlayer3Graphics({...player3Graphics, action: actionText})
        if(player === 'player4') setPlayer4Graphics({...player4Graphics, action: actionText})
        if(player === 'player5') setPlayer5Graphics({...player5Graphics, action: actionText})
    }

  


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div>
            <div className="graphics">
              <div className="player-cont">
                <Player name={player1Graphics.name} action={player1Graphics.action}/>
                <Player name={player2Graphics.name} action={player2Graphics.action}/>
                <Player name={player3Graphics.name} action={player3Graphics.action}/>
                <Player name={player4Graphics.name} action={player4Graphics.action}/>
                <Player name={player5Graphics.name} action={player5Graphics.action}/>
              </div>
             </div>

             <Console setPlayerGraphicsAction={setPlayerGraphicsAction}/>
           </div>
        }/>

        


      </Routes>
    </BrowserRouter>
    )
}

export default App;
