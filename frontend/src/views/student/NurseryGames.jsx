import { useEffect, useState } from 'react';
import { nurseryGamesApi } from '../../api/nurseryGames';
import Alert from '../../components/common/Alert';

const BABY_GROUPS = ['Baby 1', 'Baby 2', 'Baby 3'];

const TYPE_LABELS = {
  VIDEO_READING: 'Video Reading',
  VIDEO_MATH: 'Video Math',
  READING_GAME: 'Reading Game',
  OTHER: 'Game',
};

export default function NurseryGames() {
  const [games, setGames] = useState([]);
  const [activeGame, setActiveGame] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    nurseryGamesApi.list().then(({ data }) => setGames(data.data)).catch(() => {});
  }, []);

  const handlePlay = async (id) => {
    setError('');
    try {
      const { data } = await nurseryGamesApi.get(id);
      setActiveGame(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Please log in to play.');
    }
  };

  const handleFinish = async () => {
    if (!activeGame) return;
    await nurseryGamesApi.saveProgress(activeGame.id, { completed: true }).catch(() => {});
    setActiveGame(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-blue-900 mb-2">Nursery Games</h1>
      <p className="text-gray-500 text-sm mb-6">Fun learning videos and games for our youngest learners.</p>

      <Alert type="error">{error}</Alert>

      {activeGame && (
        <div className="mb-8 border border-gray-200 rounded-lg p-4">
          <h2 className="font-semibold text-gray-900 mb-2">{activeGame.title}</h2>
          <video src={activeGame.contentSignedUrl} controls autoPlay className="w-full rounded-md bg-black" />
          <button
            onClick={handleFinish}
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            I finished! 🎉
          </button>
        </div>
      )}

      {BABY_GROUPS.map((group) => {
        const groupGames = games.filter((g) => g.babyGroup === group);
        if (groupGames.length === 0) return null;

        return (
          <div key={group} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">{group}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {groupGames.map((g) => (
                <button
                  key={g.id}
                  onClick={() => handlePlay(g.id)}
                  className="text-left border-2 border-blue-100 hover:border-blue-400 rounded-xl overflow-hidden transition-colors bg-gradient-to-br from-blue-50 to-white"
                >
                  <div className="aspect-video bg-blue-100 flex items-center justify-center text-4xl">
                    🎈
                  </div>
                  <div className="p-3">
                    <span className="text-xs font-medium text-blue-700">{TYPE_LABELS[g.type]}</span>
                    <h3 className="font-semibold text-gray-900 text-sm mt-1">{g.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {games.length === 0 && (
        <p className="text-gray-500 text-sm">No nursery games published yet.</p>
      )}
    </div>
  );
}
