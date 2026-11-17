import { LitElement, html, css, nothing } from 'lit';
import { tokens, rows, safeColor } from '../../shared/base';

type Cfg = {
  eyebrow?: string;
  title?: string;
  accent?: string;
  items?: Array<{ quote?: string; name?: string; meta?: string }>;
};

export default class WahjaTestimonials extends LitElement {
  static properties = { config: { type: Object } };
  declare config?: Cfg;

  render() {
    const c = this.config ?? {};
    const items = rows<{ quote?: string; name?: string; meta?: string }>(c.items);
    return html`
      <section style="--accent:${safeColor(c.accent, '#e4572e')}">
        <div class="wrap">
          <header class="head">
            ${c.eyebrow ? html`<span class="eyebrow">${c.eyebrow}</span>` : nothing}
            <h2 class="title">${c.title}</h2>
          </header>
        </div>
        <div class="rail" tabindex="0">
          ${items.map(
            (it) => html`
              <figure>
                <blockquote>${it.quote}</blockquote>
                <figcaption>
                  <b>${it.name}</b>
                  ${it.meta ? html`<span>${it.meta}</span>` : nothing}
                </figcaption>
              </figure>
            `,
          )}
        </div>
      </section>
    `;
  }

  static styles = [
    tokens,
    css`
      section { background: var(--sand); padding-block: var(--pad); }
      .eyebrow { color: var(--accent); }
      .head { margin-bottom: clamp(1.75rem, 5vw, 3rem); }
      .rail {
        display: flex;
        gap: 1rem;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        padding-inline: clamp(1.1rem, 4.5vw, 2rem);
        padding-block: 0.25rem 1rem;
        scrollbar-width: none;
      }
      .rail::-webkit-scrollbar { display: none; }
      figure {
        flex: 0 0 min(84%, 22rem);
        scroll-snap-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1.5rem;
        padding: 1.75rem 1.6rem;
        margin: 0;
        background: #fff;
        border-radius: 22px;
        box-shadow: 0 18px 40px -30px rgba(28, 22, 19, 0.45);
      }
      blockquote {
        margin: 0;
        font-size: 1.08rem;
        line-height: 1.75;
        font-weight: 500;
      }
      blockquote::before {
        content: '\\201C';
        display: block;
        height: 2.4rem;
        font-size: 4rem;
        line-height: 1;
        font-weight: 800;
        color: var(--accent);
      }
      figcaption { display: flex; flex-direction: column; gap: 0.1rem; }
      figcaption b { font-weight: 800; }
      figcaption span { font-size: 0.9rem; opacity: 0.6; }
      @media (min-width: 900px) {
        .rail {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          max-width: 1180px;
          margin-inline: auto;
          overflow: visible;
          padding-block: 0;
        }
        figure { flex: none; }
      }
    `,
  ];
}
