import { html, fixture, expect } from '@open-wc/testing';

import '../src/minesweeper-app.js';

describe('<minesweeper-app>', () => {
  it('has a default property heading', async () => {
    const el = await fixture('<minesweeper-app></minesweeper-app>');

    expect(el.heading).to.equal('Hello world!');
  });

  it('allows property heading to be overwritten', async () => {
    const el = await fixture(html`
      <minesweeper-app heading="different heading"></minesweeper-app>
    `);

    expect(el.heading).to.equal('different heading');
  });
});
