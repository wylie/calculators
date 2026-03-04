const BOT_UA_PATTERN = /bot|crawler|spider|slurp|mediapartners-google|adsbot-google|facebookexternalhit|preview|httpclient|curl|wget/i;
const ASSET_PATH_PATTERN = /\.(?:js|mjs|cjs|css|map|png|jpe?g|gif|webp|svg|ico|txt|xml|json|pdf|woff2?|ttf|eot|mp4|webm|mp3|wav)$/i;

export default {
  async fetch(request, env, ctx) {
    const response = await fetch(request);

    const measurementId = env.GA4_MEASUREMENT_ID;
    const apiSecret = env.GA4_API_SECRET;
    if (!measurementId || !apiSecret) {
      return response;
    }

    if (!shouldTrackRequest(request, env)) {
      return response;
    }

    const url = new URL(request.url);
    const eventName = env.EVENT_NAME || 'edge_request';
    const clientIdCookieName = env.CLIENT_ID_COOKIE_NAME || '_ga_edge_cid';
    const clientIdFromCookie = getCookie(request.headers.get('cookie'), clientIdCookieName);
    const clientId = clientIdFromCookie || crypto.randomUUID();

    const payload = {
      client_id: clientId,
      non_personalized_ads: true,
      events: [
        {
          name: eventName,
          params: {
            engagement_time_msec: 1,
            page_location: url.origin + url.pathname,
            page_path: url.pathname,
            page_query: url.search ? url.search.slice(1) : '(none)',
            request_method: request.method,
            response_status: response.status,
            cf_cache_status: response.headers.get('cf-cache-status') || 'unknown',
            country: request.cf?.country || 'unknown',
            colo: request.cf?.colo || 'unknown',
            is_bot: BOT_UA_PATTERN.test(request.headers.get('user-agent') || ''),
          },
        },
      ],
    };

    const endpoint = `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`;

    ctx.waitUntil(
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => undefined)
    );

    if (clientIdFromCookie) {
      return response;
    }

    const responseWithCookie = new Response(response.body, response);
    const maxAge = Number.parseInt(env.CLIENT_ID_COOKIE_MAX_AGE || '63072000', 10);
    responseWithCookie.headers.append(
      'set-cookie',
      `${clientIdCookieName}=${clientId}; Max-Age=${Number.isNaN(maxAge) ? 63072000 : maxAge}; Path=/; Secure; HttpOnly; SameSite=Lax`
    );
    return responseWithCookie;
  },
};

function shouldTrackRequest(request, env) {
  const method = request.method.toUpperCase();
  if (method !== 'GET' && method !== 'HEAD') return false;

  const url = new URL(request.url);
  const siteHostname = env.SITE_HOSTNAME;
  if (siteHostname && url.hostname !== siteHostname) return false;

  const includeAssets = (env.INCLUDE_ASSETS || 'false').toLowerCase() === 'true';
  if (!includeAssets && ASSET_PATH_PATTERN.test(url.pathname)) return false;

  if ((env.RESPECT_DNT || 'true').toLowerCase() === 'true') {
    const dnt = request.headers.get('dnt');
    if (dnt === '1') return false;
  }

  return true;
}

function getCookie(cookieHeader, name) {
  if (!cookieHeader || !name) return null;
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [rawKey, ...rest] = part.trim().split('=');
    if (rawKey === name) {
      return rest.join('=') || null;
    }
  }
  return null;
}
