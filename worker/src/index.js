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

const UZ_PHONE_RE = /^\+998\d{9}$/

function isValidPhone(value) {
  if (typeof value !== 'string') return false
  const normalized = value.replace(/[\s()-]/g, '')
  return UZ_PHONE_RE.test(normalized)
}

function isGibberish(text) {
  const trimmed = text.trim()
  if (trimmed.length < 15) return true
  if (!/\s/.test(trimmed)) return true

  const letters = trimmed.toLowerCase().replace(/[^a-zʻʼ]/g, '')
  if (letters.length === 0) return true

  const vowels = letters.match(/[aeiou]/g) || []
  if (vowels.length / letters.length < 0.15) return true

  let run = 0
  let maxRun = 0
  for (const ch of letters) {
    if ('aeiou'.includes(ch)) {
      run = 0
    } else {
      run += 1
      maxRun = Math.max(maxRun, run)
    }
  }
  if (maxRun >= 6) return true

  return false
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

    if (!isValidPhone(phone)) {
      return new Response(
        JSON.stringify({ error: "Telefon raqam noto'g'ri, +998XXXXXXXXX ko'rinishida kiriting" }),
        { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } },
      )
    }

    if (isGibberish(message)) {
      return new Response(
        JSON.stringify({ error: "Xabar tushunarli va kamida 15 ta belgidan iborat bo'lishi kerak" }),
        { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } },
      )
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
