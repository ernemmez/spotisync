/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-console */
// @ts-nocheck
'use client';
/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';
import Head from 'next/head';
import * as React from 'react';

import { authorizeSpotify, getCurrentUserProfile } from '@/lib/spotify';

import Button from '@/components/buttons/Button';
import ButtonLink from '@/components/links/ButtonLink';

const getHashParams = () => {
  const hashParams = {};

  if (typeof window !== 'undefined') {
    const hash = window.location.hash.substring(1) || '';
    const params = hash?.split('&');

    params.forEach((param) => {
      const [key, value] = param.split('=');
      // @ts-ignore
      hashParams[key] = decodeURIComponent(value);
    });
  }

  return hashParams;
};

export default function HomePage() {
  const [activeUser, setActiveUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<any>(false);
  const [progress, setProgress] = React.useState(0);
  const [createdPlaylist, setCreatedPlaylist] = React.useState(null);
  // @ts-ignore
  const { access_token } = getHashParams();

  const getUserProfile = async () => {
    try {
      const profile = await getCurrentUserProfile(access_token);
      setActiveUser(profile);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAuthorizeSpotify = () => {
    authorizeSpotify();
  };

  React.useEffect(() => {
    if (loading) {
      let interval: NodeJS.Timer;
      // eslint-disable-next-line prefer-const
      interval = setInterval(() => {
        setProgress((prevProgress) =>
          prevProgress >= 100 ? 0 : prevProgress + 10
        );
      }, 500);

      return () => {
        clearInterval(interval);
      };
    }
  }, [loading]);

  React.useEffect(() => {
    if (access_token) {
      getUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access_token]);

  const makePublic = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        '/api/make-public',
        {
          access_token,
          playlistName: `${activeUser?.display_name}'s liked songs`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setCreatedPlaylist(response.data?.createdPlaylist);
    } catch (error) {
      console.error('Error making the request:', error);
      alert('Error making the request:');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Head>
        <title>Spotisync</title>
      </Head>
      <main className='align-center flex h-screen w-full flex-col justify-center'>
        <section className='mx-auto my-32 flex h-auto max-w-4xl flex-wrap items-center px-4 lg:my-0 lg:h-screen lg:px-0'>
          <div
            id='profile'
            className='m-auto w-full rounded-lg bg-gray-400 bg-opacity-25 shadow-2xl lg:w-3/5'
          >
            <div className='p-4 text-center md:p-12'>
              <div
                className='mx-auto -mt-16 block h-48 w-48 rounded-full bg-cover bg-center shadow-xl'
                style={{
                  backgroundImage: `url(${
                    activeUser?.images[1].url ||
                    'https://source.unsplash.com/MP0IUfwrn0A'
                  })`,
                }}
              ></div>
              <h1 className='pt-8 text-3xl font-bold text-gray-200'>
                {activeUser?.display_name || 'Welcome'}
              </h1>
              {activeUser && (
                <p className='flex items-center justify-center text-sm text-gray-500'>
                  <strong>Followers:</strong> {activeUser?.followers?.total}
                </p>
              )}
              <div className='mx-auto w-4/5 border-b-2 border-green-600 pt-3 opacity-50'></div>
              <p className='pt-4 text-sm text-gray-200'>
                Spotisync is a service that assists Spotify users in
                automatically transforming their private 'Liked Songs' playlist
                into a publicly accessible playlist. Simply log in with your
                Spotify account, and let Spotisync handle the rest. Spotisync
                automatically completes all the necessary steps to create a
                public playlist containing the user's liked songs.
              </p>
              {!access_token ? (
                <div className='py-8'>
                  <Button onClick={handleAuthorizeSpotify}>
                    Sign in with Spotify
                  </Button>
                </div>
              ) : (
                <>
                  {createdPlaylist?.id ? (
                    <>
                      <iframe
                        src={`https://open.spotify.com/embed/playlist/${createdPlaylist?.id}?utm_source=generator&theme=0`}
                        width='100%'
                        height='352'
                        allowFullScreen
                        allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
                        loading='lazy'
                        className='mt-4 h-20 w-full rounded-md'
                      />
                    </>
                  ) : (
                    <div className='py-4'>
                      <Button onClick={() => makePublic()}>
                        {loading
                          ? `Your public playlist is being created... %${progress}`
                          : 'Make Public Playlist'}
                      </Button>
                    </div>
                  )}
                </>
              )}
              <p className='pt-4 text-sm text-gray-500'>
                The ability to automatically keep your 'Liked Songs' and 'Public
                Liked Songs' playlists in sync is coming soon 🥳
              </p>
              <div className='m-auto mt-8 flex w-5/6 items-center justify-between'>
                <ButtonLink
                  leftIcon={() => (
                    <>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        xlink='http://www.w3.org/1999/xlink'
                        width='24px'
                        height='24px'
                        viewBox='0 0 20 20'
                        version='1.1'
                      >
                        <g
                          id='Page-1'
                          stroke='none'
                          stroke-width='1'
                          fill='none'
                          fill-rule='evenodd'
                        >
                          <g
                            id='Dribbble-Light-Preview'
                            transform='translate(-140.000000, -7559.000000)'
                            fill='#2DC766'
                          >
                            <g
                              id='icons'
                              transform='translate(56.000000, 160.000000)'
                            >
                              <path
                                d='M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399'
                                id='github-[#142]'
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </>
                  )}
                  variant='outline'
                  href='https://github.com/ernemmez'
                  className='text-xs'
                >
                  Github
                </ButtonLink>
                <ButtonLink
                  leftIcon={() => (
                    <>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        xlink='http://www.w3.org/1999/xlink'
                        fill='#2DC766'
                        height='24px'
                        width='24px'
                        version='1.1'
                        id='Layer_1'
                        viewBox='-143 145 512 512'
                        space='preserve'
                      >
                        <path d='M113,145c-141.4,0-256,114.6-256,256s114.6,256,256,256s256-114.6,256-256S254.4,145,113,145z M41.4,508.1H-8.5V348.4h49.9  V508.1z M15.1,328.4h-0.4c-18.1,0-29.8-12.2-29.8-27.7c0-15.8,12.1-27.7,30.5-27.7c18.4,0,29.7,11.9,30.1,27.7  C45.6,316.1,33.9,328.4,15.1,328.4z M241,508.1h-56.6v-82.6c0-21.6-8.8-36.4-28.3-36.4c-14.9,0-23.2,10-27,19.6  c-1.4,3.4-1.2,8.2-1.2,13.1v86.3H71.8c0,0,0.7-146.4,0-159.7h56.1v25.1c3.3-11,21.2-26.6,49.8-26.6c35.5,0,63.3,23,63.3,72.4V508.1z  ' />
                      </svg>
                    </>
                  )}
                  variant='outline'
                  href='https://www.linkedin.com/in/erenemmez/'
                  className='text-xs'
                >
                  Linkedin
                </ButtonLink>
                <ButtonLink
                  leftIcon={() => (
                    <>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        xmlnsXlink='http://www.w3.org/1999/xlink'
                        width='24px'
                        height='24px'
                        viewBox='0 0 20 20'
                        version='1.1'
                      >
                        <defs />
                        <g
                          id='Page-1'
                          stroke='none'
                          strokeWidth='1'
                          fill='none'
                          fillRule='evenodd'
                        >
                          <g
                            id='Dribbble-Light-Preview'
                            transform='translate(-140.000000, -7479.000000)'
                            fill='#2DC766'
                          >
                            <g
                              id='icons'
                              transform='translate(56.000000, 160.000000)'
                            >
                              <path
                                d='M99.915,7327.865 C96.692,7325.951 91.375,7325.775 88.297,7326.709 C87.803,7326.858 87.281,7326.58 87.131,7326.085 C86.981,7325.591 87.26,7325.069 87.754,7324.919 C91.287,7323.846 97.159,7324.053 100.87,7326.256 C101.314,7326.52 101.46,7327.094 101.196,7327.538 C100.934,7327.982 100.358,7328.129 99.915,7327.865 L99.915,7327.865 Z M99.81,7330.7 C99.584,7331.067 99.104,7331.182 98.737,7330.957 C96.05,7329.305 91.952,7328.827 88.773,7329.792 C88.36,7329.916 87.925,7329.684 87.8,7329.272 C87.676,7328.86 87.908,7328.425 88.32,7328.3 C91.951,7327.198 96.466,7327.732 99.553,7329.629 C99.92,7329.854 100.035,7330.334 99.81,7330.7 L99.81,7330.7 Z M98.586,7333.423 C98.406,7333.717 98.023,7333.81 97.729,7333.63 C95.381,7332.195 92.425,7331.871 88.944,7332.666 C88.609,7332.743 88.274,7332.533 88.198,7332.197 C88.121,7331.862 88.33,7331.528 88.667,7331.451 C92.476,7330.58 95.743,7330.955 98.379,7332.566 C98.673,7332.746 98.766,7333.129 98.586,7333.423 L98.586,7333.423 Z M94,7319 C88.477,7319 84,7323.477 84,7329 C84,7334.523 88.477,7339 94,7339 C99.523,7339 104,7334.523 104,7329 C104,7323.478 99.523,7319.001 94,7319.001 L94,7319 Z'
                                id='spotify-[#162]'
                              />
                            </g>
                          </g>
                        </g>
                      </svg>
                    </>
                  )}
                  variant='outline'
                  href='https://open.spotify.com/user/j467dzb7f0l5fexbs2elb1gj5?si=16c30dc7da3d4707'
                  className='text-xs'
                >
                  Spotify
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </main>
    </main>
  );
}
