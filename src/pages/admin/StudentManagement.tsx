import React, { useState } from 'react';
import { store } from '../../services/store';
import { Search, Shield, User, CheckCircle2, XCircle, Award } from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const enrollments = store.getEnrollments();
  const orders = store.getOrders();

  // Aggregate unique students from orders and enrollments
  const studentsMap = new Map<string, {
    name: string;
    email: string;
    phone: string;
    enrolledCourses: string[];
    totalPaid: number;
    status: string;
  }>();

  orders.forEach((o) => {
    const key = o.customer_email || o.customer_phone;
    const existing = studentsMap.get(key) || {
      name: o.customer_name,
      email: o.customer_email,
      phone: o.customer_phone,
      enrolledCourses: [],
      totalPaid: 0,
      status: 'active',
    };

    if (o.payment_status === 'paid') {
      existing.totalPaid += o.total;
    }
    (o.items || []).forEach((it) => {
      if (!existing.enrolledCourses.includes(it.course_title_snapshot)) {
        existing.enrolledCourses.push(it.course_title_snapshot);
      }
    });

    studentsMap.set(key, existing);
  });

  const studentsList = Array.from(studentsMap.values()).filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DFC27D]/40 pb-4">
        <div>
          <span className="text-xs font-heading font-bold uppercase tracking-widest text-gold">Cadet Registry</span>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-dark">
            STUDENT MANAGEMENT
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-[#DFC27D]/60 shadow-sm">
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student by name, phone or email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-xs focus:border-gold focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#DFC27D]/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-ivory border-b border-gray-200 text-spartan-muted font-heading uppercase tracking-wider">
                <th className="py-3.5 px-4">Cadet Name</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Enrolled Tracks</th>
                <th className="py-3.5 px-4">Invested Total</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {studentsList.map((student, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-dark text-gold flex items-center justify-center font-bold text-xs">
                        {student.name.substring(0, 2).toUpperCase()}
                      </div>
                      <strong className="font-heading font-black uppercase text-dark text-sm">
                        {student.name}
                      </strong>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className="font-mono text-dark block">{student.phone}</span>
                      <span className="text-gray-500 font-mono block text-[11px]">{student.email}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {student.enrolledCourses.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-heading uppercase font-bold text-dark">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-dark text-sm">
                    ${student.totalPaid.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase bg-green-100 text-green-800">
                      Active Cadet
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
