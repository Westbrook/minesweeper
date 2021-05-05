import { LitElement, html, css } from 'lit';

import { memoize } from './memoize.js';
import { squareTransition } from './square-machine.js';
import { defaultBoard } from './constants.js';
import './minesweeper-square.js';

const status = {
  DEAD: 'dead',
  PLAYING: 'playing',
};

const defaultFocusedSquare = [0, 0];

class MinesweeperBoard extends LitElement {
  static get properties() {
    return {
      moves: { type: Number },
      board: { type: Array },
      marks: { type: Number },
      mines: { type: Number },
      status: { type: String },
      focusedSquare: { type: Array },
    };
  }

  constructor() {
    super();
    this.board = defaultBoard;
    this.moves = 0;
    this.marks = 0;
    this.mines = 0;
    this.status = status.PLAYING;
    this.focusedSquare = defaultFocusedSquare;
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  get board() {
    return this._board;
  }

  set board(board) {
    if (board === this.board) return;
    const old = this.board;
    this._board = board;
    this.memoizedGetNeighboringMines = memoize(this._getNeighboringMines.bind(this));
    this.requestUpdate('board', old);
  }

  _getNeighbors(across, down, ...needles) {
    let neighbors = 0;
    this._doNeighbors(across, down, square => {
      if (needles.includes(square.state)) {
        neighbors += 1;
      }
    });
    return neighbors;
  }

  _doNeighbors(across, down, cb) {
    const neighbors = 0;
    for (let i = -1; i <= 1; i += 1) {
      if (this.board[across + i]) {
        for (let j = -1; j <= 1; j += 1) {
          const square = this.board[across + i][down + j];
          if (square && (i !== 0 || j !== 0)) {
            cb(square, i, j);
          }
        }
      }
    }
    return neighbors;
  }

  _getNeighboringMines(...args) {
    return this._getNeighbors(...args, 'MINE', 'MARKED_MINE', 'TRIPPED');
  }

  _getNeighboringMarks(...args) {
    return this._getNeighbors(...args, 'MARKED', 'MARKED_MINE');
  }

  _playNeighbors(across, down, unsafe) {
    this._doNeighbors(across, down, (square, i, j) => {
      if (unsafe || square.state === 'NOT_MINE') {
        // eslint-disable-next-line no-param-reassign
        square.state = squareTransition(square.state, 'PLAYED');
        if (square.state === 'TRIPPED') {
          this.status = status.DEAD;
        } else if (
          !['MARKED', 'MARKED_MINE'].includes(square.state) &&
          this.memoizedGetNeighboringMines(across + i, down + j) === 0
        ) {
          this._playNeighbors(across + i, down + j);
        }
      }
    });
    this.moves += 1;
  }

  _played(e) {
    if (this.status === status.DEAD) return;
    const { column, row } = e.target;
    const square = this.board[column][row];
    this.focusedSquare = [column, row];
    if (square.state === 'PLAYED') {
      const unsafe = true;
      if (
        this.memoizedGetNeighboringMines(column, row) === this._getNeighboringMarks(column, row)
      ) {
        this._playNeighbors(column, row, unsafe);
      } else {
        return;
      }
    } else if (square.state === 'MINE') {
      this.status = status.DEAD;
    } else if (!this.memoizedGetNeighboringMines(column, row)) {
      this._playNeighbors(column, row);
    }
    square.state = squareTransition(square.state, 'PLAYED');
    this.moves += 1;
  }

  _marked(e) {
    const { column, row } = e.target;
    const square = this.board[column][row];
    this.focusedSquare = [column, row];
    square.state = squareTransition(square.state, e.detail.marked ? 'UNMARKED' : 'MARKED');
    this.marks += square.state === 'MARKED' || square.state === 'MARKED_MINE' ? 1 : -1;
    this.moves += 1;
  }

  handleKeydown(e) {
    let { column, row } = e.composedPath()[0].getRootNode().host;
    const offset = e.shiftKey ? 5 : 1;
    switch (e.key) {
      case 'ArrowDown':
        row = this.board[0].length + row + offset;
        break;
      case 'ArrowUp':
        row = this.board[0].length + row - offset;
        break;
      case 'ArrowLeft':
        column = this.board.length + column - offset;
        break;
      case 'ArrowRight':
        column = this.board.length + column + offset;
        break;
      case 'm':
        this.shadowRoot.querySelector(`[column="${column}"][row="${row}"]`).mark(e);
        break;
      default:
        break;
    }
    this.focusedSquare = [column % this.board.length, row % this.board[0].length];
  }

  focusBoard() {
    window.addEventListener('keydown', this.handleKeydown);
  }

  blurBoard() {
    window.removeEventListener('keydown', this.handleKeydown);
  }

  isFocusedSquare(across, down) {
    if (this.focusedSquare === defaultFocusedSquare) {
      return across === 0 && down === 0;
    }
    return across === this.focusedSquare[0] && down === this.focusedSquare[1];
  }

  get focusedSquareSelector() {
    const [column, row] = this.focusedSquare;
    return `[column="${column}"][row="${row}"]`;
  }

  static get styles() {
    return [
      css`
        :host {
          position: relative;
          display: grid;
          flex-grow: 1;
          grid-auto-flow: column;
          grid-template-columns: repeat(var(--columns), 1fr);
          grid-template-rows: repeat(var(--rows), 1fr);
        }
        .status {
          position: absolute;
          bottom: 100%;
          right: 0;
          line-height: 48px;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="status">
        ${this.marks}/${this.mines}
      </div>
      ${this.board.map((column, across) =>
        column.map(
          (square, down) => html`
            <minesweeper-square
              .state=${square.state}
              .neighbors=${this.memoizedGetNeighboringMines(across, down)}
              column=${across}
              row=${down}
              ?can-focus=${this.isFocusedSquare(across, down)}
              @minesweeper-played=${this._played}
              @minesweeper-marked=${this._marked}
              @focus=${this.focusBoard}
              @blur=${this.blurBoard}
            ></minesweeper-square>
          `,
        ),
      )}
    `;
  }

  updated(changes) {
    if (changes.has('status') && this.status === status.DEAD) {
      this.dispatchEvent(
        new CustomEvent('minesweeper-game-over', { bubbles: true, composed: true }),
      );
    } else if (changes.has('mines')) {
      this.marks = 0;
      this.status = status.PLAYING;
      this.focusedSquare = defaultFocusedSquare;
    } else {
      const square = this.shadowRoot.querySelector(this.focusedSquareSelector);
      square.updateComplete.then(() => {
        square.focus();
      });
    }
  }
}

customElements.define('minesweeper-board', MinesweeperBoard);
