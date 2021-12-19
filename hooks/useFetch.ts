import useSWR, { SWRConfiguration } from 'swr';
import { fetcher } from '../client/fetcher';

export function useFetch<T>(url: string, config: SWRConfiguration = {}) {
  const { data, error } = useSWR<T>(url, fetcher, config);

  return { data, error };
}
