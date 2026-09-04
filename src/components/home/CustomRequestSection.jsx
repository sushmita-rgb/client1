import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles, AlertCircle, Instagram } from 'lucide-react';
import { useRequests } from '../../context/RequestContext';

const INSTAGRAM_URL = 'https://instagram.com/aurellecharmsss';
const EMPTY = { name: '', phone: '', email: '', category: 'Bracelets', request: '', message: '' };

const FIELD =
  'w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EBE3D5] text-sm text-[#2C3E50] ' +
  'placeholder:text-[#7B8794] focus:outline-none focus:border-[#B8D4F0] transition-colors';
const LABEL = 'block text-xs font-semibold tracking-wider text-[#4A607A] uppercase mb-2';

export default function CustomRequestSection() {
  const { submitCustomRequest } = useRequests();
  const [formData, setFormData] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await submitCustomRequest(formData);
      setFormData(EMPTY);
      setIsSuccess(true);
    } catch (err) {
      // The write goes straight to Appwrite; show what it actually said.
      setError(err?.message || 'Failed to send your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="custom-orders" className="py-24 bg-[#EBF3FA] relative overflow-hidden scroll-mt-24">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D0E2F3]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest text-[#4A607A] uppercase bg-white/70 px-4 py-1.5 rounded-full border border-[#B8D4F0]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>BESPOKE CREATIONS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2C3E50] font-normal text-balance">
            MADE JUST FOR YOU
          </h2>
          <p className="text-base text-[#4A607A] font-light leading-relaxed text-pretty">
            Tell us what you have in mind and we&apos;ll come back with a mock-up, a price and a
            timeline &mdash; or just DM us on Instagram{' '}
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="underline font-semibold text-[#2C3E50]">
              @aurellecharmsss
            </a>
            .
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-[#FFFDF9] rounded-2xl p-10 sm:p-14 text-center border border-[#B8D4F0] shadow-soft-lg space-y-5 max-w-xl mx-auto">
            <CheckCircle2 className="w-14 h-14 text-[#6FA3EA] mx-auto" />
            <h3 className="font-serif text-3xl text-[#2C3E50]">Request received</h3>
            <p className="text-sm text-[#4A607A] leading-relaxed">
              Thank you for sharing your idea. We&apos;ll review it and reach out over Instagram DM
              or email, usually within a day.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="text-xs font-semibold tracking-widest uppercase px-8 py-3.5 rounded-full bg-[#4A607A] text-white hover:bg-[#2C3E50] transition-colors"
            >
              Send another request
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
              <div>
                <label htmlFor="cr-name" className={LABEL}>Full name *</label>
                <input
                  id="cr-name" name="name" type="text" required
                  value={formData.name} onChange={handleChange}
                  placeholder="e.g. Ananya Sharma" className={FIELD}
                />
              </div>
              <div>
                <label htmlFor="cr-phone" className={LABEL}>Instagram handle / phone *</label>
                <input
                  id="cr-phone" name="phone" type="text" required
                  value={formData.phone} onChange={handleChange}
                  placeholder="e.g. @your_insta_handle" className={FIELD}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cr-email" className={LABEL}>Email address *</label>
                <input
                  id="cr-email" name="email" type="email" required
                  value={formData.email} onChange={handleChange}
                  placeholder="e.g. ananya@example.com" className={FIELD}
                />
              </div>
              <div>
                <label htmlFor="cr-category" className={LABEL}>Product type *</label>
                <select
                  id="cr-category" name="category"
                  value={formData.category} onChange={handleChange} className={FIELD}
                >
                  <option value="Bracelets">Custom bracelet</option>
                  <option value="Keychains">Custom keychain</option>
                  <option value="Mobile Keychains">Mobile phone charm</option>
                  <option value="Combo Set">Custom gift bundle</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="cr-request" className={LABEL}>Your idea *</label>
              <textarea
                id="cr-request" name="request" rows="3" required
                value={formData.request} onChange={handleChange} className={FIELD}
                placeholder="Colours, bead style, charms, initials, or a theme you'd like."
              />
            </div>

            <div>
              <label htmlFor="cr-message" className={LABEL}>Anything else (optional)</label>
              <input
                id="cr-message" name="message" type="text"
                value={formData.message} onChange={handleChange} className={FIELD}
                placeholder="A date to hit, gift notes, packaging requests…"
              />
            </div>

            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={loading}
                className="group inline-flex items-center text-xs tracking-widest uppercase font-semibold text-white bg-[#4A607A] hover:bg-[#2C3E50] px-10 py-4 rounded-full shadow-soft hover:shadow-soft-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Sending…' : 'Send request'}</span>
                <Send className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1" />
              </button>
              <p className="mt-4 text-xs text-[#4A607A]">
                Prefer to chat?{' '}
                <a
                  href={INSTAGRAM_URL} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 underline font-semibold text-[#2C3E50]"
                >
                  <Instagram className="w-3.5 h-3.5" /> DM @aurellecharmsss
                </a>
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
