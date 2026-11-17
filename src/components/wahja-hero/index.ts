import { LitElement, html, css, nothing } from 'lit';
import {
  tokens, tr, isRtl, pick, safeHref, safeImg, safeColor, toTime, pad, goTo, arrow,
} from '../../shared/base';

type Cfg = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  cta_text?: string;
  cta_link?: string;
  image?: string;
  overlay?: number;
  align?: unknown;
  accent?: string;
  end_date?: string;
};

export default class WahjaHero extends LitElement {
  static properties = {
    config: { type: Object },
    _left: { state: true },
  };
  declare config?: Cfg;
  declare _left: number;
  private _timer = 0;

  constructor() {
    super();
    this._left = -1;
  }

  connectedCallback() {
    super.connectedCallback();
    this._tick();
    this._timer = window.setInterval(() => this._tick(), 1000);
  }

  disconnectedCallback() {
    window.clearInterval(this._timer);
    super.disconnectedCallback();
  }

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('config')) this._tick();
  }

  private _tick() {
    const end = toTime(this.config?.end_date);
    this._left = end ? Math.max(0, end - Date.now()) : -1;
  }

  private _countdown() {
    if (this._left <= 0) return nothing;
    const s = Math.floor(this._left / 1000);
    const cells: Array<[number, string]> = [
      [Math.floor(s / 86400), tr('يوم', 'Days')],
      [Math.floor((s % 86400) / 3600), tr('ساعة', 'Hours')],
      [Math.floor((s % 3600) / 60), tr('دقيقة', 'Min')],
      [s % 60, tr('ثانية', 'Sec')],
    ];
    return html`
      <div class="cd" role="timer" aria-label=${tr('الوقت المتبقي على انتهاء العرض', 'Time left')}>
        ${cells.map(([n, l]) => html`<div class="cell"><b>${pad(n)}</b><span>${l}</span></div>`)}
      </div>
    `;
  }

  render() {
    const c = this.config ?? {};
    const accent = safeColor(c.accent, '#e4572e');
    const center = pick(c.align) === 'center';
    const img = safeImg(c.image);
    const overlay = Math.min(90, Math.max(0, Number(c.overlay ?? 45))) / 100;
    const href = safeHref(c.cta_link, '#products');
    return html`
      <section
        class="hero ${center ? 'center' : ''} ${isRtl() ? 'rtl' : ''}"
        style="--accent:${accent};--ov:${overlay}"
      >
        ${img
          ? html`<img class="bg" src=${img} alt="" fetchpriority="high" decoding="async" />`
          : html`<div class="bg fallback"></div>`}
        <div class="shade"></div>
        <div class="glow" aria-hidden="true"></div>
        <div class="wrap">
          <div class="content">
            ${c.eyebrow ? html`<span class="eyebrow">${c.eyebrow}</span>` : nothing}
            <h1>${c.title}</h1>
            ${c.subtitle ? html`<p class="sub">${c.subtitle}</p>` : nothing}
            ${c.cta_text
              ? html`<div class="actions">
                  <a class="btn" href=${href} @click=${(e: Event) => goTo(e, href)}>
                    ${c.cta_text}${arrow()}
                  </a>
                </div>`
              : nothing}
            ${this._countdown()}
          </div>
        </div>
      </section>
    `;
  }

  static styles = [
    tokens,
    css`
      .hero {
        position: relative;
        isolation: isolate;
        display: flex;
        align-items: flex-end;
        min-height: 560px;
        min-height: min(88svh, 820px);
        overflow: hidden;
        background: var(--ink);
        color: #fff;
      }
      .bg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -3;
      }
      .fallback {
        background:
          radial-gradient(110% 80% at 85% 5%, var(--accent) 0%, transparent 62%),
          linear-gradient(160deg, #2e1d14, #120d0a);
      }
      .shade {
        position: absolute;
        inset: 0;
        z-index: -2;
        background: linear-gradient(
          to top,
          rgba(18, 13, 10, calc(var(--ov) + 0.4)) 0%,
          rgba(18, 13, 10, var(--ov)) 55%,
          rgba(18, 13, 10, calc(var(--ov) * 0.35)) 100%
        );
      }
      .glow {
        position: absolute;
        z-index: -1;
        width: 70vmax;
        height: 70vmax;
        inset-inline-end: -28vmax;
        bottom: -38vmax;
        background: radial-gradient(circle, var(--accent) 0%, transparent 62%);
        opacity: 0.55;
        filter: blur(44px);
        animation: breathe 7s ease-in-out infinite;
      }
      @keyframes breathe {
        50% { opacity: 0.8; transform: scale(1.07); }
      }
      .content {
        padding-block: clamp(5rem, 16vw, 9rem) clamp(2.75rem, 8vw, 5.5rem);
        max-width: 46rem;
      }
      h1 {
        font-size: clamp(2.4rem, 9vw, 5rem);
        line-height: 1.1;
        font-weight: 800;
        text-wrap: balance;
      }
      .sub {
        margin-top: 1.15rem;
        font-size: clamp(1.02rem, 2.8vw, 1.22rem);
        max-width: 34rem;
        opacity: 0.9;
      }
      .actions { margin-top: 2rem; display: flex; flex-wrap: wrap; gap: 0.8rem; }
      .btn { width: 100%; }
      .cd {
        margin-top: 1.75rem;
        display: inline-flex;
        gap: 0.6rem;
        direction: ltr;
      }
      .cell {
        min-width: 64px;
        padding: 0.55rem 0.6rem;
        text-align: center;
        border: 1px solid rgba(255, 255, 255, 0.28);
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(6px);
      }
      .cell b { display: block; font-size: 1.45rem; line-height: 1.15; font-variant-numeric: tabular-nums; }
      .cell span { font-size: 0.72rem; opacity: 0.8; }
      .center .content { margin-inline: auto; text-align: center; }
      .center .sub { margin-inline: auto; }
      .center .actions, .center .cd { justify-content: center; }
      @media (min-width: 640px) {
        .btn { width: auto; }
      }
    `,
  ];
}
