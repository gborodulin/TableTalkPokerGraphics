import Card from "./Card";
import "./player.css";
import { genRandomCard } from "./utils";

function Player(props) {
  // let { rank, suit } = genRandomCard();
  
  const { name, action } = props;
  

  return (
    <div className="player">
      <div className="name">{name}</div>
      <Card className="card" rank={9} suit={'♠'} />
      <Card className="card" rank={10} suit={'♥'} />
      <div className="action">{action}</div>
    </div>
  );
}

export default Player;
