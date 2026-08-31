import React, { useState } from 'react';
import { useRequests } from '../../context/RequestContext';
import { ShoppingBag, Search, Clock, Trash2, ExternalLink, CheckCircle, Filter, Sparkles } from 'lucide-react';

export default function AdminInquiriesPage() {
  const { inquiries, updateInquiryStatus, deleteInquiry } = useRequests();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const statusOptions = ['All', 'New Inquiry', 'Contacted', 'Completed'];

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'All' || inq.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Contacted':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-sky-100 text-sky-800 border-sky-300';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#4A607A] uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Product Inquiries Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 font-serif">Product Enquiries</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track when visitors and customers click "Inquire / Order on Instagram" for any product.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200 shrink-0">
          <div className="text-center px-3 border-r border-slate-200">
            <span className="block text-xl font-bold text-slate-800">{inquiries.length}</span>
            <span className="text-[10px] text-slate-500 uppercase font-medium">Total</span>
          </div>
          <div className="text-center px-3">
            <span className="block text-xl font-bold text-sky-600">
              {inquiries.filter((i) => i.status === 'New Inquiry' || !i.status).length}
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-medium">New</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search product or customer..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-400"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                filterStatus === status
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredInquiries.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-semibold text-slate-700">No Product Inquiries Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              When a visitor clicks "Inquire / Order on Instagram" on any product page, it will automatically show up here with product details, customer info, and time!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-4">Customer / Inquirer</th>
                  <th className="py-3.5 px-4">Time & Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredInquiries.map((inq) => {
                  const id = inq.$id || inq.id;
                  return (
                    <tr key={id} className="hover:bg-slate-50/70 transition-colors">
                      
                      {/* Product Thumbnail & Details */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <img
                            src={inq.productImage || '/assets/logo.png'}
                            alt={inq.productName}
                            className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-50"
                          />
                          <div>
                            <span className="font-semibold text-slate-800 block text-sm">
                              {inq.productName}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              Price: ₹{inq.productPrice || '199'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800">
                          {inq.userName || 'Guest Visitor'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {inq.userEmail || 'Not Logged In'}
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-4 text-slate-600 font-mono text-[11px]">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{formatDate(inq.createdAt || inq.$createdAt)}</span>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={inq.status || 'New Inquiry'}
                          onChange={(e) => updateInquiryStatus(id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border focus:outline-none cursor-pointer ${getStatusBadge(
                            inq.status || 'New Inquiry'
                          )}`}
                        >
                          <option value="New Inquiry">New Inquiry</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right space-x-2">
                        <a
                          href="https://instagram.com/aurellecharmsss"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors border border-slate-200"
                          title="Open Instagram DM"
                        >
                          <span>Insta DM</span>
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this inquiry record?')) {
                              deleteInquiry(id);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors inline-block"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
