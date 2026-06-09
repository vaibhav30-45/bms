import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Target,
  Eye,
  ShieldCheck,
  Heart,
  TrendingUp,
  Clock,
} from "lucide-react";

const VALUES = [
  {
    Icon: ShieldCheck,
    title: "Security First",
    desc: "Every transaction protected with 256-bit encryption and JWT authentication.",
  },
  {
    Icon: Heart,
    title: "Customer Centric",
    desc: "We build every feature around what our customers actually need.",
  },
  {
    Icon: TrendingUp,
    title: "Innovation",
    desc: "Continuously improving our platform with the latest banking technology.",
  },
  {
    Icon: Clock,
    title: "Reliability",
    desc: "99.9% uptime SLA ensuring your banking is always available when you need it.",
  },
];

const TEAM = [
  {
    name: "Arun Mehta",
    role: "Chief Executive Officer",
    avatar: "AM",
    color: "bg-blue-500",
  },
  {
    name: "Deepika Rao",
    role: "Chief Technology Officer",
    avatar: "DR",
    color: "bg-purple-500",
  },
  {
    name: "Vikram Singh",
    role: "Chief Financial Officer",
    avatar: "VS",
    color: "bg-emerald-500",
  },
  {
    name: "Pooja Nair",
    role: "Head of Customer Experience",
    avatar: "PN",
    color: "bg-amber-500",
  },
];

export default function AboutPage() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [valRef, valInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [teamRef, teamInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <>
      <Helmet>
        <title>About Us — NexaBank</title>
        <meta
          name="description"
          content="Learn about NexaBank's mission, values and the team building
                       India's most trusted digital banking platform."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Hero */}
      <section
        ref={heroRef}
        className="bg-gradient-to-br from-[#0f2033] via-[#1a3c5e]
                          to-[#0f2033] py-20 sm:py-24 lg:py-32 relative"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs
                             font-bold bg-white/10 text-white/70 uppercase
                             tracking-widest mb-5 sm:mb-6"
            >
              Our Story
            </span>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-black
                           text-white mb-5 sm:mb-6 tracking-tight
                           leading-tight"
            >
              Building India's most trusted
              <span
                className="text-transparent bg-clip-text
                               bg-gradient-to-r from-amber-400 to-amber-200"
              >
                {" "}
                digital bank
              </span>
            </h1>
            <p
              className="text-base sm:text-lg text-blue-100/70
                          max-w-2xl mx-auto leading-relaxed"
            >
              Founded in 2020, NexaBank was born from a simple vision — make
              banking accessible, secure and effortless for every Indian.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-6 sm:h-8 fill-white dark:fill-gray-950"
          >
            <path d="M0,60 C360,0 1080,60 1440,0 L1440,60 Z" />
          </svg>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                Icon: Target,
                label: "Our Mission",
                title: "Democratize banking for every Indian",
                desc: "We believe everyone deserves access to secure, modern banking tools — regardless of location or income. NexaBank bridges the gap between traditional banking and digital innovation.",
                bg: "bg-[#1a3c5e]",
              },
              {
                Icon: Eye,
                label: "Our Vision",
                title: "India's #1 digital banking platform by 2030",
                desc: "To become the most trusted name in digital banking by building products that are secure, intuitive and built around the real needs of Indian customers and businesses.",
                bg: "bg-amber-500",
              },
            ].map(({ Icon, label, title, desc, bg }) => (
              <div
                key={label}
                className="rounded-2xl sm:rounded-3xl p-6 sm:p-8
                              bg-gray-50 dark:bg-gray-900 border
                              border-gray-100 dark:border-gray-800"
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 ${bg} rounded-2xl
                                 flex items-center justify-center mb-4 sm:mb-5`}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <span
                  className="text-xs font-bold uppercase tracking-widest
                                 text-gray-400 mb-2 block"
                >
                  {label}
                </span>
                <h3
                  className="text-lg sm:text-xl font-black text-gray-900
                               dark:text-white mb-3"
                >
                  {title}
                </h3>
                <p
                  className="text-gray-500 dark:text-gray-400 leading-relaxed
                              text-sm"
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        ref={valRef}
        className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2
              className="text-2xl sm:text-3xl font-black text-gray-900
                           dark:text-white mb-4"
            >
              What we stand for
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {VALUES.map(({ Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={valInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6
                           border border-gray-100 dark:border-gray-800
                           text-center"
              >
                <div
                  className="w-11 h-11 rounded-2xl bg-[#1a3c5e]/8
                                dark:bg-blue-400/10 flex items-center
                                justify-center mx-auto mb-4"
                >
                  <Icon
                    size={20}
                    className="text-[#1a3c5e] dark:text-blue-400"
                  />
                </div>
                <h4
                  className="font-bold text-gray-900 dark:text-white mb-2
                               text-sm sm:text-base"
                >
                  {title}
                </h4>
                <p
                  className="text-sm text-gray-500 dark:text-gray-400
                              leading-relaxed"
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section
        ref={teamRef}
        className="py-16 sm:py-20 bg-white dark:bg-gray-950"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2
              className="text-2xl sm:text-3xl font-black text-gray-900
                           dark:text-white mb-3 sm:mb-4"
            >
              Meet the team
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              Experienced professionals from India's top financial institutions.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {TEAM.map(({ name, role, avatar, color }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center bg-gray-50 dark:bg-gray-900
                           rounded-2xl p-4 sm:p-6 border border-gray-100
                           dark:border-gray-800"
              >
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl
                                 sm:rounded-2xl ${color} flex items-center
                                 justify-center text-white text-base sm:text-xl
                                 font-black mx-auto mb-3 sm:mb-4`}
                >
                  {avatar}
                </div>
                <p
                  className="font-bold text-gray-900 dark:text-white
                              text-xs sm:text-sm mb-1"
                >
                  {name}
                </p>
                <p
                  className="text-xs text-gray-500 dark:text-gray-400
                              leading-snug"
                >
                  {role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

