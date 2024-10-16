'use client'

export default function EngagementOverview() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
          Engagement Overview
        </h3>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <EngagementCard title="Most Clicked Section" value="Profile" />
          <EngagementCard title="Top Contact Action" value="Save Contact" />
          <EngagementCard title="Most Active Platform" value="LinkedIn" />
        </div>
      </div>
    </div>
  )
}

interface EngagementCardProps {
  title: string;
  value: string;
}

function EngagementCard({ title, value }: EngagementCardProps) {
  return (
    <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
          {title}
        </dt>
        <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
          {value}
        </dd>
      </div>
    </div>
  )
}