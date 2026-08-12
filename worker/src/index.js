const ALLOWED_ORIGINS = [
  'https://ogabek-karimov.github.io',
  'http://localhost:5173',
]

const TELEGRAM_CHAT_ID = '890701906'

function corsHeaders(origin) {
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function isValidField(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const headers = corsHeaders(origin)

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers })
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    let body
    try {
      body = await request.json()
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    const { name, phone, message, website } = body

    if (website) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    if (!isValidField(name, 100) || !isValidField(phone, 30) || !isValidField(message, 2000)) {
      return new Response(JSON.stringify({ error: "Barcha maydonlarni to'g'ri to'ldiring" }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    const text = [
      "Yangi xabar — portfolio saytidan",
      `Ism: ${name.trim()}`,
      `Telefon: ${phone.trim()}`,
      `Xabar: ${message.trim()}`,
    ].join('\n')

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
      },
    )

    if (!telegramRes.ok) {
      return new Response(JSON.stringify({ error: 'Xabar yuborilmadi' }), {
        status: 502,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    })
  },
}
