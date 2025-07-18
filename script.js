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
  constructor(name, balance, bet) {
    this.name = name;
    this.hand = [];
    this.balance = balance;
    this.bet = bet;
  }

  checkHandValue() {
    let totalValue;
    const numOfAces = 0;
    this.hand.forEach((card) => {
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
      this.bet = amount;
    }
  }

  // player draws a card
  hit(cardDeck) {
    const drawnCard = cardDeck.shift();
    this.hand.push(drawnCard);
  }

  // player double downs
  doubleDown() {
    // check if sufficient balance
    if (this.bet * 2 > this.balance) {
      return -1;
    } else {
      this.balance - this.bet; // betting already deducted once, so just need to deduct 1x again
      this.bet *= 2;
    }
  }

  // player splits
  splitHand() {
    // can only split with 2 cards in hand
    if (this.hand.length !== 2) {
      return -1; // invalid move
    } else {
    }
  }
}

/*-------------------------------- Constants --------------------------------*/

/*---------------------------- Variables (state) ----------------------------*/

/*------------------------ Cached Element References ------------------------*/

/*-------------------------------- Functions --------------------------------*/

/*----------------------------- Event Listeners -----------------------------*/

const test = [{ key1: 1 }, { key2: 2 }];
for (obj of test) {
  return [obj];
  console.log(obj);
}
console.log(test[0]);
