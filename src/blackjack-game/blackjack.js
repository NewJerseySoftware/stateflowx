/*
const stateServer = {
  // An array of player objects representing each player in the game.
  players: [],

  // The deck of cards being used in the game.
  deck: null,

  // The dealer's hand.
  dealerHand: [],

  // The minimum bet amount allowed in the game.
  minBet: 10,

  // The maximum bet amount allowed in the game.
  maxBet: 100,

  // The current round number.
  roundNumber: 1,

  // A method for adding a player to the game.
  addPlayer: function (playerName, playerBankroll) {
    this.players.push({
      name: playerName,
      bankroll: playerBankroll,
      hand: [],
      betAmount: null,
      standing: false,
      busted: false,
      blackjack: false,
    });
  },

  // A method for starting a new round of the game.
  startNewRound: function () {
    // Shuffle the deck.
    this.deck = shuffleDeck();

    // Reset all players' hands and standing/busted/blackjack status.
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].hand = [];
      this.players[i].standing = false;
      this.players[i].busted = false;
      this.players[i].blackjack = false;
    }

    // Deal two cards to each player and the dealer.
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < this.players.length; j++) {
        this.players[j].hand.push(drawCard());
      }
      this.dealerHand.push(drawCard());
    }

    // Set all players' bet amounts to the minimum bet.
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].betAmount = this.minBet;
      this.players[i].bankroll -= this.minBet;
    }

    // Increment the round number.
    this.roundNumber++;
  },

  // A method for a player to hit (take another card).
  hit: function (playerIndex) {
    this.players[playerIndex].hand.push(drawCard());
    checkPlayerStatus(playerIndex);
  },

  // A method for a player to stand (not take any more cards).
  stand: function (playerIndex) {
    this.players[playerIndex].standing = true;
  },

  // A method for checking a player's status (whether they are still in the game or not).
  checkPlayerStatus: function (playerIndex) {
    let handValue = calculateHandValue(this.players[playerIndex].hand);
    if (handValue > 21) {
      this.players[playerIndex].busted = true;
    } else if (handValue === 21) {
      this.players[playerIndex].blackjack = true;
      this.players[playerIndex].standing = true;
    }
  },

  // A method for calculating the value of a hand of cards.
  calculateHandValue: function (hand) {
    let totalValue = 0;
    let hasAce = false;
    for (let i = 0; i < hand.length; i++) {
      let cardValue = hand[i].value;
      if (cardValue === 'A') {
        hasAce = true;
      }
      if (cardValue === 'J' || cardValue === 'Q' || cardValue === 'K') {
        totalValue += 10;
      } else if (typeof cardValue === 'number') {
        totalValue += cardValue;
      }
      if (hasAce && totalValue <= 11) {
        totalValue += 10;
      }
      return totalValue;
    }
  },

  // A method for dealing a single card from the deck.
  drawCard: function () {
    let card = this.deck.shift();
    return card;
  },

  // A method for shuffling the deck.
  shuffleDeck: function () {
    let deck = [];
    let suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    let values = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < values.length; j++) {
        deck.push({ suit: suits[i], value: values[j] });
      }
    }
    for (let i = deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
    return deck;
  },
};
*/
