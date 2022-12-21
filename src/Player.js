import Card from "./Card";
import "./player.css";

function Player(props) {
  const { display, graphics, focus, } = props;

  // let graphics = {
  //   action: "BET",
  //   card1: genRandomCard(),
  //   card2: genRandomCard(),
  //   name: "Greg",
  //   percent: 10,
  //   currentPlayerBet: 123,
  // };


  let playerClass = "player" + (display ? "" : " fold");
  playerClass = playerClass + (!focus ? "" : " focus");
  let percentStr = "";

  if (graphics.percent !== null) {

    percentStr = '' + graphics.percent
    percentStr = percentStr.replace('~', '');
    percentStr = percentStr.split('.')[0]
    percentStr += '%'
  }


  return (
    <div className={playerClass}>
      <div className="name-cont">
        <div className={"name"}>{graphics.name}</div>
      </div>

      <div className="action-cont">
        <div className="action">{graphics.action}</div>
      </div>

      <div className="cards-cont">
        {graphics.card1 === null ? null : <Card className="card" cardValue={graphics.card1} />}
        {graphics.card2 === null ? null : <Card className="card" cardValue={graphics.card2} />}

      </div>
      {graphics.percent !== null ?
        <div className="other-cont">
          <div className="other-text">{percentStr}</div>
        </div> : null}
    </div>
  );
}

export default Player;
