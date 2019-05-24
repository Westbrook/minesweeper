import { LitElement, html, css } from 'lit-element';

const difficultyLevels = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

class MinesweeperMenu extends LitElement {
  static get properties() {
    return {
      difficulty: { type: Number },
    };
  }

  constructor() {
    super();
    this.difficulty = 1;
  }

  _newGame() {
    this.dispatchEvent(
      new CustomEvent('minesweeper-new-game', {
        bubbles: true,
        composed: true,
        detail: {
          difficulty: this.difficulty,
        },
      }),
    );
  }

  _changeDifficulty(e) {
    this.difficulty = e.target.value;
    this._newGame();
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
      `,
    ];
  }

  render() {
    return html`
      <button @click=${this._newGame}>New Game</button>
      <label>
        Difficulty
        <select @change=${this._changeDifficulty}>
          <option disabled>Select Difficulty</option>
          ${difficultyLevels.map(
            (_, level) => html`
              <option value=${level + 1} ?selected=${this.difficulty === level + 1}
                >${level + 1}</option
              >
            `,
          )}
        </select>
      </label>
    `;
  }
}

customElements.define('minesweeper-menu', MinesweeperMenu);
