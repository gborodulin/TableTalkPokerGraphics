import "./card.css";

function Card(props) {
  const { cardValue } = props;

  let rank = "";
  let suit = "";

  if (cardValue) {
    rank = cardValue[0];
    if (rank === "T") rank = "10";

    let suitRaw = cardValue[1];

    if (suitRaw === "c") suit = "♣";
    if (suitRaw === "d") suit = "♦";
    if (suitRaw === "s") suit = "♠";
    if (suitRaw === "h") suit = "♥";
  }

  return (
    <div className="card">
      <div className="rank">{rank}</div>
      <div className="suit">{suit}</div>
    </div>
  );
}

export default Card;
