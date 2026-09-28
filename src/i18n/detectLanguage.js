export const LANGS = ['uz', 'ru', 'en']

const UZ_ZONES = ['Asia/Tashkent', 'Asia/Samarkand']

// Russian-speaking neighbours: Russia, Belarus, Kazakhstan, Kyrgyzstan, Tajikistan, Turkmenistan
const RU_ZONES = [
  'Europe/Moscow', 'Europe/Kaliningrad', 'Europe/Samara', 'Europe/Ulyanovsk', 'Europe/Saratov',
  'Europe/Volgograd', 'Europe/Astrakhan', 'Europe/Kirov', 'Asia/Yekaterinburg', 'Asia/Omsk',
  'Asia/Novosibirsk', 'Asia/Barnaul', 'Asia/Tomsk', 'Asia/Novokuznetsk', 'Asia/Krasnoyarsk',
  'Asia/Irkutsk', 'Asia/Chita', 'Asia/Yakutsk', 'Asia/Khandyga', 'Asia/Vladivostok', 'Asia/Ust-Nera',
  'Asia/Magadan', 'Asia/Sakhalin', 'Asia/Srednekolymsk', 'Asia/Kamchatka', 'Asia/Anadyr',
  'Europe/Minsk',
  'Asia/Almaty', 'Asia/Qostanay', 'Asia/Aqtobe', 'Asia/Aqtau', 'Asia/Atyrau', 'Asia/Oral', 'Asia/Qyzylorda',
  'Asia/Bishkek', 'Asia/Dushanbe', 'Asia/Ashgabat',
]

// The device's time zone tells the country well enough, instantly and without asking any server.
function timeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || ''
  } catch {
    return ''
  }
}

export function isInUzbekistan() {
  return UZ_ZONES.includes(timeZone())
}

// Uzbekistan -> Uzbek, Russian-speaking countries (or a Russian browser) -> Russian, elsewhere -> English.
export function detectLanguage() {
  const zone = timeZone()
  if (UZ_ZONES.includes(zone)) return 'uz'
  const browser = (navigator.languages?.length ? navigator.languages : [navigator.language || '']).map((l) => l.toLowerCase())
  if (browser.some((l) => l.startsWith('uz'))) return 'uz'
  if (RU_ZONES.includes(zone) || browser[0]?.startsWith('ru')) return 'ru'
  return 'en'
}
