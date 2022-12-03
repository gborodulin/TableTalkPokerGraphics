import Card from "./Card";
import "./player.css";
import { genRandomCard } from "./utils";

function Player(props) {
  const { display } = props;


  let graphics = {

    action: "BET",
    card1: genRandomCard(),
    card2: genRandomCard(),
    name: "Greg",
    percent: 10,
    currentPlayerBet: 123,

  }

  let playerClass = "player" + (display ? "" : " slide-out")
  console.log(display)
  return (
    <div className={playerClass}>
      <div className="name-cont">
        <div className={"name"} >{graphics.name}</div>
      </div>

      <div className="action-cont">
        <div className="action">{graphics.action}</div>
      </div>

      <div className="cards-cont">
        <Card className="card" cardValue={graphics.card1} />
        <Card className="card" cardValue={graphics.card2} />
      </div>

      {/* <div className="other-cont">
        <div className="percent">{graphics.percent}</div>
      </div> */}
      {/* <div className="curPlayerBet">{graphics.currentPlayerBet}</div> */}
    </div>
  );
}

export default Player;
