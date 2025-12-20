// src/shared/api/ky.ts
import ky from 'ky';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';
const prefixUrl = rawBaseUrl.endsWith('/')
  ? rawBaseUrl.slice(0, -1)
  : rawBaseUrl;

export const api = ky.create({
  prefixUrl,
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  retry: { limit: 0 },
});
