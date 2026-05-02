/**
 * Returns the image URL as-is.
 * Images are loaded directly using referrerPolicy="no-referrer"
 * which prevents sites like Unsplash from blocking hotlinks.
 * Use the FALLBACK_IMAGE as the onError src if the image fails.
 */
export const FALLBACK_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='600' height='400' fill='%23111111'/%3E%3Ctext x='50%25' y='50%25' fill='%23333333' font-family='sans-serif' font-size='14' text-anchor='middle' dominant-baseline='middle'%3ESin imagen%3C/text%3E%3C/svg%3E`;

export const getProxiedImage = (url) => url || FALLBACK_IMAGE;

export default getProxiedImage;
