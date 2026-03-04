# Cloudflare → GA4 Edge Mirror Worker

Use this Worker when you want Cloudflare-level request visibility in GA4, including traffic that never executes browser JavaScript.

## What it does

- Proxies requests normally (no page/content changes)
- Sends one GA4 Measurement Protocol event per tracked request (`edge_request` by default)
- Sets a durable first-party cookie (`_ga_edge_cid`) for stable `client_id`
- Keeps your existing client-side GA (`gtag.js`) intact

## Prerequisites

1. Cloudflare zone for `simplecalculators.io`
2. GA4 Web stream with measurement ID `G-7Z9DM31C5W`
3. GA4 API secret for the same stream

Create API secret in GA4:

- Admin → Data streams → Web stream (`G-7Z9DM31C5W`)
- Measurement Protocol API secrets → Create

## Deploy

From this folder:

```bash
cd scripts/cloudflare-ga-worker
npm i -D wrangler
npx wrangler login
npx wrangler secret put GA4_API_SECRET
npx wrangler deploy
```

## Route it on your domain

In Cloudflare Dashboard:

1. Workers & Pages → your worker → Triggers
2. Add route: `simplecalculators.io/*`

That makes all matching requests pass through this Worker and mirror to GA4.

## Recommended GA4 reporting

Because browser GA also emits `page_view`, this worker emits `edge_request` to avoid duplicate page views.

In GA4 Explore, break down `edge_request` by:

- `page_path`
- `response_status`
- `cf_cache_status`
- `country`
- `is_bot`

## Config variables (`wrangler.toml`)

- `INCLUDE_ASSETS=false` tracks HTML-like requests only
- `RESPECT_DNT=true` skips requests with `DNT: 1`
- `EVENT_NAME=edge_request` sets the GA4 event name

## Notes

- GA4 is not ideal for raw server-log parity; this provides practical parity with Cloudflare request trends.
- Bot-heavy traffic can now be analyzed in GA4 via `is_bot=true`.
