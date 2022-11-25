// socket.on("serialdata", (serialdata) => {
//   const antenna = serialdata.data.split("antenna: ")[1][0];
//   const cardUID = serialdata.data.split("UID: ")[1].split(",")[0];
//   // console.log("player: ", antenna);
//   // console.log("cardUID: ", cardUID);
//   const cardValue = getCardValue(cardUID);
//   // console.log(cardValue);

//   if (!storedCards.includes(cardValue)) {
//     storedCards.push(cardValue);
//     const player = antenna2Player[antenna];

//     // console.log(player, cardValue);
//     // console.log("Value added: ", cardValue, storedCards);

//     //players antenna

//     const playerGraphicsState = getCorrectGraphicsState(player);
//     const playerGraphicsSetState = getCorrectGraphicsSetState(player);

//     console.log("Graphics state: ", playerGraphicsState);

//     if (!playerGraphicsState.card1) {
//       playerGraphicsSetState({ ...playerGraphicsState, card1: cardValue });
//     } else if (
//       !playerGraphicsState.card2 &&
//       playerGraphicsState.card1 !== cardValue
//     ) {
//       playerGraphicsSetState({ ...playerGraphicsState, card2: cardValue });
//     }

//     //community antenna
//     // else if (player === "6" || player === "7" || player === "8") {
//     //   setCommunityCards([...communityCards, cardValue]);
//     //   console.log(communityCards);
//     // }
//   }
// });
