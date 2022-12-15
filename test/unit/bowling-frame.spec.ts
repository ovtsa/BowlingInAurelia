/* I have not gone terribly heavy on testing in this application, as it is pretty small.
However, I am a believer in testing, and in an enterprise environment, I would be happy to
participate. I wanted to show that I knew how to do it using a framework I haven't used before.
*/

import { BowlingFrame } from "bowling-logic/bowling-frame";

describe('BowlingFrame class', () => {
  test('BowlingFrame.constructor should not allow certain inputs', () => {
    expect(() => { new BowlingFrame(0); }).toThrow(RangeError);
    expect(() => { new BowlingFrame(11); }).toThrow(RangeError);
    expect(() => { new BowlingFrame(1, [1, 2, 3, 4, 5]); }).toThrow(RangeError);
    expect(() => { new BowlingFrame(10, [1, 2, 3, 4]); }).toThrow(RangeError);
    expect(() => { new BowlingFrame(1, [], -2); }).toThrow(RangeError);
    expect(() => { new BowlingFrame(1, [], 31); }).toThrow(RangeError);
  });

  test('BowlingFrame.getScoreboardCharacter(roll: number) should return 0-9, /, or x', () => {
    for (let i = 0; i < 10; i++) {
      expect(BowlingFrame.getScoreboardCharacter(i) === i.toString());
    }
    expect(BowlingFrame.getScoreboardCharacter(11) === '/');
    expect(BowlingFrame.getScoreboardCharacter(12) === 'x');
  });

  test('BowlingFrame.getScoreboardCharacter(roll: number): roll cannot be under 0, equal to 10, or above 12', () => {
    expect(() => {BowlingFrame.getScoreboardCharacter(-1)}).toThrow(RangeError);
    expect(() => {BowlingFrame.getScoreboardCharacter(10)}).toThrow(RangeError);
    expect(() => {BowlingFrame.getScoreboardCharacter(15)}).toThrow(RangeError);
  });

  test('BowlingFrame.addRoll() should not be allowed on a completed frame', () => {
    const bowlingFrame: BowlingFrame = new BowlingFrame(1);
    bowlingFrame.addRoll();
    bowlingFrame.addRoll();
    expect(() => {bowlingFrame.addRoll()}).toThrow(Error);
  });
});
