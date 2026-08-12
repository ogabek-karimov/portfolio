const form = document.getElementById('search-form')
const input = document.getElementById('city-input')
const statusEl = document.getElementById('status')
const card = document.getElementById('weather-card')

const WEATHER_DESCRIPTIONS = {
  0: "Ochiq osmon",
  1: "Deyarli ochiq",
  2: "Qisman bulutli",
  3: "Bulutli",
  45: "Tuman",
  48: "Muzli tuman",
  51: "Yengil yomg'ir",
  53: "O'rtacha yomg'ir",
  55: "Kuchli yomg'ir",
  61: "Yengil jala",
  63: "O'rtacha jala",
  65: "Kuchli jala",
  71: "Yengil qor",
  73: "O'rtacha qor",
  75: "Kuchli qor",
  80: "Yomg'ir kuchayishi",
  95: "Momaqaldiroq",
}

function describeWeather(code) {
  return WEATHER_DESCRIPTIONS[code] || "Noma'lum ob-havo"
}

async function searchCity(name) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=ru`
  const res = await fetch(url)
  const data = await res.json()
  if (!data.results || data.results.length === 0) {
    throw new Error('Shahar topilmadi')
  }
  return data.results[0]
}

async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
  const res = await fetch(url)
  const data = await res.json()
  return data.current
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const city = input.value.trim()
  if (!city) return

  statusEl.textContent = 'Qidirilmoqda...'
  statusEl.className = 'status'
  card.classList.add('hidden')

  try {
    const place = await searchCity(city)
    const weather = await fetchWeather(place.latitude, place.longitude)

    document.getElementById('location').textContent = `${place.name}, ${place.country || ''}`
    document.getElementById('temp').textContent = `${Math.round(weather.temperature_2m)}°C`
    document.getElementById('description').textContent = describeWeather(weather.weather_code)
    document.getElementById('wind').textContent = `${weather.wind_speed_10m} km/soat`
    document.getElementById('humidity').textContent = `${weather.relative_humidity_2m}%`

    statusEl.textContent = ''
    card.classList.remove('hidden')
  } catch (err) {
    statusEl.textContent = 'Shahar topilmadi, boshqa nom bilan urinib ko\'ring'
    statusEl.className = 'status error'
  }
})
