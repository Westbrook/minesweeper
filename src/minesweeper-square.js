import { LitElement, html } from 'lit-element';

class MinesweeperSquare extends LitElement {
	static get properties() {
		return {
      mine: { type: Boolean },
      neighbors: { type: Number },
      played: { type: Boolean },
      marked: { type: Boolean },
      column: { type: Number },
      row: { type: Number }
		};
	}

  constructor() {
    super();
    this.mine = false;
    this.neighbors = 0;
    this.played = false;
    this.marked = false;
    this.column = 0;
    this.row = 0;
  }

  _display(played, mine, neighbors) {
      let dangerLevel = this._dangerLevel(played, mine, neighbors);
      if (!played) return false;
      if (mine) return 'played dead';
      if (dangerLevel > 5) {
        return 'played worry';
      } else if (dangerLevel > 2) {
        return 'played large';
      } else if (dangerLevel > 1) {
        return 'played medium';
      } else {
        return 'played low';
      }
  }

  _dangerLevel(played, mine, neighbors, marked) {
    if (marked) return 'm';
    if (!played) return '';
    if (mine) return 'X';
    return neighbors || '';
  }

  play() {
    if (this.marked) return;
    this.dispatchEvent(new CustomEvent('minesweeper-played', {composed: true}))
  }

  mark(e) {
    e.preventDefault();
    if (this.played) {
      return this.play();
    }
    this.dispatchEvent(new CustomEvent('minesweeper-marked', {composed: true, detail: {marked: this.marked}}))
  }

	render() {
		return html`
      <style>
        :host {
          display: block;
          min-width: var(--minesweeper-square-size, 25px);
          height: var(--minesweeper-square-size, 25px);
          line-height: var(--minesweeper-square-size, 25px);
          text-align: center;
        }
        .square {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          border: 4px outset;
          background: #cecece;
          font-weight: bold;
          font-family: monospace;
          font-size: 2em;
          -webkit-user-select: none;  /* Chrome all / Safari all */
          -moz-user-select: none;     /* Firefox all */
          -ms-user-select: none;      /* IE 10+ */
          user-select: none;          /* Likely future */
        }
        .played {
          border: 1px solid #999;
        }
        .low {
          color: blue;
        }
        .medium {
          color: green;
        }
        .large {
          color: red;
        }
        .worry {
          color: darkred;
        }
        .dead {
          background: red;
        }
      </style>
      <div
        class="square ${this._display(this.played, this.mine, this.neighbors)}"
        @click=${this.play}
        @contextmenu=${this.mark}
      >
        ${this._dangerLevel(this.played, this.mine, this.neighbors, this.marked)}
      </div>
		`;
	}
}

customElements.define('minesweeper-square', MinesweeperSquare);
