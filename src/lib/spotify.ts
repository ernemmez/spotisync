/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

export const authorizeSpotify = () => {
  const hashParams: Record<string, string> = {};
  let e: RegExpExecArray | null;
  const r = /([^&;=]+)=?([^&;]*)/g;
  const q = window.location.hash.substring(1);

  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }

  if (!hashParams.access_token) {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}&scope=playlist-read-private%20playlist-read-collaborative%20playlist-modify-public%20user-read-recently-played%20playlist-modify-private%20ugc-image-upload%20user-follow-modify%20user-follow-read%20user-library-read%20user-library-modify%20user-read-private%20user-read-email%20user-top-read%20user-read-playback-state&response_type=token&redirect_uri=https://spotisync-web.vercel.app/`;
  } else {
    localStorage.setItem('token', hashParams.access_token);
  }
};

export const getAllUserSavedTracks = async (accessToken: string) => {
  const response = await fetch(`${SPOTIFY_API_BASE}/me/tracks?limit=1`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const initialData = await response.json();
  const totalTracks = initialData.total;

  if (totalTracks <= 50) {
    const fullResponse = await fetch(
      `${SPOTIFY_API_BASE}/me/tracks?limit=${totalTracks}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const fullData = await fullResponse.json();
    return fullData.items;
  }

  const tracksPerPage = 50;
  const totalPages = Math.ceil(totalTracks / tracksPerPage);
  let allTracks: any[] = [];

  for (let page = 0; page < totalPages; page++) {
    const offset = page * tracksPerPage;
    const response = await fetch(
      `${SPOTIFY_API_BASE}/me/tracks?limit=${tracksPerPage}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    allTracks = allTracks.concat(data.items);
  }

  return allTracks;
};

export const getCurrentUserProfile = async (accessToken: string) => {
  const response = await fetch(`${SPOTIFY_API_BASE}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json();
};

export const addPlaylistCoverImage = async (
  accessToken: string,
  playlistId: any,
  base64CoverImage: string
) => {
  try {
    if (base64CoverImage) {
      await axios.put(
        `${SPOTIFY_API_BASE}/playlists/${playlistId}/images`,
        base64CoverImage,
        {
          headers: {
            'Content-Type': 'image/jpeg',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    }
  } catch (error) {
    console.error('Error adding playlist cover image:');
    throw error;
  }
};

export const createPublicPlaylist = async (
  accessToken: string,
  playlistName: string,
  tracksToAdd: any[],
  base64CoverImage: string
) => {
  try {
    const createPlaylistResponse = await axios.post(
      `${SPOTIFY_API_BASE}/me/playlists`,
      {
        name: playlistName,
        public: true,
        description:
          'This playlist was prepared with spotisync. spotisync: https://spotisync-web.vercel.app',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const playlistData = createPlaylistResponse.data;
    const playlistId = playlistData.id;

    if (base64CoverImage)
      await addPlaylistCoverImage(accessToken, playlistId, base64CoverImage);

    const batchSize = 100;
    for (let i = 0; i < tracksToAdd.length; i += batchSize) {
      const batch = tracksToAdd.slice(i, i + batchSize);
      await axios.post(
        `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`,
        {
          uris: batch,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    }

    return playlistData;
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
};
