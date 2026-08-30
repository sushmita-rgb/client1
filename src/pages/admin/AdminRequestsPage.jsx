import React, { useState } from 'react';
import { useRequests } from '../../context/RequestContext';
import { MessageSquareHeart, Phone, Mail, Clock, CheckCircle } from 'lucide-react';

export default function AdminRequestsPage() {
  const { requests, updateRequestStatus } = useRequests();
  const [filterStatus, setFilterStatus] = useState('All');

  const statusOptions = ['New', 'Contacted', 'In Progress', 'Completed'];

  const filtered = filterStatus === 'All'
    ? requests
    : requests.filter((r) => r.status === filterStatus);

  const handleStatusChange = async (id, newStatus) => {
    await updateRequestStatus(id, newStatus);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl text-slate-800 font-bold">
            Custom Order Requests
          </h1>
          <p className="text-xs text-slate-500">
            Bespoke customer ornament inquiries submitted from the storefront
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500 uppercase">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="All">All Requests</option>
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Requested Category</th>
                <th className="py-3.5 px-6">Customization Request</th>
                <th className="py-3.5 px-4">Submitted Date</th>
                <th className="py-3.5 px-6 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filtered.map((req) => {
                const id = req.$id || req.id;
                return (
                  <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Customer Name */}
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {req.name}
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-4 space-y-1">
                      <div className="flex items-center text-slate-600">
                        <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                        <a href={`https://wa.me/${req.phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:underline font-mono">
                          {req.phone}
                        </a>
                      </div>
                      <div className="flex items-center text-slate-500 text-[11px]">
                        <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                        <span>{req.email}</span>
                      </div>
                    </td>

                    {/* Requested Category */}
                    <td className="py-4 px-4 font-medium text-slate-700">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-md text-[11px] font-semibold">
                        {req.category}
                      </span>
                    </td>

                    {/* Request Details */}
                    <td className="py-4 px-6 max-w-xs space-y-1">
                      <p className="text-slate-800 font-medium leading-relaxed">{req.request}</p>
                      {req.message && (
                        <p className="text-[11px] text-slate-400 italic">Note: "{req.message}"</p>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Today'}
                    </td>

                    {/* Status Select */}
                    <td className="py-4 px-6 text-right">
                      <select
                        value={req.status || 'New'}
                        onChange={(e) => handleStatusChange(id, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border focus:outline-none transition-colors cursor-pointer ${
                          req.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : req.status === 'In Progress'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : req.status === 'Contacted'
                            ? 'bg-purple-50 text-purple-700 border-purple-300'
                            : 'bg-blue-50 text-blue-700 border-blue-300'
                        }`}
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No custom requests found for status "{filterStatus}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
