import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  MapPin,
  CheckCircle,
  XCircle,
  Loader2,
  Droplets,
  Mountain,
  Users,
  Activity,
  RefreshCw
} from 'lucide-react';

interface RiskZone {
  id: number;
  location_name: string;
  flood_risk: string;
  landslide_risk: string;
  overall_score: number;
  risk_level: string;
  created_at: string;
}

interface Incident {
  id: number;
  location_name: string;
  incident_type: string;
  description: string;
  severity: string;
  status: string;
  reporter_name: string;
  created_at: string;
}

export default function AdminPage() {
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'zones' | 'incidents'>('zones');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [zonesRes, incidentsRes] = await Promise.all([
        fetch('/api/risk-zones'),
        fetch('/api/incidents')
      ]);
      const zonesData = await zonesRes.json();
      const incidentsData = await incidentsRes.json();
      setRiskZones(zonesData);
      setIncidents(incidentsData);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateIncidentStatus = async (id: number, status: string) => {
    try {
      await fetch('/api/incidents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      fetchData();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'text-red-400 bg-red-500/20';
      case 'MODERATE': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-green-400 bg-green-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-400 bg-green-500/20';
      case 'responding': return 'text-blue-400 bg-blue-500/20';
      case 'verified': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  // Stats
  const highRiskCount = riskZones.filter(z => z.risk_level === 'HIGH').length;
  const pendingIncidents = incidents.filter(i => i.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400">Monitor risk zones and incident reports</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchData}
            className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-slate-800/50 rounded-xl border border-slate-700"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{highRiskCount}</p>
              <p className="text-sm text-slate-400">High Risk Zones</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-slate-800/50 rounded-xl border border-slate-700"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{riskZones.length}</p>
              <p className="text-sm text-slate-400">Total Zones</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-slate-800/50 rounded-xl border border-slate-700"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{pendingIncidents}</p>
              <p className="text-sm text-slate-400">Pending Reports</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-slate-800/50 rounded-xl border border-slate-700"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{incidents.length}</p>
              <p className="text-sm text-slate-400">Total Reports</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('zones')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'zones'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Risk Zones
        </button>
        <button
          onClick={() => setActiveTab('incidents')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'incidents'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Incident Reports
        </button>
      </div>

      {/* Content */}
      {activeTab === 'zones' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Location</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-300">Flood Risk</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-300">Landslide Risk</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-300">Score</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-300">Overall Risk</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {riskZones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        <span className="text-white font-medium">{zone.location_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(zone.flood_risk)}`}>
                        <Droplets className="w-3 h-3" />
                        {zone.flood_risk}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(zone.landslide_risk)}`}>
                        <Mountain className="w-3 h-3" />
                        {zone.landslide_risk}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-white font-bold">{zone.overall_score}%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(zone.risk_level)}`}>
                        {zone.risk_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {formatDate(zone.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Location</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Description</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-300">Severity</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-300">Status</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {incidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        <span className="text-white font-medium">{incident.location_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300">{incident.incident_type}</span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-slate-400 text-sm truncate">{incident.description}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                        {incident.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {incident.status !== 'verified' && (
                          <button
                            onClick={() => updateIncidentStatus(incident.id, 'verified')}
                            className="p-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                            title="Verify"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {incident.status !== 'responding' && (
                          <button
                            onClick={() => updateIncidentStatus(incident.id, 'responding')}
                            className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                            title="Mark Responding"
                          >
                            <Activity className="w-4 h-4" />
                          </button>
                        )}
                        {incident.status !== 'resolved' && (
                          <button
                            onClick={() => updateIncidentStatus(incident.id, 'resolved')}
                            className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                            title="Resolve"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}