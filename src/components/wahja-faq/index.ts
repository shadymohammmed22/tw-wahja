import { LitElement, html, css, nothing } from 'lit';
import { tokens, rows, safeColor } from '../../shared/base';

type Cfg = {
  eyebrow?: string;
  title?: string;
  accent?: string;
  items?: Array<{ question?: string; answer?: string }>;
};

export default class WahjaFaq extends LitElement {
  static properties = { config: { type: Object } };
  declare config?: Cfg;

  render() {
    const c = this.config ?? {};
    const items = rows<{ question?: string; answer?: string }>(c.items);
    return html`
      <section style="--accent:${safeColor(c.accent, '#e4572e')}">
        <div class="wrap narrow">
          <header class="head">
            ${c.eyebrow ? html`<span class="eyebrow">${c.eyebrow}</span>` : nothing}
            <h2 class="title">${c.title}</h2>
          </header>
          <div class="list">
            ${items.map(
              (it, i) => html`
                <details ?open=${i === 0}>
                  <summary>
                    <span>${it.question}</span>
                    <i aria-hidden="true"></i>
                  </summary>
                  <p>${it.answer}</p>
                </details>
              `,
            )}
          </div>
        </div>
      </section>
    `;
  }

  static styles = [
    tokens,
    css`
      section { background: var(--paper); padding-block: var(--pad); }
      .eyebrow { color: var(--accent); }
      .narrow { max-width: 820px; }
      .head { margin-bottom: clamp(1.5rem, 5vw, 2.5rem); }
      details { border-bottom: 1px solid rgba(28, 22, 19, 0.14); }
      details:first-child { border-top: 1px solid rgba(28, 22, 19, 0.14); }
      summary {
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        min-height: 64px;
        padding-block: 1rem;
        cursor: pointer;
        font-size: clamp(1.02rem, 2.8vw, 1.2rem);
        font-weight: 700;
      }
      summary::-webkit-details-marker { display: none; }
      summary i {
        position: relative;
        flex: none;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: 1.5px solid var(--ink);
        transition: background 0.2s ease, border-color 0.2s ease;
      }
      summary i::before, summary i::after {
        content: '';
        position: absolute;
        inset: 0;
        margin: auto;
        width: 12px;
        height: 2px;
        background: var(--ink);
        transition: transform 0.25s ease, background 0.2s ease;
      }
      summary i::after { transform: rotate(90deg); }
      details[open] summary i { background: var(--accent); border-color: var(--accent); }
      details[open] summary i::before, details[open] summary i::after { background: #fff; }
      details[open] summary i::after { transform: rotate(0deg); }
      details p { padding-bottom: 1.4rem; max-width: 40rem; opacity: 0.78; }
    `,
  ];
}
