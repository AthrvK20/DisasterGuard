import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  AlertTriangle, 
  Send, 
  CheckCircle, 
  Loader2,
  Droplets,
  Mountain,
  CloudRain,
  Car,
  TreePine,
  HelpCircle,
  User,
  Mail
} from 'lucide-react';

const incidentTypes = [
  { value: 'Flood', label: 'Flood', icon: Droplets, color: 'text-blue-400' },
  { value: 'Landslide', label: 'Landslide', icon: Mountain, color: 'text-amber-400' },
  { value: 'Heavy Rain', label: 'Heavy Rain', icon: CloudRain, color: 'text-cyan-400' },
  { value: 'Road Block', label: 'Road Block', icon: Car, color: 'text-orange-400' },
  { value: 'Tree Fall', label: 'Tree Fall', icon: TreePine, color: 'text-green-400' },
  { value: 'Other', label: 'Other', icon: HelpCircle, color: 'text-purple-400' }
];

const severityLevels = [
  { value: 'LOW', label: 'Low', description: 'Minor impact, no immediate danger' },
  { value: 'MODERATE', label: 'Moderate', description: 'Significant impact, attention needed' },
  { value: 'HIGH', label: 'High', description: 'Severe impact, urgent response required' }
];

export default function ReportPage() {
  const [formData, setFormData] = useState({
    location_name: '',
    latitude: '',
    longitude: '',
    incident_type: '',
    description: '',
    severity: 'MODERATE',
    reporter_name: '',
    contact_info: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeSelect = (type: string) => {
    setFormData({ ...formData, incident_type: type });
  };

  const handleSeveritySelect = (severity: string) => {
    setFormData({ ...formData, severity });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location_name || !formData.incident_type) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null
        })
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({
          location_name: '',
          latitude: '',
          longitude: '',
          incident_type: '',
          description: '',
          severity: 'MODERATE',
          reporter_name: '',
          contact_info: ''
        });
      } else {
        setError('Failed to submit report. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-orange-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Report an Incident</h1>
        </div>
        <p className="text-slate-400">
          Help improve community awareness by reporting disasters or hazards in your area.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-8 bg-slate-800/50 rounded-2xl border border-slate-700 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Report Submitted!</h2>
            <p className="text-slate-400 mb-6">
              Thank you for your report. Authorities have been notified and will respond accordingly.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubmitted(false)}
              className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
            >
              Submit Another Report
            </motion.button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400"
              >
                {error}
              </motion.div>
            )}

            {/* Location */}
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-400" />
                Location
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-sm text-slate-400 mb-2">
                    Location Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="location_name"
                    value={formData.location_name}
                    onChange={handleChange}
                    placeholder="e.g., Andheri West, Mumbai"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Latitude (optional)</label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="e.g., 19.1364"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Longitude (optional)</label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="e.g., 72.8296"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Incident Type */}
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Incident Type <span className="text-red-400">*</span>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {incidentTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.incident_type === type.value;
                  return (
                    <motion.button
                      key={type.value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTypeSelect(type.value)}
                      className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                        isSelected
                          ? 'bg-orange-500/20 border-orange-500/50'
                          : 'bg-slate-900/50 border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-orange-400' : type.color}`} />
                      <span className={isSelected ? 'text-orange-400 font-medium' : 'text-slate-300'}>
                        {type.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Severity */}
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 space-y-4">
              <h3 className="text-lg font-semibold text-white">Severity Level</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {severityLevels.map((level) => {
                  const isSelected = formData.severity === level.value;
                  return (
                    <motion.button
                      key={level.value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSeveritySelect(level.value)}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        isSelected
                          ? level.value === 'HIGH'
                            ? 'bg-red-500/20 border-red-500/50'
                            : level.value === 'MODERATE'
                            ? 'bg-yellow-500/20 border-yellow-500/50'
                            : 'bg-green-500/20 border-green-500/50'
                          : 'bg-slate-900/50 border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <p className={`font-semibold mb-1 ${
                        isSelected
                          ? level.value === 'HIGH'
                            ? 'text-red-400'
                            : level.value === 'MODERATE'
                            ? 'text-yellow-400'
                            : 'text-green-400'
                          : 'text-white'
                      }`}>
                        {level.label}
                      </p>
                      <p className="text-xs text-slate-400">{level.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 space-y-4">
              <h3 className="text-lg font-semibold text-white">Description</h3>
              
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the incident in detail. Include relevant information like affected areas, number of people impacted, current status, etc."
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 resize-none"
              />
            </div>

            {/* Contact Information */}
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact Information (Optional)</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      name="reporter_name"
                      value={formData.reporter_name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email or Phone</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      name="contact_info"
                      value={formData.contact_info}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Report
                </>
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}