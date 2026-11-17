import { css, html } from 'lit';

/** Storefront language: Arabic unless the document says otherwise. */
export const isAr = (): boolean =>
  (document.documentElement.lang || 'ar').toLowerCase().startsWith('ar');

export const isRtl = (): boolean =>
  (document.documentElement.dir || (isAr() ? 'rtl' : 'ltr')).toLowerCase() === 'rtl';

/** Pick the string for the current storefront language. */
export const tr = (ar: string, en: string): string => (isAr() ? ar : en);

/** Only allow safe link targets: #anchor, /relative, http(s), tel, mailto. */
export function safeHref(value: unknown, fallback = '#'): string {
  const v = String(value ?? '').trim();
  if (!v) return fallback;
  return /^(#|\/(?!\/)|https?:\/\/|tel:|mailto:)/i.test(v) ? v : fallback;
}

/** Only allow https or same-origin image URLs. */
export function safeImg(value: unknown): string {
  const v = String(value ?? '').trim();
  return /^(https:\/\/|\/(?!\/))/i.test(v) ? v : '';
}

/** Only allow hex colours so merchant input can never inject CSS. */
export function safeColor(value: unknown, fallback: string): string {
  const v = String(value ?? '').trim();
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v) ? v : fallback;
}

/** radio/dropdown fields arrive as [{value,label}] or a plain string. */
export function pick(v: unknown): string {
  if (Array.isArray(v)) return String((v[0] as { value?: unknown })?.value ?? '');
  if (v && typeof v === 'object') return String((v as { value?: unknown }).value ?? '');
  return String(v ?? '');
}

export function rows<T = Record<string, string>>(v: unknown): T[] {
  return Array.isArray(v) ? (v.filter(Boolean) as T[]) : [];
}

export function toTime(v: unknown): number {
  const t = Date.parse(String(v ?? ''));
  return Number.isFinite(t) ? t : 0;
}

export const pad = (n: number): string => String(n).padStart(2, '0');

/** Two-digit index in the storefront's numerals. */
export const num = (i: number): string =>
  (i + 1).toLocaleString(isAr() ? 'ar-EG' : 'en', { minimumIntegerDigits: 2, useGrouping: false });

/** Smooth-scroll to an in-page anchor; falls back to the matching wahja component. */
export function goTo(e: Event, href: string): void {
  if (!href.startsWith('#') || href.length < 2) return;
  const id = href.slice(1);
  const target =
    document.getElementById(id) ||
    document.querySelector(`salla-wahja-${id}`) ||
    document.querySelector(`salla-${id}`);
  if (!target) return;
  e.preventDefault();
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
}

export const tokens = css`
  :host {
    display: block;
    box-sizing: border-box;
    --ink: #1c1613;
    --ink-2: #2a201a;
    --paper: #faf5ee;
    --sand: #f1e8db;
    --gold: #f0b45b;
    --pad: clamp(3.5rem, 9vw, 6.5rem);
    color: var(--ink);
    font-family: inherit;
    line-height: 1.65;
    -webkit-text-size-adjust: 100%;
  }
  *, *::before, *::after { box-sizing: inherit; }
  h1, h2, h3, p, ul, ol, figure, blockquote, dl, dd { margin: 0; padding: 0; }
  a { color: inherit; }
  .wrap {
    width: 100%;
    max-width: 1180px;
    margin-inline: auto;
    padding-inline: clamp(1.1rem, 4.5vw, 2rem);
  }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    font-size: 0.88rem;
    font-weight: 700;
    color: var(--gold);
    margin-bottom: 1rem;
  }
  .eyebrow::before {
    content: '';
    width: 28px;
    height: 2px;
    background: currentColor;
  }
  .title {
    font-size: clamp(1.8rem, 5.2vw, 3.1rem);
    line-height: 1.2;
    font-weight: 800;
    text-wrap: balance;
  }
  .lead {
    margin-top: 0.9rem;
    font-size: clamp(1rem, 2.4vw, 1.15rem);
    max-width: 34rem;
    opacity: 0.78;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    min-height: 54px;
    padding: 0.85rem 1.9rem;
    border-radius: 999px;
    border: 0;
    background: var(--accent, #e4572e);
    color: #fff;
    font: inherit;
    font-weight: 700;
    font-size: 1.02rem;
    text-decoration: none;
    cursor: pointer;
    box-shadow: 0 12px 32px -10px var(--accent, #e4572e);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .btn:hover { transform: translateY(-2px); box-shadow: 0 16px 36px -10px var(--accent, #e4572e); }
  .btn:active { transform: translateY(0); }
  .btn.light { background: #fff; color: var(--ink); box-shadow: 0 12px 32px -12px rgba(0, 0, 0, 0.5); }
  .arrow { width: 20px; height: 20px; flex: none; }
  .rtl .arrow { transform: scaleX(-1); }
  a:focus-visible, summary:focus-visible, .btn:focus-visible {
    outline: 3px solid var(--gold);
    outline-offset: 3px;
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
`;

export const arrow = () => html`<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
