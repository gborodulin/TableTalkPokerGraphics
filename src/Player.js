import Card from "./Card";
import "./player.css";
import { genRandomCard } from "./utils";

function Player(props) {
  // let { rank, suit } = genRandomCard();

  const { graphics } = props;

  return (
    <div className="player">
      <div className="name">{graphics.name}</div>
      <Card className="card" cardValue={graphics.card1} />
      <Card className="card" cardValue={graphics.card2} />
      <div className="action">{graphics.action}</div>
    </div>
  );
}

export default Player;
