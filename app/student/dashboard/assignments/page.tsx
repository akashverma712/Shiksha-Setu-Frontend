'use client';
import { useState } from 'react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Download,
  Upload,
  Filter,
  TrendingUp,
  FileText,
  Target,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export default function AssignmentsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'overdue'>('all');

  const assignments = [
    {
      id: 1,
      subject: 'Database Management Systems',
      title: 'SQL Query Optimization Assignment',
      dueDate: new Date('2025-12-08'),
      submitted: true,
      marks: '92/100',
      status: 'graded',
    },
    {
      id: 2,
      subject: 'Operating Systems',
      title: 'Process Scheduling Algorithms',
      dueDate: new Date('2025-12-05'),
      submitted: true,
      marks: 'Pending',
      status: 'submitted',
    },
    {
      id: 3,
      subject: 'Machine Learning',
      title: 'Implement Linear Regression from Scratch',
      dueDate: new Date('2025-12-10'),
      submitted: false,
      marks: null,
      status: 'pending',
    },
    {
      id: 4,
      subject: 'Computer Networks',
      title: 'Subnetting & Routing Table Design',
      dueDate: new Date('2025-12-01'),
      submitted: false,
      marks: null,
      status: 'overdue',
    },
    {
      id: 5,
      subject: 'Compiler Design',
      title: 'Lexical Analyzer using Flex',
      dueDate: new Date('2025-12-15'),
      submitted: false,
      marks: null,
      status: 'upcoming',
    },
  ];

  const total = assignments.length;
  const submitted = assignments.filter(a => a.submitted).length;
  const pending = assignments.filter(a => !a.submitted && !isPast(a.dueDate)).length;
  const overdue = assignments.filter(a => !a.submitted && isPast(a.dueDate)).length;

  const filteredAssignments = assignments.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !a.submitted && !isPast(a.dueDate);
    if (filter === 'submitted') return a.submitted;
    if (filter === 'overdue') return !a.submitted && isPast(a.dueDate);
    return true;
  });

  const getDueStatus = (dueDate: Date) => {
    if (isPast(dueDate) && !isToday(dueDate)) return { text: 'Overdue', color: 'text-red-400', bg: 'bg-red-600/20' };
    if (isToday(dueDate)) return { text: 'Due Today', color: 'text-orange-400', bg: 'bg-orange-600/20' };
    if (isTomorrow(dueDate)) return { text: 'Due Tomorrow', color: 'text-yellow-400', bg: 'bg-yellow-600/20' };
    return { text: format(dueDate, 'dd MMM'), color: 'text-gray-400', bg: 'bg-white/5' };
  };

  // Pie Chart Data
  const pieData = [
    { name: 'Submitted', value: submitted, color: '#10b981' },
    { name: 'Pending', value: pending, color: '#f59e0b' },
    { name: 'Overdue', value: overdue, color: '#ef4444' },
  ].filter(item => item.value > 0);

  // Radar Data
  const radarData = [
    { metric: 'Total', value: total },
    { metric: 'Submitted', value: submitted },
    { metric: 'Pending', value: pending },
    { metric: 'Overdue', value: overdue },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/30 rounded-2xl mx-3 mt-4 p-6 relative overflow-hidden">
        <Sparkles className="absolute right-6 top-6 h-14 w-14 text-white/30" />
        <h1 className="text-4xl font-bold">Assignments</h1>
        <p className="text-white/80 text-lg mt-2">Stay ahead of your deadlines</p>
      </div>

      <div className="px-3 mt-6 pb-24 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<BookOpen className="h-8 w-8 text-blue-300" />} title="Total" value={total} color="from-blue-600/20" />
          <StatCard icon={<CheckCircle className="h-8 w-8 text-emerald-300" />} title="Submitted" value={submitted} color="from-emerald-600/20" />
          <StatCard icon={<Clock className="h-8 w-8 text-yellow-300" />} title="Pending" value={pending} color="from-yellow-600/20" />
          <StatCard icon={<AlertCircle className="h-8 w-8 text-red-300" />} title="Overdue" value={overdue} color="from-red-600/20" />
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Radar Chart */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="text-xl font-semibold mb-4 text-cyan-300 flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Assignment Radar
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="metric" stroke="#cbd5e1" fontSize={13} />
                <PolarRadiusAxis angle={90} domain={[0, Math.max(total, 10)]} stroke="#475569" />
                <Radar name="Stats" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="text-xl font-semibold mb-4 text-orange-300 flex items-center gap-2">
              <Target className="h-6 w-6" />
              Submission Status
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-400">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
          {(['all', 'pending', 'submitted', 'overdue'] as const).map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {f === 'all' ? 'All Assignments' : f}
            </motion.button>
          ))}
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment, i) => {
            const due = getDueStatus(assignment.dueDate);
            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{assignment.title}</h3>
                      {assignment.submitted ? (
                        <span className="px-3 py-1 text-xs rounded-full bg-emerald-600/20 text-emerald-300 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Submitted
                        </span>
                      ) : isPast(assignment.dueDate) ? (
                        <span className="px-3 py-1 text-xs rounded-full bg-red-600/20 text-red-300 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          Overdue
                        </span>
                      ) : null}
                    </div>
                    <p className="text-slate-400 text-sm">{assignment.subject}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className={`flex items-center gap-2 px-3 py-1 rounded-full ${due.bg}`}>
                        <Calendar className="h-4 w-4" />
                        {due.text}
                      </span>
                      {assignment.marks && (
                        <span className="px-3 py-1 text-sm rounded-full bg-cyan-600/20 text-cyan-300">
                          Score: {assignment.marks}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {assignment.submitted ? (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-emerald-600/20 rounded-xl hover:bg-emerald-600/30 transition"
                      >
                        <Download className="h-5 w-5 text-emerald-300" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-medium text-sm flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Submit Now
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-20">
            <FileText className="mx-auto h-20 w-20 text-slate-600 mb-4" />
            <p className="text-xl text-slate-500">No assignments found</p>
          </div>
        )}

        {/* Floating Upload Button */}
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 p-4 rounded-full shadow-2xl"
          >
            <Upload className="h-7 w-7 text-white" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

// Reusable StatCard
function StatCard({ icon, title, value, color }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${color} border border-white/10 rounded-2xl p-5`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-3 bg-white/10 rounded-xl">{icon}</div>
        <TrendingUp className="h-5 w-5 text-green-400" />
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-slate-400 text-sm mt-1">{title}</p>
    </motion.div>
  );
}
