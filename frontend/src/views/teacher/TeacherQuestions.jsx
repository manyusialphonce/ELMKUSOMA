import { Link } from 'react-router-dom';

export default function TeacherQuestions() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">Student Questions</h1>
      <p className="text-gray-500 text-sm mb-6">
        Questions are managed live, inside each class — open a live class to
        approve, reject, and answer questions as they come in.
      </p>
      <Link
        to="/teacher/live-classes"
        className="inline-block bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Go to My Live Classes
      </Link>
    </div>
  );
}
