import { storiesOf, html, withKnobs, withClassPropertiesKnobs } from '@open-wc/demoing-storybook';

import MinesweeperApp from '../src/MinesweeperApp.js';
import '../src/minesweeper-app.js';

import readme from '../README.md';

storiesOf('minesweeper-app', module)
  .addDecorator(withKnobs)
  .add('Documentation', () => withClassPropertiesKnobs(MinesweeperApp), { notes: { markdown: readme } })
  .add(
    'Alternative Header',
    () => html`
      <minesweeper-app .header=${'Something else'}></minesweeper-app>
    `,
  );
