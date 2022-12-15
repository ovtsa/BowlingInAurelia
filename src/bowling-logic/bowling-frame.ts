/* The BowlingFrame class is an abstraction of a single frame in a game of bowling
   for one player. It contains various helper methods too specific to the frame and
   too tangential to be included within the Game class.
*/
export class BowlingFrame {
  // This is simply a convention to be used in scoring.
  public static readonly spareValue: number = 11;
  public static readonly strikeValue: number = 12;

  constructor(
    private _frameNumber: number = 1,
    // a roll of 11 means a spare, and a 12 means a strike, as shown above.
    private _rolls: number[] = [],
    private _score: number = -1,
  ) {
    if (_frameNumber < 1 || this.frameNumber > 10 || 
      (_rolls.length > 3 || _rolls.length > 2 && _frameNumber !== 10) ||
      _score < -1 || _score > 30) {
        throw new RangeError('Illegal arguments in BowlingFrame constructor');
      }
  }

  public get frameNumber(): number {
    return this._frameNumber;
  }

  public get rolls(): number[] {
    return this._rolls;
  }

  public get score(): number {
    return this._score;
  }

  public set score(score: number) {
    this._score = score;
  }

  // This function allows way the view presents scores - spares should be a /, and strikes should be an x.
  public static getScoreboardCharacter(roll: number): string {
    if (roll < 0 || roll === 10 || roll > 12) {
      throw new RangeError('roll out of bounds in BowlingFrame.getScoreboardCharacter(roll: number)');
    }

    switch (roll) {
      case this.spareValue:
        return '/';
      case this.strikeValue:
        return 'x';
      default:
        return roll.toString();
    }
  }

  /* This function does what is necessary to add a roll to this frame and
     calculate whether that was a strike, a spare, or neither.
  */
  public addRoll(): void {
    // You shouldn't be adding rolls to a finished frame, and I'd rather not nest an if statement here.
    if (this.frameIsComplete()) {
      throw new Error('BowlingFrame.addRoll() attempted on completed frame');
    }

    /* This chunk of code determines how many pins are available to be knocked down.
       I have attempted to format this as legibly as possible. 

       Basically, the number of pins available will be 10 if it's a new frame, or
       if we're in frame 10, then also if the previous roll was a spare or strike.

       Otherwise, the number of pins available will be equal to 10 minus the number
       knocked over in the last roll.
    */
    const pinsAvailable = (
      this.rolls.length === 0 || 
      this.rolls[this.rolls.length - 1] === BowlingFrame.spareValue || 
      this.rolls[this.rolls.length - 1] === BowlingFrame.strikeValue
    ) ? 
      10 : 
      10 - this.rolls[this.rolls.length - 1];
    
    // Finally, we do a random roll.
    let pinsKnockedOver = Math.floor(Math.random() * (pinsAvailable + 1));

    // determine if this roll was a spare or strike 
    // a roll will be a strike if it knocks over all the pins
    // AND the previous roll either doesn't exist, was a spare, or was a strike
    if (
      pinsKnockedOver === 10 && (
        this.rolls.length === 0 || 
        this.rolls[this.rolls.length - 1] === BowlingFrame.spareValue ||
        this.rolls[this.rolls.length - 1] === BowlingFrame.strikeValue
      )
    ) {
      pinsKnockedOver = BowlingFrame.strikeValue;
    } else if (pinsAvailable === pinsKnockedOver) {
      pinsKnockedOver = BowlingFrame.spareValue;
    }

    // finally, we add the roll to this frame.
    this._rolls.push(pinsKnockedOver);
  }

  /* This function determines if this frame is complete.
  */
  public frameIsComplete(): boolean {
    /* Cases where a frame will be complete 
      1. On frames 1-9 when a strike is thrown in the first throw
      2. On frames 1-9 when a second throw is completed
      3. On frame 10 when 2 throws have been completed and the second is not a spare or strike
         and the first was not a strike.
      4. On frame 10 when 3 throws have been completed
    */
    return (
      ( // case 1
        this.frameNumber !== 10 && this.rolls.length === 1 && 
        this.rolls[0] === BowlingFrame.strikeValue
      ) || ( // case 2
        this.frameNumber !== 10 && this.rolls.length === 2
      )  || ( // case 3
        this.frameNumber === 10 && this.rolls.length === 2 && 
        this.rolls[0] !== BowlingFrame.strikeValue && 
        this.rolls[1] !== BowlingFrame.spareValue
      ) || ( // case 4
        this.frameNumber === 10 && this.rolls.length === 3
      )
    );
  }
}
