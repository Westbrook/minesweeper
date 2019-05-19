import { LitElement, html } from 'lit-element';

import './minesweeper-board.js';
import './minesweeper-menu.js';

class MinesweeperApp extends LitElement {
	static get properties() {
		return {
			width: { type: Number },
			height: { type: Number },
      board: { type: Array },
      difficulty: { type: Number },
      squareSize: { type: Number },
		};
	}

  constructor() {
    super();
		this.width = 0;
		this.height = 0;
    this.board = [];
    this.difficulty = 5;
    this.squareSize = 50;
    window.requestIdleCallback(this.measure.bind(this));
  }

  measure() {
    var width = this.offsetWidth;
    var height = this.offsetHeight;
    this.width = width;
    this.height = height;
    this.startNewGame();
  }

  startNewGame() {
    this.createBoard();
  }

  createBoard() {
    let across = Math.floor(this.width / this.squareSize);
    let down = Math.floor(this.height / this.squareSize);
    let downCount = down;
    let board = Array(across);
    this.style.setProperty('--columns', across);
    this.style.setProperty('--rows', down);
    while (across) {
      across--;
      board[across] = Array(down);
      down = downCount;
      while (down) {
        down--;
        board[across][down] = this._setSquare();
      }
    }
    this.board = board;
  }

  _setSquare() {
    let isMine = Math.round(Math.random() * 100);
    let square = {
      mine: isMine <= this.difficulty * 4,
      played: false,
      marked: false,
    }
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

	render() {
		return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          height: 100vh;

          --minesweeper-square-size: 50px;
        }
      </style>
      <minesweeper-menu
        difficulty="${this.difficulty}"
        @minesweeper-new-game=${this.startNewGame}
      ></minesweeper-menu>
      <minesweeper-board
        .board=${this.board}
        @minesweeper-game-over=${this._gameOver}
      ></minesweeper-board>
		`;
	}
}

customElements.define('minesweeper-app', MinesweeperApp);
