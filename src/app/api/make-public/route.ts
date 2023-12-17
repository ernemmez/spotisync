/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextRequest, NextResponse } from 'next/server';

import { createPublicPlaylist, getAllUserSavedTracks } from '@/lib/spotify';

import { base64Cover } from '@/constant/base64Cover';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { access_token, playlistName } = body;

  if (!access_token) {
    return NextResponse.json(
      { message: 'Missing access_token parameter' },
      { status: 400 }
    );
  }

  const savedTracks = await getAllUserSavedTracks(access_token);

  if (savedTracks.length < 1) {
    return NextResponse.json(
      {
        message:
          "There seems to be nothing in 'Liked songs'. Or something went wrong on the server side. Please log in again.",
      },
      { status: 400 }
    );
  }

  // example track item: spotify:track:<track_id>
  // @ts-ignore
  const tracksToAdd = await savedTracks.map(
    ({ track }) => `spotify:track:${track.id}`
  );

  const createdPlaylist = await createPublicPlaylist(
    access_token,
    playlistName,
    tracksToAdd,
    base64Cover
  );

  return NextResponse.json(
    {
      message: `Playlist Created Successfully!`,
      createdPlaylist,
    },
    { status: 200 }
  );
}
