import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles, AlertCircle, Instagram } from 'lucide-react';
import { useRequests } from '../../context/RequestContext';

export default function CustomRequestSection() {
  const { submitCustomRequest } = useRequests();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'Bracelets',
    request: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.request) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitCustomRequest(formData);
      setIsSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        category: 'Bracelets',
        request: '',
        message: '',
      });
    } catch (err) {
      setError('Failed to send custom request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="custom-orders" className="py-24 bg-[#EBF3FA] relative overflow-hidden">
      {/* Soft background decor */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D0E2F3]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest text-[#4A607A] uppercase bg-white/70 px-4 py-1.5 rounded-full border border-[#B8D4F0]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>BESPOKE CREATIONS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2C3E50] font-normal">
            MADE JUST FOR YOU
          </h2>
          <p className="text-base text-[#5C728A] font-light leading-relaxed">
            Have something special in mind? Tell us what you'd like and we'll create it for you, or DM us on Instagram <a href="https://instagram.com/aurellecharmsss" target="_blank" rel="noreferrer" className="underline font-semibold text-[#2C3E50]">@aurellecharmsss</a>.
          </p>
        </div>

        {/* Success State Overlay or Form */}
        {isSuccess ? (
          <div className="bg-[#FFFDF9] rounded-2xl p-10 sm:p-14 text-center border border-[#B8D4F0] shadow-soft-lg space-y-6 max-w-xl mx-auto animate-fade-in">
            <CheckCircle2 className="w-16 h-16 text-[#6FA3EA] mx-auto" />
            <h3 className="font-serif text-3xl text-[#2C3E50]">Request Received!</h3>
            <p className="text-sm text-[#5C728A] leading-relaxed">
              Thank you for sharing your design idea with AurelleCharmsss. Our team will review your customization request and reach out to you via Instagram DM or Email within 24 hours.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="text-xs font-semibold tracking-widest uppercase px-8 py-3.5 rounded-full bg-[#4A607A] text-white hover:bg-[#2C3E50] transition-colors"
            >
              SUBMIT ANOTHER REQUEST
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[#FFFDF9] rounded-2xl p-8 sm:p-12 border border-[#B8D4F0] shadow-soft-lg space-y-6"
          >
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold tracking-wider text-[#4A607A] uppercase mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EBE3D5] text-sm text-[#2C3E50] focus:outline-none focus:border-[#B8D4F0] transition-colors"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold tracking-wider text-[#4A607A] uppercase mb-2">
                  Phone Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EBE3D5] text-sm text-[#2C3E50] focus:outline-none focus:border-[#B8D4F0] transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold tracking-wider text-[#4A607A] uppercase mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. ananya@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EBE3D5] text-sm text-[#2C3E50] focus:outline-none focus:border-[#B8D4F0] transition-colors"
                  required
                />
              </div>

              {/* Product Category */}
              <div>
                <label className="block text-xs font-semibold tracking-wider text-[#4A607A] uppercase mb-2">
                  Product Type / Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EBE3D5] text-sm text-[#2C3E50] focus:outline-none focus:border-[#B8D4F0] transition-colors"
                >
                  <option value="Bracelets">Custom Bracelet</option>
                  <option value="Keychains">Custom Keychain</option>
                  <option value="Mobile Keychains">Mobile Phone Charm</option>
                  <option value="Combo Set">Custom Gift Bundle</option>
                </select>
              </div>
            </div>

            {/* Customization Request */}
            <div>
              <label className="block text-xs font-semibold tracking-wider text-[#4A607A] uppercase mb-2">
                Customization Request *
              </label>
              <textarea
                name="request"
                rows="3"
                value={formData.request}
                onChange={handleChange}
                placeholder="Describe your design (colors, bead style, charms, initial letters, or specific theme)..."
                className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EBE3D5] text-sm text-[#2C3E50] focus:outline-none focus:border-[#B8D4F0] transition-colors"
                required
              />
            </div>

            {/* Additional Message */}
            <div>
              <label className="block text-xs font-semibold tracking-wider text-[#4A607A] uppercase mb-2">
                Additional Message (Optional)
              </label>
              <input
                type="text"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Any special date, gift notes, or packaging requirements..."
                className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EBE3D5] text-sm text-[#2C3E50] focus:outline-none focus:border-[#B8D4F0] transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={loading}
                className="group inline-flex items-center text-xs tracking-widest uppercase font-semibold text-white bg-[#4A607A] hover:bg-[#2C3E50] px-10 py-4 rounded-full shadow-soft hover:shadow-soft-lg transition-all duration-300 disabled:opacity-50"
              >
                <span>{loading ? 'SENDING REQUEST...' : 'SEND REQUEST'}</span>
                <Send className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        )}

      </div>
    </section>
  );
}
