import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { fetchLeadStats } from '../api/leads.api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import CustomDropdown from '../components/common/CustomDropdown';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    newLeads: 0,
    contacted: 0,
    converted: 0
  });

  /* ──────────────── TODO LIST STATE & HANDLERS ──────────────── */
  const [todos, setTodos] = useState<{ id: number; text: string; done: boolean }[]>([]);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');

  const { user } = useAppSelector((state) => state.auth); // To get currently logged in userId

  // Load todos on mount
  useEffect(() => {
    loadTodos();
  }, [user]);

  const loadTodos = async () => {
    if (!user?.id) return;
    try {
      const { data } = await import('../api/todo.api').then(m => m.fetchTodos(user.id));
      setTodos(data);
    } catch (error) {
      console.error('Failed to load todos', error);
    }
  };

  const toggleTodo = async (id: number) => {
    // Optimistic update
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    try {
      await import('../api/todo.api').then(m => m.toggleTodo(id));
    } catch (error) {
      console.error('Failed to toggle todo', error);
      // Revert if failed
      loadTodos();
    }
  };

  const deleteTodo = async (id: number) => {
    // Optimistic update
    setTodos(prev => prev.filter(t => t.id !== id));
    try {
      await import('../api/todo.api').then(m => m.deleteTodo(id));
    } catch (error) {
      console.error('Failed to delete todo', error);
      loadTodos();
    }
  };

  const startAddTodo = () => {
    setIsAddingTodo(true);
    setTimeout(() => document.getElementById('new-todo-input')?.focus(), 100);
  };

  const saveNewTodo = async () => {
    if (newTodoText.trim() && user?.id) {
      try {
        const { data } = await import('../api/todo.api').then(m => m.createTodo(newTodoText.trim(), user.id));
        setTodos(prev => [data, ...prev]);
        setNewTodoText('');
        setIsAddingTodo(false);
      } catch (error) {
        console.error('Failed to create todo', error);
      }
    }
  };

  const cancelAddTodo = () => {
    setNewTodoText('');
    setIsAddingTodo(false);
  };

  useEffect(() => {
    fetchLeadStats()
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error('Failed to load stats', err);
      });
  }, []);

  const [timeRange, setTimeRange] = useState('This Month');

  // Bold, vivid colors for charts and cards
  const colors = {
    total: { fill: '#F97316', from: 'from-orange-500', to: 'to-orange-600' }, // Bold Orange
    new: { fill: '#EC4899', from: 'from-pink-500', to: 'to-pink-600' },       // Deep Pink
    contacted: { fill: '#06B6D4', from: 'from-cyan-500', to: 'to-cyan-600' },  // Vivid Cyan
    converted: { fill: '#8B5CF6', from: 'from-violet-500', to: 'to-violet-600' } // Electric Violet
  };

  const chartData = timeRange === 'This Month' ? [
    { name: 'Total', value: stats.total, fill: colors.total.fill },
    { name: 'New', value: stats.newLeads, fill: colors.new.fill },
    { name: 'Contacted', value: stats.contacted, fill: colors.contacted.fill },
    { name: 'Converted', value: stats.converted, fill: colors.converted.fill },
  ] : [
    { name: 'Total', value: 0, fill: colors.total.fill },
    { name: 'New', value: 0, fill: colors.new.fill },
    { name: 'Contacted', value: 0, fill: colors.contacted.fill },
    { name: 'Converted', value: 0, fill: colors.converted.fill },
  ];

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
          {
            label: 'Total Leads', value: stats.total, ...colors.total, icon: (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            )
          },
          {
            label: 'New Leads', value: stats.newLeads, ...colors.new, icon: (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            )
          },
          {
            label: 'Contacted', value: stats.contacted, ...colors.contacted, icon: (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            )
          },
          {
            label: 'Converted', value: stats.converted, ...colors.converted, icon: (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )
          },
        ].map((stat) => (
          <div key={stat.label} className={`group relative overflow-hidden bg-gradient-to-br ${stat.from} ${stat.to} p-6 rounded-2xl shadow-lg border border-transparent hover:shadow-2xl hover:scale-[1.02] transition-all duration-300`}>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 blur-2xl" />

            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-semibold text-white/80 mb-1 uppercase tracking-wide">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">{stat.value}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/10 transform group-hover:-translate-y-1 transition-transform">
                {stat.icon}
              </div>
            </div>

            <div className="mt-4 flex items-center text-sm text-white/90 font-medium">
              <span className="bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                +2.5%
              </span>
              <span className="ml-2 text-white/70">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
            <div className="flex-shrink-0 min-w-0 max-w-full relative">
              <CustomDropdown
                value={timeRange}
                onChange={setTimeRange}
                options={[
                  { label: 'This Month', value: 'This Month' },
                  { label: 'Last Month', value: 'Last Month' },
                  { label: 'Last Quarter', value: 'Last Quarter' },
                ]}
                className="w-full sm:w-48"
              />
            </div>
          </div>

          <div className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barSize={40}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 13, fontWeight: 500 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 13 }}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ fill: '#F9FAFB' }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ fontSize: '14px', fontWeight: 600 }}
                />
                <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                  <Cell fill="url(#colorTotal)" />
                  <Cell fill="url(#colorNew)" />
                  <Cell fill="url(#colorContacted)" />
                  <Cell fill="url(#colorConverted)" />
                </Bar>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={1} />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="colorContacted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity={1} />
                    <stop offset="100%" stopColor="#9333EA" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity / Side Panel */}
        <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/leads', { state: { openAddLead: true } })}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors group"
            >
              <span className="font-medium text-gray-700 group-hover:text-indigo-700">Add New Lead</span>
              <div className="w-8 h-8 rounded-full bg-white text-gray-400 group-hover:text-indigo-600 group-hover:bg-indigo-200 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </div>
            </button>

            <button
              onClick={() => {
                const csvContent = "data:text/csv;charset=utf-8,"
                  + "Category,Count\n"
                  + `Total Leads,${stats.total}\n`
                  + `New Leads,${stats.newLeads}\n`
                  + `Contacted,${stats.contacted}\n`
                  + `Converted,${stats.converted}`;
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "lead_report.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-purple-50 hover:text-purple-600 transition-colors group"
            >
              <span className="font-medium text-gray-700 group-hover:text-purple-700">Export Report</span>
              <div className="w-8 h-8 rounded-full bg-white text-gray-400 group-hover:text-purple-600 group-hover:bg-purple-200 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </div>
            </button>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">To-Do List</h4>
              <div className="space-y-3">
                {todos.map(todo => (
                  <div key={todo.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleTodo(todo.id)}>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${todo.done ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>
                        {todo.done && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className={`text-sm transition-all ${todo.done ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>{todo.text}</span>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
              </div>

              {isAddingTodo ? (
                <div className="mt-4 animate-fade-in p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <input
                    id="new-todo-input"
                    type="text"
                    className="w-full px-3 py-2 border border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white mb-3"
                    placeholder="Enter task description..."
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveNewTodo();
                      if (e.key === 'Escape') cancelAddTodo();
                    }}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={cancelAddTodo}
                      className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveNewTodo}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 shadow-sm transition-colors"
                    >
                      Add Task
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={startAddTodo}
                  className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 px-1 py-1 rounded hover:bg-indigo-50 transition-colors w-full"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add Task
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
