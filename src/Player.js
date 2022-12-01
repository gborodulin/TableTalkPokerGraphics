import Card from "./Card";
import "./player.css";
import { genRandomCard } from "./utils";

function Player(props) {
  const { graphics } = props;

  return (
    <div className="player">
      <div className="name">{graphics.name}</div>
      <Card className="card" cardValue={graphics.card1} />
      <Card className="card" cardValue={graphics.card2} />
      <div className="action">{graphics.action}</div>
      <div className="percent">{graphics.percent}</div>
      {/* <div className="curPlayerBet">{graphics.currentPlayerBet}</div> */}
    </div>
  );
}

export default Player;
