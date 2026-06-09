import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Headphones,
  Building2,
  ChevronDown,
  Send,
  CheckCircle2,
  AlertCircle,
  Shield,
  Smartphone,
  Globe,
} from "lucide-react";

// Data 

const CONTACT_CHANNELS = [
  {
    Icon: Phone,
    label: "Phone Banking",
    value: "1800-123-4567",
    sub: "Toll-free · 24 × 7",
    href: "tel:18001234567",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    badge: "24/7",
    badgeColor:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  },
  {
    Icon: Headphones,
    label: "Customer Care",
    value: "1800-456-7890",
    sub: "Mon – Sat · 9 AM – 6 PM",
    href: "tel:18004567890",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    badge: "Mon–Sat",
    badgeColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  {
    Icon: Mail,
    label: "Email Support",
    value: "support@nexabank.in",
    sub: "Response within 24 hours",
    href: "mailto:support@nexabank.in",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    badge: "24h Reply",
    badgeColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  {
    Icon: MessageSquare,
    label: "Live Chat",
    value: "Chat with us",
    sub: "Available on website & app",
    href: "#chat",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    iconBg: "bg-purple-100 dark:bg-purple-900/40",
    iconColor: "text-purple-600 dark:text-purple-400",
    badge: "Instant",
    badgeColor:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  },
];

const BRANCHES = [
  {
    name: "Mumbai Main Branch",
    address:
      "Bandra Kurla Complex (BKC), Bandra East, Mumbai, Maharashtra - 400051",
    hours: "Mon – Fri: 9:30 AM – 4:30 PM | Sat: 9:30 AM – 1:30 PM",
    phone: "022-4444-5555",
    ifsc: "NEXA0001001",
  },
  {
    name: "Delhi Central Branch",
    address: "Connaught Place, New Delhi, Delhi - 110001",
    hours: "Mon – Fri: 9:30 AM – 4:30 PM | Sat: 9:30 AM – 1:30 PM",
    phone: "011-3333-4444",
    ifsc: "NEXA0001002",
  },
  {
    name: "Hyderabad Main Branch",
    address: "Road No. 12, Banjara Hills, Hyderabad, Telangana - 500034",
    hours: "Mon – Fri: 9:30 AM – 4:30 PM | Sat: 9:30 AM – 1:30 PM",
    phone: "040-2222-3333",
    ifsc: "NEXA0001003",
  },
  {
    name: "Bengaluru Branch",
    address: "MG Road, Ashok Nagar, Bengaluru, Karnataka - 560001",
    hours: "Mon – Fri: 9:30 AM – 4:30 PM | Sat: 9:30 AM – 1:30 PM",
    phone: "080-5555-6666",
    ifsc: "NEXA0001004",
  },
];

const FAQS = [
  {
    q: "How do I report a lost or stolen card?",
    a: "Call our 24×7 helpline 1800-123-4567 immediately to block your card. You can also block it instantly through the NexaBank mobile app under Cards → Block Card.",
  },
  {
    q: "How long does KYC verification take?",
    a: "Digital KYC via video verification is usually completed within 2 business hours. Document-based KYC may take up to 2 working days.",
  },
  {
    q: "What should I do if I notice an unauthorised transaction?",
    a: "Call 1800-123-4567 right away or raise a dispute through the app. Under RBI guidelines, you are not liable for fraud reported within 3 working days.",
  },
  {
    q: "How do I update my registered mobile number?",
    a: "Visit any NexaBank branch with your Aadhaar and a self-attested photo ID. Mobile number updates cannot be done online for security reasons.",
  },
];

const SUBJECT_OPTIONS = [
  "Account Opening",
  "KYC / Document Issues",
  "Loan Enquiry",
  "Credit / Debit Card",
  "Internet / Mobile Banking",
  "Unauthorised Transaction",
  "Fixed Deposit",
  "Other",
];

//  Sub-components 

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4
                   text-left hover:bg-gray-50 dark:hover:bg-gray-800/60
                   transition-colors"
      >
        <span className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 flex-shrink-0 transition-transform duration-200
            ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="px-5 pb-4"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {a}
          </p>
        </motion.div>
      )}
    </div>
  );
}

//  Main Page 

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
    accountType: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFormError("");
  };

  const handleSubmit = async () => {
    const { name, email, mobile, subject, message } = form;
    if (
      !name.trim() ||
      !email.trim() ||
      !mobile.trim() ||
      !subject ||
      !message.trim()
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us — NexaBank</title>
        <meta
          name="description"
          content="Get in touch with NexaBank. Phone banking, email, live chat, branch locator and grievance support."
        />
      </Helmet>

      {/*  Hero header  */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl"
          >
            <span
              className="inline-block px-3 py-1 rounded-full text-[11px] font-bold
                         bg-[#1a3c5e]/8 text-[#1a3c5e] dark:bg-blue-400/10
                         dark:text-blue-400 uppercase tracking-widest mb-3"
            >
              Support & Help
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              How can we help you?
            </h1>
            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
              Our team is here for you 24×7. Reach us via phone, email, live
              chat, or visit your nearest NexaBank branch.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 space-y-12">
          {/*  Contact channels  */}
          <section>
            <h2 className="text-lg font-black text-gray-900 dark:text-white mb-5">
              Reach Us
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CONTACT_CHANNELS.map(
                (
                  {
                    Icon,
                    label,
                    value,
                    sub,
                    href,
                    bg,
                    iconBg,
                    iconColor,
                    badge,
                    badgeColor,
                  },
                  i,
                ) => (
                  <motion.a
                    key={label}
                    href={href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className={`${bg} border border-gray-100 dark:border-gray-800
                                rounded-2xl p-5 flex flex-col gap-3
                                hover:shadow-lg hover:-translate-y-0.5
                                transition-all group cursor-pointer`}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center
                                       justify-center ${iconBg}`}
                      >
                        <Icon size={20} className={iconColor} />
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5
                                      rounded-full ${badgeColor}`}
                      >
                        {badge}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                        {label}
                      </p>
                      <p className="text-sm font-black text-gray-900 dark:text-white group-hover:text-[#1a3c5e] dark:group-hover:text-blue-400 transition-colors">
                        {value}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                    </div>
                  </motion.a>
                ),
              )}
            </div>
          </section>

          {/*  Write to us + Branch info  */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-2xl
                         border border-gray-100 dark:border-gray-800 p-6 lg:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-[#1a3c5e]/10 dark:bg-blue-900/30 flex items-center justify-center">
                  <Send
                    size={18}
                    className="text-[#1a3c5e] dark:text-blue-400"
                  />
                </div>
                <div>
                  <h2 className="text-base font-black text-gray-900 dark:text-white">
                    Write to Us
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    We'll respond within 24 business hours
                  </p>
                </div>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-10 gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900 dark:text-white mb-1">
                      Message Received!
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                      Thank you for reaching out, {form.name.split(" ")[0]}. Our
                      team will get back to you at{" "}
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {form.email}
                      </span>{" "}
                      within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        mobile: "",
                        subject: "",
                        message: "",
                        accountType: "",
                      });
                    }}
                    className="mt-2 px-5 py-2.5 rounded-xl text-sm font-bold
                               bg-[#1a3c5e] text-white hover:bg-[#15304d] transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {/* Row 1: Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Rahul Sharma"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl
                                   border border-gray-200 dark:border-gray-700
                                   bg-white dark:bg-gray-800
                                   text-gray-900 dark:text-white
                                   placeholder:text-gray-400
                                   outline-none focus:ring-2 focus:ring-[#1a3c5e]/25
                                   focus:border-[#1a3c5e] dark:focus:border-blue-400
                                   transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="rahul@email.com"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl
                                   border border-gray-200 dark:border-gray-700
                                   bg-white dark:bg-gray-800
                                   text-gray-900 dark:text-white
                                   placeholder:text-gray-400
                                   outline-none focus:ring-2 focus:ring-[#1a3c5e]/25
                                   focus:border-[#1a3c5e] dark:focus:border-blue-400
                                   transition"
                      />
                    </div>
                  </div>

                  {/* Row 2: Mobile + Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 select-none">
                          +91
                        </span>
                        <input
                          type="tel"
                          name="mobile"
                          value={form.mobile}
                          onChange={handleChange}
                          placeholder="9876543210"
                          maxLength={10}
                          className="w-full pl-11 pr-3.5 py-2.5 text-sm rounded-xl
                                     border border-gray-200 dark:border-gray-700
                                     bg-white dark:bg-gray-800
                                     text-gray-900 dark:text-white
                                     placeholder:text-gray-400
                                     outline-none focus:ring-2 focus:ring-[#1a3c5e]/25
                                     focus:border-[#1a3c5e] dark:focus:border-blue-400
                                     transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl
                                   border border-gray-200 dark:border-gray-700
                                   bg-white dark:bg-gray-800
                                   text-gray-900 dark:text-white
                                   outline-none focus:ring-2 focus:ring-[#1a3c5e]/25
                                   focus:border-[#1a3c5e] dark:focus:border-blue-400
                                   transition"
                      >
                        <option value="">Select a topic…</option>
                        {SUBJECT_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Describe your issue or query in detail…"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl
                                 border border-gray-200 dark:border-gray-700
                                 bg-white dark:bg-gray-800
                                 text-gray-900 dark:text-white
                                 placeholder:text-gray-400
                                 outline-none focus:ring-2 focus:ring-[#1a3c5e]/25
                                 focus:border-[#1a3c5e] dark:focus:border-blue-400
                                 transition resize-none"
                    />
                    <p className="text-right text-[11px] text-gray-400 mt-1">
                      {form.message.length} / 500
                    </p>
                  </div>

                  {/* Error */}
                  {formError && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                      <AlertCircle
                        size={14}
                        className="text-red-500 flex-shrink-0"
                      />
                      <p className="text-xs text-red-700 dark:text-red-400">
                        {formError}
                      </p>
                    </div>
                  )}

                  {/* Privacy note */}
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <Shield
                      size={13}
                      className="text-gray-400 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Your information is encrypted and will only be used to
                      respond to your query. We never share your data with third
                      parties.
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3
                               rounded-xl text-sm font-bold bg-[#1a3c5e] text-white
                               hover:bg-[#15304d] disabled:opacity-60
                               transition-colors shadow-lg shadow-[#1a3c5e]/20"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>

            {/* Right: Hours + Digital channels */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 flex flex-col gap-4"
            >
              {/* Business hours */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Clock
                      size={17}
                      className="text-amber-600 dark:text-amber-400"
                    />
                  </div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white">
                    Branch Hours
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {[
                    { day: "Monday – Friday", time: "9:30 AM – 4:30 PM" },
                    { day: "Saturday", time: "9:30 AM – 1:30 PM" },
                    { day: "Sunday & Holidays", time: "Closed" },
                    { day: "Phone Banking", time: "24 × 7" },
                    { day: "Digital / NetBanking", time: "24 × 7" },
                  ].map(({ day, time }) => (
                    <div
                      key={day}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {day}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          time === "Closed"
                            ? "text-red-500"
                            : time === "24 × 7"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital access channels */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-[#1a3c5e]/10 dark:bg-blue-900/30 flex items-center justify-center">
                    <Globe
                      size={17}
                      className="text-[#1a3c5e] dark:text-blue-400"
                    />
                  </div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white">
                    Digital Banking
                  </h3>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      Icon: Globe,
                      label: "NetBanking",
                      desc: "nexabank.in/login",
                      color:
                        "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
                    },
                    {
                      Icon: Smartphone,
                      label: "Mobile App",
                      desc: "Android & iOS",
                      color:
                        "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
                    },
                    {
                      Icon: MessageSquare,
                      label: "WhatsApp Banking",
                      desc: "Send 'Hi' to 9090909090",
                      color:
                        "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
                    },
                  ].map(({ Icon, label, desc, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center
                                       justify-center flex-shrink-0 ${color}`}
                      >
                        <Icon size={15} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">
                          {label}
                        </p>
                        <p className="text-[11px] text-gray-400">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RBI Ombudsman */}
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-5">
                <p className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-wide mb-1.5">
                  RBI Ombudsman
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300/80 leading-relaxed">
                  If your complaint is not resolved within 30 days, you may
                  escalate to the RBI Banking Ombudsman at{" "}
                  <span className="font-bold">cms.rbi.org.in</span> or call{" "}
                  <span className="font-bold">14448</span>.
                </p>
              </div>
            </motion.div>
          </section>

          {/*  Branch locator */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-[#1a3c5e]/10 dark:bg-blue-900/30 flex items-center justify-center">
                <MapPin
                  size={17}
                  className="text-[#1a3c5e] dark:text-blue-400"
                />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white">
                  Our Branches
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Walk in during branch hours — no appointment needed
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BRANCHES.map((branch, i) => (
                <motion.div
                  key={branch.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border
                             border-gray-100 dark:border-gray-800 p-5"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1a3c5e]/10 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Building2
                        size={16}
                        className="text-[#1a3c5e] dark:text-blue-400"
                      />
                    </div>
                    <p className="text-sm font-black text-gray-900 dark:text-white leading-snug">
                      {branch.name}
                    </p>
                  </div>
                  <div className="space-y-2 pl-0">
                    <div className="flex items-start gap-2">
                      <MapPin
                        size={12}
                        className="text-gray-400 flex-shrink-0 mt-0.5"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {branch.address}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock
                        size={12}
                        className="text-gray-400 flex-shrink-0 mt-0.5"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {branch.hours}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone
                        size={12}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <a
                        href={`tel:${branch.phone}`}
                        className="text-xs font-semibold text-[#1a3c5e] dark:text-blue-400 hover:underline"
                      >
                        {branch.phone}
                      </a>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                        IFSC Code
                      </p>
                      <p className="text-xs font-mono font-bold text-gray-700 dark:text-gray-300">
                        {branch.ifsc}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Open Mon–Sat
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/*  FAQ  */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-[#1a3c5e]/10 dark:bg-blue-900/30 flex items-center justify-center">
                <MessageSquare
                  size={17}
                  className="text-[#1a3c5e] dark:text-blue-400"
                />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Quick answers to common queries
                </p>
              </div>
            </div>
            <div className=" max-w-5xl space-y-4">
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </section>

          {/*  Grievance / Escalation banner  */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-[#1a3c5e] to-[#0d2440]
                         rounded-2xl p-7 lg:p-8 flex flex-col lg:flex-row
                         items-start lg:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Shield size={22} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white mb-1">
                    Grievance Redressal
                  </h3>
                  <p className="text-sm text-blue-200/70 max-w-xl leading-relaxed">
                    Not satisfied with the resolution? Escalate to our Nodal
                    Officer at{" "}
                    <span className="text-white font-semibold">
                      grievance@nexabank.in
                    </span>{" "}
                    or call{" "}
                    <span className="text-amber-400 font-semibold">
                      1800-888-9999
                    </span>
                    . As per RBI guidelines, we resolve all complaints within 30
                    days.
                  </p>
                </div>
              </div>
              <a
                href="mailto:grievance@nexabank.in"
                className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold
                           bg-amber-400 text-gray-900 hover:bg-amber-300
                           transition-colors whitespace-nowrap"
              >
                Email Nodal Officer
              </a>
            </motion.div>
          </section>
        </div>
      </div>
    </>
  );
}
