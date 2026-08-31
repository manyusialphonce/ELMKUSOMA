import { useEffect, useState } from 'react';
import { liveClassesApi } from '../../api/liveClasses';
import { liveChatApi } from '../../api/nurseryGames';
import useLiveClassSocket from '../../hooks/useLiveClassSocket';
import useAgoraClient from '../../hooks/useAgoraClient';
import LiveVideoStage from '../../components/common/LiveVideoStage';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function StudentLiveClasses() {
  const [liveClasses, setLiveClasses] = useState([]);
  const [error, setError] = useState('');
  const [joiningId, setJoiningId] = useState(null);
  const [joinedClassId, setJoinedClassId] = useState(null);
  const agora = useAgoraClient();

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    liveClassesApi.list().then(({ data }) => setLiveClasses(data.data)).catch(() => {});
  };

  const handleJoin = async (id) => {
    setError('');
    setJoiningId(id);
    try {
      const { data } = await liveClassesApi.join(id);
      if (data.streaming) {
        await agora.join(data.streaming, false);
      }
      setJoinedClassId(id);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not join this class.');
    } finally {
      setJoiningId(null);
    }
  };

  const handleLeave = async (id) => {
    await agora.leave();
    setJoinedClassId(null);
    liveClassesApi.leave(id).catch(() => {});
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">Live Classes</h1>
      <Alert type="error">{error || agora.error}</Alert>

      <div className="space-y-3">
        {liveClasses.map((lc) => (
          <div key={lc.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-semibold text-gray-900">{lc.topic}</h2>
                  <Badge status={lc.status} />
                </div>
                <p className="text-sm text-gray-500">
                  {lc.subject?.name} · {lc.teacher?.fullName} ·{' '}
                  {new Date(lc.startTime).toLocaleString()}
                </p>
              </div>
              {joinedClassId === lc.id ? (
                <Button variant="danger" onClick={() => handleLeave(lc.id)}>Leave</Button>
              ) : (
                <Button
                  onClick={() => handleJoin(lc.id)}
                  loading={joiningId === lc.id}
                  disabled={lc.status !== 'LIVE'}
                >
                  {lc.status === 'LIVE' ? 'Join Now' : 'Not Live Yet'}
                </Button>
              )}
            </div>

            {joinedClassId === lc.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <LiveVideoStage
                  isPublisher={false}
                  remoteUsers={agora.remoteUsers}
                  status={agora.status}
                />
                <LiveChatPanel liveClassId={lc.id} />
              </div>
            )}
          </div>
        ))}

        {liveClasses.length === 0 && (
          <p className="text-gray-500 text-sm">No live classes scheduled right now.</p>
        )}
      </div>
    </div>
  );
}

function LiveChatPanel({ liveClassId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    liveChatApi.list(liveClassId).then(({ data }) => setMessages(data.data)).catch(() => {});
  }, [liveClassId]);

  useLiveClassSocket(liveClassId, {
    'chat:message': (msg) => setMessages((prev) => [...prev, msg]),
  });

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await liveChatApi.post(liveClassId, text.trim());
      setText('');
    } catch {
      // silent
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Live Chat</h3>
      <div className="max-h-48 overflow-y-auto space-y-1 mb-2 bg-gray-50 rounded-md p-2">
        {messages.map((m) => (
          <p key={m.id} className="text-sm">
            <span className="font-medium">{m.user?.fullName}:</span> {m.message}
          </p>
        ))}
        {messages.length === 0 && <p className="text-sm text-gray-400">No messages yet — say hello!</p>}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
        />
        <button type="submit" className="text-sm font-medium text-blue-700">Send</button>
      </form>
    </div>
  );
}
