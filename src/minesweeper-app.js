import { LitElement, html, css } from 'lit-element';

import './minesweeper-board.js';
import './minesweeper-menu.js';

/*!
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

/*
 * @see https://developers.google.com/web/updates/2015/08/using-requestidlecallback
 */
window.requestIdleCallback =
  window.requestIdleCallback ||
  function(cb) {
    return setTimeout(() => {
      const start = Date.now();
      cb({
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

window.cancelIdleCallback =
  window.cancelIdleCallback ||
  function(id) {
    clearTimeout(id);
  };

class MinesweeperApp extends LitElement {
  static get properties() {
    return {
      width: { type: Number },
      height: { type: Number },
      board: { type: Array },
      mines: {
        type: Number,
        hasChanged() {
          return false;
        },
      },
      difficulty: { type: Number },
      squareSize: { type: Number },
    };
  }

  constructor() {
    super();
    this.width = 0;
    this.height = 0;
    this.board = [];
    this.mines = 0;
    this.difficulty = 5;
    this.squareSize = 50;
  }

  connectedCallback() {
    super.connectedCallback();
    window.requestIdleCallback(this.measure.bind(this));
  }

  measure() {
    const width = this.offsetWidth;
    const height = this.offsetHeight;
    this.width = width;
    this.height = height;
    this.startNewGame();
  }

  startNewGame(e = { detail: { difficulty: false } }) {
    if (e.detail.difficulty) {
      this.difficulty = e.detail.difficulty;
    }
    this.createBoard();
  }

  createBoard() {
    let across = Math.floor(this.width / this.squareSize);
    let down = Math.floor(this.height / this.squareSize);
    const downCount = down;
    const board = Array(across);
    this.mines = 0;
    this.style.setProperty('--columns', across);
    this.style.setProperty('--rows', down);
    while (across) {
      across -= 1;
      board[across] = Array(down);
      down = downCount;
      while (down) {
        down -= 1;
        board[across][down] = this._setSquare();
      }
    }
    this.board = board;
  }

  _setSquare() {
    const isMine = Math.round(Math.random() * 100) <= this.difficulty * 4;
    if (isMine) this.mines += 1;
    const square = {
      mine: isMine,
      played: false,
      marked: false,
    };
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

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          height: 100vh;

          --minesweeper-square-size: 50px;
        }
        .dark-theme {
          --color-square-background: black;
          --color-square-focus: neongreen;
          --color-square-border: lightblue;
          --color-danger-low: green;
          --color-danger-medium: yellow;
          --color-danger-high: orange;
          --color-danger-worry: red;
          --color-dead: white;
        }
      `,
    ];
  }

  render() {
    return html`
      <minesweeper-menu
        difficulty="${this.difficulty}"
        @minesweeper-new-game=${this.startNewGame}
      ></minesweeper-menu>
      <minesweeper-board
        .board=${this.board}
        .mines=${this.mines}
        @minesweeper-game-over=${this._gameOver}
      ></minesweeper-board>
    `;
  }
}

customElements.define('minesweeper-app', MinesweeperApp);
