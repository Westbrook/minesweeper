import { LitElement, html } from 'lit-element';

import './minesweeper-square.js';

const status = {
  DEAD: 'dead',
  PLAYING: 'playing',
}

class MinesweeperBoard extends LitElement {
	static get properties() {
		return {
      board: { type: Array },
      status: { type: String }
		};
	}

  constructor() {
    super();
    this.board = [];
    this.status = status.PLAYING;
  }

  _getNeighbors(board, across, down, needle) {
    var neighbors = 0;
    let square;
    for (var i = -1; i <= 1; i++) {
      if (!board[across + i]) continue;
      for (var j = -1; j <= 1; j++) {
        square = board[across + i][down + j];
        if (!square) continue;
        if (i === 0 && j === 0) continue;
        if (square[needle]) {
          neighbors++;
        }
      }
    }
    return neighbors;
  }

  _getNeighboringMines(board, across, down) {
    return this._getNeighbors(...arguments, 'mine');
  }

  _getNeighboringMarks(board, across, down) {
    return this._getNeighbors(...arguments, 'marked');
  }

  _playNeighbors(across, down, unsafe) {
    for (var i = across - 1; i <= across + 1; i++) {
      if (i < 0 || i == this.board.length) continue;
      for (var j = down - 1; j <= down + 1; j++) {
        if (j < 0 || j == this.board[i].length) continue;
        const square = this.board[i][j];
        if ((unsafe || !square.mine) && !square.played && !square.marked) {
          square.played = true;
          if (square.mine) {
            this.status = status.DEAD;
          }
          if (!this._getNeighboringMines(this.board, i, j)) this._playNeighbors(i, j);
        }
      }
    }
    this.requestUpdate();
  }

  _played(e) {
    if (this.status === status.DEAD) return;
    var column = e.target.column;
    var row = e.target.row;
    const square = this.board[column][row];
    if (square.played) {
      const unsafe = true;
      if (this._getNeighboringMines(this.board, column, row) === this._getNeighboringMarks(this.board, column, row)) {
        this._playNeighbors(column, row, unsafe);
      }
    } else if (square.mine) {
      this.status = status.DEAD;
    } else if (!this._getNeighboringMines(this.board, column, row)) {
      this._playNeighbors(column, row);
    }
    square.played = true;
    this.requestUpdate();
  }

  _marked(e) {
    var column = e.target.column;
    var row = e.target.row;
    this.board[column][row].marked = !e.detail.marked;
    this.requestUpdate();
  }

	render() {
		return html`
      <style>
        :host {
          display: grid;
          grid-auto-flow: column;
          grid-template-columns: repeat(var(--columns), auto);
          grid-template-rows: repeat(var(--rows), auto);
        }
      </style>
      ${this.board.map((column, across) => column.map((square, down) => html`
          <minesweeper-square
            .column=${across}
            .mine=${square.mine}
            .marked=${square.marked}
            .neighbors=${this._getNeighboringMines(this.board, across, down)}
            .played=${square.played}
            .row=${down}
            @minesweeper-played=${this._played}
            @minesweeper-marked=${this._marked}
          ></minesweeper-square>
      `))}
		`;
	}

  updated(changes) {
    if (changes.has('status') && this.status === status.DEAD) {
      this.dispatchEvent(new CustomEvent('minesweeper-game-over', {bubbles: true, composed: true}));
    } else if (changes.has('board')) {
      this.status = status.PLAYING;
    }
  }
}

customElements.define('minesweeper-board', MinesweeperBoard);
