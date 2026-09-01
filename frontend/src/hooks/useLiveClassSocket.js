import { useEffect, useRef } from 'react';
import { getSocket } from '../api/socket';

/**
 * Joins the given live class's Socket.IO room for the lifetime of the
 * component and wires up event handlers. Usage:
 *
 *   useLiveClassSocket(liveClassId, {
 *     'live-class:started': (payload) => ...,
 *     'question:requested': (question) => ...,
 *   });
 */
export default function useLiveClassSocket(liveClassId, handlers = {}) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!liveClassId) return;

    const socket = getSocket();
    if (!socket.connected) socket.connect();

    socket.emit('live-class:join', liveClassId);

    const boundHandlers = Object.entries(handlersRef.current).map(([event, fn]) => {
      const wrapped = (...args) => handlersRef.current[event]?.(...args);
      socket.on(event, wrapped);
      return [event, wrapped];
    });

    return () => {
      boundHandlers.forEach(([event, wrapped]) => socket.off(event, wrapped));
      socket.emit('live-class:leave', liveClassId);
    };
  }, [liveClassId]);
}
