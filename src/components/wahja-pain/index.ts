import { LitElement, html, css, nothing } from 'lit';
import { tokens, rows, num, safeColor } from '../../shared/base';

type Cfg = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  accent?: string;
  items?: Array<{ title?: string; text?: string }>;
};

export default class WahjaPain extends LitElement {
  static properties = { config: { type: Object } };
  declare config?: Cfg;

  render() {
    const c = this.config ?? {};
    const items = rows<{ title?: string; text?: string }>(c.items);
    return html`
      <section style="--accent:${safeColor(c.accent, '#e4572e')}">
        <div class="wrap">
          <header class="head">
            ${c.eyebrow ? html`<span class="eyebrow">${c.eyebrow}</span>` : nothing}
            <h2 class="title">${c.title}</h2>
            ${c.subtitle ? html`<p class="lead">${c.subtitle}</p>` : nothing}
          </header>
          <ol class="list">
            ${items.map(
              (it, i) => html`
                <li>
                  <span class="n" aria-hidden="true">${num(i)}</span>
                  <div>
                    <h3>${it.title}</h3>
                    ${it.text ? html`<p>${it.text}</p>` : nothing}
                  </div>
                </li>
              `,
            )}
          </ol>
        </div>
      </section>
    `;
  }

  static styles = [
    tokens,
    css`
      section {
        background: var(--ink);
        color: #fff;
        padding-block: var(--pad);
      }
      .head { max-width: 38rem; margin-bottom: clamp(2rem, 6vw, 3.5rem); }
      .list {
        list-style: none;
        display: grid;
        border-top: 1px solid rgba(255, 255, 255, 0.16);
      }
      li {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 1.2rem 1.5rem;
        align-items: start;
        padding-block: 1.6rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.16);
      }
      .n {
        min-width: 2.4ch;
        font-size: clamp(2.3rem, 9vw, 3.5rem);
        font-weight: 800;
        line-height: 1;
        color: transparent;
        -webkit-text-stroke: 1.5px var(--gold);
      }
      h3 { font-size: clamp(1.15rem, 3.6vw, 1.5rem); font-weight: 700; line-height: 1.35; }
      li p { margin-top: 0.45rem; color: rgba(255, 255, 255, 0.72); max-width: 32rem; }
      @media (min-width: 900px) {
        .list { grid-template-columns: repeat(3, 1fr); gap: 2.5rem; border-top: 0; }
        li {
          grid-template-columns: 1fr;
          border-bottom: 0;
          border-top: 2px solid var(--accent);
          padding-top: 1.5rem;
        }
      }
    `,
  ];
}
