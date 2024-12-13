'use client'

import React from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function NewAdminDashboard() {
  // Dummy data for charts
  const lineChartData = [10, 41, 35, 51, 49, 62, 69, 91, 148];
  const barChartData = [30, 40, 45, 50, 49, 60, 70, 91, 125];
  const pieChartData = [
    { label: 'Business', value: 30 },
    { label: 'Personal', value: 50 },
    { label: 'Other', value: 20 },
  ];

  // Helper function to generate SVG path for line chart
  const generateLinePath = (data: number[]) => {
    const max = Math.max(...data);
    const scale = 100 / max;
    return data
      .map(
        (d, i) =>
          `${i === 0 ? 'M' : 'L'} ${(i / (data.length - 1)) * 300} ${
            100 - d * scale
          }`
      )
      .join(' ');
  };

  return (
    <div className={`min-h-screen bg-gray-100 ${inter.className}`}>
      {/* Header */}


      <div className="flex">
        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
              {[
                { title: 'Total vCards', value: '1,234', change: '+5.3%' },
                { title: 'Active Users', value: '789', change: '+2.7%' },
                { title: 'Revenue', value: '$12,345', change: '+10.1%' },
              ].map((metric) => (
                <div
                  key={metric.title}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">{metric.title}</h3>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</p>
                  <p className="text-sm text-green-600">{metric.change} from last month</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
              {/* Line Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">vCard Creation Trend</h3>
                <svg className="w-full h-64" viewBox="0 0 300 100">
                  <path
                    d={generateLinePath(lineChartData)}
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">User Engagement</h3>
                <svg className="w-full h-64" viewBox="0 0 300 100">
                  {barChartData.map((value, index) => (
                    <rect
                      key={index}
                      x={index * 33}
                      y={100 - value}
                      width="30"
                      height={value}
                      fill="#4F46E5"
                    />
                  ))}
                </svg>
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">vCard Types</h3>
                <svg className="w-full h-64" viewBox="0 0 100 100">
                  {pieChartData.map((slice, index) => {
                    const startAngle = (slice.value / 100) * Math.PI * 2;
                    const x1 = Math.cos(startAngle) * 50 + 50;
                    const y1 = Math.sin(startAngle) * 50 + 50;
                    const x2 = Math.cos(startAngle + Math.PI) * 50 + 50;
                    const y2 = Math.sin(startAngle + Math.PI) * 50 + 50;
                    const largeArcFlag = startAngle > Math.PI ? 1 : 0;
                    const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                    return (
                      <path
                        key={index}
                        d={pathData}
                        fill={`hsl(${index * 120}, 70%, 60%)`}
                      />
                    );
                  })}
                </svg>
                <div className="flex justify-center mt-4">
                  {pieChartData.map((slice, index) => (
                    <div key={index} className="flex items-center mr-4">
                      <div
                        className="w-3 h-3 rounded-full mr-1"
                        style={{ backgroundColor: `hsl(${index * 120}, 70%, 60%)` }}
                      ></div>
                      <span className="text-sm text-gray-600">{slice.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-2">User</th>
                      <th className="pb-2">Action</th>
                      <th className="pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { user: 'Alice Smith', action: 'Created vCard', date: '2023-06-15' },
                      { user: 'Bob Johnson', action: 'Updated vCard', date: '2023-06-14' },
                      { user: 'Charlie Brown', action: 'Deleted vCard', date: '2023-06-13' },
                    ].map((activity, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="py-2">{activity.user}</td>
                        <td className="py-2">{activity.action}</td>
                        <td className="py-2">{activity.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
