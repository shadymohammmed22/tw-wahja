import { LitElement, html, css, nothing } from 'lit';
import { tokens, rows, num, safeColor } from '../../shared/base';

type Cfg = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  accent?: string;
  items?: Array<{ title?: string; text?: string }>;
};

export default class WahjaFeatures extends LitElement {
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
          <div class="grid">
            ${items.map(
              (it, i) => html`
                <article>
                  <span class="n" aria-hidden="true">${num(i)}</span>
                  <h3>${it.title}</h3>
                  ${it.text ? html`<p>${it.text}</p>` : nothing}
                </article>
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
      .head { max-width: 38rem; margin-bottom: clamp(2rem, 6vw, 3.5rem); }
      .grid { display: grid; gap: 1rem; }
      article {
        position: relative;
        padding: 1.6rem 1.5rem 1.7rem;
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 1px 0 rgba(28, 22, 19, 0.06), 0 18px 40px -28px rgba(28, 22, 19, 0.35);
      }
      article::before {
        content: '';
        position: absolute;
        inset-inline-start: 1.5rem;
        top: 0;
        width: 44px;
        height: 4px;
        border-radius: 0 0 4px 4px;
        background: var(--accent);
      }
      .n { display: block; margin-bottom: 0.6rem; font-size: 0.95rem; font-weight: 800; color: var(--accent); }
      h3 { font-size: clamp(1.15rem, 3.4vw, 1.4rem); font-weight: 700; line-height: 1.35; }
      p { margin-top: 0.5rem; opacity: 0.74; }
      @media (min-width: 640px) { .grid { grid-template-columns: repeat(2, 1fr); gap: 1.25rem; } }
      @media (min-width: 1000px) { .grid { grid-template-columns: repeat(4, 1fr); } }
    `,
  ];
}
