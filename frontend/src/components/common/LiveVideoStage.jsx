import { useEffect, useRef } from 'react';

/**
 * Renders one remote participant's video track. Agora's SDK plays video
 * into a DOM element by id/ref, so each tile needs a real mounted <div>.
 */
function RemoteTile({ user }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (user.videoTrack && containerRef.current) {
      user.videoTrack.play(containerRef.current);
    }
    return () => {
      user.videoTrack?.stop();
    };
  }, [user]);

  return (
    <div className="relative bg-black rounded-md overflow-hidden aspect-video">
      <div ref={containerRef} className="w-full h-full" />
      <span className="absolute bottom-1 left-2 text-xs text-white/80 font-mono">
        {user.uid}
      </span>
    </div>
  );
}

/**
 * Full live-class video grid: local camera preview (publishers only) plus
 * every remote participant currently in the call.
 */
export default function LiveVideoStage({ isPublisher, localVideoElementId, remoteUsers, status }) {
  if (status === 'idle') {
    return (
      <div className="aspect-video bg-black/90 rounded-md flex items-center justify-center text-white/50 text-sm">
        Not connected
      </div>
    );
  }

  if (status === 'connecting') {
    return (
      <div className="aspect-video bg-black/90 rounded-md flex items-center justify-center text-white/50 text-sm">
        Connecting to live class...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="aspect-video bg-black/90 rounded-md flex items-center justify-center text-red-400 text-sm px-4 text-center">
        Could not connect. Check your camera/microphone permissions and try again.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {isPublisher && (
        <div className="relative bg-black rounded-md overflow-hidden aspect-video">
          <div id={localVideoElementId} className="w-full h-full" />
          <span className="absolute bottom-1 left-2 text-xs text-white/80 font-mono">You</span>
        </div>
      )}
      {remoteUsers.map((user) => (
        <RemoteTile key={user.uid} user={user} />
      ))}
      {!isPublisher && remoteUsers.length === 0 && (
        <div className="aspect-video bg-black/90 rounded-md flex items-center justify-center text-white/50 text-sm sm:col-span-2">
          Waiting for the teacher to start their camera...
        </div>
      )}
    </div>
  );
}
