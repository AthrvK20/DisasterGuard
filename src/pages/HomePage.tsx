import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  MapPin, 
  Shield, 
  Brain, 
  Users, 
  Radio,
  ArrowRight,
  CloudRain,
  Mountain,
  Waves,
  Activity
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced algorithms analyze environmental data to predict disaster risks with high accuracy.'
  },
  {
    icon: MapPin,
    title: 'Location-Based Alerts',
    description: 'Get precise risk assessments for your specific location with real-time monitoring.'
  },
  {
    icon: Shield,
    title: 'Safety Recommendations',
    description: 'Receive actionable safety recommendations tailored to current risk levels.'
  },
  {
    icon: Users,
    title: 'Community Reporting',
    description: 'Report incidents and help improve situational awareness for everyone.'
  }
];

const disasterTypes = [
  { icon: Waves, name: 'Floods', color: 'text-blue-400' },
  { icon: Mountain, name: 'Landslides', color: 'text-amber-400' },
  { icon: CloudRain, name: 'Heavy Rain', color: 'text-cyan-400' },
  { icon: Activity, name: 'Extreme Weather', color: 'text-purple-400' }
];

const steps = [
  { step: 1, title: 'Enter Location', description: 'Input your city or coordinates to check risk levels' },
  { step: 2, title: 'AI Analysis', description: 'Our system analyzes environmental and weather data' },
  { step: 3, title: 'Get Alerts', description: 'Receive risk assessment and safety recommendations' }
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-slate-900" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6">
              <Radio className="w-4 h-4 text-orange-400 animate-pulse" />
              <span className="text-orange-400 text-sm font-medium">Real-Time Monitoring Active</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              AI-Powered Disaster
              <span className="block bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 bg-clip-text text-transparent">
                Early Warning System
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Monitor environmental risks in real-time. Get AI-generated alerts for floods, 
              landslides, and extreme weather. Protect your community with actionable insights.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-shadow"
                >
                  <MapPin className="w-5 h-5" />
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <Link to="/report">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl border border-slate-600 hover:border-orange-500/50 hover:bg-slate-700 transition-all"
                >
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  Report Incident
                </motion.button>
              </Link>
            </div>
          </motion.div>
          
          {/* Disaster Types */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-16 flex flex-wrap justify-center gap-6"
          >
            {disasterTypes.map((type) => (
              <div
                key={type.name}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700"
              >
                <type.icon className={`w-5 h-5 ${type.color}`} />
                <span className="text-slate-300">{type.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Comprehensive Disaster Monitoring
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our system combines real-time data analysis with AI to provide accurate early warnings
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-orange-500/30 transition-all"
              >
                <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl w-fit mb-4">
                  <feature.icon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-400">Three simple steps to stay safe</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-orange-500 to-transparent" style={{ width: 'calc(100% - 4rem)', left: 'calc(50% + 2rem)' }} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500/10 to-red-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Stay Safe?
            </h2>
            <p className="text-slate-300 mb-8">
              Access real-time disaster risk information and help protect your community.
            </p>
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl shadow-lg"
              >
                Check Your Area Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}