import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { getLocalStoreSettings } from '../data/settingsStore';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { toast } from 'react-hot-toast';

export const ContactPage: React.FC = () => {
  const { language } = useTheme();
  const isBn = language === 'bn';
  const settings = getLocalStoreSettings();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      toast.error(isBn ? 'অনুগ্রহ করে সকল আবশ্যকীয় তথ্য পূরণ করুন।' : 'Please fill in all required fields.');
      return;
    }

    setIsSubmitted(true);
    toast.success(
      isBn
        ? 'আপনার বার্তা সফলভাবে গৃহীত হয়েছে! শীঘ্রই আমাদের প্রতিনিধি যোগাযোগ করবেন।'
        : 'Thank you! Your message has been sent successfully. We will get back to you shortly.'
    );
  };

  return (
    <div className="bg-white dark:bg-[#080C14] text-slate-900 dark:text-white transition-colors">
      {/* ── Header ────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-slate-50 dark:bg-[#0B0F19] border-b border-slate-100 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-600/10 dark:bg-[#C5A880]/15 text-blue-600 dark:text-[#C5A880] font-mono">
            {isBn ? 'সরাসরি যোগাযোগ' : 'GET IN TOUCH'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase font-heading">
            {isBn ? 'আমাদের সাথে যোগাযোগ করুন' : 'CONTACT US'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            {isBn
              ? 'অর্ডার সংক্রান্ত যেকোনো প্রশ্ন, সাইজ পরামর্শ বা কাস্টমার সাপোর্টের জন্য আমাদের সাথে নির্দ্বিধায় যোগাযোগ করুন।'
              : 'Have a question about sizing, active orders, or custom streetwear inquiries? We are here to help.'}
          </p>
        </div>
      </section>

      {/* ── Contact Info Cards & Form ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Left Column: Direct Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                {isBn ? 'যোগাযোগের তথ্য' : 'Direct Support Channels'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn ? 'প্রতিদিন সকাল ১০টা থেকে রাত ১০টা পর্যন্ত আমাদের হটলাইন চালু থাকে।' : 'Our support hotline is available 7 days a week, 10:00 AM - 10:00 PM.'}
              </p>
            </div>

            <div className="space-y-4">
              {/* Phone Hotline */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-[#C5A880]/10 flex items-center justify-center text-blue-600 dark:text-[#C5A880] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isBn ? 'সরাসরি ফোন কল' : 'Customer Hotline'}
                  </span>
                  <a
                    href={`tel:${(settings.storePhone || '01700000000').replace(/[^0-9+]/g, '')}`}
                    className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-[#C5A880] font-mono mt-0.5 block"
                  >
                    {settings.storePhone || '+880 1700-000000'}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isBn ? 'ইমেইল সাপোর্ট' : 'Email Us'}
                  </span>
                  <a
                    href={`mailto:${settings.storeEmail || 'support@mensoutfit.com'}`}
                    className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-[#C5A880] font-mono mt-0.5 block"
                  >
                    {settings.storeEmail || 'support@mensoutfit.com'}
                  </a>
                </div>
              </div>

              {/* Showroom Address */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isBn ? 'হেড অফিস ও শোরুম' : 'Showroom & Studio'}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                    {settings.storeAddress || 'ধানমন্ডি, ঢাকা - ১২০৫, বাংলাদেশ'}
                  </p>
                </div>
              </div>

              {/* Support Hours */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isBn ? 'সেবার সময়সূচী' : 'Support Hours'}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                    {settings.supportHours || 'সকাল ১০টা থেকে রাত ১০টা (প্রতিদিন)'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900/50 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isBn ? 'ধন্যবাদ! আপনার বার্তা পাঠানো হয়েছে।' : 'Thank You! Message Received.'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  {isBn
                    ? 'আমাদের কাস্টমার রিলেশনশিপ টিম খুব শীঘ্রই আপনার দেওয়া নম্বরে বা ইমেইলে যোগাযোগ করবে।'
                    : 'Our customer support team will review your inquiry and get back to you shortly.'}
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setName('');
                    setPhone('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="mt-4 px-6 py-2.5 bg-slate-900 text-white dark:bg-[#C5A880] dark:text-black font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer"
                >
                  {isBn ? 'আরেকটি বার্তা পাঠান' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-slate-200 dark:border-white/10 pb-4 mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#C5A880]" />
                    <span>{isBn ? 'সরাসরি মেসেজ পাঠান' : 'Send Us an Instant Inquiry'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {isBn
                      ? 'নিচের ফর্মটি পূরণ করে পাঠান, আমরা দ্রুত রেসপন্স দেব।'
                      : 'Fill out the form below and we will get back to you within 2-4 hours.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      {isBn ? 'আপনার নাম *' : 'Your Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isBn ? 'যেমন: তানভীর আহমেদ' : 'e.g. Tanvir Ahmed'}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      {isBn ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      {isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address (Optional)'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      {isBn ? 'বিষয় (Subject)' : 'Subject'}
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder={isBn ? 'অর্ডার অনুসন্ধান / সাইজ সম্পর্কিত' : 'Order Inquiry / Sizing Help'}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {isBn ? 'আপনার বার্তা বা বিস্তারিত তথ্য *' : 'Your Message / Inquiry *'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      isBn
                        ? 'আপনার বার্তা এখানে লিখুন...'
                        : 'Please write your message here...'
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#C5A880]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="bg-slate-900 dark:bg-[#C5A880] text-white dark:text-black font-bold text-xs uppercase tracking-wider rounded-lg px-8 shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 mr-2" />
                    <span>{isBn ? 'বার্তা পাঠান' : 'SEND MESSAGE'}</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
