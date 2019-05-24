import { LitElement, html, css } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';

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

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          line-height: var(--minesweeper-square-size, 25px);
          text-align: center;
        }
        .square {
          cursor: pointer;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          border: 4px outset;
          background: var(--color-square-background, #cecece);
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
          outline: 2px solid var(--color-square-focus, blue);
          outline-offset: -10px;
        }
        .played {
          border: 1px solid var(--color-square-border, #999);
        }
        .played:focus {
          outline-offset: -5px;
        }
        .low {
          color: var(--color-danger-low, blue);
        }
        .medium {
          color: var(--color-danger-medium, green);
        }
        .high {
          color: var(--color-danger-high, red);
        }
        .worry {
          color: var(--color-danger-worry, darkred);
        }
        .dead {
          background: var(--color-dead, red);
        }
      `,
    ];
  }

  render() {
    const dangerLevel = this._dangerLevel();
    return html`
      <button
        class=${classMap({
          square: true,
          played: this.played,
          low: !this.mine && this.played,
          medium: !this.mine && this.played && dangerLevel > 1,
          high: !this.mine && this.played && dangerLevel > 2,
          worry: !this.mine && this.played && dangerLevel > 5,
          dead: this.played && this.mine,
        })}
        tabindex=${this.canFocus ? '0' : '-1'}
        @click=${this.play}
        @contextmenu=${this.mark}
        aria-label=${`${this.played ? 'Played' : 'Playable'} Square: Column ${this.column +
          1}, Row ${this.column + 1}`}
      >
        ${dangerLevel}
      </button>
    `;
  }
}

customElements.define('minesweeper-square', MinesweeperSquare);
