import { LitElement, html } from 'lit-element';

class MinesweeperSquare extends LitElement {
  static get properties() {
    return {
      canFocus: { type: Boolean, attribute: 'can-focus' },
      mine: { type: Boolean },
      neighbors: { type: Number },
      played: { type: Boolean },
      marked: { type: Boolean },
      column: { type: Number },
      row: { type: Number },
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
    const dangerLevel = this._dangerLevel(played, mine, neighbors);
    if (!played) return false;
    if (mine) return 'played dead';
    if (dangerLevel > 5) {
      return 'played worry';
    }
    if (dangerLevel > 2) {
      return 'played large';
    }
    if (dangerLevel > 1) {
      return 'played medium';
    }
    return 'played low';
  }

  _dangerLevel() {
    if (this.marked) return 'm';
    if (!this.played) return '';
    if (this.mine) return 'X';
    return this.neighbors || '';
  }

  play() {
    if (this.marked) return;
    this.dispatchEvent(new CustomEvent('minesweeper-played', { composed: true }));
  }

  mark(e) {
    e.preventDefault();
    if (this.played) {
      this.play();
      return;
    }
    this.dispatchEvent(
      new CustomEvent('minesweeper-marked', { composed: true, detail: { marked: this.marked } }),
    );
  }

  focus() {
    this.shadowRoot.querySelector('button').focus();
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
          cursor: pointer;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          border: 4px outset;
          background: #cecece;
          font-weight: bold;
          font-family: monospace;
          font-size: 2em;
          -webkit-user-select: none; /* Chrome all / Safari all */
          -moz-user-select: none; /* Firefox all */
          -ms-user-select: none; /* IE 10+ */
          user-select: none; /* Likely future */
        }
        .square:focus {
          transform: translateZ(0);
          outline: 2px solid blue;
          outline-offset: -10px;
        }
        .played {
          border: 1px solid #999;
        }
        .played:focus {
          outline-offset: -5px;
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
      <button
        class="square ${this._display(this.played, this.mine, this.neighbors)}"
        tabindex=${this.canFocus ? '0' : '-1'}
        @click=${this.play}
        @contextmenu=${this.mark}
      >
        ${this._dangerLevel(this.played, this.mine, this.neighbors, this.marked)}
      </button>
    `;
  }
}

customElements.define('minesweeper-square', MinesweeperSquare);
