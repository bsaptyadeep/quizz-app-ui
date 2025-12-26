import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-lg shadow-lg p-12">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-indigo-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Go to Home
          </Link>
          <div>
            <button
              onClick={() => window.history.back()}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

