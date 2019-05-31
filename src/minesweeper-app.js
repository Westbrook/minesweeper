import { LitElement, html, css } from 'lit-element';

import { defaultBoard } from './constants.js';
import './minesweeper-menu.js';

class MinesweeperApp extends LitElement {
  static get properties() {
    return {
      width: { type: Number },
      height: { type: Number },
      across: { type: Number },
      down: { type: Number },
      board: { type: Array },
      mines: {
        type: Number,
        hasChanged() {
          return false;
        },
      },
      difficulty: { type: Number },
      squareSize: { type: Number },
    };
  }

  constructor() {
    super();
    this.width = 0;
    this.height = 0;
    this.board = defaultBoard;
    this.mines = 0;
    this.difficulty = 5;
    this.squareSize = 50;
  }

  measure() {
    import('./minesweeper-board.js');
    this.width = this.offsetWidth;
    this.height = this.offsetHeight;
    this.startNewGame();
  }

  startNewGame(e = { detail: { difficulty: false } }) {
    this.difficulty = e.detail.difficulty || this.difficulty;
    this.createBoard();
  }

  createBoard() {
    let across = Math.floor(this.width / this.squareSize);
    this.across = across;
    let down = Math.floor(this.height / this.squareSize);
    this.down = down;
    const downCount = down;
    const board = Array(across);
    this.mines = 0;
    while (across) {
      across -= 1;
      board[across] = Array(down);
      down = downCount;
      while (down) {
        down -= 1;
        board[across][down] = this._setSquare();
      }
    }
    this.board = board;
  }

  _setSquare() {
    const isMine = Math.round(Math.random() * 100) <= this.difficulty * 4;
    if (isMine) this.mines += 1;
    const square = {
      state: isMine ? 'MINE' : 'NOT_MINE',
    };
    return square;
  }

  _gameOver() {
    requestIdleCallback(() => this._requestNewGame());
  }

  _requestNewGame() {
    if (window.confirm('Game Over.\n\n\nStart a new game?')) {
      this.startNewGame();
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          height: 100vh;

          --minesweeper-square-size: 50px;
        }
        .dark-theme {
          --color-square-background: black;
          --color-square-focus: neongreen;
          --color-square-border: lightblue;
          --color-danger-low: green;
          --color-danger-medium: yellow;
          --color-danger-high: orange;
          --color-danger-worry: red;
          --color-dead: white;
        }
      `,
    ];
  }

  render() {
    return html`
      <minesweeper-menu
        difficulty="${this.difficulty}"
        @minesweeper-new-game=${this.measure}
      ></minesweeper-menu>
      ${this.across && this.down
        ? html`
            <minesweeper-board
              style=${`--columns:${this.across};--rows:${this.down};`}
              .board=${this.board}
              .mines=${this.mines}
              @minesweeper-game-over=${this._gameOver}
            ></minesweeper-board>
          `
        : html``}
    `;
  }
}

customElements.define('minesweeper-app', MinesweeperApp);
