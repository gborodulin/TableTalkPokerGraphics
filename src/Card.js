import "./card.css";

function Card(props) {
    
    const { cardValue } = props;

    let rank = ""
    let suit = ""
    
    if(cardValue){
        rank = cardValue.split(",")[0]
        suit = cardValue.split(",")[1]
    }

    return (
        <div className="card">
            <div className="rank">{rank}</div>
            <div className="suit">{suit}</div>
        </div>
    );
}

export default Card;
