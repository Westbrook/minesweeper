import { LitElement, html, css } from 'lit-element';

import './minesweeper-square.js';

const status = {
  DEAD: 'dead',
  PLAYING: 'playing',
};

const defaultFocusedSquare = [0, 0];

class MinesweeperBoard extends LitElement {
  static get properties() {
    return {
      board: { type: Array },
      marks: { type: Number },
      mines: { type: Number },
      status: { type: String },
      focusedSquare: { type: Array },
    };
  }

  constructor() {
    super();
    this.board = [];
    this.marks = 0;
    this.mines = 0;
    this.status = status.PLAYING;
    this.focusedSquare = defaultFocusedSquare;
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  _getNeighbors(across, down, needle) {
    let neighbors = 0;
    let square;
    for (let i = -1; i <= 1; i += 1) {
      if (this.board[across + i]) {
        for (let j = -1; j <= 1; j += 1) {
          square = this.board[across + i][down + j];
          if (square) {
            if (i !== 0 || j !== 0) {
              if (square[needle]) {
                neighbors += 1;
              }
            }
          }
        }
      }
    }
    return neighbors;
  }

  _getNeighboringMines(...args) {
    return this._getNeighbors(...args, 'mine');
  }

  _getNeighboringMarks(...args) {
    return this._getNeighbors(...args, 'marked');
  }

  _playNeighbors(across, down, unsafe) {
    for (let i = across - 1; i <= across + 1; i += 1) {
      if (this.board[i]) {
        for (let j = down - 1; j <= down + 1; j += 1) {
          if (this.board[i][j]) {
            const square = this.board[i][j];
            if ((unsafe || !square.mine) && !square.played && !square.marked) {
              square.played = true;
              if (square.mine) {
                this.status = status.DEAD;
              }
              if (!this._getNeighboringMines(i, j)) this._playNeighbors(i, j);
            }
          }
        }
      }
    }
    this.board = [...this.board];
  }

  _played(e) {
    if (this.status === status.DEAD) return;
    const { column, row } = e.target;
    const square = this.board[column][row];
    this.focusedSquare = [column, row];
    if (square.played) {
      const unsafe = true;
      if (this._getNeighboringMines(column, row) === this._getNeighboringMarks(column, row)) {
        this._playNeighbors(column, row, unsafe);
      } else {
        return;
      }
    } else if (square.mine) {
      this.status = status.DEAD;
    } else if (!this._getNeighboringMines(column, row)) {
      this._playNeighbors(column, row);
    }
    square.played = true;
    this.board = [...this.board];
  }

  _marked(e) {
    const { column, row } = e.target;
    const square = this.board[column][row];
    this.focusedSquare = [column, row];
    square.marked = !e.detail.marked;
    this.marks += square.marked ? 1 : -1;
    this.board = [...this.board];
  }

  handleKeydown(e) {
    let { column, row } = e.composedPath()[0].getRootNode().host;
    const offset = e.shiftKey ? 5 : 1;
    switch (e.key) {
      case 'ArrowDown':
        row = (this.board[0].length + row + offset) % this.board[0].length;
        break;
      case 'ArrowUp':
        row = (this.board[0].length + row - offset) % this.board[0].length;
        break;
      case 'ArrowLeft':
        column = (this.board.length + column - offset) % this.board.length;
        break;
      case 'ArrowRight':
        column = (this.board.length + column + offset) % this.board.length;
        break;
      case 'm':
        this.shadowRoot.querySelector(`[column="${column}"][row="${row}"]`).mark(e);
        break;
      default:
        break;
    }
    this.focusedSquare = [column, row];
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
              .mine=${square.mine}
              .marked=${square.marked}
              .neighbors=${this._getNeighboringMines(across, down)}
              .played=${square.played}
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
