/* I have not gone terribly heavy on testing in this application, as it is pretty small.
However, I am a believer in testing, and in an enterprise environment, I would be happy to
participate. I wanted to show that I knew how to do it using a framework I haven't used before.
*/

import { Game } from "bowling-logic/game";

describe('Game Class', () => {
  const game: Game = new Game();
  test('Constructor should instantiate all fields to defaults', () => {
    expect(game.framePointerIndex === 0);
    expect(game.frames.length === 0);
    expect(game.gameOver === false);
    expect(game.players.length === 1);
    expect(game.score === 0);
  });

  test('A reset game should be equal to a newly instantiated one', () => {
    const game1: Game = new Game();
    const game2: Game = new Game();
    game1.rollBall();
    game1.rollBall();
    game1.rollBall();
    game1.reset();
    expect(game1.framePointerIndex === game2.framePointerIndex);
    expect(game1.frames.length === game2.frames.length);
    expect(game1.gameOver === game2.gameOver);
    expect(game1.players.length === game2.players.length);
    expect(game1.score === game2.score);
  });

  game.reset();

  test('Game.getScoreboardCharacter(roll: number) should return 0-9, /, or x', () => {
    for (let i = 0; i < 10; i++) {
      expect(game.getScoreboardCharacter(i) === i.toString());
    }
    expect(game.getScoreboardCharacter(11) === '/');
    expect(game.getScoreboardCharacter(12) === 'x');
  });

  game.reset();

  test('Game.getScoreboardCharacter(roll: number): roll cannot be under 0, equal to 10, or above 12', () => {
    expect(() => {game.getScoreboardCharacter(-1)}).toThrow(RangeError);
    expect(() => {game.getScoreboardCharacter(10)}).toThrow(RangeError);
    expect(() => {game.getScoreboardCharacter(15)}).toThrow(RangeError);
  });
  
  game.reset();

  test('Game.rollBall() correctly calculates scores', () => {
    for (let i = 0; i < Math.floor(Math.random() * 18); i++) {
      game.rollBall();
    }
    let scoreCount = 0;
    for (let i = 0; i < game.frames.length; i++) {
      if (game.frames[i].score !== -1) {
        scoreCount += game.frames[i].score;
      }
    }
    expect(game.score === scoreCount);
  });

  
});
