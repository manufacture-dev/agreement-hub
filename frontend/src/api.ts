import type { Contract, ContractInput } from './types';

// Vite dev and preview proxy /api to http://localhost:3001 (see vite.config.ts).
// For hosting without that proxy, set VITE_API_BASE_URL before building.
const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/contracts`
  : '/api/contracts';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((body as { error: string }).error || res.statusText);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export async function listContracts(): Promise<Contract[]> {
  const res = await fetch(API_BASE);
  return handleResponse<Contract[]>(res);
}

export async function getContract(id: string): Promise<Contract> {
  const res = await fetch(`${API_BASE}/${id}`);
  return handleResponse<Contract>(res);
}

export async function createContract(input: ContractInput): Promise<Contract> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Contract>(res);
}

export async function updateContract(id: string, input: ContractInput): Promise<Contract> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Contract>(res);
}

export async function deleteContract(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  return handleResponse<void>(res);
}
