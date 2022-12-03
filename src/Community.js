import Card from "./Card";
import "./community.css";

function Community(props) {
  const { pot, cards, round } = props;

  return (
    <div className="community-cont">
      <div className="community">

        <div className="info-cont">
          <div className="round-cont">
            <div className="round">{round}</div>
          </div>
          <div className="pot-cont">
            <div className="pot">POT ${pot}</div>

          </div>
        </div>


        <div className="community-cards-cont">
          {cards.map((cardValue) => (
            <Card cardValue={cardValue} />
          ))}
        </div>

      </div>
    </div>
  );
}

export default Community;
