# Vetriver — Launch Plan

## What's built

| File | What it is |
|---|---|
| `index.html` | Storefront: hero, heritage, farmers, garland buy-box, **6-product catalogue**, FAQ |
| `admin.html` | **Admin dashboard** — stock, prices, sold counts, orders to pack |
| `server.js` | API: catalogue, live stock, order pricing, address validation, Razorpay, webhook |
| `assets/` | Your logo (cut to transparent PNG) + product imagery |
| `robots.txt` / `sitemap.xml` | Crawl + AI-answer-engine directives |
| `.env.example` | The four secrets you need to fill in |

```bash
npm install
cp .env.example .env      # fill in your Razorpay keys
npm start                 # storefront -> localhost:3000
                          # admin      -> localhost:3000/admin.html
```

**Tested: 19/19 automated checks passing** (pricing, stock, address, webhook, admin auth).

---

## The catalogue — your actual argument

Six SKUs, priced against the market (Khusplaza is your closest competitor):

| Product | Price | Grade used |
|---|---|---|
| Healing Garland | ₹899 | Finest long fibre |
| Khus Window Curtain | ₹1,490 | Medium fibre |
| Meditation Mat | ₹1,249 | Medium fibre |
| Desert Cooler Pad | ₹399 | Short fibre |
| Ruh Khus Oil 10ml | ₹649 | Distilled offcuts |
| Loose Roots 250g | ₹299 | Sorted whole root |

**Every card shows its grade.** That's deliberate — it's the one claim no reseller
can copy. You buy the whole harvest, so the ladder from garland down to oil *is*
the business model, made visible on the shelf. A dropshipper has one SKU and no story.

> **Prices are my research-based starting point, not gospel.** Check them against
> your actual cost per kilo before launch. Change any of them from the admin
> dashboard in two clicks.

---

## The admin dashboard

Open `/admin.html`, paste your `ADMIN_TOKEN`, and you get:

- **KPIs** — revenue, paid orders, units sold, how many products need restocking
- **Stock table** — edit price and stock inline, hit Save. Shows units sold per
  product and how many are *reserved* by in-flight checkouts.
- **Close / Reopen** — takes a product off the shop entirely. Verified: closing it
  in admin makes the storefront show it unavailable and refuse the purchase.
- **Orders to pack** — name, phone, email, full address with PIN, and exactly what
  to put in the box. Enter a tracking number, hit *Mark shipped*.

This is the "see how much is sold / close a product / mark out of stock" system
you asked for. No curl needed.

---

## Checkout — two steps, address before payment

Cart -> **Delivery details** -> Razorpay.

The address is collected *before* payment on purpose. Validating the PIN up front
means you never take money for an order you can't deliver — refunding an
undeliverable order costs you the gateway fee, the goodwill, and the time.

Validated on both sides (client for speed, **server for truth**):
- 10-digit Indian mobile, must start 6–9
- 6-digit PIN, cannot start with 0
- Real email, full street address, city, state

A blank form makes **zero API calls** — it fails instantly, client-side, and
reserves no stock.

---

## Security — the part most Indian storefronts get wrong

Four properties, all tested:

1. **The browser never sends a price.** Add 2 garlands + 1 oil and tamper the
   payload to `price: 1` — the server still charges ₹2,447, because it prices from
   its own database. *Most tutorial Razorpay integrations fail this exact test.*
2. **The webhook signature is verified** with a timing-safe HMAC over the raw body.
   A frontend "payment success" callback is spoofable, so it is advisory only —
   **only the webhook marks an order paid and decrements stock.**
3. **Stock is reserved at checkout**, released after 20 minutes if unpaid. Two
   people cannot buy the last garland.
4. **Invalid addresses reserve nothing.** A rejected order never touches inventory.

Plus: Helmet CSP, 60 req/min rate limit, admin behind a bearer token, secrets in
env vars only.

---

## What you must do before going live

**1. Razorpay account** (~1 day — start today, it's the long pole)
- KYC as *Vetriver Farmers India Private Limited*
- Needs: PAN, GST, CIN, cancelled cheque, bank proof
- Keys -> `.env`. Webhook -> `https://vetriver.in/api/webhook`,
  subscribe to `payment.captured` and `payment.failed`

**2. Razorpay will not activate you without four legal pages.**
This is the #1 cause of rejected activations:
- Terms & Conditions
- Privacy Policy
- **Refund & Cancellation Policy** <- they check for this specifically
- **Shipping Policy** (state the 2-day dispatch, 3–7 day delivery)

I left these out deliberately — **do not let an AI write your legal pages.**
They are a compliance document, not copy. Have someone review them.

**3. Generate a real admin token**
```bash
openssl rand -hex 32     # -> ADMIN_TOKEN in .env
```
Anyone with this token can change your prices. Treat it like a password.

**4. Hosting** (~₹500–900/mo)
Railway, Render, or a small Hetzner box. Node + SQLite needs very little.
**HTTPS is mandatory** — Razorpay won't run on http. Put Cloudflare in front (free)
for CDN and caching; that's your "fastest" requirement handled.

**5. Photography — still your highest-leverage upgrade**
The catalogue images are currently re-crops of your packaging art. They work, but
they are placeholders — the curtain, mat and pad especially need real shots. What
will actually sell this:
- The garland in a **real doorway**, in real light
- A **khus curtain wet and hanging** in a hot room
- **Hands tying** — the rural women artisans
- The **drying yard**, the 300 tonnes

You are selling provenance. Show it. A ₹15,000 day with a photographer in Dindigul
beats any amount of copy.

---

## SEO / AEO / GEO

- **Schema.org JSON-LD**: Organization, Product, **ItemList (all 6 SKUs)**, FAQPage.
  This is what makes Google show your prices and stock status directly in results.
- **The FAQ answers what people actually search** — "is vetiver the same as khus?",
  "how long does the aroma last?". AI answer engines lift text from exactly this
  structure. That is the AEO/GEO play.
- `robots.txt` explicitly **allows GPTBot, ClaudeBot, PerplexityBot**. Most sites
  block these by reflex — you want to be *cited*, because you are the authority.
- Semantic HTML, one `h1`, alt text everywhere, canonical URL, OG tags.
- Admin is `noindex, nofollow`.

**Keywords you already own:** *vetiver garland, khus mala, khus curtain, vetiver
mat, ruh khus oil, khus roots online.* Low competition, high purchase intent.

After launch: Google Business Profile (Dindigul) + Search Console, submit sitemap.

---

## Design decisions, and why

**I inverted your packaging palette.** The box is kraft-brown and gold. A brown
website reads muddy on a phone, and "warm cream + serif + terracotta" is the exact
look every AI generates right now. You said *don't feel like an AI.*

So the site is **deep vetiver-root green** — from your own logo's leaves — and your
kraft artwork sits on it as a **lit object**, the way you'd photograph a craft piece
in a dark studio. It glows instead of blending in.

**The signature element is the time-rule** in Heritage: a dated timeline from the
Sangam era to Ottanchatharam today. You claim 3,000 years, so that claim becomes the
*structure* of the page, not a line of body text. The dates are researched (Sangam
Tamil literature, the Ayurvedic canon, khus ki tatti, Nataraja garlands) — not invented.

**Typography:** Fraunces (organic, characterful — not the default Playfair) against
Inter Tight, with IBM Plex Mono for labels and data. The mono does real work: it
marks every *verifiable fact* — dates, counts, stock numbers, grades — so the eye
learns that mono = fact.

**One ambient effect only:** the radial "mist" glow behind the hero product, because
misting is literally how the product works. Everything else holds still.

---

## Honest gaps

- **No order-confirmation email.** It is a `TODO` in the webhook. Wire up Resend or
  MSG91 — customers will email asking "did it go through?" until you do.
- **No user accounts.** Guest checkout only. Correct for launch: accounts add
  friction and a data-protection burden you do not need yet.
- **Free shipping is hardcoded.** If you later charge by weight or zone, the
  `products` table has room for it.
- **SQLite** is right until roughly a few hundred orders/day. Then Postgres; the
  queries barely change.
- **Catalogue imagery is placeholder.** See point 5 above.
- **No COD.** Worth considering — a large share of Indian e-commerce still runs on
  it, though it brings return-fraud risk. Prepaid-only is a defensible launch choice.

---

## Order of operations

1. Razorpay KYC — **start today**
2. Write the 4 legal pages — blocks activation
3. Deploy + domain + HTTPS + Cloudflare
4. Test in Razorpay **test mode** end-to-end, including a real webhook fire
5. Real photography
6. Go live, submit sitemap, claim Google Business Profile
