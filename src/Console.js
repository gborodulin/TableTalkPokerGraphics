import "./console.css";
import { useState, useRef, useEffect } from "react";

function Console(props) {
  const {
    setPlayerGraphicsAction,
    setPlayerInHand,
    newHand,
    player1Graphics,
    player2Graphics,
    player3Graphics,
    player4Graphics,
    player5Graphics,
    handleBet,
    handleCall,
    inHandPlayers,
    removePlayerFromHand,
  } = props;

  const [player1ActionInput, setPlayer1ActionInput] = useState("");
  const [player2ActionInput, setPlayer2ActionInput] = useState("");
  const [player3ActionInput, setPlayer3ActionInput] = useState("");
  const [player4ActionInput, setPlayer4ActionInput] = useState("");
  const [player5ActionInput, setPlayer5ActionInput] = useState("");

  const [focusPlayer, setFocusPlayer] = useState(1);

  const player1 = useRef(null);
  const player2 = useRef(null);
  const player3 = useRef(null);
  const player4 = useRef(null);
  const player5 = useRef(null);

  useEffect(() => {
    if (focusPlayer === 1) player1.current.focus();
    if (focusPlayer === 2) player2.current.focus();
    if (focusPlayer === 3) player3.current.focus();
    if (focusPlayer === 4) player4.current.focus();
    if (focusPlayer === 5) player5.current.focus();
  }, [focusPlayer]);

  const getCorrectInputSetState = (player) => {
    if (player === "1") return setPlayer1ActionInput;
    if (player === "2") return setPlayer2ActionInput;
    if (player === "3") return setPlayer3ActionInput;
    if (player === "4") return setPlayer4ActionInput;
    if (player === "5") return setPlayer5ActionInput;
  };

  const getCorrectInputState = (player) => {
    if (player === "1") return player1ActionInput;
    if (player === "2") return player2ActionInput;
    if (player === "3") return player3ActionInput;
    if (player === "4") return player4ActionInput;
    if (player === "5") return player5ActionInput;
  };

  const handleChange = (e) => {
    let player = e.target.id;
    let key = e.nativeEvent.data;

    const correctInputSetState = getCorrectInputSetState(player);

    if (key === "f") {
      correctInputSetState("FOLD");
    } else if (key === "c") correctInputSetState("CALL");
    else if (key === "z") correctInputSetState("CHECK");
    else if (key === "b") correctInputSetState("BET ");
    else if (key === "q") {
      setPlayer1ActionInput("");
      setPlayer2ActionInput("");
      setPlayer3ActionInput("");
      setPlayer4ActionInput("");
      setPlayer5ActionInput("");

      newHand();
    } else correctInputSetState(e.target.value);
  };

  const handleKeyDown = (e) => {
    // console.log(e.key)
    if (e.key === "Enter") {
      let player = e.target.id;

      const correctInputState = getCorrectInputState(player);
      setPlayerGraphicsAction(player, correctInputState);

      if (correctInputState.includes("FOLD")) {
        setPlayerInHand(player, false);
        removePlayerFromHand(player);
      }

      if (correctInputState.includes("BET")) {
        let amountString = correctInputState.split(" ")[1];
        let amount = parseInt(amountString);
        handleBet(player, amount);

        inHandPlayers.forEach((curPlayer) => {
          if (curPlayer !== player) {
            const correctInputSetState = getCorrectInputSetState(curPlayer);
            correctInputSetState("");
          }
        });
      }

      if (correctInputState.includes("CALL")) {
        handleCall(player);
      }

      if (focusPlayer === 5) setFocusPlayer(1);
      else setFocusPlayer(focusPlayer + 1);
      // console.log(focusPlayer)
    }

    if (e.key === "ArrowUp") {
      if (focusPlayer === 1) setFocusPlayer(5);
      else setFocusPlayer(focusPlayer - 1);
    }

    if (e.key === "ArrowDown") {
      if (focusPlayer === 5) setFocusPlayer(1);
      else setFocusPlayer(focusPlayer + 1);
    }
  };

  return (
    <div className="console" onKeyDown={handleKeyDown}>
      <div className="playerConsoleBox">
        <div className="playerConsoleBoxName">{player1Graphics.name}</div>
        <input
          type="text"
          id="1"
          ref={player1}
          value={player1ActionInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="playerConsoleBox">
        <div className="playerConsoleBoxName">{player2Graphics.name}</div>
        <input
          type="text"
          id="2"
          ref={player2}
          value={player2ActionInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="playerConsoleBox">
        <div className="playerConsoleBoxName">{player3Graphics.name}</div>
        <input
          type="text"
          id="3"
          ref={player3}
          value={player3ActionInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="playerConsoleBox">
        <div className="playerConsoleBoxName">{player4Graphics.name}</div>
        <input
          type="text"
          id="4"
          ref={player4}
          value={player4ActionInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="playerConsoleBox">
        <div className="playerConsoleBoxName">{player5Graphics.name}</div>
        <input
          type="text"
          id="5"
          ref={player5}
          value={player5ActionInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="controlKeys">
        <p>Q - New Hand</p>
        <p>B - Bet + Amount</p>
        <p>C - Call</p>
        <p>Z - Check</p>
        <p>F - Fold</p>
        <p>Enter - Send to Graphics</p>
        <p>Arrows - Move Up and Down</p>
      </div>
    </div>
  );
}

export default Console;
