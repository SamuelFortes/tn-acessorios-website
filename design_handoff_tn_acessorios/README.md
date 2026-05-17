# Handoff: TN Acessórios — Boutique Digital

## Overview

This is a design handoff for **TN Acessórios**, a digital boutique for a women's accessories entrepreneur based in Teresina (PI), Brazil. The shop sells **jewelry, perfumes, handbags, and curated gift kits**, with the business model being **catalog-driven**: customers browse on the site, build a cart, and **close the purchase via WhatsApp** (pre-filled message with the order).

The brand identity is **modern boutique**: minimalist, bold typography, warm color palette (cream + burgundy), editorial layouts with generous whitespace. Inspired by the existing TN Instagram aesthetic.

## About the Design Files

The files in `prototype/` are **design references created as a React + HTML prototype** — they show the intended look, layout, copy, interactions, and behavior, **not production code to ship as-is**.

The task is to **recreate these designs in a real codebase**:
- If the team already has a codebase, use its existing patterns (component library, routing, state management, design tokens).
- If starting from scratch, **Next.js (App Router) + Tailwind CSS** is recommended — see "Recommended stack" below.

The prototype uses inline JSX compiled by Babel in the browser. **Do not ship that to production.** Use it as a visual + behavioral spec.

## Fidelity

**High-fidelity.** Final colors, typography, spacing, copy, and interactions are all defined. Recreate pixel-perfectly using the target codebase's component primitives.

The only placeholder content is **product imagery** — the prototype draws SVG illustrations of each product category (earrings, perfume bottles, handbags, gift boxes). Replace these with real product photos when available.

---

## Recommended Stack (if greenfield)

| Concern | Recommendation |
|---|---|
| Framework | **Next.js 14+ (App Router)** — SSR for SEO, fast pages, easy deploy on Vercel |
| Styling | **Tailwind CSS** + CSS variables for theme tokens |
| Fonts | `next/font/google` — Instrument Serif (display) + Manrope (body) |
| State | React hooks for local; **Zustand** for cart (persisted to localStorage) |
| CMS / Catalog | **Sanity** or **Shopify Storefront API** if scaling; for MVP, hardcoded JSON works |
| Checkout | **WhatsApp deep-link** (current model) → upgrade to **Mercado Pago Checkout Pro** or **Pagar.me** when ready for real payments |
| Hosting | **Vercel** (front) + WhatsApp Business API (no backend needed for MVP) |
| Forms / Newsletter | Resend + a serverless route, or Mailchimp embed |
| Analytics | Vercel Analytics + Meta Pixel for Instagram traffic |

---

## Brand & Design Tokens

### Color palette — "Cremoso" (active theme)

> Two alternate themes (`bordo` and `areia`) are defined in the prototype (`styles.css`) as CSS variable sets. Implement them as `data-theme` swappers if you want runtime switching; otherwise ship Cremoso as the default.

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#F3ECDF` | Primary background (warm cream) |
| `--bg-2` | `#EBE1D0` | Secondary background (footer, hover) |
| `--surface` | `#FBF6EC` | Cards, product tiles |
| `--surface-2` | `#FFFFFF` | Elevated surfaces |
| `--text` | `#221512` | Primary text (deep coffee-black) |
| `--text-2` | `#5F4B40` | Secondary text |
| `--muted` | `#9C8775` | Tertiary text, prices riscados |
| `--line` | `rgba(34,21,18,.10)` | Subtle dividers |
| `--line-2` | `rgba(34,21,18,.18)` | Stronger dividers, borders |
| `--accent` | `#6B1E2C` | Primary CTA, links, brand burgundy |
| `--accent-fg` | `#FBF6EC` | Text on accent |
| `--accent-2` | `#C9876F` | Dusty rose-terracotta (gradients, secondary) |
| `--gold` | `#B8915A` | Stars, decorative |
| `--whats` | `#128C7E` | WhatsApp green |

### Typography

- **Display:** `Instrument Serif` (Google Fonts) — used in two flavors:
  - Regular for headlines
  - Italic for emphasis/accents (very characteristic of the brand)
- **Body:** `Manrope` (Google Fonts), weights 300/400/500/600/700
- **Letter-spacing:** display: `-0.01em`; eyebrows: `0.22em` uppercase

#### Type scale (used in prototype)

| Role | Family | Size | Style |
|---|---|---|---|
| H1 (hero) | Instrument Serif | `clamp(56px, 8vw, 112px)` | mix regular + italic |
| H1 (page) | Instrument Serif | `clamp(56px, 7vw, 96px)` | regular |
| H2 (section) | Instrument Serif | `clamp(36px, 4vw, 52px)` | regular |
| H3 (card title) | Instrument Serif | 19–26px italic | italic |
| Price (hero on PDP) | Instrument Serif | 42px italic, color: accent | italic |
| Body | Manrope | 15–17px / line-height 1.55–1.65 | regular |
| Eyebrow | Manrope | 11px, letter-spacing 0.22em | uppercase 500 |
| Small / meta | Manrope | 12–13px | regular |
| Button label | Manrope | 13.5–14px, letter-spacing 0.04em | 500 |

### Spacing

The prototype uses a loose 8px-derived scale. Common values: 4 / 8 / 12 / 16 / 20 / 24 / 28 / 32 / 40 / 48 / 56 / 64 / 80 / 96 / 120 px.

- **Container:** `width: min(1280px, 100% - 48px); margin-inline: auto`
- **Section vertical rhythm:** `padding: 96–120px 0`
- **Card gap (grid):** 18–28px

### Radii, borders, shadows

- **Buttons:** `border-radius: 999px` (full pill) — height 36/48/56
- **Cards & images:** square corners (radius 0 or 8px max) — editorial feel
- **Tags/badges:** square corners, uppercase tracking
- **Shadow:** `0 1px 2px rgba(34,21,18,.04), 0 14px 40px -16px rgba(34,21,18,.18)`

### Iconography

- **Stroke-based line icons**, weight 1.6, line-cap round
- Set defined in `prototype/components.jsx` under `Icon`: bag, heart, search, menu, user, arrow, close, plus/minus, star, check, whats (WhatsApp), instagram, gift, sparkle, pin (location), truck, shield
- Use **Lucide** or **Phosphor** in production (closest match to the style)

### Logo

- **Custom SVG** recreated from the Instagram profile:
  - **Mark:** circular badge with sparkle ornament + "TN" italic serif monogram + curved "ACESSÓRIOS" wordmark
  - **Wordmark:** small mark + "TN Acessórios" + tagline "Teresina · desde 2022"
- Source: `prototype/logo.jsx`
- **Action:** If the owner provides a proper logo file (SVG/PNG), replace these placeholders.

---

## Information Architecture

```
/                          → Home
/categorias/[slug]         → Category listing
  • /categorias/joias
  • /categorias/perfumes
  • /categorias/bolsas
  • /categorias/kits
/produto/[id]              → Product detail
/contato                   → About / Showroom / FAQ
```

### Global elements (every page)

- **Marquee top bar** (text: "Frete grátis em Teresina acima de R$ 199 · Embalagem presenteável inclusa · Atendimento pelo WhatsApp · Aceitamos cartão e Pix · Showroom em N.S.R")
- **Sticky header** with: nav (Joias / Perfumes / Bolsas / Kits / Contato), centered logo, search + favorites + cart icons (cart shows badge count)
- **Floating WhatsApp FAB** (bottom-right, 56×56 circle, green `#128C7E`)
- **Cart drawer** slides in from the right when bag icon clicked
- **Footer** with brand statement, 3 link columns (Loja / Atendimento / Contato), newsletter, social links

---

## Screens

### 1. Home (`/`)

**Purpose:** introduce the brand, route shoppers into a category or kits, build trust.

**Sections, top-to-bottom:**

1. **Hero** — two-column (1.05fr / 1fr).
   - Left: eyebrow "✦ Teresina · Boutique digital" → big headline `Acessórios *que contam histórias*.` (italic for the inner phrase, in burgundy) → 480px supporting paragraph → two CTAs (`Ver kits presenteáveis` primary, `Explorar joias` ghost) → 3 perk badges (gift / truck / shield).
   - Right: editorial **photo collage** of 3 overlapping product images (red handbag, perfume, pearl earrings) + a rotated circular badge "NOVA coleção OUTONO '26".
2. **Categorias** — 4-column grid of large category cards. Each card: tall (4/5 aspect) image with dark gradient overlay + category name in italic serif at the bottom-left + number "01–04" eyebrow. Hover lifts the card.
3. **Vitrine — Selecionados com carinho** — 4-column product grid of featured items (those with `tags`). Cards have hover state that slides up an "+ Adicionar" button at the bottom.
4. **Kits banner** — full-width dark block (`var(--text)` background). Two-column: headline `O presente perfeito já vem montado.` + CTA, right side has 2 kit images. Decorative giant TN watermark at 5% opacity in the corner.
5. **Joias grid** — same 4-column product grid.
6. **Sobre a marca** — two-column. Left: 4/5 aspect colored block with brand statement and logo mark (placeholder for founder photo). Right: headline `Começou em casa, *chegou em vocês*.` + paragraphs + 3 brand stats (500 clientes / 3 anos / 100% embalagem).
7. **Testimonials** — 3-column grid. Each card: 5 stars (gold), italic serif quote, client name in tracked uppercase.
8. **CTA WhatsApp** — bordered block with headline + phone number button.

### 2. Category (`/categorias/[slug]`)

- **Hero:** breadcrumb (`Início / Joias`), eyebrow "Categoria", huge headline (first word regular, rest italic in burgundy), supporting subtitle, product count on the right.
- **Toolbar:** category pills (all 4 cats as tabs — active one is filled dark), sort dropdown (Relevance / Price asc / Price desc / A-Z), grid density toggle (3 or 4 columns).
- **Grid:** product cards (same component as Home).

### 3. Product (`/produto/[id]`)

- Breadcrumb
- **Two-column** (1.2fr / 1fr):
  - **Left (gallery):** main image 4/5 aspect + 4 thumbnails below (first one highlighted with dark border)
  - **Right (info):**
    - Tags (filled accent-color rectangles, uppercase 10px)
    - H1 product name (Instrument Serif, regular)
    - Price: large italic serif in accent + crossed old price + "ou 3x de R$X sem juros · 5% off no Pix"
    - Description paragraph
    - **Variant pickers** — chips, active state has dark fill
    - Quantity stepper + "Adicionar à sacola" primary CTA (1:flex ratio)
    - Perks strip (embalagem / frete / troca) bordered top/bottom
    - "Dúvidas? Chama no whats" ghost button (opens WhatsApp)
- **Related products** — 4-column grid

### 4. About / Contact (`/contato`)

- Eyebrow + big headline `A gente *conversa*, você escolhe, a gente embala.`
- **4-step process** cards (Escolha / Chame / Pague / Receba) with italic serif numbers in accent
- **Showroom block** — dark two-column with address/whats/insta + visit CTA, right side has logo mark on gradient
- **FAQ** — 2-column `<details>` grid with serif italic questions and plus icons

### 5. Cart drawer (modal, all pages)

- Slides from right, width 460px (or 92vw on mobile)
- Header: italic serif "Sua sacola (N)" + close icon
- List of items: 88px thumbnail + name (italic serif) + variant + qty stepper + line total + remove
- Footer: subtotal / frete ("calculado no WhatsApp") / total (huge italic serif) + **green WhatsApp CTA** "Finalizar no WhatsApp"
- Empty state: italic serif message + "Explorar a loja" button

---

## Interactions & Behavior

| Interaction | Behavior |
|---|---|
| Add to cart | Item appears in cart drawer; toast slides up from bottom-center for 2.5s with checkmark + product name |
| Cart drawer | Slides in from right; backdrop fades in (`rgba(0,0,0,0.4)`); 350ms cubic-bezier `(.4,.14,.3,1)` |
| Product card hover | Card lifts 4px up; "+ Adicionar" button slides up and fades in over the image |
| Image hover | Inner placeholder scales 1.04× over 500ms |
| Nav link active state | Burgundy text + 1.5px underline |
| **Checkout (WhatsApp)** | Builds message with all items + total → opens `https://wa.me/5586988333593?text=<urlencoded message>` in a new tab |
| Floating WhatsApp button | Direct link to `https://wa.me/5586988333593` |
| Sort dropdown | Re-sorts product array client-side |
| Grid density toggle | Switches CSS grid columns 3 ↔ 4 |
| Variant selectors | Locally update selected variant; string is passed to cart on add |
| FAQ items | Native `<details>` accordion |
| Marquee | CSS infinite `@keyframes marquee` (38s linear) — duplicates content for seamless loop |
| Page transitions | 350ms fadeUp animation on route change |

---

## State Management

```ts
// Suggested Zustand store
type CartItem = { id: string; qty: number; variant?: string };

type Store = {
  cart: CartItem[];
  cartOpen: boolean;
  addToCart: (id: string, qty?: number, variant?: string) => void;
  updateQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  openCart: () => void;
  closeCart: () => void;
  checkoutWhatsApp: () => void; // builds message + opens wa.me
};
```

Persist `cart` to `localStorage` so it survives page reloads.

---

## WhatsApp Checkout — implementation detail

```ts
const WHATS = '5586988333593'; // Thaís — TN Acessórios

function checkoutWhatsApp(cart: CartItem[]) {
  const lines = cart.map(i => {
    const p = catalog.find(x => x.id === i.id)!;
    const opt = i.variant ? ` (${i.variant})` : '';
    return `• ${i.qty}x ${p.name}${opt} — ${formatBRL(p.price * i.qty)}`;
  });
  const total = cart.reduce((s, i) => s + catalog.find(x => x.id === i.id)!.price * i.qty, 0);
  const msg = [
    'Olá Thaís! Quero fechar o seguinte pedido pela loja online:',
    '',
    ...lines,
    '',
    `*Total: ${formatBRL(total)}*`,
    '',
    'Como podemos prosseguir com o pagamento e a entrega?',
  ].join('\n');
  window.open(`https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}`, '_blank');
}
```

---

## Catalog Data

The prototype hardcodes 16 products across 4 categories (`prototype/data.jsx`). When implementing for real:

- **Short term:** keep products in a JSON file or simple CMS (Sanity, Contentful, even a Google Sheet via API). Owner edits prices/descriptions without touching code.
- **Medium term:** move to **Shopify** (Storefront API → headless Next.js) or **Mercado Shops**. Brazilian merchants get easier payment integration there.

### Product schema

```ts
type Product = {
  id: string;
  cat: 'joias' | 'perfumes' | 'bolsas' | 'kits';
  name: string;
  price: number;       // BRL
  oldPrice?: number;
  desc: string;
  tags?: string[];     // e.g., 'Mais vendido', 'Novidade', 'O Boticário'
  options?: Record<string, string[]>; // e.g., { Cor: ['Carmim', 'Preto'] }
  images: string[];    // product photos (URLs); first is hero
};
```

---

## Assets to Provide (owner's TODO)

The owner should supply, to replace placeholders:

1. **Real logo files** — SVG preferred, with horizontal and stacked variants
2. **Product photography** — at minimum one square hero per product + 3 additional angles. Lifestyle shots also welcome for category headers and the hero collage.
3. **Founder photo** — for the "Sobre a marca" block on Home and the showroom block on Contact
4. **Showroom photo** — for the contact page right column
5. **Final copy** — current copy is suggested editorial; owner should review brand voice
6. **Real address** — currently shows "Teresina · N.S.R" generically
7. **Real CNPJ + legal info** for the footer

---

## Responsive Behavior

The prototype targets desktop (≥1024px). For production:

- **Mobile (< 760px):** hide secondary nav links (`.hide-mobile`), collapse category grid to 2 columns, product grid to 2 columns, stack hero columns, full-width drawer for cart
- **Tablet (760–1024px):** hero stacks, grids stay at 3 cols for products and 2 cols for categories

All `clamp()` headline sizes already scale fluidly.

---

## Accessibility Notes

- All buttons have visible focus rings (`2px solid var(--accent)` outline offset 3px)
- Icons in icon-only buttons have `aria-label`
- Cart drawer should trap focus when open (the prototype doesn't — add with `react-focus-lock` or similar)
- Carousel/marquee should pause on hover/focus (prototype doesn't — add for accessibility)
- Color contrast: all token combos meet AA (text on bg, accent-fg on accent, bg on text)
- Form fields need proper labels (newsletter input only has placeholder — add visually-hidden `<label>`)

---

## Performance Notes

- Use `next/image` for all product photos with proper `sizes` attribute
- Marquee uses `transform` (GPU-accelerated) — keep it that way
- Cart drawer slides via `transform: translateX` — don't change to `right:` animation
- Lazy-load product detail images below the fold

---

## Files in this bundle

| File | Purpose |
|---|---|
| `prototype/index.html` | Entry point — loads fonts, React, Babel, and all JSX files |
| `prototype/styles.css` | Global styles + theme tokens (3 themes) + button/card primitives + animations |
| `prototype/app.jsx` | Root `<App>`: routing, cart state, theme switcher (tweaks panel) |
| `prototype/pages.jsx` | `HomePage`, `CategoryPage`, `ProductPage`, `AboutPage` |
| `prototype/components.jsx` | `Header`, `Footer`, `ProductCard`, `CartDrawer`, `Toast`, `Icon` |
| `prototype/data.jsx` | Mock catalog: 16 products + categories + testimonials |
| `prototype/placeholders.jsx` | SVG illustrations for each product type (replace with real photos) |
| `prototype/logo.jsx` | `LogoMark` (circular) + `LogoWordmark` (horizontal) — both inline SVG |
| `prototype/tweaks-panel.jsx` | Design-system playground (theme/font switcher) — **do not ship to production**, it's a tooling helper |

---

## How to view the prototype locally

The prototype runs entirely in the browser — no build step needed:

```bash
cd prototype
npx serve .         # or python3 -m http.server 8000
# open http://localhost:3000 (or :8000)
```

(Open `index.html` directly via `file://` will fail because of CORS on the JSX imports — needs a static server.)

---

## Owner contact (for the developer)

- **Phone (WhatsApp):** +55 86 9 8833-3593
- **Instagram:** @tnacessorios2
- **Location:** Teresina, PI (Brazil) — Showroom in Nossa Senhora dos Remédios neighborhood

Boa sorte! 🌸
