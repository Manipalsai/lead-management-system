import { useEffect, useState } from 'react';
import { fetchLeadStats } from '../api/leads.api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    newLeads: 0,
    contacted: 0,
    converted: 0
  });

  useEffect(() => {
    fetchLeadStats()
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error('Failed to load stats', err);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">
          Overview of lead management system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Leads', value: stats.total, color: 'bg-blue-500' },
          { label: 'New Leads', value: stats.newLeads, color: 'bg-indigo-500' },
          { label: 'Contacted', value: stats.contacted, color: 'bg-purple-500' },
          { label: 'Converted', value: stats.converted, color: 'bg-green-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform hover:scale-[1.02]">
            <h4 className="text-sm font-medium text-gray-500 mb-2">{stat.label}</h4>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
              <div className={`w-10 h-10 rounded-full ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                <div className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`}>
                  {/* Icon placeholder - could be replaced with SVG if needed */}
                  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for Chart or Recent Activity */}
      {/* Interactive Chart Visualization */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Lead Performance Overview</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'Total Leads', value: stats.total, fill: '#3B82F6' },
                { name: 'New Leads', value: stats.newLeads, fill: '#6366F1' },
                { name: 'Contacted', value: stats.contacted, fill: '#A855F7' },
                { name: 'Converted', value: stats.converted, fill: '#22C55E' },
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: '#F3F4F6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={60} animationDuration={1500}>
                {
                  [
                    { name: 'Total Leads', value: stats.total, fill: '#3B82F6' },
                    { name: 'New Leads', value: stats.newLeads, fill: '#6366F1' },
                    { name: 'Contacted', value: stats.contacted, fill: '#A855F7' },
                    { name: 'Converted', value: stats.converted, fill: '#22C55E' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))
                }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
