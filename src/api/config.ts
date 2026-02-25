const rawBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
const isDev = process.env.NODE_ENV !== 'production';
export const API_BASE_URL =
  rawBaseUrl && rawBaseUrl.length > 0
    ? rawBaseUrl
    : isDev
      ? 'http://10.0.0.19:3000'
      : 'https://example.com';

const rawMock = process.env.EXPO_PUBLIC_USE_MOCK_API;
// treat undefined as true; treat 'false' (case-insensitive) as false; everything else true
export const USE_MOCK_API = rawMock ? rawMock.toLowerCase() !== 'false' : true;
