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
        this.deck.push({ rank: value, suit: element });
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
  constructor(name, balance) {
    this.name = name;
    this.hand1 = [];
    this.hand2 = undefined; // defined only after player splits
    this.balance = balance;
    this.bet1 = undefined; // defined only after player places bet
    this.bet2 = undefined; // defined only after player splits
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
    if (amount > this.balance) {
      return -1; // invalid move
    } else {
      this.balance -= amount;
      this.bet1 = amount;
    }
  }

  // player draws a card
  hit(hand, cardDeck) {
    // check if player has split if trying to hit hand2
    // note: without splitting, hand2 = undefined is falsy
    if (hand) {
      const drawnCard = cardDeck.shift();
      hand.push(drawnCard);
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

/*-------------------------------- Constants --------------------------------*/
const yen = new Players("Yen", 1000);

/*---------------------------- Variables (state) ----------------------------*/

/*------------------------ Cached Element References ------------------------*/
const landingPage = document.querySelector("#landing-page");
const startButton = document.querySelector("#start-game");
const gamePage = document.querySelector("#game-page");
const betInput = document.querySelector("#amount");
const quickBet1 = document.querySelector("#quick1");
const quickBet2 = document.querySelector("#quick2");
const quickBet3 = document.querySelector("#quick3");
const placeBetButton = document.querySelector("#bet");
/*-------------------------------- Functions --------------------------------*/
function populateBet(event) {
  const amountStr = event.target.innerText.replace(",", "");
  const amountInt = parseInt(amountStr);
  betInput.value = amountInt;
  console.log(amountInt);
}

function placeBet() {
  const amount = betInput.value;
  yen.bet(amount);
}

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
placeBetButton.addEventListener("click", () => {});
