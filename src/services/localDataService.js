/**
 * Loads property list from public/data/all_data.json and descriptions from public/data/descriptions.json.
 * Normalizes to the app's property shape for Properties list, filters, detail page, and map.
 */

const ALL_DATA_URL = '/data/all_data.json';
const DESCRIPTIONS_URL = '/data/descriptions.json';

let cachedAllData = null;
let cachedDescriptions = null;
let cachedProperties = null;

const NON_DEVELOPER_SLUG_WORDS = new Set([
  'the', 'new', 'one', 'residence', 'residences', 'tower', 'towers',
  'view', 'views', 'park', 'gardens', 'garden', 'living', 'district',
  'phase', 'project', 'villas', 'villa', 'apartments', 'apartment',
]);

const BUILDER_TRANSLATION_MAP = {
  'عزيزي': 'Azizi',
  'إعمار': 'Emaar',
  'داماك': 'Damac',
  'نخيل': 'Nakheel',
  'شوبا': 'Sobha',
};

function containsUrduOrArabic(text) {
  return /[\u0600-\u06FF]/.test(String(text || ''));
}

function titleCaseFromWords(text) {
  return String(text || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function humanizeSlug(slug) {
  if (!slug) return '';
  const cleaned = String(slug)
    .trim()
    .toLowerCase()
    // remove numeric prefixes such as 697102a325136-
    .replace(/^[0-9a-f]+-/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return titleCaseFromWords(cleaned);
}

function extractDeveloperFromSlug(slug) {
  if (!slug) return '';
  const cleaned = String(slug)
    .toLowerCase()
    .replace(/^[0-9a-f]+-/, '')
    .trim();

  // pattern: something-by-developer
  if (cleaned.includes('-by-')) {
    const parts = cleaned.split('-by-');
    if (parts[1]) {
      return titleCaseFromWords(parts[1].replace(/-/g, ' ').split(' ').slice(0, 2).join(' '));
    }
  }

  const words = cleaned.split('-').filter(Boolean);
  const candidate = words.find((w) => !NON_DEVELOPER_SLUG_WORDS.has(w));
  return candidate ? titleCaseFromWords(candidate) : '';
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function normalizeDeveloperName(item) {
  const rawBuilder = String(item?.builder || '').trim();
  if (!rawBuilder) {
    return extractDeveloperFromSlug(item?.slug) || 'Verified Developer';
  }

  if (!containsUrduOrArabic(rawBuilder)) {
    return titleCaseFromWords(rawBuilder);
  }

  if (BUILDER_TRANSLATION_MAP[rawBuilder]) {
    return BUILDER_TRANSLATION_MAP[rawBuilder];
  }

  return extractDeveloperFromSlug(item?.slug) || 'Verified Developer';
}

function inferBedroomsFromUnits(units) {
  if (!units || typeof units !== 'object') return 2;
  const areas = Object.values(units).flatMap((u) => (u && (u.area_from != null || u.area_to != null))
    ? [u.area_from, u.area_to].filter((n) => n != null)
    : []);
  if (areas.length === 0) return 2;
  const minArea = Math.min(...areas);
  if (minArea <= 45) return 0;
  if (minArea <= 70) return 1;
  if (minArea <= 100) return 2;
  if (minArea <= 150) return 3;
  if (minArea <= 200) return 4;
  return 5;
}

function hasToken(text, token) {
  return String(text || '').toLowerCase().includes(token);
}

function classifyPropertyType(item) {
  const slug = String(item?.slug || '').toLowerCase();
  const title = String(item?.title || '').toLowerCase();
  const source = `${slug} ${title}`;
  const units = item?.statistics?.units || {};
  const unitKeys = Object.keys(units);

  // Explicit tokens first
  if (hasToken(source, 'penthouse') || hasToken(source, 'penthouses')) return 'Penthouse';
  if (hasToken(source, 'townhouse') || hasToken(source, 'townhouses')) return 'Townhouse';
  if (hasToken(source, 'villa') || hasToken(source, 'villas')) return 'Villa';
  if (hasToken(source, 'studio')) return 'Studio';
  if (hasToken(source, 'apartment') || hasToken(source, 'apartments') || hasToken(source, 'residence') || hasToken(source, 'tower')) return 'Apartment';

  // Unit code heuristic (110 is commonly studio in this feed)
  if (unitKeys.includes('110') && unitKeys.length <= 2) return 'Studio';

  // Compound generally indicates villa/townhouse-style low-rise inventory
  if (String(item?.type || '').toLowerCase() === 'compound') return 'Townhouse';

  // Safe default for undefined feed types
  return 'Apartment';
}

function normalizeItem(item) {
  const total = item.statistics?.total || {};
  const units = item.statistics?.units;
  const priceFrom = total.price_from != null ? total.price_from : 0;
  const areaFrom = total.units_area_mt != null ? Math.round(parseFloat(total.units_area_mt) * 10.764) : 0;

  let status = 'Off-Plan';
  const pct = parseFloat(item.construction_percent);
  if (!Number.isNaN(pct) && pct >= 100) status = 'Ready';
  else if (pct > 0) status = 'Under Construction';

  const districtTitle = item.district?.title || '';
  const locationArea = districtTitle && !containsUrduOrArabic(districtTitle) ? districtTitle : 'Dubai';
  const coverSrc = item.cover?.src;
  const photoList = Array.isArray(item.photos) ? item.photos.map((p) => p.src || p.logo).filter(Boolean) : [];
  const images = coverSrc ? [coverSrc, ...photoList.filter((s) => s !== coverSrc)] : photoList;
  const image = images[0] || 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80';

  const bedrooms = inferBedroomsFromUnits(units);
  const type = classifyPropertyType(item);
  const fallbackDescription = `${titleCaseFromWords(item.builder || 'Developer')} project in ${districtTitle || 'Dubai'} with ${bedrooms === 0 ? 'studio and apartment' : `${bedrooms}+ bedroom`} options. Contact us for full brochure and payment plan details.`;

  const titleNative = item.title || 'Untitled Project';
  const titleFromSlug = humanizeSlug(item.slug);
  const title =
    containsUrduOrArabic(titleNative) && titleFromSlug
      ? titleFromSlug
      : titleNative;

  return {
    id: item.id,
    slug: item.slug || `id-${item.id}`,
    title,
    titleNative,
    type,
    status: [status],
    location: { area: locationArea },
    price: priceFrom,
    developer: normalizeDeveloperName(item),
    developerLogo: item.logo?.logo || item.logo?.src || null,
    bedrooms,
    bathrooms: 2,
    squareFeet: areaFrom,
    image,
    images,
    latitude: item.latitude,
    longitude: item.longitude,
    description: fallbackDescription, // replaced by descriptions.json when available
  };
}

export async function fetchAllData() {
  if (cachedAllData) return cachedAllData;
  const res = await fetch(ALL_DATA_URL);
  if (!res.ok) throw new Error(`Failed to load ${ALL_DATA_URL}`);
  const json = await res.json();
  cachedAllData = json;
  return json;
}

export async function fetchDescriptions() {
  if (cachedDescriptions) return cachedDescriptions;
  const res = await fetch(DESCRIPTIONS_URL);
  if (!res.ok) throw new Error(`Failed to load ${DESCRIPTIONS_URL}`);
  const json = await res.json();
  cachedDescriptions = json;
  return json;
}

/**
 * Returns normalized properties array from all_data.json (data.items).
 */
export async function fetchLocalProperties() {
  if (cachedProperties) return cachedProperties;
  const { data } = await fetchAllData();
  const items = data?.items;
  if (!Array.isArray(items)) {
    cachedProperties = [];
    return cachedProperties;
  }
  cachedProperties = items.map(normalizeItem);
  return cachedProperties;
}

/**
 * Get rich description HTML for a slug from descriptions.json.
 */
export async function getDescriptionForSlug(slug) {
  const desc = await fetchDescriptions();
  return desc[slug] != null ? desc[slug] : null;
}

export async function getDescriptionForProperty(propertyLike) {
  const desc = await fetchDescriptions();
  const slug = propertyLike?.slug || '';
  const title = propertyLike?.title || '';
  const titleNative = propertyLike?.titleNative || '';
  const id = propertyLike?.id;

  const candidates = [];
  if (slug) {
    candidates.push(slug);
    candidates.push(String(slug).replace(/^[0-9a-f]+-/, ''));
  }
  if (title) candidates.push(slugify(title));
  if (titleNative) candidates.push(slugify(titleNative));
  if (id != null) candidates.push(`id-${id}`);

  for (const key of candidates) {
    if (key && desc[key] != null && String(desc[key]).trim() !== '') {
      return desc[key];
    }
  }
  return null;
}

export function getDescriptionForSlugSync(slug) {
  return cachedDescriptions != null && slug ? (cachedDescriptions[slug] ?? null) : null;
}

/**
 * Ensure descriptions are loaded (e.g. on app init or before detail page).
 */
export async function ensureDescriptionsLoaded() {
  if (!cachedDescriptions) await fetchDescriptions();
}

/**
 * Get a single property by id from local data.
 */
export async function getLocalPropertyById(id) {
  const list = await fetchLocalProperties();
  const numId = parseInt(id, 10);
  return list.find((p) => p.id === numId) || list.find((p) => String(p.id) === String(id)) || null;
}

/**
 * Get properties that have valid lat/lng for map display.
 */
export async function fetchLocalPropertiesWithCoords() {
  const list = await fetchLocalProperties();
  return list.filter((p) => p.latitude != null && p.longitude != null);
}
