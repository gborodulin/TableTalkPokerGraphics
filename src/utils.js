export const SUITS = {
  HEARTS: "HEARTS",
  SPADES: "SPADES",
  CLUBS: "CLUBS",
  DIAMONDS: "DIAMONDS",
};

export function generateStringFromSuit(suit) {
  let suitString = "ERR_SUIT";
  switch (suit) {
    case SUITS.HEARTS:
      suitString = "h";
      break;
    case SUITS.SPADES:
      suitString = "s";
      break;
    case SUITS.CLUBS:
      suitString = "c";
      break;
    case SUITS.DIAMONDS:
      suitString = "d";
      break;
  }

  return suitString;
}

export function generateStringFromRank(rank) {
  if (rank === "T") return "10";
  return rank;
}

export function genRandomCard() {
  let rank = Math.floor(Math.random() * 10) + 1;
  let suit = Object.values(SUITS)[Math.floor(Math.random() * 3)];
  suit = generateStringFromSuit(suit);
  return [rank, suit]
}
