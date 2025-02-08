'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { AccessToken } from 'livekit-client';

interface VideoPlayerProps {
  streamKey: string;
  liveKitUrl?: string;
  liveKitApiKey?: string;
  liveKitApiSecret?: string;
}

export function VideoPlayer({ streamKey, liveKitUrl, liveKitApiKey, liveKitApiSecret }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const streamUrl = `/api/live/${streamKey}/stream.m3u8`;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(console.error);
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(console.error);
      });
    }

    // Connect to LiveKit if credentials are provided
    if (liveKitUrl && liveKitApiKey && liveKitApiSecret) {
      const token = new AccessToken(liveKitApiKey, liveKitApiSecret, {
        identity: 'user', // Replace with actual user identity if available
        name: 'User',
      }).toJwt();

      // You would typically use the token to connect to LiveKit here
      console.log('Connecting to LiveKit with:', { liveKitUrl, token });
      // Replace this with your actual LiveKit connection logic
    }
  }, [streamKey, liveKitUrl, liveKitApiKey, liveKitApiSecret]);

  return (
    <div className="aspect-video relative bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full"
        playsInline
        controls
        muted
      />
    </div>
  );
}
