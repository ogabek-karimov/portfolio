const ALLOWED_ORIGINS = [
  'https://ogabek-karimov.github.io',
  'http://localhost:5173',
]

function corsHeaders(origin) {
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

async function geocode(city, apiKey) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
  const res = await fetch(url)
  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) return null
  return { lat: data[0].lat, lon: data[0].lon, name: data[0].name, country: data[0].country }
}

async function reverseGeocode(lat, lon, apiKey) {
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
  const res = await fetch(url)
  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) return { name: '', country: '' }
  return { name: data[0].name, country: data[0].country }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const headers = corsHeaders(origin)

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers })
    }

    const url = new URL(request.url)
    const city = url.searchParams.get('city')
    let lat = url.searchParams.get('lat')
    let lon = url.searchParams.get('lon')
    const apiKey = env.OPENWEATHER_API_KEY

    let placeName = ''
    let placeCountry = ''

    try {
      if (city) {
        const place = await geocode(city, apiKey)
        if (!place) {
          return new Response(JSON.stringify({ error: 'not-found' }), {
            status: 404,
            headers: { ...headers, 'Content-Type': 'application/json' },
          })
        }
        lat = place.lat
        lon = place.lon
        placeName = place.name
        placeCountry = place.country
      } else if (lat && lon) {
        const place = await reverseGeocode(lat, lon, apiKey)
        placeName = place.name
        placeCountry = place.country
      } else {
        return new Response(JSON.stringify({ error: 'missing-params' }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
        })
      }

      const [currentRes, forecastRes, uviRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`),
      ])

      const [current, forecast, uvi] = await Promise.all([
        currentRes.json(),
        forecastRes.json(),
        uviRes.json().catch(() => ({ value: null })),
      ])

      return new Response(
        JSON.stringify({
          place: { name: placeName, country: placeCountry, lat, lon },
          current,
          forecast,
          uvi: uvi.value,
        }),
        { headers: { ...headers, 'Content-Type': 'application/json' } },
      )
    } catch (err) {
      return new Response(JSON.stringify({ error: 'server-error' }), {
        status: 502,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }
  },
}
