import { API_BASE_URL } from './config';
import { systemStatus, productionData, documents } from '../data/mockData';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// ── Status ──────────────────────────────────────────────────────────────────
export const api = {
  getStatus: () => Promise.resolve(systemStatus),

  // ── Batches ───────────────────────────────────────────────────────────────
  getBatches: () => Promise.resolve([productionData]),
  getBatch: (_id: string) => Promise.resolve(productionData),
  createBatch: (data: unknown) => Promise.resolve({ ...productionData, ...(data as object) }),

  // ── Documents ─────────────────────────────────────────────────────────────
  getDocuments: () => Promise.resolve(documents),

  // ── Chat ──────────────────────────────────────────────────────────────────
  chat: (message: string) =>
    Promise.resolve({ reply: `Procesando: "${message}"` }),

  // When FastAPI is ready, replace mocks above with real calls:
  // getStatus: () => get('/status'),
  // getBatches: () => get('/batches'),
  // chat: (msg: string) => post('/chat', { message: msg }),
};

export { get, post };
