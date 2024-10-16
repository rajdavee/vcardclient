'use client'

import { Users, Clock, UserPlus, FileText } from 'lucide-react'

export default function OverviewCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <OverviewCard
        icon={<Users className="h-6 w-6 text-white" />}
        title="Total Scans"
        value="2,450"
        change="+5.25%"
        color="bg-blue-500"
      />
      <OverviewCard
        icon={<Clock className="h-6 w-6 text-white" />}
        title="Avg. Time Spent"
        value="2m 15s"
        change="+12s"
        color="bg-green-500"
      />
      <OverviewCard
        icon={<UserPlus className="h-6 w-6 text-white" />}
        title="New Visitors"
        value="65%"
        change="-2%"
        color="bg-yellow-500"
        negative
      />
      <OverviewCard
        icon={<FileText className="h-6 w-6 text-white" />}
        title="Form Submissions"
        value="126"
        change="+8.3%"
        color="bg-purple-500"
      />
    </div>
  )
}

interface OverviewCardProps {
  icon: JSX.Element;
  title: string;
  value: string;
  change: string;
  color: string;
  negative?: boolean;
}

function OverviewCard({ icon, title, value, change, color, negative = false }: OverviewCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${color} rounded-md p-3`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {value}
                </div>
                <span className={`ml-2 text-sm font-medium ${negative ? 'text-red-600' : 'text-green-600'}`}>
                  {change}
                </span>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}