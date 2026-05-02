import API_URL from './api';

/**
 * Returns a proxied image URL to bypass hotlink/CORS restrictions
 * from external CDNs like Unsplash, IMGur, etc.
 *
 * - If the URL is already relative or from our own domain, return as-is.
 * - If it's an external URL, route it through our backend proxy.
 */
export const getProxiedImage = (url) => {
    if (!url) return '';
    // Allow data URIs and relative paths directly
    if (url.startsWith('data:') || url.startsWith('/')) return url;
    // Allow same-origin images (if hosted on our server)
    if (url.startsWith(API_URL)) return url;
    // Proxy everything else through our backend
    return `${API_URL}/api/image-proxy?url=${encodeURIComponent(url)}`;
};

export default getProxiedImage;
