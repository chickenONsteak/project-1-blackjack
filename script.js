/*--------------------------------- Imports ---------------------------------*/
import { cardImages } from "./assets/cards.js";

/*--------------------------------- Classes ---------------------------------*/
class Card {
  constructor(rank, suit, img) {
    this.rank = rank;
    this.suit = suit;
    this.imageURI = img;
  }

  // method to convert the non-int values to int
  checkCardValue() {
    if (this.rank === "J" || this.rank === "Q" || this.rank === "K") {
      return 10;
    } else if (this.rank === "A") {
      return 11;
    } else {
      return this.rank;
    }
  }
}

class Deck {
  constructor(
    rank = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"],
    suit = ["clubs", "diamonds", "hearts", "spades"]
  ) {
    this.rank = rank;
    this.suit = suit;
    this.deck = [];
  }

  // to generate a fresh deck of cards
  generateCards() {
    this.deck = [];
    this.rank.forEach((value) => {
      this.suit.forEach((element) => {
        const imgObjKey = element + value.toString();
        this.deck.push(new Card(value, element, cardImages[imgObjKey]));
      });
    });
    console.log(this.deck);
  }

  // use the modified Fisher-Yates shuffle algorithm
  shuffle() {
    for (let i = this.deck.length - 1; i >= 0; i--) {
      const randomCardIdx = Math.round(Math.random() * this.deck.length);
      [this.deck[i], this.deck[randomCardIdx]] = [
        this.deck[randomCardIdx],
        this.deck[i],
      ];
    }
  }
}

class Players {
  constructor(name, balance, hand1Id, hand2Id) {
    this.name = name;
    this.hand1 = [];
    this.hand2 = undefined; // defined only after player splits
    this.balance = balance;
    this.bet1 = undefined; // defined only after player places bet
    this.bet2 = undefined; // defined only after player splits
    this.hand1UIId = hand1Id;
    this.hand2UIId = hand2Id;
  }

  checkHandValue(hand) {
    if (hand.length === 0) {
      return 0;
    }

    let totalValue = 0;
    let numOfAces = 0;
    hand.forEach((card) => {
      totalValue += card.checkCardValue();
      if (card.rank === "A") {
        numOfAces++;
      }
    });
    // adjust value of ace to 1 if total value > 21
    while (totalValue > 21 && numOfAces > 0) {
      totalValue -= 10; // value of ace drops from 11 to 1
      numOfAces--;
    }
    return totalValue;
  }

  // player places bet
  bet(amount) {
    // check if sufficient balance
    if (amount > this.balance || amount < 100 || amount === "") {
      return -1; // invalid move
    } else {
      this.balance -= amount;
      this.bet1 = amount;
    }
  }

  // player draws a card
  hit(hand, handHtmlId) {
    // check if player has split if trying to hit hand2
    // note: without splitting, hand2 = undefined is falsy while empty array is truthy
    if (hand) {
      let drawnCard;
      // while first card is not undefined
      for (let i = 0; i < shuffledDeck.deck.length; i++) {
        if (shuffledDeck.deck[i]) {
          drawnCard = shuffledDeck.deck[i];
          shuffledDeck.deck.splice(i, 1);
          break;
        }
      }
      console.log(drawnCard);
      hand.push(drawnCard);

      // update cards displayed on hand
      const playerHandUI = document.querySelector(`#${handHtmlId}`);
      const img = document.createElement("img");
      img.src = drawnCard.imageURI;
      img.alt = "front of card"; // FIND A WAY TO IMPROVE THIS
      img.height = 176; // 11rem to px
      playerHandUI.appendChild(img);
    } else {
      return -1;
    }
  }

  // player doubles down
  doubleDown(bet) {
    // check if sufficient balance
    // note: since balance already deducted the earlier bet, just need to check for another 1x
    if (bet > this.balance) {
      return -1;
    } else {
      this.balance - bet;
      bet *= 2;
    }
  }

  // player splits
  splitHand() {
    // can only split with 2 cards in hand AND have sufficient balance for another bet of equal value
    if (this.hand1.length !== 2 || this.bet1 > this.balance || !this.hand2) {
      return -1; // invalid move
    } else {
      this.hand2 = [];
      this.bet2 = this.bet1;
      this.balance - this.bet2;
    }
  }
}

class Dealer {
  constructor(name, hand1Id) {
    this.name = name;
    this.hand1 = [];
    this.hand1UIId = hand1Id;
  }

  checkHandValue(hand) {
    if (hand.length === 0) {
      return 0;
    }

    let totalValue = 0;
    let numOfAces = 0;
    hand.forEach((card) => {
      totalValue += card.checkCardValue();
      console.log(totalValue);
      if (card.rank === "A") {
        numOfAces++;
      }
    });
    // adjust value of ace to 1 if total value > 21
    while (totalValue > 21 && numOfAces > 0) {
      totalValue -= 10; // value of ace drops from 11 to 1
      numOfAces--;
    }
    return totalValue;
  }

  hit(hand, handHtmlId) {
    let drawnCard;
    // while first card is not undefined
    for (let i = 0; i < shuffledDeck.deck.length; i++) {
      if (shuffledDeck.deck[i]) {
        drawnCard = shuffledDeck.deck[i];
        shuffledDeck.deck.splice(i, 1);
        break;
      }
    }
    console.log(drawnCard);
    hand.push(drawnCard);

    // update cards displayed on hand
    const playerHandUI = document.querySelector(`#${handHtmlId}`);
    const img = document.createElement("img");
    img.src = drawnCard.imageURI;
    img.alt = "front of card"; // FIND A WAY TO IMPROVE THIS
    img.height = 176; // 11rem to px
    playerHandUI.appendChild(img);
  }
}

/*-------------------------------- Constants --------------------------------*/
const players = [
  new Players("Yen", 1000, "hand1", "hand2"),
  new Players("Brack", 1000, "friend-left-hand"),
  new Players("Jack", 1000, "friend-right-hand"),
];
const [yen, jack, brack] = players; // destructure to create 3 variables in 1 go
const dealer = new Dealer("Dealer", "dealer-hands");
let shuffledDeck;
const playerHand1 = yen.hand1;
let playerHand2 = yen.hand2;
const friendLeftHand = brack.hand1;
const friendRightHand = jack.hand1;
const dealerHand = dealer.hand1;
let playerHand1Value;
let playerHand2Value;
let friendLeftValue;
let friendRightValue;
let dealerValue;
let standHand1 = false;

/*---------------------------- Variables (state) ----------------------------*/

/*------------------------ Cached Element References ------------------------*/
const landingPage = document.querySelector("#landing-page");
const startButton = document.querySelector("#start-game");
const gamePage = document.querySelector("#game-page");
const messageBoard = document.querySelector("#message-board");
const placeBetUI = document.querySelector("#place-bets");
const betInput = document.querySelector("#amount");
const quickBet1 = document.querySelector("#quick1");
const quickBet2 = document.querySelector("#quick2");
const quickBet3 = document.querySelector("#quick3");
const placeBetButton = document.querySelector("#bet");
const postBetUI = document.querySelector("#post-bets");
const amount1Display = document.querySelector("#amount1");
const actionButtons = document.querySelector("#action-buttons");
const hitButton = document.querySelector("#hit");
const standButton = document.querySelector("#stand");
const doubleDownButton = document.querySelector("#double-down");
const splitButton = document.querySelector("#split");
const nextHandButton = document.querySelector("#next-hand");
const bet1Display = document.querySelector("#amount1");
const bet2Display = document.querySelector("#amount2");
const playerHand1UI = document.querySelector("#hand1");
const playerHand2UI = document.querySelector("#hand2");
const dealerHandUI = document.querySelector("#dealer-hands");
const friendLeftHandUI = document.querySelector("#friend-left-hand");
const friendRightHandUI = document.querySelector("#friend-right-hand");

/*-------------------------------- Functions --------------------------------*/
function populateBet(event) {
  const amountStr = event.target.innerText.replace(",", "");
  const amountInt = parseInt(amountStr);
  betInput.value = amountInt;
  bet1Display.innerText = amountInt;
}

function placeBet() {
  const amount = betInput.value;
  if (yen.bet(amount) !== -1) {
    // acknowledge and show next phase UI
    messageBoard.innerText = `You've bet $${amount} on your hand, game on!`;
    placeBetUI.style.display = "none";
    postBetUI.style.display = "grid";
    actionButtons.style.display = "flex";

    // populate bet1 for hand1
    amount1Display.innerText = amount;
  } else {
    messageBoard.innerText = `You can only bet an amount >$100 and less than your balance: $${yen.balance}.`;
  }
}

function prepareDeck() {
  const deck = new Deck();
  deck.generateCards();
  deck.shuffle();
  return deck;
}

function distributeCards() {
  shuffledDeck = prepareDeck();
  // each player draw 2 cards each facing up
  for (let orbits = 0; orbits < 2; orbits++) {
    for (const player of players) {
      player.hit(player.hand1, player.hand1UIId);
    }
    dealer.hit(dealerHand, dealer.hand1UIId);
  }
}

function updateBalance(player, betIdUI) {
  const amount = document.querySelector(`#${betIdUI}`).innerText;
  player.balance -= amount;
}

function resetHand() {
  // reset bets
  [yen.bet1, yen.bet2] = [undefined, undefined];

  // reset cards distributed
  [playerHand1.length, playerHand2] = [0, undefined];
  [friendLeftHand.length, friendRightHand.length, dealerHand.length] = [
    0, 0, 0,
  ];
}

function resetHandUI() {
  // remove images of cards distributed to hand1
  while (playerHand1UI.firstChild) {
    console.log(playerHand1UI.firstChild);
    playerHand1UI.removeChild(playerHand1UI.firstChild);
  }
  while (playerHand2UI.firstChild) {
    console.log(playerHand2UI.firstChild);
    playerHand2UI.removeChild(playerHand2UI.firstChild);
  }
  while (dealerHandUI.firstChild) {
    console.log(dealerHandUI.firstChild);
    dealerHandUI.removeChild(dealerHandUI.firstChild);
  }
  while (friendLeftHandUI.firstChild) {
    console.log(friendLeftHandUI.firstChild);
    friendLeftHandUI.removeChild(friendLeftHandUI.firstChild);
  }
  while (friendRightHandUI.firstChild) {
    console.log(friendRightHandUI.firstChild);
    friendRightHandUI.removeChild(friendRightHandUI.firstChild);
  }
}

// INCLUDE COMPUTER LOGIC FOR CHECKING VALUE AND DETERMINE STAND/BUST AFTER HITTING

/*----------------------------- Event Listeners -----------------------------*/
// LANDING PAGE
startButton.addEventListener("click", () => {
  landingPage.style.display = "none";
  gamePage.style.display = "grid";
  messageBoard.innerText = `Place your bets!\nYou have $${yen.balance} remaining.`;
});

// PLACING BETS
quickBet1.addEventListener("click", populateBet);
quickBet2.addEventListener("click", populateBet);
quickBet3.addEventListener("click", populateBet);
placeBetButton.addEventListener("click", () => {
  placeBet();
  distributeCards();
});

// AFTER PLACING BETS
// After pressing hit, will push the card to hand1.
// If bust, empty the hand1 array and change to value 0, and check if there's hand2 (if player split) — continue pushing to hand2
hitButton.addEventListener("click", () => {
  playerHand1Value = yen.checkHandValue(playerHand1);
  if (playerHand1Value !== 0) {
    yen.hit(playerHand1, "hand1");
    playerHand1Value = yen.checkHandValue(playerHand1);
    messageBoard.innerText = `You got ${playerHand1Value} in total.`;
    if (playerHand1Value > 21) {
      messageBoard.innerText = `Unlucky! You got ${playerHand1Value} in total.`;
      playerHand1.length = 0; // reset hand1 since bust
      // check if there's a hand2
      if (playerHand2 === undefined) {
        actionButtons.style.display = "none";
        nextHandButton.style.display = "flex";
      } else {
        yen.hit(playerHand2, "hand2"); // give second card for hand2
      }
    }
  }
  // if player splits, going bust on hand1 will straight away distribute 2nd card to hand2 — hence length >= 2
  if (playerHand2 !== undefined && playerHand2.length >= 2) {
    yen.hit(playerHand2, "hand2");
    playerHand2Value = yen.checkHandValue(playerHand2);
    if (playerHand2Value > 21) {
      messageBoard.innerText = `It's a bust! Total hand value: ${playerHand2Value}`;
      actionButtons.style.display = "none";
      nextHandButton.style.display = "flex";
    }
  }
});

standButton.addEventListener("click", () => {
  standHand1 = true;
  playerHand1Value = yen.checkHandValue(playerHand1);
  // if player stand for 1st hand and there is a 2nd hand, draw 1 card for the 2nd hand
  if (playerHand2 !== undefined) {
    if (playerHand2.length < 2) {
      yen.hit(playerHand2, "hand2"); // stand is for the 1st hand, and give second card for hand2
      messageBoard.innerText = "What do you want to do for your 2nd hand?";
    } else {
      // if player stand after >= 2 cards in 2nd hand, it means that the stand is for the 2nd hand
      actionButtons.style.display = "none";
      nextHandButton.style.display = "flex";
      playerHand2Value = yen.checkHandValue(playerHand2);
    }
  } else {
    // if player does not hand a 2nd hand
    actionButtons.style.display = "none";
    nextHandButton.style.display = "flex";
  }
  // compare results
  dealerValue = dealer.checkHandValue(dealerHand);
  while (dealerValue < 17) {
    dealer.hit(dealerHand, "dealer-hands");
    dealerValue = dealer.checkHandValue(dealerHand);
  }
  if (playerHand1Value > dealerValue && playerHand1Value <= 21) {
    updateBalance(yen, "amount1");
    messageBoard.innerText = `You won $${yen.bet1}!`;
  }
  if (playerHand2 !== undefined) {
    if (playerHand2Value > dealerValue && playerHand2Value <= 21) {
      updateBalance(yen, "amount2");
      messageBoard.innerText = `You won $${yen.bet2}!`;
    }
  }
});

doubleDownButton.addEventListener("click", () => {
  if (standHand1) {
    const isDoubled = yen.doubleDown(yen.bet2);
    if (isDoubled !== -1) {
      bet2Display.innerText = yen.bet2 * 2;
    } else {
      messageBoard.innerText = "Not enough funds to double down.";
    }
  } else {
    const isDoubled = yen.doubleDown(yen.bet1);
    if (isDoubled !== -1) {
      bet1Display.innerText = yen.bet1 * 2;
    } else {
      messageBoard.innerText = "Not enough funds to double down.";
    }
  }
});

splitButton.addEventListener("click", () => {
  const split = yen.splitHand();
  if (split === -1) {
    // update second bet
    bet2Display.innerText = yen.bet2;
    // update hand displayed
    playerHand2UI.style.display = "flex";
  } else {
    messageBoard.innerText = "Unable to split.";
  }
});

nextHandButton.addEventListener("click", () => {
  standHand1 = false;
  nextHandButton.style.display = "none";
  resetHand();
  resetHandUI();
  placeBetUI.style.display = "flex";
  postBetUI.style.display = "none";
});
