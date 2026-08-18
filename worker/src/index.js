const ALLOWED_ORIGINS = [
  'https://ogabek-karimov.github.io',
  'http://localhost:5173',
]

const TELEGRAM_CHAT_ID = '890701906'

function corsHeaders(origin) {
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { ...headers, 'Content-Type': 'application/json' },
  })
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

const VOWELS = 'aeiouаеёиоуыэюя'

function isGibberish(text) {
  const trimmed = text.trim()
  if (trimmed.length < 15) return true
  if (!/\s/.test(trimmed)) return true

  const letters = trimmed.toLowerCase().replace(/[^a-zа-яёʻʼ]/g, '')
  if (letters.length === 0) return true

  const vowels = [...letters].filter((ch) => VOWELS.includes(ch))
  if (vowels.length / letters.length < 0.15) return true

  let run = 0
  let maxRun = 0
  for (const ch of letters) {
    if (VOWELS.includes(ch)) {
      run = 0
    } else {
      run += 1
      maxRun = Math.max(maxRun, run)
    }
  }
  if (maxRun >= 6) return true

  return false
}

async function sendTelegram(token, text) {
  return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
  })
}

function generateOtp() {
  const arr = new Uint32Array(1)
  crypto.getRandomValues(arr)
  return String(100000 + (arr[0] % 900000))
}

async function requireSession(request, env) {
  const auth = request.headers.get('Authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token) return false
  const phone = await env.SITE_CONTENT.get(`session:${token}`)
  return Boolean(phone)
}

async function handleContactForm(request, env, headers) {
  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400, headers)
  }

  const { name, phone, message, website } = body

  if (website) return json({ ok: true }, 200, headers)

  if (!isValidField(name, 100) || !isValidField(phone, 30) || !isValidField(message, 2000)) {
    return json({ error: "Barcha maydonlarni to'g'ri to'ldiring" }, 400, headers)
  }

  if (!isValidPhone(phone)) {
    return json(
      { error: "Telefon raqam noto'g'ri, +998XXXXXXXXX ko'rinishida kiriting" },
      400,
      headers,
    )
  }

  if (isGibberish(message)) {
    return json(
      { error: "Xabar tushunarli va kamida 15 ta belgidan iborat bo'lishi kerak" },
      400,
      headers,
    )
  }

  const text = [
    'Yangi xabar — portfolio saytidan',
    `Ism: ${name.trim()}`,
    `Telefon: ${phone.trim()}`,
    `Xabar: ${message.trim()}`,
  ].join('\n')

  const telegramRes = await sendTelegram(env.TELEGRAM_BOT_TOKEN, text)
  if (!telegramRes.ok) return json({ error: 'Xabar yuborilmadi' }, 502, headers)

  return json({ ok: true }, 200, headers)
}

async function handleRequestOtp(request, env, headers) {
  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400, headers)
  }

  const { phone } = body
  if (!isValidPhone(phone)) {
    return json({ error: "Telefon raqam noto'g'ri" }, 400, headers)
  }

  const attemptsKey = `otp-attempts:${phone}`
  const attempts = Number((await env.SITE_CONTENT.get(attemptsKey)) || '0')
  if (attempts >= 5) {
    return json({ error: "Juda ko'p urinish, birozdan so'ng qayta urinib ko'ring" }, 429, headers)
  }

  const code = generateOtp()
  await env.SITE_CONTENT.put(`otp:${phone}`, code, { expirationTtl: 300 })
  await env.SITE_CONTENT.put(attemptsKey, String(attempts + 1), { expirationTtl: 900 })

  const text = `Admin panelga kirish kodi: ${code}\n(5 daqiqa amal qiladi)`
  const telegramRes = await sendTelegram(env.TELEGRAM_BOT_TOKEN, text)
  if (!telegramRes.ok) return json({ error: 'Kod yuborilmadi' }, 502, headers)

  return json({ ok: true }, 200, headers)
}

async function handleVerifyOtp(request, env, headers) {
  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400, headers)
  }

  const { phone, code } = body
  if (!isValidPhone(phone) || !isValidField(code, 10)) {
    return json({ error: "Ma'lumotlar noto'g'ri" }, 400, headers)
  }

  const storedCode = await env.SITE_CONTENT.get(`otp:${phone}`)
  if (!storedCode || storedCode !== code.trim()) {
    return json({ error: "Kod noto'g'ri yoki muddati tugagan" }, 401, headers)
  }

  await env.SITE_CONTENT.delete(`otp:${phone}`)
  await env.SITE_CONTENT.delete(`otp-attempts:${phone}`)

  const token = crypto.randomUUID()
  await env.SITE_CONTENT.put(`session:${token}`, phone, { expirationTtl: 604800 })

  return json({ token }, 200, headers)
}

async function handleGetContent(env, headers) {
  const [experience, certificates] = await Promise.all([
    env.SITE_CONTENT.get('content:experience'),
    env.SITE_CONTENT.get('content:certificates'),
  ])

  return json(
    {
      experience: experience ? JSON.parse(experience) : null,
      certificates: certificates ? JSON.parse(certificates) : null,
    },
    200,
    headers,
  )
}

async function handlePutContent(request, env, headers) {
  const authed = await requireSession(request, env)
  if (!authed) return json({ error: 'Unauthorized' }, 401, headers)

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400, headers)
  }

  const { section, data } = body
  if (section !== 'experience' && section !== 'certificates') {
    return json({ error: "Noto'g'ri bo'lim" }, 400, headers)
  }
  if (!data || typeof data !== 'object' || !Array.isArray(data.uz) || !Array.isArray(data.ru)) {
    return json({ error: "Noto'g'ri ma'lumot formati" }, 400, headers)
  }

  await env.SITE_CONTENT.put(`content:${section}`, JSON.stringify(data))
  return json({ ok: true }, 200, headers)
}

async function handleGetResume(env) {
  const pdf = await env.SITE_CONTENT.get('resume-pdf', { type: 'arrayBuffer' })
  if (!pdf) {
    return Response.redirect('https://ogabek-karimov.github.io/portfolio/resume.pdf', 302)
  }
  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Karimov-Ogabek-resume.pdf"',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

async function handlePostResume(request, env, headers) {
  const authed = await requireSession(request, env)
  if (!authed) return json({ error: 'Unauthorized' }, 401, headers)

  const buf = await request.arrayBuffer()
  if (!buf.byteLength || buf.byteLength > 15 * 1024 * 1024) {
    return json({ error: "Noto'g'ri fayl hajmi" }, 400, headers)
  }

  await env.SITE_CONTENT.put('resume-pdf', buf)
  return json({ ok: true }, 200, headers)
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const headers = corsHeaders(origin)
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers })
    }

    if (url.pathname === '/resume.pdf' && request.method === 'GET') {
      return handleGetResume(env)
    }

    if (url.pathname === '/content' && request.method === 'GET') {
      return handleGetContent(env, headers)
    }

    if (url.pathname === '/content' && request.method === 'PUT') {
      return handlePutContent(request, env, headers)
    }

    if (url.pathname === '/admin/request-otp' && request.method === 'POST') {
      return handleRequestOtp(request, env, headers)
    }

    if (url.pathname === '/admin/verify-otp' && request.method === 'POST') {
      return handleVerifyOtp(request, env, headers)
    }

    if (url.pathname === '/admin/resume' && request.method === 'POST') {
      return handlePostResume(request, env, headers)
    }

    if ((url.pathname === '/' || url.pathname === '') && request.method === 'POST') {
      return handleContactForm(request, env, headers)
    }

    return json({ error: 'Not found' }, 404, headers)
  },
}
