const ROLE_LABELS = {
  STUDENT: 'Student',
  TEACHER: 'Teacher',
  PARENT: 'Parent',
  SCHOOL_ADMINISTRATOR: 'School Admin',
  ADMINISTRATOR: 'Administrator',
  SUPER_ADMINISTRATOR: 'Super Admin',
  ADVERTISER: 'Advertiser',
};

// This matrix is generated directly from the authorize(...) middleware calls
// across every route file in the backend — it reflects what the API
// actually enforces today, not an aspirational design. Update it here
// whenever a route's authorize(...) list changes.
const MODULES = [
  {
    name: 'Live Classes',
    capabilities: [
      { action: 'View list & details', roles: ['STUDENT', 'TEACHER', 'PARENT', 'SCHOOL_ADMINISTRATOR', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR', 'ADVERTISER'] },
      { action: 'Create, start, end a class', roles: ['TEACHER'] },
      { action: 'Join / leave as attendee', roles: ['STUDENT'] },
      { action: 'Approve / reject / answer questions', roles: ['TEACHER'] },
      { action: 'Chat during a live class', roles: ['STUDENT', 'TEACHER'] },
    ],
  },
  {
    name: 'Recordings',
    capabilities: [
      { action: 'View published list', roles: ['Public (no login)'] },
      { action: 'Stream a recording', roles: ['Any authenticated user + active subscription'] },
      { action: 'Upload & manage own recordings', roles: ['TEACHER'] },
      { action: 'Publish a recording', roles: ['TEACHER', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR'] },
    ],
  },
  {
    name: 'Notes Library (Resources)',
    capabilities: [
      { action: 'View published list', roles: ['Public (no login)'] },
      { action: 'Download a resource', roles: ['Any authenticated user'] },
      { action: 'Upload a resource', roles: ['TEACHER', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR'] },
      { action: 'Publish a resource', roles: ['TEACHER', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR'] },
    ],
  },
  {
    name: 'Lessons (self-paced)',
    capabilities: [
      { action: 'View published list', roles: ['Public (no login)'] },
      { action: 'View content & track progress', roles: ['STUDENT'] },
      { action: 'Create a lesson', roles: ['TEACHER'] },
      { action: 'Publish a lesson', roles: ['TEACHER', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR'] },
    ],
  },
  {
    name: 'Quizzes',
    capabilities: [
      { action: 'View list & details', roles: ['Any authenticated user'] },
      { action: 'Create a quiz', roles: ['TEACHER'] },
      { action: 'View results / class statistics', roles: ['TEACHER'] },
      { action: 'Attempt a quiz', roles: ['STUDENT'] },
    ],
  },
  {
    name: 'Assignments',
    capabilities: [
      { action: 'View list & details', roles: ['Any authenticated user'] },
      { action: 'Create an assignment', roles: ['TEACHER'] },
      { action: 'View submissions & grade', roles: ['TEACHER'] },
      { action: 'Submit an assignment', roles: ['STUDENT'] },
    ],
  },
  {
    name: 'Certificates',
    capabilities: [
      { action: 'Verify by code', roles: ['Public (no login)'] },
      { action: 'View own certificates', roles: ['STUDENT'] },
      { action: 'Issue a certificate', roles: ['TEACHER', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR'] },
      { action: 'Revoke a certificate', roles: ['ADMINISTRATOR', 'SUPER_ADMINISTRATOR'] },
    ],
  },
  {
    name: 'Nursery Games',
    capabilities: [
      { action: 'View published list', roles: ['Public (no login)'] },
      { action: 'Play & track progress', roles: ['STUDENT'] },
      { action: 'Create & publish a game', roles: ['TEACHER', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR'] },
    ],
  },
  {
    name: 'Parent Monitoring',
    capabilities: [
      { action: 'Link / unlink a child', roles: ['PARENT'] },
      { action: "View a linked child's progress & certificates", roles: ['PARENT'] },
    ],
  },
  {
    name: 'Schools',
    capabilities: [
      { action: 'View list & profile', roles: ['Public (no login)'] },
      { action: 'Create a school', roles: ['SCHOOL_ADMINISTRATOR', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR'] },
      { action: 'Run the School Setup Wizard', roles: ['SCHOOL_ADMINISTRATOR', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR'] },
    ],
  },
  {
    name: 'Academic & Reference Data',
    capabilities: [
      { action: 'View regions, education levels, subjects, academic structure', roles: ['Public (no login)'] },
      { action: 'Add regions, districts, education levels, classes, subjects', roles: ['ADMINISTRATOR', 'SUPER_ADMINISTRATOR'] },
      { action: 'Manage departments, programmes, courses, academic years', roles: ['ADMINISTRATOR', 'SUPER_ADMINISTRATOR'] },
    ],
  },
  {
    name: 'ED Advertising',
    capabilities: [
      { action: 'View approved announcements', roles: ['Public (no login)'] },
      { action: 'Submit an advertisement', roles: ['ADVERTISER', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR'] },
      { action: 'Approve / reject submissions', roles: ['ADMINISTRATOR', 'SUPER_ADMINISTRATOR'] },
    ],
  },
  {
    name: 'Subscriptions & Payments',
    capabilities: [
      { action: 'View plans', roles: ['Public (no login)'] },
      { action: 'Subscribe & view own history', roles: ['Any authenticated user'] },
      { action: 'View all subscriptions / payments platform-wide', roles: ['ADMINISTRATOR', 'SUPER_ADMINISTRATOR'] },
    ],
  },
  {
    name: 'Platform Administration',
    capabilities: [
      { action: 'View & manage users (suspend/reactivate)', roles: ['ADMINISTRATOR', 'SUPER_ADMINISTRATOR'] },
      { action: 'Approve / reject teacher verifications', roles: ['ADMINISTRATOR', 'SUPER_ADMINISTRATOR'] },
      { action: 'View audit logs', roles: ['ADMINISTRATOR', 'SUPER_ADMINISTRATOR'] },
      { action: 'View system settings', roles: ['ADMINISTRATOR', 'SUPER_ADMINISTRATOR'] },
      { action: 'Edit system settings', roles: ['SUPER_ADMINISTRATOR'] },
    ],
  },
  {
    name: 'Reports',
    capabilities: [
      { action: 'View own learning report', roles: ['STUDENT'] },
      { action: 'View own teaching report & student list', roles: ['TEACHER'] },
      { action: 'View platform-wide overview & geography reports', roles: ['ADMINISTRATOR', 'SUPER_ADMINISTRATOR'] },
    ],
  },
];

export default function AdminRolesPermissions() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">Roles & Permissions</h1>
      <p className="text-gray-500 text-sm mb-6 max-w-2xl">
        ELMKUSOMA uses a fixed set of roles rather than a configurable
        permissions system — this page documents exactly what each role can
        do today, generated from the actual access rules enforced by the API.
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {Object.entries(ROLE_LABELS).map(([key, label]) => (
          <span key={key} className="text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
            {label}
          </span>
        ))}
      </div>

      <div className="space-y-6">
        {MODULES.map((mod) => (
          <div key={mod.name} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900 text-sm">{mod.name}</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {mod.capabilities.map((cap) => (
                <div key={cap.action} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm text-gray-700 sm:w-72 shrink-0">{cap.action}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {cap.roles.map((r) => (
                      <span
                        key={r}
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          r.startsWith('Public') || r.startsWith('Any')
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-green-50 text-green-700'
                        }`}
                      >
                        {ROLE_LABELS[r] || r}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-6">
        Want configurable, database-driven roles instead of this fixed set?
        That's a larger architectural change (introducing Role/Permission
        tables and rewriting every access check) — worth a dedicated
        planning conversation before starting, since it touches nearly
        every route in the API.
      </p>
    </div>
  );
}
