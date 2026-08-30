import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { useProducts } from '../../context/ProductContext';
import { Eye, TrendingUp, Layers } from 'lucide-react';

export default function AnalyticsCharts() {
  const { products } = useProducts();

  // Synthetic 7-day views trend data for analytics visualization
  const viewsTrendData = [
    { day: 'Mon', views: 320 },
    { day: 'Tue', views: 410 },
    { day: 'Wed', views: 480 },
    { day: 'Thu', views: 390 },
    { day: 'Fri', views: 540 },
    { day: 'Sat', views: 680 },
    { day: 'Sun', views: 720 },
  ];

  // Views aggregated by category
  const categoryDataMap = products.reduce((acc, p) => {
    const cat = p.category || 'Other';
    acc[cat] = (acc[cat] || 0) + (p.views || 0);
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryDataMap).map(([category, views]) => ({
    category,
    views,
  }));

  // Top 5 Most Viewed Products
  const topViewedProducts = [...products]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const colors = ['#5C728A', '#94BEFA', '#D4AF37', '#6FA3EA', '#E5C158'];

  return (
    <div className="space-y-8">
      
      {/* 2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Views Over Time */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl text-slate-800 font-semibold">
                Product Views Analytics
              </h3>
              <p className="text-xs text-slate-500">Total customer views logged over the past 7 days</p>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#4A607A"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#D4AF37' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Views by Category */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl text-slate-800 font-semibold">
                Views by Category
              </h3>
              <p className="text-xs text-slate-500">Comparison of interest across product types</p>
            </div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="views" radius={[8, 8, 0, 0]}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Top 5 Most Viewed Products Ranking */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl text-slate-800 font-semibold">
              Most Viewed Products
            </h3>
            <p className="text-xs text-[#64748B]">
              Rankings based on total customer page loads & interest
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
            Analytics Counter
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {topViewedProducts.map((prod, idx) => (
            <div key={prod.$id || prod.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="w-6 text-center font-serif text-base font-bold text-slate-400">
                  #{idx + 1}
                </span>
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                />
                <div>
                  <h4 className="font-medium text-sm text-slate-800">{prod.name}</h4>
                  <p className="text-xs text-slate-400">{prod.category} • ₹{prod.price}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs font-semibold text-[#4A607A] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                <Eye className="w-3.5 h-3.5" />
                <span>{prod.views || 0} views</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
