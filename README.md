# Vetriver — Retail Storefront

Dark root-green retail site with cart, Razorpay checkout, live stock and an admin dashboard.

**Live preview (GitHub Pages, static):** catalogue and stock show demo data since Pages
can't run the Node backend. Checkout will show a "gateway unavailable" error on this
preview — that's expected, not a bug. Real checkout only works when deployed with `server.js`
running (see below).

## Run it for real

```bash
npm install
cp .env.example .env      # fill in your Razorpay keys
npm start                 # storefront -> localhost:3000
                           # admin      -> localhost:3000/admin.html
```

See [PLAN.md](PLAN.md) for the full launch checklist (legal pages, hosting, photography).
