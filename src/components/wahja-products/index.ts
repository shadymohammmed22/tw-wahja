import { LitElement, html, css, nothing } from 'lit';
import { tokens, tr, rows, safeColor } from '../../shared/base';

type Cfg = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  cta_text?: string;
  accent?: string;
  products?: Array<{ value?: string | number }>;
};

type Item = {
  id: number;
  name: string;
  url: string;
  price: number;
  regular_price?: number;
  is_on_sale?: boolean;
  is_out_of_stock?: boolean;
  image?: { url?: string; alt?: string | null };
};

export default class WahjaProducts extends LitElement {
  static properties = {
    config: { type: Object },
    _items: { state: true },
    _loading: { state: true },
  };
  declare config?: Cfg;
  declare _items: Item[];
  declare _loading: boolean;
  private _key = '';

  constructor() {
    super();
    this._items = [];
    this._loading = false;
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('config')) void this._load();
  }

  private async _load() {
    const ids = rows<{ value?: string | number }>(this.config?.products)
      .map((p) => p.value)
      .filter(Boolean)
      .slice(0, 8);
    const key = ids.join(',');
    if (key === this._key) return;
    this._key = key;
    if (!ids.length) {
      this._items = [];
      return;
    }
    const S = (window as any).Salla;
    if (!S?.product?.api) return;
    this._loading = true;
    try {
      await S.onReady?.();
      const res = await Promise.allSettled(ids.map((id) => S.product.api.getDetails(id)));
      if (key !== this._key) return;
      this._items = res
        .filter((r): r is PromiseFulfilledResult<{ data: Item }> => r.status === 'fulfilled' && !!r.value?.data)
        .map((r) => r.value.data);
    } finally {
      this._loading = false;
    }
  }

  private _money(n: number) {
    const S = (window as any).Salla;
    return S?.money ? S.money(n) : String(n);
  }

  private _skeletons() {
    return [0, 1, 2, 3].map(
      () => html`<div class="card sk"><div class="ph"></div><div class="l1"></div><div class="l2"></div></div>`,
    );
  }

  private _card(p: Item) {
    const sale = !!p.is_on_sale && !!p.regular_price && p.regular_price > p.price;
    const off = sale ? Math.round((1 - p.price / (p.regular_price as number)) * 100) : 0;
    const cta = this.config?.cta_text;
    return html`
      <a class="card ${p.is_out_of_stock ? 'out' : ''}" href=${p.url}>
        <figure>
          ${p.image?.url
            ? html`<img src=${p.image.url} alt=${p.image.alt || p.name} loading="lazy" decoding="async" />`
            : nothing}
          ${p.is_out_of_stock
            ? html`<span class="badge dark">${tr('نفدت الكمية', 'Sold out')}</span>`
            : off
              ? html`<span class="badge">${tr(`خصم ${off}%`, `${off}% off`)}</span>`
              : nothing}
        </figure>
        <h3>${p.name}</h3>
        <div class="price">
          <b>${this._money(p.price)}</b>
          ${sale ? html`<s>${this._money(p.regular_price as number)}</s>` : nothing}
        </div>
        ${cta && !p.is_out_of_stock ? html`<span class="go">${cta}</span>` : nothing}
      </a>
    `;
  }

  render() {
    const c = this.config ?? {};
    const cols = this._items.length === 3 ? 3 : 4;
    return html`
      <section style="--accent:${safeColor(c.accent, '#e4572e')};--cols:${cols}">
        <div class="wrap">
          <header class="head">
            ${c.eyebrow ? html`<span class="eyebrow">${c.eyebrow}</span>` : nothing}
            <h2 class="title">${c.title}</h2>
            ${c.subtitle ? html`<p class="lead">${c.subtitle}</p>` : nothing}
          </header>
          <div class="grid" aria-busy=${this._loading ? 'true' : 'false'}>
            ${this._items.length ? this._items.map((p) => this._card(p)) : this._loading ? this._skeletons() : html`<p class="empty">${tr('اختر المنتجات من إعدادات المكوّن.', 'Choose products in the component settings.')}</p>`}
          </div>
        </div>
      </section>
    `;
  }

  static styles = [
    tokens,
    css`
      section { background: #fff; padding-block: var(--pad); }
      .eyebrow { color: var(--accent); }
      .head { max-width: 38rem; margin-bottom: clamp(1.75rem, 5vw, 3rem); }
      .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.1rem 0.85rem; }
      .card { display: flex; flex-direction: column; text-decoration: none; color: inherit; }
      figure {
        position: relative;
        aspect-ratio: 3 / 4;
        overflow: hidden;
        border-radius: 18px;
        background: var(--sand);
      }
      figure img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.5s ease;
      }
      .card:hover img { transform: scale(1.05); }
      .out figure img { opacity: 0.55; }
      .badge {
        position: absolute;
        inset-block-start: 0.7rem;
        inset-inline-start: 0.7rem;
        padding: 0.28rem 0.75rem;
        border-radius: 999px;
        background: var(--accent);
        color: #fff;
        font-size: 0.8rem;
        font-weight: 700;
      }
      .badge.dark { background: var(--ink); }
      h3 {
        margin-top: 0.85rem;
        font-size: 1rem;
        font-weight: 600;
        line-height: 1.45;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .price { margin-top: 0.3rem; display: flex; align-items: baseline; flex-wrap: wrap; gap: 0.2rem 0.6rem; }
      .price b { font-size: 1.08rem; font-weight: 800; color: var(--accent); }
      .price s { font-size: 0.92rem; opacity: 0.5; }
      .go {
        margin-top: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 46px;
        border-radius: 999px;
        border: 1.5px solid var(--ink);
        font-weight: 700;
        font-size: 0.95rem;
        transition: background 0.2s ease, color 0.2s ease;
      }
      .card:hover .go { background: var(--ink); color: #fff; }
      .sk .ph, .sk .l1, .sk .l2 {
        background: linear-gradient(90deg, var(--sand), #f8f1e7, var(--sand));
        background-size: 200% 100%;
        animation: shimmer 1.4s linear infinite;
        border-radius: 14px;
      }
      .sk .ph { aspect-ratio: 3 / 4; border-radius: 18px; }
      .sk .l1 { height: 16px; margin-top: 0.85rem; }
      .sk .l2 { height: 16px; width: 50%; margin-top: 0.5rem; }
      .empty { grid-column: 1 / -1; opacity: 0.6; }
      @keyframes shimmer { to { background-position: -200% 0; } }
      @media (min-width: 900px) {
        .grid { grid-template-columns: repeat(var(--cols), 1fr); gap: 1.75rem 1.25rem; }
      }
    `,
  ];
}
