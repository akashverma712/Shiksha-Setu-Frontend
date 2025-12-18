'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Phone,
  Send,
  Users,
  Search,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Student {
  _id: string;
  name: string;
  rollNo: string;
  phone: string;
  semester: number;
  section: string;
}

export default function SendSMSPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{success: number, failed: number} | null>(null);

  useEffect(() => {
    fetchMyStudents();
  }, []);

  const fetchMyStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/teachers/my-students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        // Filter students who have phone numbers
        const withPhone = res.data.students.filter((s: any) => s.phone);
        setStudents(withPhone);
        setFilteredStudents(withPhone);
      }
    } catch (err) {
      alert('Failed to load students');
    }
  };

  // Search filter
  useEffect(() => {
    const lower = search.toLowerCase();
    const filtered = students.filter(s =>
      s.name.toLowerCase().includes(lower) ||
      s.rollNo.toLowerCase().includes(lower) ||
      s.phone.includes(search)
    );
    setFilteredStudents(filtered);
  }, [search, students]);

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedStudents);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedStudents(newSet);
  };

  const selectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map(s => s._id)));
    }
  };

  const sendBulkSMS = async () => {
    if (selectedStudents.size === 0) {
      alert('Please select at least one student');
      return;
    }
    if (!message.trim()) {
      alert('Please write a message');
      return;
    }

    if (!confirm(`Send SMS to ${selectedStudents.size} student(s)?`)) return;

    setSending(true);
    setResult(null);

    let success = 0;
    let failed = 0;

    try {
      for (const studentId of selectedStudents) {
        try {
          const token = localStorage.getItem('token');
          await axios.post(
            `${API_URL}/api/teachers/send-sms/${studentId}`,
            { message: message.trim() },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          success++;
        } catch (err) {
          failed++;
        }
      }
    } catch (err) {
      failed++;
    }

    setSending(false);
    setResult({ success, failed });
    if (failed === 0) {
      setMessage('');
      setSelectedStudents(new Set());
    }
  };

  const characterCount = message.length;
  const smsCount = Math.ceil(characterCount / 160);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
            Send SMS to Students
          </h1>
          <p className="text-xl text-slate-400 mt-3">
            Powered by Twilio • Reach students instantly
          </p>
        </motion.div>

        {/* Message Composer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900/90 to-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg">
              <MessageSquare className="h-9 w-9 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Compose Message</h2>
              <p className="text-slate-400">
                Selected: <span className="text-orange-400 font-bold">{selectedStudents.size}</span> students
              </p>
            </div>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here...&#10;&#10;Example:&#10;Dear student.name , your assignment is due tomorrow. Please submit on time! - Prof. Sharma"
            className="w-full h-40 px-6 py-5 bg-slate-900/70 border border-slate-700 rounded-2xl focus:border-orange-500 outline-none resize-none text-lg"
          />

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-slate-400">
              <span className={characterCount > 160 ? 'text-yellow-400' : ''}>
                {characterCount} characters
              </span>{' '}
              • {smsCount} SMS
            </div>
            <button
              onClick={sendBulkSMS}
              disabled={sending || selectedStudents.size === 0 || !message.trim()}
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-500 hover:to-pink-500 rounded-2xl font-bold text-lg shadow-lg hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {sending ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-6 w-6" />
                  Send SMS Now
                </>
              )}
            </button>
          </div>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-5 rounded-2xl border text-center font-semibold text-lg ${
                result.failed === 0
                  ? 'bg-emerald-900/40 border-emerald-600/60 text-emerald-300'
                  : 'bg-yellow-900/40 border-yellow-600/60 text-yellow-300'
              }`}
            >
              {result.failed === 0 ? (
                <p className="flex items-center justify-center gap-3">
                  <CheckCircle className="h-7 w-7" />
                  Success! Sent to all {result.success} students
                </p>
              ) : (
                <p className="flex items-center justify-center gap-3">
                  <AlertCircle className="h-7 w-7" />
                  Sent: {result.success} | Failed: {result.failed}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Students List */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-orange-400" />
                <h2 className="text-2xl font-bold">Select Recipients</h2>
                <span className="text-sm text-slate-400">
                  {students.length} students with phone numbers
                </span>
              </div>
              <button
                onClick={selectAll}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition"
              >
                {selectedStudents.size === filteredStudents.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {/* Search */}
            <div className="relative mt-5 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, roll no, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-slate-800/70 border border-slate-700 rounded-xl focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          {/* End header */}

          {/* Students Grid */}
          <div className="max-h-96 overflow-y-auto">
            {filteredStudents.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No students found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-6">
                {filteredStudents.map((student) => (
                  <motion.div
                    key={student._id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => toggleSelect(student._id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedStudents.has(student._id)
                        ? 'border-orange-500 bg-orange-900/20'
                        : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl font-bold ${
                          selectedStudents.has(student._id) ? 'bg-orange-600' : 'bg-slate-700'
                        }`}>
                          {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{student.name}</p>
                          <p className="text-sm text-slate-400">{student.rollNo}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Sem {student.semester} {student.section}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono text-emerald-400">{student.phone}</p>
                        {selectedStudents.has(student._id) && (
                          <CheckCircle className="h-6 w-6 text-orange-400 mt-2" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
