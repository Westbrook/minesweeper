import { LitElement, html } from 'lit-element';

class MinesweeperMenu extends LitElement {
	static get properties() {
		return {
      difficulty: { type: Number }
		};
	}

  constructor() {
    super();
    this.difficulty = 1;
  }

  _newGame() {
    this.dispatchEvent(new CustomEvent('minesweeper-new-game', {bubbles: true, composed: true}));
  }

  _changeDifficulty() {
    this.difficulty = Math.round(Math.random() * 9) + 1;
    this._newGame();
  }

	render() {
		return html`
      <style>
        :host {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
      </style>
      <button @click=${this._newGame}>New Game</button>
      <button @click=${this._changeDifficulty}>Change Difficulty: ${this.difficulty}</button>
		`;
	}
}

customElements.define('minesweeper-menu', MinesweeperMenu);
