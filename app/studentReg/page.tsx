'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { ArrowLeft, GraduationCap, UserCheck } from 'lucide-react';

const registerSchema = z.object({
  rollNo: z.string().min(1, 'Roll No is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  semester: z.coerce.number().int().min(1).max(8),
  gender: z.enum(['Male', 'Female', 'Other']),
  category: z.enum(['General', 'OBC', 'SC', 'ST']),
  cgpa: z.coerce.number().min(0).max(10).optional(),
  attendancePercentage: z.coerce.number().min(0).max(100).optional(),
  backlogs: z.coerce.number().min(0).optional(),
  familyIncome: z.coerce.number().min(0).optional(),
  placementStatus: z.enum(['Placed', 'Not Placed', 'Higher Studies', 'Not Interested']).optional(),

  // Additional fields
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().length(6, 'Pincode must be 6 digits').optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']).optional(),
  aadharNumber: z.string().length(12, 'Aadhar must be 12 digits').optional(),
  tenthPercentage: z.coerce.number().min(0).max(100).optional(),
  twelfthPercentage: z.coerce.number().min(0).max(100).optional(),
  entranceRank: z.coerce.number().optional(),
  hostelResident: z.boolean().default(false),
  scholarship: z.boolean().default(false),
  scholarshipType: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function StudentRegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsSubmitting(true);
    try {
      await axios.post('/api/auth/register', data);
      toast.success('Registration successful! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-4">
        <div className="relative w-full max-w-7xl h-[880px] rounded-3xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-xl">

          {/* Left Panel – Hero */}
          <div className="absolute inset-0 w-full lg:w-1/2 h-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 backdrop-blur-3xl flex items-center justify-center px-12 border-r border-white/10">
            <div className="text-white max-w-lg">
              <div className="flex items-center gap-6 mb-12">
                <div className="p-5 bg-white/10 rounded-3xl backdrop-blur border border-white/20">
                  <GraduationCap size={80} />
                </div>
                <div>
                  <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                    Join DropoutGuard
                  </h1>
                  <p className="text-2xl mt-4 opacity-90">Your AI-Powered Academic Guardian</p>
                </div>
              </div>

              <ul className="space-y-8 text-lg font-medium">
                {[
                  'Get real-time dropout risk prediction',
                  'Track your academic performance',
                  'Receive personalized success tips',
                  'Stay ahead with AI insights',
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-5 opacity-0" style={{ animation: 'fadeSlideUp 0.9s ease-out forwards', animationDelay: `${i * 200}ms` }}>
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Panel – Registration Form */}
          <div className="absolute right-0 w-full lg:w-1/2 h-full bg-slate-900/90 backdrop-blur-2xl flex items-center justify-center px-8 lg:px-16 overflow-y-auto">
            <div className="w-full max-w-2xl py-8">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-4xl font-bold text-white flex items-center gap-4">
                  <UserCheck className="text-cyan-400" size={48} />
                  Student Registration
                </h2>
                <a href="/login" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition">
                  <ArrowLeft size={20} />
                  Back to Login
                </a>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Row 1 */}
                  <InputField label="Roll No *" {...register('rollNo')} error={errors.rollNo} />
                  <InputField label="Full Name *" {...register('name')} error={errors.name} />

                  {/* Row 2 */}
                  <InputField label="Email *" type="email" {...register('email')} error={errors.email} />
                  <InputField label="Password *" type="password" {...register('password')} error={errors.password} />

                  {/* Row 3 */}
                  <InputField label="Phone" {...register('phone')} />
                  <InputField label="Department *" {...register('department')} error={errors.department} />

                  {/* Row 4 */}
                  <SelectField label="Semester *" {...register('semester')} error={errors.semester}>
                    {[...Array(8)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}th Semester</option>
                    ))}
                  </SelectField>

                  <SelectField label="Gender *" {...register('gender')} error={errors.gender}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </SelectField>

                  {/* Row 5 */}
                  <SelectField label="Category *" {...register('category')} error={errors.category}>
                    <option>General</option>
                    <option>OBC</option>
                    <option>SC</option>
                    <option>ST</option>
                  </SelectField>

                  <InputField label="Father's Name" {...register('fatherName')} />
                  <InputField label="Mother's Name" {...register('motherName')} />

                  {/* Academic */}
                  <InputField label="CGPA (0-10)" type="number" step="0.01" {...register('cgpa')} />
                  <InputField label="Attendance %" type="number" {...register('attendancePercentage')} />
                  <InputField label="Backlogs" type="number" {...register('backlogs')} />
                  <InputField label="Family Income (₹/year)" type="number" {...register('familyIncome')} />

                  {/* More fields */}
                  <InputField label="Aadhar Number" {...register('aadharNumber')} />
                  <InputField label="10th %" type="number" step="0.01" {...register('tenthPercentage')} />
                  <InputField label="12th %" type="number" step="0.01" {...register('twelfthPercentage')} />
                  <InputField label="Entrance Rank" type="number" {...register('entranceRank')} />

                  {/* Checkboxes */}
                  <div className="flex items-center gap-4">
                    <input type="checkbox" {...register('hostelResident')} className="w-6 h-6 text-cyan-500 rounded bg-white/10 border-white/20" />
                    <label className="text-gray-300">Hostel Resident</label>
                  </div>
                  <div className="flex items-center gap-4">
                    <input type="checkbox" {...register('scholarship')} className="w-6 h-6 text-purple-500 rounded bg-white/10 border-white/20" />
                    <label className="text-gray-300">Receiving Scholarship</label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 rounded-2xl font-bold text-white text-xl shadow-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition-all duration-300 mt-8"
                  style={{ boxShadow: '0 20px 40px -10px rgba(0, 255, 255, 0.4)' }}
                >
                  {isSubmitting ? 'Creating Account...' : 'Register as Student →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable Input Component */}
      {({ label, error, ...props }: any) => (
        <div className="space-y-2">
          <label className="text-sm text-gray-400">{label}</label>
          <input
            {...props}
            className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none backdrop-blur transition-all"
          />
          {error && <p className="text-red-400 text-sm">{error.message}</p>}
        </div>
      )}

      {/* Reusable Select */}
      {({ label, error, children, ...props }: any) => (
        <div className="space-y-2">
          <label className="text-sm text-gray-400">{label}</label>
          <select
            {...props}
            className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white focus:border-cyan-400 focus:outline-none backdrop-blur transition-all"
          >
            <option value="">Select {label}</option>
            {children}
          </select>
          {error && <p className="text-red-400 text-sm">{error.message}</p>}
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />
    </>
  );
}

// Helper Components (for clean code)
function InputField({ label, error, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">{label}</label>
      <input
        {...props}
        className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none backdrop-blur transition-all"
      />
      {error && <p className="text-red-400 text-sm">{error.message}</p>}
    </div>
  );
}

function SelectField({ label, error, children, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">{label}</label>
      <select
        {...props}
        className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white focus:border-cyan-400 focus:outline-none backdrop-blur transition-all"
      >
        <option value="">Select {label}</option>
        {children}
      </select>
      {error && <p className="text-red-400 text-sm">{error.message}</p>}
    </div>
  );
}