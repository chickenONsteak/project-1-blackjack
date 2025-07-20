/*--------------------------------- Imports ---------------------------------*/
import { cardImages } from "./assets/cards.js";

/*--------------------------------- Classes ---------------------------------*/
class Cards {
  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }

  // method to convert the non-int values to int
  checkCardValue() {
    if (this.rank === "J" || this.rank === "Q" || this.rank === "K") {
      return 10;
    } else if (this.rank === "A") {
      return 11;
    }
  }
}

class Deck extends Cards {
  constructor(
    rank = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"],
    suit = ["clubs", "diamonds", "hearts", "spades"]
  ) {
    super(rank, suit);
    this.deck = [];
  }

  // // to generate a fresh deck of cards
  generateCards() {
    this.deck = [];
    this.rank.forEach((value) => {
      this.suit.forEach((element) => {
        const imgObjKey = element + value.toString();
        this.deck.push({
          rank: value,
          suit: element,
          imageURI: cardImages[imgObjKey],
        });
      });
    });
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
    let totalValue;
    const numOfAces = 0;
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
  hit(hand, shuffledDeck, handHtmlId) {
    // check if player has split if trying to hit hand2
    // note: without splitting, hand2 = undefined is falsy while empty array is truthy
    if (hand) {
      const cardDeck = shuffledDeck.deck;
      const drawnCard = cardDeck.shift();
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
    if (this.hand1.length !== 2 || this.bet1 > this.balance) {
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
    let totalValue;
    const numOfAces = 0;
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

  hit(hand, shuffledDeck, handHtmlId) {
    const cardDeck = shuffledDeck.deck;
    const drawnCard = cardDeck.shift();
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
  new Dealer("Dealer", "dealer-hands"),
];
const [yen, jack, brack, dealer] = players; // destructure to create 3 variables in 1 go

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

/*-------------------------------- Functions --------------------------------*/
function populateBet(event) {
  const amountStr = event.target.innerText.replace(",", "");
  const amountInt = parseInt(amountStr);
  betInput.value = amountInt;
  console.log(amountInt);
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
  const shuffledDeck = prepareDeck();
  // each player draw 2 cards each facing up
  for (let orbits = 0; orbits < 2; orbits++) {
    for (const player of players) {
      player.hit(player.hand1, shuffledDeck, player.hand1UIId);
    }
  }
}

// INCLUDE COMPUTER LOGIC FOR CHECKING VALUE AND DETERMINE STAND/BUST AFTER HITTING

/*----------------------------- Event Listeners -----------------------------*/
// LANDING PAGE
startButton.addEventListener("click", () => {
  landingPage.style.display = "none";
  gamePage.style.display = "grid";
});

// PLACING BETS
quickBet1.addEventListener("click", populateBet);
quickBet2.addEventListener("click", populateBet);
quickBet3.addEventListener("click", populateBet);
placeBetButton.addEventListener("click", placeBet);

// AFTER PLACING BETS
hitButton.addEventListener("click", () => {
  yen.hit();
  if (yen.checkHandValue > 21) {
    actionButtons.style.display = "none";
    messageBoard.innerText = `It's a bust! Total hand value: ${yen.checkHandValue(
      hand1
    )}`; // HAND INPUT IS WRONG
  }
});

/*------------------------------- Game Logic --------------------------------*/
// while (yen.balance > 0) {}
const deck = new Deck();
distributeCards();
