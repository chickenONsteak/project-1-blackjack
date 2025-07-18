/*--------------------------------- Classes ---------------------------------*/
class Cards {
  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }
  // method to convert the non-int values to int
  returnValue() {
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
  constructor(name, wealth) {
    this.name = name;
    this.hand = [];
    this.wealth = wealth;
  }
}

/*-------------------------------- Constants --------------------------------*/

/*---------------------------- Variables (state) ----------------------------*/

/*------------------------ Cached Element References ------------------------*/

/*-------------------------------- Functions --------------------------------*/

/*----------------------------- Event Listeners -----------------------------*/

const deck1 = new Deck();
deck1.generateCards();
deck1.shuffle();
console.log(deck1.deck);
