/**
 * Helper utility to generate clean, valid, scannable Hasnain Foundation URLs.
 * Automatically handles localhost / development sandbox environments so scanning
 * the QR code on external mobile devices or cameras loads the live web app without network errors.
 */
export function getHasnainFoundationLink(id?: string, type: 'receipt' | 'member' = 'receipt'): string {
  const OFFICIAL_PUBLIC_URL = 'https://hasnain-foundation-com.ai.studio';
  
  let baseUrl = OFFICIAL_PUBLIC_URL;
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    const origin = window.location.origin;
    // Only use window.location.origin if it's NOT a local/loopback environment
    if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      baseUrl = origin;
    }
  }

  if (!id) return baseUrl;

  const cleanId = id.trim();
  if (type === 'member') {
    return `${baseUrl}/?verifyMember=${encodeURIComponent(cleanId)}`;
  }

  return `${baseUrl}/?verify=${encodeURIComponent(cleanId)}`;
}
