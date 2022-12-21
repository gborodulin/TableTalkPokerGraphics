import { useEffect, useRef, useState } from "react";
import "./console.css";

function Console(props) {
  const {
    newHand,
    player1Graphics,
    player2Graphics,
    player3Graphics,
    player4Graphics,
    player5Graphics,
    handleBet,
    handleCall,
    inHandPlayers,
    handleCheck,
    handleFold,
    round,
    setNextRound,
    graphicsFocusPlayer,
    forceBreak,
    button,
    moveButton,
    clearAllLoadedCards,
    handleAllIn,
  } = props;

  const [player1ActionInput, setPlayer1ActionInput] = useState("");
  const [player2ActionInput, setPlayer2ActionInput] = useState("");
  const [player3ActionInput, setPlayer3ActionInput] = useState("");
  const [player4ActionInput, setPlayer4ActionInput] = useState("");
  const [player5ActionInput, setPlayer5ActionInput] = useState("");

  const [consoleFocusPlayer, setConsoleFocusPlayer] = useState("1");

  const player1 = useRef(null);
  const player2 = useRef(null);
  const player3 = useRef(null);
  const player4 = useRef(null);
  const player5 = useRef(null);

  useEffect(() => {
    if (consoleFocusPlayer === "1") player1.current.focus();
    else if (consoleFocusPlayer === "2") player2.current.focus();
    else if (consoleFocusPlayer === "3") player3.current.focus();
    else if (consoleFocusPlayer === "4") player4.current.focus();
    else if (consoleFocusPlayer === "5") player5.current.focus();
  }, [consoleFocusPlayer]);

  useEffect(() => {
    if (round === "Break") {
      clearAllInputStates();
    } else if (round === "PreFlop") {
      clearAllInputStates();
    } else if (round === "Flop") {
      clearAllInHandInputStates();
    } else if (round === "Turn") {
      clearAllInHandInputStates();
    } else if (round === "River") {
      clearAllInHandInputStates();
    }
  }, [round]);

  useEffect(() => {
    if (graphicsFocusPlayer === "1") player1.current.focus();
    else if (graphicsFocusPlayer === "2") player2.current.focus();
    else if (graphicsFocusPlayer === "3") player3.current.focus();
    else if (graphicsFocusPlayer === "4") player4.current.focus();
    else if (graphicsFocusPlayer === "5") player5.current.focus();
  }, [graphicsFocusPlayer]);

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

  const clearAllInputStates = () => {
    setPlayer1ActionInput("");
    setPlayer2ActionInput("");
    setPlayer3ActionInput("");
    setPlayer4ActionInput("");
    setPlayer5ActionInput("");
  };

  const clearAllInHandInputStates = () => {
    inHandPlayers.forEach((player) => {
      const correctInputSetState = getCorrectInputSetState(player);

      correctInputSetState("");
    });
  };

  const setNextConsoleFocusPlayer = (curPlayer) => {
    var i = inHandPlayers.indexOf(curPlayer);
    var len = inHandPlayers.length;

    var current = inHandPlayers[i];
    var previous = inHandPlayers[(i + len - 1) % len];
    var next = inHandPlayers[(i + 1) % len];

    setConsoleFocusPlayer(next);
  };

  const setPreviousConsoleFocusPlayer = (curPlayer) => {
    var i = inHandPlayers.indexOf(curPlayer);
    var len = inHandPlayers.length;

    var current = inHandPlayers[i];
    var previous = inHandPlayers[(i + len - 1) % len];
    var next = inHandPlayers[(i + 1) % len];

    setConsoleFocusPlayer(previous);
  };

  const handleChange = (e) => {
    let player = e.target.id;
    let key = e.nativeEvent.data;
    // console.log(key);

    const correctInputSetState = getCorrectInputSetState(player);

    if (
      key === "1" ||
      key === "2" ||
      key === "3" ||
      key === "4" ||
      key === "5" ||
      key === "6" ||
      key === "7" ||
      key === "8" ||
      key === "9" ||
      key === "0" ||
      key === "." ||
      key === null
    ) {
      correctInputSetState(e.target.value);
    }
  };

  const handleKeyDown = (e) => {
    const player = e.target.id;
    const key = e.key;
    // console.log(e.key);

    const correctInputSetState = getCorrectInputSetState(player);

    if (key === "Enter") {
      const correctInputState = getCorrectInputState(player);

      if (correctInputState.includes("BET")) {
        let amountString = correctInputState.split(" ")[1];
        let amount = parseFloat(amountString);
        handleBet(player, amount);

        inHandPlayers.forEach((curPlayer) => {
          if (curPlayer !== player) {
            const correctInputSetState = getCorrectInputSetState(curPlayer);
            correctInputSetState("");
          }
        });
      }
    } else if (key === "Clear") {
      correctInputSetState("CHECK");
      handleCheck(player);
      // setPlayerCard(player, "Ad");
    } else if (key === "/") {
      correctInputSetState("CALL");
      handleCall(player);
    } else if (key === "+") {
      correctInputSetState("BET ");
    } else if (key === "*") {
      correctInputSetState("FOLD");
      handleFold(player);
    } else if (key === "PageUp") {
      clearAllInputStates();
      newHand();
    } else if (key === "PageDown") {
      forceBreak();
    } else if (key === "F13") {
      moveButton();
    } else if (key === "Delete") {
      clearAllLoadedCards();
    } else if (key === "-") {
      handleAllIn(player);
      correctInputSetState("ALL-IN");

      //move this if value is added to all-in
      inHandPlayers.forEach((curPlayer) => {
        if (curPlayer !== player) {
          const correctInputSetState = getCorrectInputSetState(curPlayer);
          correctInputSetState("");
        }
      });
    }

    ///////////
    else if (key === "ArrowUp") {
      setPreviousConsoleFocusPlayer(player);
    } else if (key === "ArrowDown") {
      setNextConsoleFocusPlayer(player);
    } else if (key === "ArrowRight") {
      setNextRound();
    }
  };

  return (
    <div className="console" onKeyDown={handleKeyDown}>
      <div className="round-console">{round}</div>
      <div className="playerConsoleBox">
        <div className="playerConsoleBoxName">
          {player1Graphics.name} {button === "1" ? "-B" : null}
        </div>
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
        <div className="playerConsoleBoxName">
          {player2Graphics.name} {button === "2" ? "-B" : null}
        </div>
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
        <div className="playerConsoleBoxName">
          {player3Graphics.name} {button === "3" ? "-B" : null}
        </div>
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
        <div className="playerConsoleBoxName">
          {player4Graphics.name} {button === "4" ? "-B" : null}
        </div>
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
        <div className="playerConsoleBoxName">
          {player5Graphics.name} {button === "5" ? "-B" : null}
        </div>
        <input
          type="text"
          id="5"
          ref={player5}
          value={player5ActionInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      {/* 
      <div className="controlKeys">
        <p>Q - New Hand</p>
        <p>B - Bet + Amount</p>
        <p>C - Call</p>
        <p>Z - Check</p>
        <p>F - Fold</p>
        <p>Enter - Send to Graphics</p>
        <p>Arrows - Move Up and Down</p>
      </div> */}
    </div>
  );
}

export default Console;
