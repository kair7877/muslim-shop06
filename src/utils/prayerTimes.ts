/**
 * Astronomical and standard prayer times calculation for Kazakhstan cities.
 * Default city: Атырау (Atyrau), Kazakhstan.
 * Uniform Kazakhstan Timezone: UTC+5.
 */

export interface CityLocation {
  id: string;
  nameRu: string;
  nameKz: string;
  lat: number;
  lng: number;
}

export const KAZAKHSTAN_CITIES: CityLocation[] = [
  { id: 'atyrau', nameRu: 'Атырау', nameKz: 'Атырау', lat: 47.1167, lng: 51.8833 },
  { id: 'almaty', nameRu: 'Алматы', nameKz: 'Алматы', lat: 43.2389, lng: 76.8897 },
  { id: 'astana', nameRu: 'Астана', nameKz: 'Астана', lat: 51.1694, lng: 71.4491 },
  { id: 'shymkent', nameRu: 'Шымкент', nameKz: 'Шымкент', lat: 42.3417, lng: 69.5901 },
  { id: 'aktau', nameRu: 'Актау', nameKz: 'Ақтау', lat: 43.6500, lng: 51.1500 },
  { id: 'aktobe', nameRu: 'Актобе', nameKz: 'Ақтөбе', lat: 50.2839, lng: 57.1670 },
  { id: 'oral', nameRu: 'Уральск', nameKz: 'Орал', lat: 51.2333, lng: 51.3667 },
  { id: 'karaganda', nameRu: 'Караганда', nameKz: 'Қарағанды', lat: 49.8047, lng: 73.1094 },
  { id: 'kostanay', nameRu: 'Костанай', nameKz: 'Қостанай', lat: 53.2144, lng: 63.6246 },
  { id: 'pavlodar', nameRu: 'Павлодар', nameKz: 'Павлодар', lat: 52.2878, lng: 76.9674 },
  { id: 'taraz', nameRu: 'Тараз', nameKz: 'Тараз', lat: 42.9000, lng: 71.3667 },
  { id: 'kyzylorda', nameRu: 'Кызылорда', nameKz: 'Қызылорда', lat: 44.8528, lng: 65.5092 },
  { id: 'turkestan', nameRu: 'Туркестан', nameKz: 'Түркістан', lat: 43.3017, lng: 68.2728 },
  { id: 'semey', nameRu: 'Семей', nameKz: 'Семей', lat: 50.4111, lng: 80.2275 },
];

export interface PrayerTimeSlot {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  nameRu: string;
  nameKz: string;
  timeStr: string; // HH:MM
  timestamp: number; // milliseconds timestamp for today
  icon: string;
  isCurrent: boolean;
  isNext: boolean;
}

export interface DailyPrayerInfo {
  city: CityLocation;
  dateStrRu: string;
  dateStrKz: string;
  hijriStrRu: string;
  hijriStrKz: string;
  prayers: PrayerTimeSlot[];
  currentPrayer: PrayerTimeSlot | null;
  nextPrayer: PrayerTimeSlot | null;
  timeRemainingStr: string; // HH:MM:SS until next prayer
}

// Trigonometric helpers in degrees
const d2r = (deg: number) => (deg * Math.PI) / 180;
const r2d = (rad: number) => (rad * 180) / Math.PI;

/**
 * Calculates sun declination and equation of time for a given day of year.
 */
function getSunAstronomicalPosition(date: Date) {
  const startOfYear = new Date(Date.UTC(date.getFullYear(), 0, 1));
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000) + 1;
  const B = (360 / 365.24) * (dayOfYear - 81);
  const B_rad = d2r(B);

  // Equation of Time in minutes
  const EoT = 9.87 * Math.sin(2 * B_rad) - 7.53 * Math.cos(B_rad) - 1.5 * Math.sin(B_rad);

  // Sun declination in degrees
  const declination = 23.45 * Math.sin(d2r((360 / 365) * (dayOfYear - 81)));

  return { EoT, declination };
}

/**
 * Computes solar hour angle for a given altitude angle (in degrees).
 */
function getHourAngle(lat: number, declination: number, altitudeDeg: number): number {
  const latR = d2r(lat);
  const decR = d2r(declination);
  const altR = d2r(altitudeDeg);

  const cosH = (Math.sin(altR) - Math.sin(latR) * Math.sin(decR)) / (Math.cos(latR) * Math.cos(decR));

  if (cosH > 1) return 0; // Sun never rises to this altitude
  if (cosH < -1) return 180; // Sun never sets below this altitude

  return r2d(Math.acos(cosH));
}

/**
 * Converts decimal hours (e.g. 13.75) into { hours, minutes, str: "13:45" }.
 */
function formatHour(val: number): { hours: number; minutes: number; str: string } {
  let h = Math.floor(val);
  let m = Math.round((val - h) * 60);
  if (m >= 60) {
    h += 1;
    m -= 60;
  }
  h = (h + 24) % 24;
  const str = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  return { hours: h, minutes: m, str };
}

/**
 * Approximates Hijri Date based on Gregorian date.
 */
export function getEstimatedHijriDate(date: Date) {
  // Umm al-Qura standard approximation
  const jd = Math.floor((date.getTime() / 86400000) + 2440587.5);
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  const hijriMonthsRu = [
    'Мухаррам', 'Сафар', 'Раби аль-авваль', 'Раби ас-сани',
    'Джумада аль-уля', 'Джумада аль-ахира', 'Раджаб', 'Шабан',
    'Рамадан', 'Шавваль', 'Зуль-када', 'Зуль-хиджа'
  ];

  const hijriMonthsKz = [
    'Мұхаррам', 'Сапар', 'Раби әл-әууәл', 'Раби әс-сәни',
    'Жұмада әл-улә', 'Жұмада әл-ахира', 'Ережеп', 'Шағбан',
    'Рамазан', 'Шәууәл', 'Зүлқағда', 'Зүлхижжа'
  ];

  const mIdx = Math.max(0, Math.min(11, month - 1));

  return {
    day,
    month: mIdx + 1,
    year,
    strRu: `${day} ${hijriMonthsRu[mIdx]} ${year} г.х.`,
    strKz: `${day} ${hijriMonthsKz[mIdx]} ${year} ж.һ.`,
  };
}

/**
 * Calculates prayer times for a city and date.
 */
export function calculatePrayerTimes(city: CityLocation, date: Date = new Date()): DailyPrayerInfo {
  // Kazakhstan uniform timezone is UTC+5
  const tz = 5;
  const { EoT, declination } = getSunAstronomicalPosition(date);

  // Solar noon in local standard time
  // Solar Noon = 12 + (Timezone * 15 - Longitude) / 15 - (EoT / 60)
  const solarNoon = 12 + (tz * 15 - city.lng) / 15 - EoT / 60;

  // Fajr: Sun altitude -18°
  const fajrHA = getHourAngle(city.lat, declination, -18);
  const fajrTime = solarNoon - fajrHA / 15;

  // Sunrise: Sun altitude -0.833°
  const sunriseHA = getHourAngle(city.lat, declination, -0.833);
  const sunriseTime = solarNoon - sunriseHA / 15;

  // Dhuhr: Solar noon (+2 min safety buffer as standard)
  const dhuhrTime = solarNoon + (2 / 60);

  // Asr: Standard shadow ratio (shadow = object height + noon shadow)
  const latR = d2r(city.lat);
  const decR = d2r(declination);
  const noonSunAlt = 90 - Math.abs(city.lat - declination);
  const noonShadow = 1 / Math.tan(d2r(noonSunAlt));
  const asrSunAlt = r2d(Math.atan(1 / (1 + noonShadow)));
  const asrHA = getHourAngle(city.lat, declination, asrSunAlt);
  const asrTime = solarNoon + asrHA / 15;

  // Maghrib: Sunset (-0.833°)
  const maghribTime = solarNoon + sunriseHA / 15;

  // Isha: Sun altitude -15.5°
  const ishaHA = getHourAngle(city.lat, declination, -15.5);
  const ishaTime = solarNoon + ishaHA / 15;

  // Format today's timestamps
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const makeTimestamp = (hourDec: number) => {
    const { hours, minutes } = formatHour(hourDec);
    const d = new Date(year, month, day, hours, minutes, 0, 0);
    return d.getTime();
  };

  const rawPrayers: {
    id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
    nameRu: string;
    nameKz: string;
    dec: number;
    icon: string;
  }[] = [
    { id: 'fajr', nameRu: 'Фаджр (Таң)', nameKz: 'Таң намазы', dec: fajrTime, icon: '🌙' },
    { id: 'sunrise', nameRu: 'Восход (Күн)', nameKz: 'Күн шығуы', dec: sunriseTime, icon: '🌅' },
    { id: 'dhuhr', nameRu: 'Зухр (Бесін)', nameKz: 'Бесін намазы', dec: dhuhrTime, icon: '☀️' },
    { id: 'asr', nameRu: 'Аср (Екінті)', nameKz: 'Екінті намазы', dec: asrTime, icon: '🌤️' },
    { id: 'maghrib', nameRu: 'Магриб (Ақшам)', nameKz: 'Ақшам намазы', dec: maghribTime, icon: '🌇' },
    { id: 'isha', nameRu: 'Иша (Құптан)', nameKz: 'Құптан намазы', dec: ishaTime, icon: '🌌' },
  ];

  const nowMs = date.getTime();
  const prayersWithTime: PrayerTimeSlot[] = rawPrayers.map((p) => {
    const formatted = formatHour(p.dec);
    const timestamp = makeTimestamp(p.dec);
    return {
      id: p.id,
      nameRu: p.nameRu,
      nameKz: p.nameKz,
      timeStr: formatted.str,
      timestamp,
      icon: p.icon,
      isCurrent: false,
      isNext: false,
    };
  });

  // Find next and current prayer
  let nextIdx = -1;
  for (let i = 0; i < prayersWithTime.length; i++) {
    if (prayersWithTime[i].timestamp > nowMs) {
      nextIdx = i;
      break;
    }
  }

  let nextPrayer: PrayerTimeSlot | null = null;
  let currentPrayer: PrayerTimeSlot | null = null;
  let timeRemainingMs = 0;

  if (nextIdx !== -1) {
    prayersWithTime[nextIdx].isNext = true;
    nextPrayer = prayersWithTime[nextIdx];
    timeRemainingMs = nextPrayer.timestamp - nowMs;
    const currIdx = nextIdx > 0 ? nextIdx - 1 : prayersWithTime.length - 1;
    prayersWithTime[currIdx].isCurrent = true;
    currentPrayer = prayersWithTime[currIdx];
  } else {
    // All prayers for today have passed, next prayer is tomorrow's Fajr
    const tomorrowFajr = prayersWithTime[0].timestamp + 86400000;
    timeRemainingMs = tomorrowFajr - nowMs;
    prayersWithTime[prayersWithTime.length - 1].isCurrent = true;
    currentPrayer = prayersWithTime[prayersWithTime.length - 1];
    nextPrayer = {
      ...prayersWithTime[0],
      isNext: true,
      timestamp: tomorrowFajr,
    };
  }

  // Format countdown string
  const totalSec = Math.max(0, Math.floor(timeRemainingMs / 1000));
  const remH = Math.floor(totalSec / 3600);
  const remM = Math.floor((totalSec % 3600) / 60);
  const remS = totalSec % 60;
  const timeRemainingStr = `${String(remH).padStart(2, '0')}:${String(remM).padStart(2, '0')}:${String(remS).padStart(2, '0')}`;

  const hijri = getEstimatedHijriDate(date);

  const monthsRu = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const monthsKz = ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'];

  const dateStrRu = `${day} ${monthsRu[month]} ${year}`;
  const dateStrKz = `${year} жылғы ${day} ${monthsKz[month]}`;

  return {
    city,
    dateStrRu,
    dateStrKz,
    hijriStrRu: hijri.strRu,
    hijriStrKz: hijri.strKz,
    prayers: prayersWithTime,
    currentPrayer,
    nextPrayer,
    timeRemainingStr,
  };
}
