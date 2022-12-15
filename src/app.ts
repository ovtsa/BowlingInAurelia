import { Game } from "bowling-logic/game";

// I moved the logic for the game of bowling into the bowling-logic directory.
export class App {
  game: Game;

  constructor() {
    this.game = new Game();
  }
}
