import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  AlertTriangle, 
  Droplets, 
  Mountain, 
  Wind,
  Thermometer,
  Gauge,
  Eye,
  Loader2,
  Info,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface RiskZone {
  id: number;
  location_name: string;
  latitude: number;
  longitude: number;
  flood_risk: string;
  landslide_risk: string;
  overall_score: number;
  risk_level: string;
  rainfall_mm: number;
  wind_speed_kmh: number;
  soil_moisture: number;
  river_distance_km: number;
  elevation_m: number;
  recommended_action: string;
  ai_explanation: string;
}

export default function DashboardPage() {
  const [location, setLocation] = useState('');
  const [selectedZone, setSelectedZone] = useState<RiskZone | null>(null);
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchRiskZones();
  }, []);

  const fetchRiskZones = async () => {
    try {
      const res = await fetch('/api/risk-zones');
      const data = await res.json();
      setRiskZones(data);
      if (data.length > 0) {
        setSelectedZone(data[0]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!location.trim()) return;
    
    setAnalyzing(true);
    try {
      // Search existing zones first
      const res = await fetch(`/api/risk-zones?location=${encodeURIComponent(location)}`);
      const data = await res.json();
      
      if (data.length > 0) {
        setSelectedZone(data[0]);
      } else {
        // Generate new analysis
        const weatherData = {
          rainfall_mm: Math.random() * 200 + 20,
          wind_speed_kmh: Math.random() * 60 + 10,
          humidity_percent: Math.random() * 40 + 50
        };
        
        const terrainData = {
          river_distance_km: Math.random() * 10,
          elevation_m: Math.random() * 1500,
          soil_moisture: Math.random() * 50 + 30
        };
        
        const analyzeRes = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location_name: location,
            latitude: 20 + Math.random() * 10,
            longitude: 75 + Math.random() * 10,
            weather: weatherData,
            terrain: terrainData
          })
        });
        
        const newZone = await analyzeRes.json();
        setSelectedZone(newZone);
        fetchRiskZones();
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'text-red-400';
      case 'MODERATE': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'bg-red-500/20 border-red-500/30';
      case 'MODERATE': return 'bg-yellow-500/20 border-yellow-500/30';
      default: return 'bg-green-500/20 border-green-500/30';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'HIGH': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'MODERATE': return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default: return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Alert Banner */}
      {selectedZone?.risk_level === 'HIGH' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3"
        >
          <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
          <div>
            <p className="text-red-400 font-semibold">⚠ High Risk Alert</p>
            <p className="text-red-300 text-sm">Elevated disaster risk detected in {selectedZone.location_name}</p>
          </div>
        </motion.div>
      )}

      {/* Location Search */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter city or location name..."
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            disabled={analyzing}
            className="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {analyzing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            {analyzing ? 'Analyzing...' : 'Check Risk'}
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Risk Status */}
        <div className="lg:col-span-2 space-y-6">
          {selectedZone && (
            <>
              {/* Risk Status Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-orange-400" />
                    <h2 className="text-xl font-bold text-white">{selectedZone.location_name}</h2>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getRiskBgColor(selectedZone.risk_level)}`}>
                    {getRiskIcon(selectedZone.risk_level)}
                    <span className={`font-semibold ${getRiskColor(selectedZone.risk_level)}`}>
                      {selectedZone.risk_level} RISK
                    </span>
                  </div>
                </div>

                {/* Risk Scores */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className={`p-4 rounded-xl border ${getRiskBgColor(selectedZone.flood_risk)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-5 h-5 text-blue-400" />
                      <span className="text-slate-400">Flood Risk</span>
                    </div>
                    <p className={`text-2xl font-bold ${getRiskColor(selectedZone.flood_risk)}`}>
                      {selectedZone.flood_risk}
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-xl border ${getRiskBgColor(selectedZone.landslide_risk)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Mountain className="w-5 h-5 text-amber-400" />
                      <span className="text-slate-400">Landslide Risk</span>
                    </div>
                    <p className={`text-2xl font-bold ${getRiskColor(selectedZone.landslide_risk)}`}>
                      {selectedZone.landslide_risk}
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-xl border ${getRiskBgColor(selectedZone.risk_level)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="w-5 h-5 text-purple-400" />
                      <span className="text-slate-400">Overall Score</span>
                    </div>
                    <p className={`text-2xl font-bold ${getRiskColor(selectedZone.risk_level)}`}>
                      {selectedZone.overall_score}%
                    </p>
                  </div>
                </div>

                {/* Environmental Data */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <span className="text-slate-400">Rainfall:</span>
                    <span className="text-white font-medium">{selectedZone.rainfall_mm?.toFixed(1)}mm</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Wind className="w-4 h-4 text-teal-400" />
                    <span className="text-slate-400">Wind:</span>
                    <span className="text-white font-medium">{selectedZone.wind_speed_kmh?.toFixed(0)}km/h</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Thermometer className="w-4 h-4 text-orange-400" />
                    <span className="text-slate-400">Elevation:</span>
                    <span className="text-white font-medium">{selectedZone.elevation_m?.toFixed(0)}m</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-400">River:</span>
                    <span className="text-white font-medium">{selectedZone.river_distance_km?.toFixed(1)}km</span>
                  </div>
                </div>
              </motion.div>

              {/* Recommended Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700"
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-semibold text-white">Recommended Action</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {selectedZone.recommended_action}
                </p>
              </motion.div>

              {/* AI Explanation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl border border-orange-500/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {selectedZone.ai_explanation}
                </p>
              </motion.div>
            </>
          )}
        </div>

        {/* Right Column - Map & Zones List */}
        <div className="space-y-6">
          {/* Map Visualization */}
          <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-400" />
              Risk Zone Map
            </h3>
            <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden relative">
              {/* Simple map visualization */}
              <div className="absolute inset-0 p-4">
                <div className="relative w-full h-full">
                  {riskZones.map((zone, index) => {
                    const x = ((zone.longitude - 70) / 25) * 100;
                    const y = ((35 - zone.latitude) / 20) * 100;
                    const size = Math.max(20, zone.overall_score / 3);
                    
                    return (
                      <motion.div
                        key={zone.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedZone(zone)}
                        className={`absolute rounded-full cursor-pointer transition-all hover:scale-110 ${
                          zone.risk_level === 'HIGH' 
                            ? 'bg-red-500/40 border-2 border-red-400' 
                            : zone.risk_level === 'MODERATE'
                            ? 'bg-yellow-500/40 border-2 border-yellow-400'
                            : 'bg-green-500/40 border-2 border-green-400'
                        }`}
                        style={{
                          left: `${Math.min(90, Math.max(5, x))}%`,
                          top: `${Math.min(90, Math.max(5, y))}%`,
                          width: `${size}px`,
                          height: `${size}px`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        title={zone.location_name}
                      />
                    );
                  })}
                  
                  {/* Legend */}
                  <div className="absolute bottom-2 left-2 flex flex-col gap-1 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-slate-400">High Risk</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-slate-400">Moderate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-slate-400">Low Risk</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Zones List */}
          <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Monitored Locations</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {riskZones.map((zone) => (
                <motion.button
                  key={zone.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedZone(zone)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedZone?.id === zone.id
                      ? 'bg-orange-500/20 border border-orange-500/30'
                      : 'bg-slate-700/30 hover:bg-slate-700/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium truncate">{zone.location_name}</span>
                    <span className={`text-sm font-semibold ${getRiskColor(zone.risk_level)}`}>
                      {zone.overall_score}%
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}