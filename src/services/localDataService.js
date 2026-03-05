/**
 * Loads property list from public/data/all_data.json and descriptions from public/data/descriptions.json.
 * Normalizes to the app's property shape for Properties list, filters, detail page, and map.
 */

const ALL_DATA_URL = '/data/all_data.json';
const DESCRIPTIONS_URL = '/data/descriptions.json';

let cachedAllData = null;
let cachedDescriptions = null;
let cachedProperties = null;

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
  const coverSrc = item.cover?.src;
  const photoList = Array.isArray(item.photos) ? item.photos.map((p) => p.src || p.logo).filter(Boolean) : [];
  const images = coverSrc ? [coverSrc, ...photoList.filter((s) => s !== coverSrc)] : photoList;
  const image = images[0] || 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80';

  const bedrooms = inferBedroomsFromUnits(units);
  const type = item.type === 'project' ? 'Project' : (item.type || 'Apartment');

  return {
    id: item.id,
    slug: item.slug || `id-${item.id}`,
    title: item.title || 'Untitled Project',
    type,
    status: [status],
    location: { area: districtTitle || 'Dubai' },
    price: priceFrom,
    developer: item.builder || 'Private Seller',
    bedrooms,
    bathrooms: 2,
    squareFeet: areaFrom,
    image,
    images,
    latitude: item.latitude,
    longitude: item.longitude,
    description: null, // filled from descriptions.json by slug when needed
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
