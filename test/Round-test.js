const chai = require('Chai');
const expect = chai.expect;

const Card = require('../src/Card');
const Deck = require('../src/Deck');
const Turn = require('../src/Turn');
const Round = require('../src/Round');

describe('Round class', () => {
  let card1, card2, card3, deck, turn1, round;

  beforeEach(() => {
    card1 = new Card( 1, "At what age did Ahsoka Tano become a Jedi Padawan?", ["12", "14", "17"], "14" );
    card2 = new Card( 2, "Who was Ahsoka's teacher?", ["Yoda", "Plo Koon", "Anakin Skywalker"], "Anakin Skywalker" );
    card3 = new Card( 3, "Did Ahsoka fight with Darth Maul on Mandalore?", ["true", "false"], "true" );
    deck = new Deck([ card1, card2, card3 ]);
    turn1 = new Turn('14', card1);
    round = new Round(deck);
  })

  describe('Round class properties', () => { // describes Round.constructor
    it('should take in a deck of cards to play with', () => {
      expect(round.deckInPlay).to.deep.equal(deck);
    })

    it('should count the number of turns taken', () => {
      expect(round.turnCount).to.equal(0);
    })

    it('should have an array to store incorrect answers', () => {
      expect(round.incorrectGuesses).to.deep.equal([]);
    })

    it('should store the percentage of correct answers', () => {
      expect(round.percentCorrect).to.equal(0);
    })

    it('should keep track of progress in the round', () => {
      expect(round.isOver).to.equal(false);
    })
  })

  describe('A method to return the current card in play', () => { // describes Round.returnCurrentCard
    it('should return the first card in the deck at the start of the round', () => {
      expect(round.returnCurrentCard()).to.deep.equal(card1);
    })

    it('should return the current card', () => { // invoke Turn.currentCard
      expect(round.returnCurrentCard()).to.deep.equal(card1);
    })
  })

  describe('A method to record the steps for each turn', () => { // describes Round.takeTurn
    it('should create a new Turn instance', () => {
      round.takeTurn('14');
      expect(turn1).to.be.an.instanceof(Turn);
    })

    it('should update the turn counter', () => {
      round.takeTurn('14');

      expect(round.turnCount).to.equal(1);
    })

    it('should update the turn counter regardless of a correct answer', () => {
      round.takeTurn('14');
      round.takeTurn('Yoda');
      round.takeTurn('true');

      expect(round.turnCount).to.equal(3);
    })

    it('should return the next card in the deck', () => {
      round.takeTurn('14');
      round.takeTurn('Yoda');

      expect(round.returnCurrentCard()).to.deep.equal(card3);
    })

    it('should evaluate each answer', () => { // invoke Turn.evaluateGuess
      round.takeTurn('14');

      expect(round.incorrectGuesses).to.deep.equal([]);
    })

    it('should store the id of incorrect answers', () => {
      round.takeTurn('14');
      round.takeTurn('Yoda');

      expect(round.incorrectGuesses).to.deep.equal([2]);
    })

    it('should tell the player if their answer is correct', () => { // invoke Turn.giveFeedback

      expect(round.takeTurn('14')).to.equal('correct! 🎉');
    })

    it('should tell the player if their answer is incorrect', () => {
      round.takeTurn('14');

      expect(round.takeTurn('Yoda')).to.equal('not correct. 🌚 You can try again in the next round!');
    })
  })

  describe('A method to calculate the game score', () => {
    it('should calculate the percentage of correct answers', () => { // describes Round.calculateScore
      round.takeTurn('14');
      round.takeTurn('Yoda');
      round.takeTurn('true');
      round.calculateScore();

      expect(round.percentCorrect).to.equal(67);
    })
  })

  describe('A method to alert a player when the game is over', () => { // describes Round.endRound
    it.skip('should end the round when all cards have been played', () => {
      round.takeTurn('14');
      round.takeTurn('Yoda');
      round.takeTurn('true');
      round.calculateScore();
      round.endRound();

      expect(round.isOver).to.equal(true);
    })

    it('should only end the round if all the cards have been played', () => {
      round.takeTurn('14');
      round.takeTurn('Yoda');
      round.endRound();

      expect(round.isOver).to.equal(false);
    })

    it('should return a message with the percentage of correct answers', () => {
      round.takeTurn('14');
      round.takeTurn('Yoda');
      round.takeTurn('true');
      round.calculateScore();

      expect(round.endRound()).to.equal('** Round over! ** You answered 67% of the questions correctly!');
    })
  })
});
