'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Clock,
  TrendingUp,
  AlertCircle,
  Calendar,
  CheckCircle,
  XCircle,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Animated Donut
function Donut({ value }: { value: number }) {
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;
  const color = value >= 90 ? '#10b981' : value >= 75 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full -rotate-90">
        <circle cx="94" cy="94" r={radius} stroke="#1e293b" strokeWidth="20" fill="none" />
        <circle
          cx="94"
          cy="94"
          r={radius}
          stroke={color}
          strokeWidth="20"
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="drop-shadow-lg transition-all duration-1500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
        >
          {value}%
        </motion.span>
        <span className="text-sm text-slate-400 mt-1">Attendance</span>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/attendance/my-history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ──────────────────────────────────────────────────────────────
  // Loading & Error States
  // ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-xl animate-pulse">Loading attendance...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400 text-xl">
        Failed to load data
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // Data Processing
  // ──────────────────────────────────────────────────────────────
  const { summary, dailyHistory } = data;
  const overall = summary.overall;

  // Subject-wise
  const subjectMap = new Map<string, { present: number; total: number; name: string }>();
  dailyHistory.forEach((day: any) => {
    day.subjects.forEach((sub: any) => {
      const code = sub.subjectCode;
      if (!subjectMap.has(code)) {
        subjectMap.set(code, { present: 0, total: 0, name: sub.subjectName || code });
      }
      const stats = subjectMap.get(code)!;
      stats.total += 1;
      if (sub.status === 'present' || sub.status === 'late') stats.present += 1;
    });
  });

  const subjects = Array.from(subjectMap.entries())
    .map(([_, stats]) => ({
      name: stats.name,
      percent: Math.round((stats.present / stats.total) * 100),
    }))
    .sort((a, b) => b.percent - a.percent);

  // Charts data
  const radarData = [
    { metric: 'Present', value: overall.present },
    { metric: 'Late', value: overall.late },
    { metric: 'Absent', value: overall.absent },
    { metric: 'Total', value: overall.totalClasses },
  ];

  const pieData = [
    { name: 'Present', value: overall.present, color: '#10b981' },
    { name: 'Late', value: overall.late, color: '#f59e0b' },
    { name: 'Absent', value: overall.absent, color: '#ef4444' },
  ].filter((i) => i.value > 0);

  // ──────────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/30 rounded-2xl mx-3 mt-4 p-6 relative overflow-hidden">
        <Sparkles className="absolute right-6 top-6 h-14 w-14 text-white/30" />
        <h1 className="text-4xl font-bold">Attendance Overview</h1>
        <p className="text-white/80 text-lg mt-2">
          {summary.name} • {summary.rollNo} • {summary.department}
        </p>
      </div>

      <div className="px-3 mt-6 pb-20 space-y-6">
        {/* Donut + Quick Stats */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <Donut value={Math.round(overall.attendancePercentage)} />

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Calendar, label: 'Total Classes', value: overall.totalClasses, color: 'text-blue-300' },
                { icon: CheckCircle, label: 'Present', value: overall.present, color: 'text-emerald-300' },
                { icon: AlertCircle, label: 'Late', value: overall.late, color: 'text-yellow-300' },
                { icon: XCircle, label: 'Absent', value: overall.absent, color: 'text-red-300' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 text-center"
                >
                  <stat.icon className={`h-10 w-10 ${stat.color} mx-auto mb-3`} />
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Radar */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="text-xl font-semibold mb-4 text-cyan-300">Attendance Radar</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="metric" stroke="#cbd5e1" fontSize={13} />
                <PolarRadiusAxis angle={90} domain={[0, 'dataMax']} stroke="#475569" />
                <Radar name="Stats" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="text-xl font-semibold mb-4 text-orange-300">Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-400 ml-2">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subject-wise */}
        {subjects.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-3">
              <Flame className="text-orange-400" />
              Subject-wise Performance
            </h2>
            <div className="space-y-4">
              {subjects.map((sub: any, i: number) => {
                const bg = sub.percent >= 90 ? 'from-emerald-500' : sub.percent >= 75 ? 'from-yellow-500' : 'from-red-500';
                return (
                  <motion.div
                    key={sub.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300 font-medium">{sub.name}</span>
                      <span className="text-cyan-300 font-bold">{sub.percent}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${sub.percent}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={`h-full bg-gradient-to-r ${bg} to-transparent rounded-full shadow-lg`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-8 text-center border-2 ${
            overall.attendancePercentage >= 85
              ? 'bg-gradient-to-br from-emerald-600/20 border-emerald-600/50'
              : overall.attendancePercentage >= 75
              ? 'bg-gradient-to-br from-yellow-600/20 border-yellow-600/50'
              : 'bg-gradient-to-br from-red-600/20 border-red-600/50'
          }`}
        >
          <Sparkles className="mx-auto h-16 w-16 text-yellow-400 mb-4" />
          <h2 className="text-3xl font-bold mb-3">
            {overall.attendancePercentage >= 90 && 'Perfect Streak!'}
            {overall.attendancePercentage >= 80 && overall.attendancePercentage < 90 && 'Amazing Consistency!'}
            {overall.attendancePercentage >= 75 && overall.attendancePercentage < 80 && 'Keep Pushing!'}
            {overall.attendancePercentage < 75 && 'Time to Step Up!'}
          </h2>
          <p className="text-lg text-slate-300">
            Every class counts. Your future self is watching.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
