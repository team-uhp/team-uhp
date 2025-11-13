// app/test-db/page.tsx
import { prisma } from '@/lib/prisma';

export default async function TestDBPage() {
  let dbStatus = {
    connected: false,
    error: null as string | null,
    userCount: 0,
    sampleUser: null as any,
    environment: process.env.NODE_ENV,
    databaseUrl: `${process.env.DATABASE_URL?.substring(0, 30)}...`,
  };

  try {
    // Test database connection
    const userCount = await prisma.user.count();
    const sampleUser = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });

    dbStatus = {
      connected: true,
      error: null,
      userCount,
      sampleUser,
      environment: process.env.NODE_ENV || 'unknown',
      databaseUrl: `${process.env.DATABASE_URL?.substring(0, 30)}...` || 'not set',
    };
  } catch (error: any) {
    dbStatus.error = error.message;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>

          {/* Connection Status */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-semibold">Status:</span>
              {dbStatus.connected ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                  bg-green-100 text-green-800"
                >
                  ✓ Connected
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                  bg-red-100 text-red-800"
                >
                  ✗ Disconnected
                </span>
              )}
            </div>
          </div>

          {/* Environment Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Environment Info</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Environment:</span>
                {' '}
                <code className="bg-gray-200 px-2 py-1 rounded">{dbStatus.environment}</code>
              </div>
              <div>
                <span className="font-medium">Database URL:</span>
                {' '}
                <code className="bg-gray-200 px-2 py-1 rounded text-xs">{dbStatus.databaseUrl}</code>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {dbStatus.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
              <pre className="text-sm text-red-700 whitespace-pre-wrap">{dbStatus.error}</pre>
            </div>
          )}

          {/* Success Display */}
          {dbStatus.connected && (
            <>
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <h2 className="text-lg font-semibold mb-3">Database Stats</h2>
                <div className="text-sm">
                  <span className="font-medium">Total Users:</span>
                  {' '}
                  <span className="text-2xl font-bold text-green-700">{dbStatus.userCount}</span>
                </div>
              </div>

              {dbStatus.sampleUser && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h2 className="text-lg font-semibold mb-3">Sample User</h2>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">ID:</span>
                      {' '}
                      {dbStatus.sampleUser.id}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>
                      {' '}
                      {dbStatus.sampleUser.email}
                    </div>
                    <div>
                      <span className="font-medium">Username:</span>
                      {' '}
                      {dbStatus.sampleUser.username}
                    </div>
                    <div>
                      <span className="font-medium">Role:</span>
                      {' '}
                      <span className="px-2 py-1 bg-blue-200 rounded text-xs">
                        {dbStatus.sampleUser.role}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Refresh Test
            </button>
            <a
              href="/"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Back to Home
            </a>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold mb-2">📋 Instructions</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>If connected, you&apos;ll see a green checkmark and user count</li>
            <li>If there&apos;s an error, check your DATABASE_URL in .env</li>
            <li>
              Make sure Prisma Client is generated:
              <code className="bg-gray-200 px-1">npx prisma generate</code>
            </li>
            <li><strong>Delete this page before deploying to production!</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
