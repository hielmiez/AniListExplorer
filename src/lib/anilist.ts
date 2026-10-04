export const ANILIST_API_URL = "https://graphql.anilist.co";

export async function fetchAnilist(query: string, variables?: Record<string, unknown>) {
  const response = await fetch(ANILIST_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Anilist API error:", errorText);
    throw new Error(`Failed to fetch from Anilist: ${response.statusText}`);
  }

  const result = await response.json();
  if (result.errors) {
    console.error("Anilist GraphQL errors:", result.errors);
    throw new Error("GraphQL errors occurred");
  }

  return result.data;
}

export const GET_OPTIONS_QUERY = `
  query GetOptions {
    GenreCollection
    MediaTagCollection {
      name
    }
  }
`;

export const GET_ANIME_LIST_QUERY = `
  query GetAnimeList(
    $page: Int = 1,
    $search: String,
    $season: MediaSeason,
    $seasonYear: Int,
    $genre_in: [String],
    $tag_in: [String],
    $format_in: [MediaFormat],
    $status_in: [MediaStatus],
    $sort: [MediaSort] = [POPULARITY_DESC]
  ) {
    Page(page: $page, perPage: 24) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(
        search: $search
        season: $season
        seasonYear: $seasonYear
        genre_in: $genre_in
        tag_in: $tag_in
        format_in: $format_in
        status_in: $status_in
        type: ANIME
        sort: $sort
      ) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          color
        }
        description(asHtml: true)
        studios(isMain: true) {
          nodes {
            name
          }
        }
        season
        seasonYear
        format
        status
        episodes
        genres
        averageScore
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
      }
    }
  }
`;

export const GET_ANIME_DETAIL_QUERY = `
  query GetAnimeDetail($id: Int!) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        extraLarge
        large
        color
      }
      bannerImage
      description(asHtml: true)
      format
      status
      episodes
      duration
      season
      seasonYear
      averageScore
      meanScore
      popularity
      favourites
      source
      genres
      synonyms
      startDate {
        year
        month
        day
      }
      studios {
        edges {
          isMain
          node {
            name
          }
        }
      }
      tags {
        name
        description
        rank
      }
      externalLinks {
        id
        site
        url
        icon
        color
      }
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
      relations {
        edges {
          relationType(version: 2)
          node {
            id
            type
            title {
              romaji
              english
              native
            }
            coverImage {
              large
              color
            }
            format
            averageScore
          }
        }
      }
      recommendations(sort: RATING_DESC) {
        nodes {
          mediaRecommendation {
            id
            type
            title {
              romaji
              english
              native
            }
            coverImage {
              large
            }
            format
            averageScore
          }
        }
      }
      trailer {
        id
        site
        thumbnail
      }
      characters(sort: [ROLE, RELEVANCE, ID], perPage: 12) {
        edges {
          role
          node {
            id
            name {
              full
            }
            image {
              large
            }
          }
          voiceActors(language: JAPANESE) {
            id
            name {
              full
            }
            image {
              large
            }
          }
        }
      }
      staff(sort: [RELEVANCE, ID], perPage: 8) {
        edges {
          role
          node {
            id
            name {
              full
            }
            image {
              large
            }
          }
        }
      }
    }
  }
`;

export const GET_CHARACTER_DETAIL_QUERY = `
  query($id: Int) {
    Character(id: $id) {
      id
      name {
        full
        native
        alternative
        alternativeSpoiler
      }
      image {
        large
      }
      description(asHtml: true)
      age
      gender
      bloodType
      dateOfBirth {
        year
        month
        day
      }
      media(type: ANIME, sort: POPULARITY_DESC) {
        edges {
          characterRole
          node {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            format
          }
        }
      }
    }
  }
`;

export const GET_STAFF_DETAIL_QUERY = `
  query($id: Int) {
    Staff(id: $id) {
      id
      name {
        full
        native
        alternative
      }
      image {
        large
      }
      description(asHtml: true)
      age
      gender
      yearsActive
      primaryOccupations
      dateOfBirth {
        year
        month
        day
      }
      staffMedia(type: ANIME, sort: POPULARITY_DESC) {
        edges {
          staffRole
          node {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            format
          }
        }
      }
    }
  }
`;

export const GET_USER_WATCHLIST_QUERY = `
  query($userId: Int!) {
    MediaListCollection(userId: $userId, type: ANIME) {
      lists {
        name
        isCustomList
        isSplitCompletedList
        status
        entries {
          id
          status
          progress
          score
          media {
            id
            title {
              english
              romaji
              native
            }
            coverImage {
              large
              color
            }
            description(asHtml: true)
            format
            episodes
            genres
            averageScore
            season
            seasonYear
            studios(isMain: true) {
              nodes {
                name
              }
            }
            nextAiringEpisode {
              episode
              timeUntilAiring
            }
          }
        }
      }
    }
  }
`;

export const SAVE_MEDIA_LIST_ENTRY_MUTATION = `
  mutation SaveMediaListEntry($mediaId: Int, $status: MediaListStatus, $scoreRaw: Int, $progress: Int) {
    SaveMediaListEntry(mediaId: $mediaId, status: $status, scoreRaw: $scoreRaw, progress: $progress) {
      id
      status
      score
      progress
      media {
        id
        title {
          romaji
        }
      }
    }
  }
`;

export const GET_MEDIA_LIST_ENTRY_QUERY = `
  query GetMediaListEntry($mediaId: Int!, $userId: Int!) {
    MediaList(mediaId: $mediaId, userId: $userId) {
      id
      status
      progress
      score
    }
  }
`;

export const GET_ANIME_CHARACTERS_QUERY = `
  query GetAnimeCharacters($id: Int!, $page: Int = 1) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      characters(sort: [ROLE, RELEVANCE, ID], page: $page, perPage: 24) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        edges {
          role
          node {
            id
            name { full }
            image { large }
          }
          voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
            id
            name { full }
            image { large }
          }
        }
      }
    }
  }
`;

export const GET_ANIME_STAFF_QUERY = `
  query GetAnimeStaff($id: Int!, $page: Int = 1) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      staff(sort: [RELEVANCE, ID], page: $page, perPage: 24) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        edges {
          role
          node {
            id
            name { full }
            image { large }
          }
        }
      }
    }
  }
`;
