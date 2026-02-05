import React from 'react';
import { UserProfile } from '../types';
import { Activity, Shield, Code, Server, Zap, TrendingUp, Users } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const stats = [
    { label: 'Architecture Patterns', value: '1,284', change: '+12%', icon: Code, color: 'text-blue-400' },
    { label: 'Security Scans', value: '89.2%', change: '+4.1%', icon: Shield, color: 'text-green-400' },
    { label: 'Infrastructure Cost', value: '$2.4k', change: '-8%', icon: Server, color: 'text-purple-400' },
    { label: 'System Uptime', value: '99.99%', change: '+0.01%', icon: Activity, color: 'text-orange-400' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Platform Overview</h2>
          <p className="text-gray-400">Welcome back, {user.name}. System performance is nominal.</p>
        </div>
        <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs font-mono rounded-full border border-green-800 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
                SYSTEM HEALTHY
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-gray-900 border border-gray-800 p-5 rounded-xl hover:border-gray-700 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-gray-950 border border-gray-800 group-hover:border-gray-700 transition-colors ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-xs font-mono ${stat.change.startsWith('+') ? 'text-green-400' : 'text-blue-400'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-mono">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-80">
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-200 flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-500" />
                    Generation Velocity
                </h3>
                <div className="flex gap-2">
                    {['1H', '24H', '7D', '30D'].map(t => (
                        <button key={t} className={`text-xs px-2 py-1 rounded ${t === '7D' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 flex items-end gap-2 px-2">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                    <div key={i} className="flex-1 bg-blue-900/20 rounded-t hover:bg-blue-600/50 transition-colors relative group" style={{height: `${h}%`}}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700">
                            {h} generations
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
             <h3 className="font-semibold text-gray-200 flex items-center gap-2 mb-6">
                <Users size={18} className="text-purple-500" />
                Active Teams
            </h3>
            <div className="space-y-4">
                {[
                    {name: 'Payment Infra', status: 'Optimizing', time: '2m ago'},
                    {name: 'Core Auth', status: 'Reviewing', time: '15m ago'},
                    {name: 'Inventory Ops', status: 'Generating', time: '32m ago'},
                    {name: 'Trust & Safety', status: 'Idle', time: '1h ago'},
                ].map((team, i) => (
                    <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                        <div>
                            <p className="text-sm font-medium text-gray-300">{team.name}</p>
                            <p className="text-xs text-gray-500">{team.time}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full border ${
                            team.status === 'Generating' ? 'bg-blue-900/20 border-blue-800 text-blue-400' : 
                            team.status === 'Optimizing' ? 'bg-green-900/20 border-green-800 text-green-400' :
                            'bg-gray-800 border-gray-700 text-gray-400'
                        }`}>
                            {team.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
