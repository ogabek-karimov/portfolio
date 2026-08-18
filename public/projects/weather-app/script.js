const RELAY_URL = 'https://portfolio-weather-relay.bek8896ok.workers.dev'

const translations = {
  uz: {
    backLink: '← Portfolioga qaytish',
    searchPlaceholder: 'Shahar nomini kiriting...',
    currentLocation: 'Joriy joylashuv',
    feelsLike: 'His qilinadi',
    humidity: 'Namlik',
    windSpeed: 'Shamol',
    sunrise: 'Quyosh chiqishi',
    sunset: 'Quyosh botishi',
    pressure: 'Bosim',
    uvIndex: 'UV indeks',
    forecast5: '5 kunlik prognoz',
    hourlyForecast: 'Soatlik prognoz',
    notFound: "Shahar topilmadi, boshqa nom bilan urinib ko'ring",
    loading: 'Qidirilmoqda...',
    locating: 'Joylashuv aniqlanmoqda...',
    locationDenied: 'Joylashuvga ruxsat berilmadi',
    myLocation: 'Mening joylashuvim',
    error: "Xatolik yuz berdi, birozdan so'ng qayta urinib ko'ring",
  },
  ru: {
    backLink: '← Вернуться в портфолио',
    searchPlaceholder: 'Введите название города...',
    currentLocation: 'Текущее место',
    feelsLike: 'Ощущается как',
    humidity: 'Влажность',
    windSpeed: 'Ветер',
    sunrise: 'Восход',
    sunset: 'Закат',
    pressure: 'Давление',
    uvIndex: 'УФ-индекс',
    forecast5: 'Прогноз на 5 дней',
    hourlyForecast: 'Почасовой прогноз',
    notFound: 'Город не найден, попробуйте другое название',
    loading: 'Поиск...',
    locating: 'Определение местоположения...',
    locationDenied: 'Доступ к геолокации запрещён',
    myLocation: 'Моё местоположение',
    error: 'Произошла ошибка, попробуйте позже',
  },
}

const DAY_NAMES = {
  uz: ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'],
  ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
}

const MONTH_NAMES = {
  uz: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
  ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
}

const COUNTRY_NAMES = {
  uz: {
    UZ: "O'zbekiston", RU: 'Rossiya', KZ: 'Qozogʻiston', KG: 'Qirgʻiziston', TJ: 'Tojikiston',
    TM: 'Turkmaniston', TR: 'Turkiya', US: 'AQSH', GB: 'Buyuk Britaniya', DE: 'Germaniya',
    FR: 'Fransiya', CN: 'Xitoy', IN: 'Hindiston', JP: 'Yaponiya', KR: 'Janubiy Koreya',
    AE: "BAA", SA: 'Saudiya Arabistoni', IT: 'Italiya', ES: 'Ispaniya', UA: 'Ukraina',
  },
  ru: {
    UZ: 'Узбекистан', RU: 'Россия', KZ: 'Казахстан', KG: 'Киргизия', TJ: 'Таджикистан',
    TM: 'Туркменистан', TR: 'Турция', US: 'США', GB: 'Великобритания', DE: 'Германия',
    FR: 'Франция', CN: 'Китай', IN: 'Индия', JP: 'Япония', KR: 'Южная Корея',
    AE: 'ОАЭ', SA: 'Саудовская Аравия', IT: 'Италия', ES: 'Испания', UA: 'Украина',
  },
}

function countryName(code) {
  if (!code) return ''
  return (COUNTRY_NAMES[lang] && COUNTRY_NAMES[lang][code]) || code
}

function conditionInfo(id) {
  if (id >= 200 && id < 300) return { icon: '⛈️', uz: 'Momaqaldiroq', ru: 'Гроза' }
  if (id >= 300 && id < 400) return { icon: '🌦️', uz: "Yengil yomg'ir", ru: 'Морось' }
  if (id >= 500 && id < 505) return { icon: '🌧️', uz: "Yomg'ir", ru: 'Дождь' }
  if (id >= 505 && id < 532) return { icon: '🌧️', uz: "Kuchli yomg'ir", ru: 'Сильный дождь' }
  if (id >= 600 && id < 700) return { icon: '❄️', uz: 'Qor', ru: 'Снег' }
  if (id >= 700 && id < 800) return { icon: '🌫️', uz: 'Tuman', ru: 'Туман' }
  if (id === 800) return { icon: '☀️', uz: 'Ochiq osmon', ru: 'Ясно' }
  if (id === 801) return { icon: '🌤️', uz: 'Deyarli ochiq', ru: 'Почти ясно' }
  if (id === 802) return { icon: '⛅', uz: 'Qisman bulutli', ru: 'Переменная облачность' }
  if (id === 803 || id === 804) return { icon: '☁️', uz: 'Bulutli', ru: 'Облачно' }
  return { icon: '🌡️', uz: "Noma'lum", ru: 'Неизвестно' }
}

let lang = localStorage.getItem('weather-lang') || 'uz'
let unit = localStorage.getItem('weather-unit') || 'c'
let theme = localStorage.getItem('weather-theme') || 'light'
let lastData = null

const root = document.documentElement
const statusEl = document.getElementById('status')
const content = document.getElementById('content')
const searchForm = document.getElementById('search-form')
const cityInput = document.getElementById('city-input')
const locationBtn = document.getElementById('location-btn')
const themeToggle = document.getElementById('theme-toggle')

function applyTheme() {
  if (theme === 'dark') root.setAttribute('data-theme', 'dark')
  else root.removeAttribute('data-theme')
  localStorage.setItem('weather-theme', theme)
}

function applyLanguage() {
  const dict = translations[lang]
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = dict[el.dataset.i18n]
  })
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = dict[el.dataset.i18nPlaceholder]
  })
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang)
  })
  document.documentElement.lang = lang
  localStorage.setItem('weather-lang', lang)

  if (lastData) renderWeather(lastData)
}

function applyUnit() {
  document.querySelectorAll('.unit-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.unit === unit)
  })
  localStorage.setItem('weather-unit', unit)
  if (lastData) renderWeather(lastData)
}

function toCurrentUnit(celsius) {
  if (unit === 'f') return Math.round((celsius * 9) / 5 + 32)
  return Math.round(celsius)
}

function unitSymbol() {
  return unit === 'f' ? '°F' : '°C'
}

themeToggle.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark'
  applyTheme()
})

document.querySelectorAll('.lang-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    lang = btn.dataset.lang
    applyLanguage()
  })
})

document.querySelectorAll('.unit-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    unit = btn.dataset.unit
    applyUnit()
  })
})

function localTime(unixSeconds, tzOffsetSeconds) {
  return new Date((unixSeconds + tzOffsetSeconds) * 1000)
}

function formatClock(d) {
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mm = String(d.getUTCMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

function formatDateTime(d) {
  const dayName = DAY_NAMES[lang][d.getUTCDay()]
  const monthName = MONTH_NAMES[lang][d.getUTCMonth()]
  const clock = formatClock(d)

  if (lang === 'ru') return `${dayName}, ${d.getUTCDate()} ${monthName}, ${clock}`
  return `${dayName}, ${d.getUTCDate()}-${monthName}, ${clock}`
}

async function fetchByCity(city) {
  const res = await fetch(`${RELAY_URL}?city=${encodeURIComponent(city)}`)
  if (!res.ok) throw new Error('not-found')
  return res.json()
}

async function fetchByCoords(lat, lon) {
  const res = await fetch(`${RELAY_URL}?lat=${lat}&lon=${lon}`)
  if (!res.ok) throw new Error('failed')
  return res.json()
}

function renderWeather(data) {
  const { place, current, forecast, uvi } = data
  const tz = current.timezone
  const cond = conditionInfo(current.weather[0].id)

  document.getElementById('city-name').textContent = place.name
    ? `${place.name}${place.country ? ', ' + countryName(place.country) : ''}`
    : current.name
  document.getElementById('date-time').textContent = formatDateTime(localTime(current.dt, tz))
  document.getElementById('temp-value').textContent = `${toCurrentUnit(current.main.temp)}${unitSymbol()}`
  document.getElementById('feels-value').textContent = `${toCurrentUnit(current.main.feels_like)}${unitSymbol()}`
  document.getElementById('condition-icon').textContent = cond.icon
  document.getElementById('condition-text').textContent = cond[lang]

  document.getElementById('stat-humidity').textContent = `${current.main.humidity}%`
  document.getElementById('stat-wind').textContent = `${Math.round(current.wind.speed * 3.6)} km/h`
  document.getElementById('stat-pressure').textContent = `${current.main.pressure} hPa`
  document.getElementById('stat-uv').textContent = uvi != null ? Math.round(uvi * 10) / 10 : '--'
  document.getElementById('stat-sunrise').textContent = formatClock(localTime(current.sys.sunrise, tz))
  document.getElementById('stat-sunset').textContent = formatClock(localTime(current.sys.sunset, tz))

  const todayDateStr = localTime(current.dt, tz).toISOString().slice(0, 10)
  const byDate = new Map()
  forecast.list.forEach((entry) => {
    const d = localTime(entry.dt, tz)
    const dateStr = d.toISOString().slice(0, 10)
    if (dateStr === todayDateStr) return
    if (!byDate.has(dateStr)) byDate.set(dateStr, [])
    byDate.get(dateStr).push({ entry, d })
  })

  const dailyList = document.getElementById('daily-list')
  dailyList.innerHTML = ''
  ;[...byDate.entries()].slice(0, 5).forEach(([, entries]) => {
    const maxEntry = entries.reduce((a, b) => (b.entry.main.temp > a.entry.main.temp ? b : a))
    const dayCond = conditionInfo(maxEntry.entry.weather[0].id)
    const li = document.createElement('li')
    li.innerHTML = `
      <span class="day-icon">${dayCond.icon}</span>
      <span class="day-name">${DAY_NAMES[lang][maxEntry.d.getUTCDay()]}</span>
      <span class="day-temp">${toCurrentUnit(maxEntry.entry.main.temp)}${unitSymbol()}</span>
    `
    dailyList.appendChild(li)
  })

  const hourlyList = document.getElementById('hourly-list')
  hourlyList.innerHTML = ''
  forecast.list.slice(0, 6).forEach((entry) => {
    const d = localTime(entry.dt, tz)
    const hCond = conditionInfo(entry.weather[0].id)
    const div = document.createElement('div')
    div.className = 'hour-card'
    div.innerHTML = `
      <div class="hour-time">${formatClock(d)}</div>
      <div class="hour-icon">${hCond.icon}</div>
      <div class="hour-temp">${toCurrentUnit(entry.main.temp)}${unitSymbol()}</div>
    `
    hourlyList.appendChild(div)
  })

  content.classList.remove('hidden')
  statusEl.textContent = ''
}

async function loadByCity(city) {
  statusEl.textContent = translations[lang].loading
  statusEl.className = 'status'
  content.classList.add('hidden')

  try {
    const data = await fetchByCity(city)
    lastData = data
    renderWeather(data)
  } catch {
    statusEl.textContent = translations[lang].notFound
    statusEl.className = 'status error'
  }
}

async function loadByCoords(lat, lon) {
  try {
    const data = await fetchByCoords(lat, lon)
    lastData = data
    renderWeather(data)
  } catch {
    statusEl.textContent = translations[lang].error
    statusEl.className = 'status error'
  }
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const city = cityInput.value.trim()
  if (!city) return
  loadByCity(city)
})

locationBtn.addEventListener('click', () => {
  if (!navigator.geolocation) return

  statusEl.textContent = translations[lang].locating
  statusEl.className = 'status'
  content.classList.add('hidden')

  navigator.geolocation.getCurrentPosition(
    (pos) => loadByCoords(pos.coords.latitude, pos.coords.longitude),
    () => {
      statusEl.textContent = translations[lang].locationDenied
      statusEl.className = 'status error'
    },
  )
})

applyTheme()
applyLanguage()
applyUnit()
loadByCity('Tashkent')
