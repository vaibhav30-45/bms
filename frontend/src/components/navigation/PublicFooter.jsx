import { Link } from "react-router-dom";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Shield,
  Lock,
  Award,
} from "lucide-react";

const LINKS = {
  Company: [
    { to: "/about", label: "About Us" },
    { to: "/services", label: "Services" },
    { to: "/", label: "Home" },
  ],
  Banking: [
    { to: "/services", label: "Savings Account" },
    { to: "/services", label: "Current Account" },
    { to: "/services", label: "Fund Transfer" },
    { to: "/services", label: "KYC Verification" },
  ],
  Account: [
    { to: "/login", label: "Sign In" },
    { to: "/register", label: "Open Account" },
    { to: "/admin/login", label: "Admin Portal" },
  ],
};


const TRUST = [
  { Icon: Shield, text: "Bank Grade Security" },
  { Icon: Lock, text: "256-bit Encryption" },
  { Icon: Award, text: "RBI Compliant" },
];

export default function PublicFooter() {
  return (
    <footer className="bg-[#0f2033] text-gray-300">
      {/* Trust bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div
            className="flex flex-wrap items-center justify-center
                          gap-4 sm:gap-8 md:gap-12"
          >
            {TRUST.map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon size={15} className="text-amber-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-300">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand col — full width on mobile, 2 cols on lg */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-xl bg-[#1a3c5e] flex items-center
                              justify-center shadow-md flex-shrink-0"
              >
                <Building2 size={20} className="text-white" />
              </div>
              <div>
                <p className="text-base font-black text-white tracking-tight">
                  NexaBank
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                  Management System
                </p>
              </div>
            </div>

            <p
              className="text-sm text-gray-400 leading-relaxed mb-5
                          max-w-xs"
            >
              Your trusted digital banking partner. Secure, fast and reliable
              banking solutions built for modern India.
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-2.5 mb-5">
              {[
                { Icon: Phone, text: "+91 1800 123 4567" },
                { Icon: Mail, text: "support@nexabank.in" },
                { Icon: MapPin, text: "Mumbai, Maharashtra, India" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-start gap-2.5">
                  <Icon
                    size={14}
                    className="text-amber-400 flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-gray-400">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link cols — 3 cols on mobile (compact), individual on lg */}
          <div
            className="sm:col-span-2 lg:col-span-3
                          grid grid-cols-3 gap-4 sm:gap-6"
          >
            {Object.entries(LINKS).map(([heading, items]) => (
              <div key={heading}>
                <h4
                  className="text-white font-bold text-xs sm:text-sm
                               mb-3 sm:mb-4 uppercase tracking-wider"
                >
                  {heading}
                </h4>
                <ul className="flex flex-col gap-2 sm:gap-2.5">
                  {items.map(({ to, label }) => (
                    <li key={label}>
                      <Link
                        to={to}
                        className="text-xs sm:text-sm text-gray-400
                                   hover:text-white transition-colors
                                   hover:translate-x-0.5 inline-block
                                   duration-200 leading-relaxed"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5
                        flex flex-col sm:flex-row items-center
                        justify-between gap-3 text-center sm:text-left"
        >
          <p className="text-xs text-gray-500 order-2 sm:order-1">
            © {new Date().getFullYear()} NexaBank. All rights reserved. NexaBank
            is regulated by RBI under Banking Regulation Act, 1949.
          </p>
          <div
            className="flex flex-wrap items-center justify-center
                          gap-3 sm:gap-4 order-1 sm:order-2"
          >
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (t) => (
                <a
                  key={t}
                  href="#"
                  className="text-xs text-gray-500 hover:text-gray-300
                            transition-colors whitespace-nowrap"
                >
                  {t}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
