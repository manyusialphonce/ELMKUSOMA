import { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

/**
 * Wraps the official Agora Web SDK (agora-rtc-sdk-ng) for a single live
 * class session. Call start(credentials, videoElementId) with the
 * { appId, token, channelName, uid } object returned by the backend's
 * /live-classes/:id/start or /join endpoints.
 *
 * Publishers (teachers) get their own camera/mic tracks created and
 * published automatically. Subscribers (students) receive and play
 * remote tracks as they arrive.
 */
export default function useAgoraClient() {
  const clientRef = useRef(null);
  const localTracksRef = useRef([]);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | connecting | connected | error
  const [error, setError] = useState(null);

  useEffect(() => {
    clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

    const client = clientRef.current;

    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      setRemoteUsers((prev) => {
        const others = prev.filter((u) => u.uid !== user.uid);
        return [...others, user];
      });
      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }
    });

    client.on('user-unpublished', (user) => {
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    });

    client.on('user-left', (user) => {
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    });

    return () => {
      leave();
      client.removeAllListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * @param {{appId: string, token: string, channelName: string, uid: number|string}} credentials
   * @param {boolean} isPublisher - true for teachers (publishes camera+mic), false for students (view-only)
   * @param {string} [localVideoElementId] - DOM element id to render the local camera preview into (publishers only)
   */
  async function join(credentials, isPublisher, localVideoElementId) {
    setStatus('connecting');
    setError(null);
    try {
      const { appId, token, channelName, uid } = credentials;
      await clientRef.current.join(appId, channelName, token, uid);

      if (isPublisher) {
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracksRef.current = [audioTrack, videoTrack];
        if (localVideoElementId) {
          videoTrack.play(localVideoElementId);
        }
        await clientRef.current.publish(localTracksRef.current);
      }

      setStatus('connected');
    } catch (err) {
      console.error('[agora] join failed:', err);
      setError(err.message || 'Could not connect to the live class.');
      setStatus('error');
    }
  }

  async function leave() {
    localTracksRef.current.forEach((track) => {
      track.stop();
      track.close();
    });
    localTracksRef.current = [];
    try {
      await clientRef.current?.leave();
    } catch {
      // already left / never joined — safe to ignore
    }
    setRemoteUsers([]);
    setStatus('idle');
  }

  function toggleMic(enabled) {
    const audioTrack = localTracksRef.current.find((t) => t.trackMediaType === 'audio');
    audioTrack?.setEnabled(enabled);
  }

  function toggleCamera(enabled) {
    const videoTrack = localTracksRef.current.find((t) => t.trackMediaType === 'video');
    videoTrack?.setEnabled(enabled);
  }

  return { join, leave, toggleMic, toggleCamera, remoteUsers, status, error };
}
