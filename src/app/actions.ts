'use server'

import { fetchAnilist, GET_ANIME_LIST_QUERY } from '@/lib/anilist';

export async function fetchNextPage(variables: Record<string, unknown>) {
  return await fetchAnilist(GET_ANIME_LIST_QUERY, variables);
}
