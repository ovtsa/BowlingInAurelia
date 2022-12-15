import { throws } from 'assert';
import { BowlingFrame } from "bowling-logic/bowling-frame";

/* This Game class is the primary object that the ViewModel will have access to. It 
   contains the logic of the game of bowling.
*/
export class Game {
  players: object[];
  frames: BowlingFrame[];
  framePointerIndex: number;
  gameOver: boolean;
  score: number;


  constructor() {
    this.reset();
  }

  // Refreshes the bowling game to a new state without needing to reinstantiate the object.
  public reset(): void {
    this.frames = [];
    for (let i = 0; i < 10; i++) {
      this.frames.push(new BowlingFrame(i + 1));
    }
    this.framePointerIndex = 0;
    this.gameOver = false;
    this.score = 0;

    /* this player field is superfluous, but included in case code were to be
    added to dynamically add or remove players eventually. */
    this.players = [{name: "Nathan Jobe"}];
  }
  
  /* In the bowling-frame.ts file, I have a convention where I call rolls that end in a
     spare an 11, and ones that end in a strike a 12. They aren't actually 11 and 12 points,
     and they need to be displayed as a / or an x respectively. This function serves as an
     accessor for the view to that function in the BowlingFrame class.
  */
  public getScoreboardCharacter(roll: number): string {
    return BowlingFrame.getScoreboardCharacter(roll);
  }

  /* The Game.rollBall() method is the view's accessor to the functionality of rolling
     a roll within a frame. 
  */
  public rollBall(): void {
    // If the current frame has been completed, you should roll in the next frame.
    if (this.frames[this.framePointerIndex].frameIsComplete()) {
      this.framePointerIndex++;
    }

    this.frames[this.framePointerIndex].addRoll();

    this.calculateScores();
    this.checkGameOver();
  }

  /* The heftiest function in the program, and the one most open to optimization.
     Many changes could be done here, but I am working under the assumption that
     turning in a reasonably fast, readable, and working algorithm is the goal
     here. 

     Game.calculateScores() loops through all the frames that have currently been played
     and calculates the score for each of them, and the overall score. This must be rechecked
     because some frames are dependent on the score of the succeeding frames to know their own
     score.

     I can see ways to optimize this - for example, never rechecking a frame that has a strike
     or spare already calculated. However, since this is such a small project, that sounds like 
     it may be an overengineering issue to me.
  */
  private calculateScores(): void {
    this.score = 0;

    // Looping through all frames in the game
    for (let i = 0; i <= this.framePointerIndex; i++) {
      /* There are 3 ways this score can be decided
        1. On frames 1-9, if you get a strike, you get 10 + the next two rolls
        2. On frames 1-9, if you get a spare, you get 10 + the next roll
        3. In all other circumstances, the frame score is merely addition
           of pins knocked over.
      */

      /* I know nested if statements hinder readability. Given more time, I would like to see
         a simpler way to do this, but for now, I am content with this solution.
      */
      let frameScore = 0;

      // Looping through all rolls in this frame
      for (let j = 0; j < this.frames[i].rolls.length; j++) {
        // If you get a strike
        if (this.frames[i].rolls[j] === BowlingFrame.strikeValue) {
          frameScore += 10;
          if (i !== 9) {
            frameScore += this.getNextRoll(i, j) + this.getNextRoll (i + 1, 0);
          }
        // If you get a spare
        } else if (this.frames[i].rolls[j] === BowlingFrame.spareValue) {
          if (i === 9) { 
            frameScore += 10 - this.frames[i].rolls[j - 1];
          } else { 
            frameScore = 10 + this.getNextRoll(i, j); 
          }
        // If you get neither a strike nor a spare
        } else {
          frameScore += this.frames[i].rolls[j];
        }
      }
      this.frames[i].score = frameScore;
      this.score += frameScore;
    }
  }

  /* Helper function to grab the roll following the one specified,
     doing necessary bounds checking. Useful to dramatically simplify 
     Game.calculateScore()
  */
  private getNextRoll(frameIndex: number, rollIndexInFrame: number): number {
    // Quick bounds checking
    if (frameIndex < 0 || frameIndex > 9 || rollIndexInFrame < 0 || 
        rollIndexInFrame > 2 || (rollIndexInFrame > 1 && frameIndex !== 9)) {
      throw new RangeError("Game.getNextRoll() parameter out of bounds");
    }

    let nextRoll = 0;
    // next step is to get which roll is next and exists.
    if (this.frames[frameIndex].rolls.length > rollIndexInFrame + 1) {
      // if in here, this means that the rollIndexInFrame is not the last roll in this frame.
      // So we can just grab the next roll within the same frame.
      nextRoll = this.frames[frameIndex].rolls[rollIndexInFrame + 1];
    } else if (
      this.frames.length > frameIndex + 1 &&
      this.frames[frameIndex + 1].rolls.length > 0
    ) {
      // If in here, it means we have to look at the next frame to get the next roll.
      nextRoll = this.frames[frameIndex + 1].rolls[0];
    }

    // Cleaning up the messy spare and strike values as stored in BowlingFrame
    if (nextRoll === BowlingFrame.spareValue) nextRoll = 10 - this.frames[frameIndex].rolls[rollIndexInFrame];
    if (nextRoll === BowlingFrame.strikeValue) nextRoll = 10;
    
    return nextRoll;
  }

  /* helper function to see if the game is over, and therefore the "Roll!"
    button should be disabled.
  */
  private checkGameOver(): void {
    /* I originally wanted this to be a boolean function that I could bind the
    "Roll!" button to directly, but I struggled for a bit with binding to the
    disabled property in a function, and wound up choosing to just use a
    property for simplicity. If I worked with y'all, I would learn the proper
    way in Aurelia. */
    this.gameOver = this.frames[this.frames.length - 1].frameIsComplete();
  }
}
