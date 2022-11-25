import "./card.css";

function Card(props) {
  const { cardValue } = props;

  let rank = "";
  let suit = "";
  let textcolor = "";

  if (cardValue) {
    rank = cardValue[0];
    if (rank === "T") rank = "10";

    let rawSuit = cardValue[1];

    if (rawSuit === "s") {
      suit = "♠";
      textcolor = "black";
    }
    if (rawSuit === "c") {
      suit = "♣";
      textcolor = "black";
    }
    if (rawSuit === "d") {
      suit = "♦";
      textcolor = "red";
    }
    if (rawSuit === "h") {
      suit = "♥";
      textcolor = "red";
    }
  }

  // console.log(rank, suit);
  return (
    <div className="card">
      <div className="rank" style={{ color: textcolor }}>
        {rank}
      </div>
      <div className="suit">{suit}</div>
    </div>
  );
}

export default Card;
