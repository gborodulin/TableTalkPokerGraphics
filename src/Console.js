import "./console.css";
import { useState, useRef, useEffect } from "react";

function Console(props) {

    const {setPlayerGraphicsAction} = props;

    const [player1Console, setPlayer1Console] = useState({name: "Greg", action: ""})
    const [player2Console, setPlayer2Console] = useState({name: "Josh", action: ""})
    const [player3Console, setPlayer3Console] = useState({name: "David", action: ""})
    const [player4Console, setPlayer4Console] = useState({name: "Michael", action: ""})
    const [player5Console, setPlayer5Console] = useState({name: "Andrew", action: ""})
    const [focusPlayer, setFocusPlayer] = useState(1)

    const player1 = useRef(null);
    const player2 = useRef(null);
    const player3 = useRef(null);
    const player4 = useRef(null);
    const player5 = useRef(null);

    useEffect(() => {
      if(focusPlayer === 1) player1.current.focus();
      if(focusPlayer === 2) player2.current.focus();
      if(focusPlayer === 3) player3.current.focus();
      if(focusPlayer === 4) player4.current.focus();
      if(focusPlayer === 5) player5.current.focus();
    }, [focusPlayer])
    

    const getCorrectSetState = (player) => {
      if(player === '1') return setPlayer1Console
      if(player === '2') return setPlayer2Console
      if(player === '3') return setPlayer3Console
      if(player === '4') return setPlayer4Console
      if(player === '5') return setPlayer5Console
    }

    const getCorrectState = (player) => {
      if(player === '1') return player1Console
      if(player === '2') return player2Console
      if(player === '3') return player3Console
      if(player === '4') return player4Console
      if(player === '5') return player5Console
    }

    const handleChange = (e) => {
        let player = e.target.id;
        let key = e.nativeEvent.data;

        const correctSetState = getCorrectSetState(player)
        const correctState = getCorrectState(player)
       

        if(key === "f") correctSetState({...correctState, action: "FOLD"})
        else if(key === "c") correctSetState({...correctState, action: "CALL"})
        else if(key === "z") correctSetState({...correctState, action: "CHECK"})
        else if(key === "b") correctSetState({...correctState, action: "BET "})
        else if (key ==="q") console.log()
        else(correctSetState({...correctState, action: e.target.value}))
    }

    const handleKeyDown = e => {
      // console.log(e.key)
        if(e.key === "Enter"){
          let player = e.target.id;
          const correctState = getCorrectState(player)
          setPlayerGraphicsAction(player, correctState.action)

          if(focusPlayer === 5) setFocusPlayer(1)
          else setFocusPlayer(focusPlayer + 1)
          console.log(focusPlayer)

        }

        if(e.key === "ArrowUp"){
          if(focusPlayer === 1) setFocusPlayer(5)
          else setFocusPlayer(focusPlayer - 1)
          
        }

        if(e.key === "ArrowDown"){
          if(focusPlayer === 5) setFocusPlayer(1)
          else setFocusPlayer(focusPlayer + 1)
        }

        if(e.key === "q"){
          setPlayer1Console({...player1Console, action: ""})
          setPlayer2Console({...player2Console, action: ""})
          setPlayer3Console({...player3Console, action: ""})
          setPlayer4Console({...player4Console, action: ""})
          setPlayer5Console({...player5Console, action: ""})
        }
    }



    return (
        <div className="console" onKeyDown={handleKeyDown}>
            <div className="playerConsoleBox">
              <div className="playerConsoleBoxName">Greg</div>
              <input type="text" id="1" ref={player1} value={player1Console.action} onChange={handleChange} onKeyDown={handleKeyDown}/>
            </div>

            <div className="playerConsoleBox">
              <div className="playerConsoleBoxName">Josh</div>
              <input type="text" id="2" ref={player2}  value={player2Console.action} onChange={handleChange} onKeyDown={handleKeyDown}/>
            </div>

            <div className="playerConsoleBox">
              <div className="playerConsoleBoxName">David</div>
              <input type="text" id="3" ref={player3}  value={player3Console.action} onChange={handleChange} onKeyDown={handleKeyDown}/>
            </div>

            <div className="playerConsoleBox">
              <div className="playerConsoleBoxName">Michael</div>
              <input type="text" id="4" ref={player4}  value={player4Console.action} onChange={handleChange} onKeyDown={handleKeyDown}/>
            </div>

            <div className="playerConsoleBox">
              <div className="playerConsoleBoxName">Andrew</div>
              <input type="text" id="5" ref={player5}  value={player5Console.action} onChange={handleChange} onKeyDown={handleKeyDown}/>
            </div>

            
        </div>
    );
  }
  
  export default Console;
  