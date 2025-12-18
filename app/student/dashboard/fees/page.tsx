"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Download,
  TrendingUp,
  PieChart as PieIcon,
  Shield,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function FeeDetailsPage() {
  const totalDue = 125000;
  const paidAmount = 85000;
  const pendingAmount = totalDue - paidAmount;
  const dueDate = "2025-12-15";
  const overdue = false; // Toggle for demo
  const feeBreakdown = [
    { label: "Tuition Fee", amount: 90000, paid: 70000 },
    { label: "Hostel Fee", amount: 20000, paid: 15000 },
    { label: "Mess Advance", amount: 8000, paid: 0 },
    { label: "Library & Lab Fee", amount: 5000, paid: 5000 },
    { label: "Sports & Activities", amount: 2000, paid: 2000 },
  ];
  const paymentHistory = [
    { date: "2025-11-10", amount: 50000, method: "UPI", status: "Success", receipt: "#" },
    { date: "2025-10-05", amount: 20000, method: "Net Banking", status: "Success", receipt: "#" },
    { date: "2025-08-20", amount: 15000, method: "Credit Card", status: "Success", receipt: "#" },
  ];

  const [selectedTab, setSelectedTab] = useState<"overview" | "breakdown" | "history">("overview");

  // Pie Chart Data
  const pieData = feeBreakdown.map((item) => ({
    name: item.label,
    value: item.amount,
    paid: item.paid,
  }));
  const colors = ["#f97316", "#3b82f6", "#10b981", "#a855f7", "#ef4444"];

  // Progress Percentage
  const progress = Math.round((paidAmount / totalDue) * 100);
  const progressColor = progress >= 75 ? "from-emerald-500" : progress >= 50 ? "from-yellow-500" : "from-red-500";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/30 rounded-2xl mx-3 mt-4 p-6 relative overflow-hidden">
        <Sparkles className="absolute right-6 top-6 h-14 w-14 text-white/30" />
        <h1 className="text-4xl font-bold">Fee Details</h1>
        <p className="text-white/80 text-lg mt-2">Track & manage your payments</p>
      </div>

      <div className="px-3 mt-6 pb-24 space-y-6">
        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
        >
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="text-center md:text-left">
              <p className="text-slate-400 text-sm">Total Due</p>
              <p className="text-3xl font-bold mt-1">₹{totalDue.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-300" />
                Paid
              </p>
              <p className="text-3xl font-bold text-emerald-300 mt-1">₹{paidAmount.toLocaleString()}</p>
              <div className="w-full bg-white/10 rounded-full h-3 mt-3 overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${progressColor} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">{progress}% Paid</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm flex items-center justify-center md:justify-end gap-2">
                <Clock className={`h-5 w-5 ${pendingAmount > 0 ? "text-yellow-300" : "text-emerald-300"}`} />
                {pendingAmount > 0 ? "Pending" : "Cleared"}
              </p>
              <p className={`text-3xl font-bold mt-1 ${pendingAmount > 0 ? "text-yellow-300" : "text-emerald-300"}`}>
                ₹{pendingAmount.toLocaleString()}
              </p>
              {pendingAmount > 0 && (
                <div className="flex items-center justify-center md:justify-end gap-2 mt-2 text-sm text-slate-400">
                  <Calendar className="h-4 w-4" />
                  Due: {new Date(dueDate).toLocaleDateString("en-IN")}
                </div>
              )}
            </div>
          </div>
          {overdue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 bg-red-600/20 border border-red-600/40 rounded-xl p-4 flex items-center gap-3 text-red-300"
            >
              <AlertCircle className="h-6 w-6" />
              Payment overdue — Late fees may apply!
            </motion.div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
          {(["overview", "breakdown", "history"] as const).map((tab) => (
            <motion.button
              key={tab}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTab === tab
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => setSelectedTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedTab === "overview" && (
            <div className="grid md:grid-cols-2 gap-4">
              {/* Progress Radar (Simple Radar for Fee Metrics) */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-cyan-300">
                  <TrendingUp className="h-5 w-5" />
                  Fee Progress Radar
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="paid"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {pieData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                      <span className="text-slate-400">{item.name}: ₹{item.paid.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Breakdown */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-300">
                  <FileText className="h-5 w-5" />
                  Fee Summary
                </h2>
                <div className="space-y-3">
                  {feeBreakdown.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex justify-between items-center bg-white/5 p-3 rounded-lg"
                    >
                      <span className="text-slate-300">{item.label}</span>
                      <div className="flex items-center gap-3 text-sm">
                        <span className={item.paid === item.amount ? "text-emerald-300" : "text-yellow-300"}>
                          ₹{item.paid.toLocaleString()} / ₹{item.amount.toLocaleString()}
                        </span>
                        {item.paid === item.amount && <CheckCircle className="h-5 w-5 text-emerald-300" />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === "breakdown" && (
            <div className="space-y-4">
              {feeBreakdown.map((item, i) => {
                const percent = Math.round((item.paid / item.amount) * 100);
                const color = percent === 100 ? "from-emerald-500" : percent >= 75 ? "from-yellow-500" : "from-red-500";
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5"
                  >
                    <div className="flex justify-between mb-3">
                      <h3 className="font-semibold text-slate-200">{item.label}</h3>
                      <span className={`text-lg font-bold ${percent === 100 ? "text-emerald-300" : "text-yellow-300"}`}>
                        ₹{item.paid.toLocaleString()} / ₹{item.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${color} to-transparent rounded-full`}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-right">{percent}% Paid</p>
                  </motion.div>
                );
              })}
            </div>
          )}

          {selectedTab === "history" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-300">
                <Shield className="h-5 w-5" />
                Payment History
              </h2>
              <div className="space-y-3">
                {paymentHistory.map((payment, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-emerald-600/20">
                        <CheckCircle className="h-6 w-6 text-emerald-300" />
                      </div>
                      <div>
                        <p className="font-semibold">₹{payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-slate-400">
                          {new Date(payment.date).toLocaleDateString("en-IN")} • {payment.method}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Download className="h-4 w-4" />
                      Receipt
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Pay Now Button */}
        {pendingAmount > 0 && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold py-4 px-10 rounded-full shadow-2xl flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <DollarSign className="h-6 w-6" />
              Pay Now ₹{pendingAmount.toLocaleString()}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
