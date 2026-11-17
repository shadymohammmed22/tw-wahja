import { LitElement, html, css, nothing } from 'lit';
import { tokens, isRtl, rows, safeHref, safeColor, goTo, arrow } from '../../shared/base';

type Cfg = {
  title?: string;
  text?: string;
  cta_text?: string;
  cta_link?: string;
  accent?: string;
  points?: Array<{ text?: string }>;
};

export default class WahjaCta extends LitElement {
  static properties = { config: { type: Object } };
  declare config?: Cfg;

  render() {
    const c = this.config ?? {};
    const href = safeHref(c.cta_link, '#products');
    const points = rows<{ text?: string }>(c.points).filter((p) => p.text);
    return html`
      <section class=${isRtl() ? 'rtl' : ''} style="--accent:${safeColor(c.accent, '#e4572e')}">
        <div class="glow" aria-hidden="true"></div>
        <div class="wrap">
          <h2 class="title">${c.title}</h2>
          ${c.text ? html`<p class="lead">${c.text}</p>` : nothing}
          ${c.cta_text
            ? html`<div class="actions">
                <a class="btn light" href=${href} @click=${(e: Event) => goTo(e, href)}>
                  ${c.cta_text}${arrow()}
                </a>
              </div>`
            : nothing}
          ${points.length
            ? html`<ul class="points">
                ${points.map((p) => html`<li>${p.text}</li>`)}
              </ul>`
            : nothing}
        </div>
      </section>
    `;
  }

  static styles = [
    tokens,
    css`
      section {
        position: relative;
        isolation: isolate;
        overflow: hidden;
        text-align: center;
        padding-block: var(--pad);
        color: #fff;
        background: linear-gradient(135deg, var(--accent), #14100d 135%);
      }
      .glow {
        position: absolute;
        z-index: -1;
        width: 60vmax;
        height: 60vmax;
        inset-inline-start: 50%;
        top: -30vmax;
        translate: -50% 0;
        background: radial-gradient(circle, rgba(240, 180, 91, 0.55), transparent 62%);
        filter: blur(30px);
      }
      .title { max-width: 22ch; margin-inline: auto; }
      .lead { margin-inline: auto; opacity: 0.92; }
      .actions { margin-top: 2rem; }
      .btn { width: 100%; }
      .points {
        list-style: none;
        margin-top: 1.75rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.6rem 1.5rem;
        font-size: 0.95rem;
        font-weight: 600;
      }
      .points li::before { content: '✓'; margin-inline-end: 0.45rem; color: var(--gold); }
      @media (min-width: 640px) { .btn { width: auto; } }
    `,
  ];
}
