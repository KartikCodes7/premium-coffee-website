import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LiveOrder, MenuItem, Reservation } from '@/store/useStore';
import type { CoffeeMenuItem } from '@/components/coffee-menu/coffeeMenuData';

const API_BASE_URL = 'http://localhost:5000/api';

// Core Fetch Wrappers
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}

// --- Query & Mutation Hooks ---

// 1. Orders Queries
export function useOrdersQuery() {
  return useQuery<LiveOrder[]>({
    queryKey: ['orders'],
    queryFn: () => apiFetch<LiveOrder[]>('/orders'),
    refetchInterval: 5000, // Poll every 5 seconds for real-time kitchen queue pacing!
  });
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (order: { name: string; items: string; total: number }) =>
      apiFetch<LiveOrder>('/orders', {
        method: 'POST',
        body: JSON.stringify(order),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LiveOrder['status'] }) =>
      apiFetch<LiveOrder>(`/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

// 2. Menu Queries
export function useMenuQuery() {
  return useQuery<MenuItem[]>({
    queryKey: ['menu'],
    queryFn: () => apiFetch<MenuItem[]>('/menu'),
  });
}

export function useQrMenuQuery() {
  return useQuery<CoffeeMenuItem[]>({
    queryKey: ['qr-menu'],
    queryFn: () => apiFetch<CoffeeMenuItem[]>('/qr-menu'),
  });
}

export function useUpdateMenuPriceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, price }: { id: string; price: number }) =>
      apiFetch<MenuItem>(`/menu/${id}/price`, {
        method: 'PATCH',
        body: JSON.stringify({ price }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });
}

export function useAddMenuItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: Omit<MenuItem, 'id' | 'rating'>) =>
      apiFetch<MenuItem>('/menu', {
        method: 'POST',
        body: JSON.stringify(item),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });
}

export function useDeleteMenuItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<MenuItem>(`/menu/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });
}

// 3. Reservations Queries
export function useReservationsQuery() {
  return useQuery<Reservation[]>({
    queryKey: ['reservations'],
    queryFn: () => apiFetch<Reservation[]>('/reservations'),
  });
}

export function useCreateReservationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (res: Omit<Reservation, 'id' | 'status'>) =>
      apiFetch<Reservation>('/reservations', {
        method: 'POST',
        body: JSON.stringify(res),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

export function useConfirmReservationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<Reservation>(`/reservations/${id}/confirm`, {
        method: 'PATCH',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

export function useCancelReservationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<Reservation>(`/reservations/${id}/cancel`, {
        method: 'PATCH',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

// 4. Analytics Queries
export interface AnalyticsPayload {
  metrics: {
    grossRevenue: number;
    totalOrdersCount: number;
    avgOrderValue: number;
    returningCohort: string;
    shiftRevenue: number;
    activeQueueCount: number;
    alertsCount: number;
  };
  popularItems: Array<{ name: string; sold: number; percentage: number }>;
  cohortData: Array<{ date: string; w0: string; w2: string; w4: string; w6: string }>;
  transactions: Array<{ id: string; time: string; name: string; items: string; total: number; status: string }>;
}

export function useAnalyticsQuery() {
  return useQuery<AnalyticsPayload>({
    queryKey: ['analytics'],
    queryFn: () => apiFetch<AnalyticsPayload>('/analytics'),
    refetchInterval: 10000, // Sync analytics dashboards metrics every 10s
  });
}

// 5. Chat Query
export interface ChatResponse {
  text: string;
  upsellItem?: {
    id: string;
    name: string;
    price: number;
    image: string;
  } | null;
}

export function useChatMutation() {
  return useMutation<ChatResponse, Error, string>({
    mutationFn: (message: string) =>
      apiFetch<ChatResponse>('/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
      }),
  });
}
