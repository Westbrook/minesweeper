import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

class MinesweeperSquare extends LitElement {
  static get properties() {
    return {
      canFocus: { type: Boolean, attribute: 'can-focus' },
      neighbors: { type: Map },
      state: { type: String },
      column: { type: Number },
      row: { type: Number },
    };
  }

  constructor() {
    super();
    this.state = 'INIT';
    this.neighbors = 0;
    this.column = 0;
    this.row = 0;
  }

  _dangerLevel() {
    switch (this.state) {
      case 'MARKED':
      case 'MARKED_MINE':
        return 'm';
      case 'TRIPPED':
        return 'x';
      case 'PLAYED':
        return this.neighbors || '';
      case 'MINE':
      case 'NOT_MINE':
      default:
        return '';
    }
  }

  play() {
    if (['MARKED', 'MARKED_MINE'].includes(this.state)) return;
    this.dispatchEvent(new CustomEvent('minesweeper-played'));
  }

  mark(e) {
    e.preventDefault();
    if (this.state === 'PLAYED') {
      this.play();
      return;
    }
    this.dispatchEvent(
      new CustomEvent('minesweeper-marked', {
        detail: {
          marked: ['MARKED', 'MARKED_MINE'].includes(this.state),
        },
      }),
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

  testDangerLevel(dangerLevel, threashold = -1) {
    return this.state === 'PLAYED' && dangerLevel > threashold;
  }

  get squareType() {
    switch (this.state) {
      case 'PLAYED':
        return 'Played';
      case 'MARKED':
      case 'MARKED_MINE':
        return 'Marked';
      default:
        return 'Playable';
    }
  }

  render() {
    const dangerLevel = this._dangerLevel();
    return html`
      <button
        class=${classMap({
          square: true,
          played: ['PLAYED', 'TRIPPED'].includes(this.state),
          low: this.testDangerLevel(dangerLevel),
          medium: this.testDangerLevel(dangerLevel, 1),
          high: this.testDangerLevel(dangerLevel, 2),
          worry: this.testDangerLevel(dangerLevel, 5),
          dead: this.state === 'TRIPPED',
        })}
        tabindex=${this.canFocus ? '0' : '-1'}
        @click=${this.play}
        @contextmenu=${this.mark}
        aria-label=${`${this.squareType} Square: Column ${this.column + 1}, Row ${this.column + 1}`}
      >
        ${dangerLevel}
      </button>
    `;
  }
}

customElements.define('minesweeper-square', MinesweeperSquare);
