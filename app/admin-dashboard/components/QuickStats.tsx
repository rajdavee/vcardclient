import React from 'react';
import { Users, CreditCard, Activity, BarChart2, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { theme } from '../theme-constants';

interface QuickStatsProps {
  stats: {
    totalUsers: number;
    totalVCards: number;
    totalScans: number;
  };
  userAnalytics: {
    premiumUsers: number;
    activeUsers: number;
    userGrowth: number;
  };
  isLoading: boolean;
}

export default function QuickStats({ stats, userAnalytics, isLoading }: QuickStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const quickStats = [
    {
      title: 'Total Users',
      icon: <Users size={24} />,
      value: stats.totalUsers.toLocaleString(),
      change: '+5.2%',
      changeType: 'increase',
      color: 'blue',
      detail: `${userAnalytics.activeUsers} active users`,
      trend: userAnalytics.userGrowth > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />
    },
    {
      title: 'Total vCards',
      icon: <CreditCard size={24} />,
      value: stats.totalVCards.toLocaleString(),
      change: '+3.1%',
      changeType: 'increase',
      color: 'green',
      detail: 'Last 30 days'
    },
    {
      title: 'Total Scans',
      icon: <Activity size={24} />,
      value: stats.totalScans.toLocaleString(),
      change: '+7.6%',
      changeType: 'increase',
      color: 'yellow',
      detail: 'Avg. 2.3 scans/card'
    },
    {
      title: 'Premium Users',
      icon: <BarChart2 size={24} />,
      value: userAnalytics.premiumUsers.toLocaleString(),
      change: '-2.5%',
      changeType: 'decrease',
      color: 'purple',
      detail: '32% conversion rate'
    }
  ];

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'hover') => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        hover: 'hover:bg-blue-100'
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        hover: 'hover:bg-green-100'
      },
      yellow: {
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        hover: 'hover:bg-amber-100'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        hover: 'hover:bg-purple-100'
      }
    };
    return colors[color as keyof typeof colors][type];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {quickStats.map((stat, index) => (
        <div 
          key={index} 
          className="group bg-white rounded-xl shadow-sm p-6 transform transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl transition-colors duration-200 ${getColorClasses(stat.color, 'bg')} ${getColorClasses(stat.color, 'hover')}`}>
              <div className={getColorClasses(stat.color, 'text')}>
                {stat.icon}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {stat.trend && (
                <span className={`${stat.changeType === 'increase' ? 'text-success-main' : 'text-error-main'}`}>
                  {stat.trend}
                </span>
              )}
              <span className={`text-sm font-semibold ${
                stat.changeType === 'increase' ? 'text-success-main' : 'text-error-main'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
          
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
            <div className="flex items-center text-sm text-gray-500">
              <span>{stat.detail}</span>
              <ArrowRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
