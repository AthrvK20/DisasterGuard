import supabase from './_supabase.js';

// AI-based risk analysis logic
function analyzeRisk(weather, terrain) {
  const { rainfall_mm = 0, wind_speed_kmh = 0, humidity_percent = 0 } = weather || {};
  const { river_distance_km = 10, elevation_m = 100, soil_moisture = 50 } = terrain || {};
  
  // Flood risk calculation
  let floodScore = 0;
  floodScore += Math.min(rainfall_mm / 5, 30); // Max 30 points from rainfall
  floodScore += Math.max(0, (5 - river_distance_km) * 5); // Max 25 points from river proximity
  floodScore += Math.max(0, (50 - elevation_m) / 2); // Max 25 points from low elevation
  floodScore += humidity_percent > 80 ? 10 : 0; // 10 points for high humidity
  floodScore += wind_speed_kmh > 50 ? 10 : 0; // 10 points for high wind
  
  // Landslide risk calculation
  let landslideScore = 0;
  landslideScore += Math.min(rainfall_mm / 4, 25); // Max 25 points from rainfall
  landslideScore += Math.max(0, (elevation_m - 500) / 50); // Max 25 points from elevation
  landslideScore += Math.min(soil_moisture / 2, 25); // Max 25 points from soil moisture
  landslideScore += wind_speed_kmh > 40 ? 10 : 0; // 10 points for wind
  landslideScore += rainfall_mm > 100 && elevation_m > 500 ? 15 : 0; // 15 bonus for high rain + elevation
  
  // Normalize scores to 0-100
  floodScore = Math.min(100, Math.round(floodScore));
  landslideScore = Math.min(100, Math.round(landslideScore));
  
  // Overall score (weighted average)
  const overallScore = Math.round((floodScore * 0.6 + landslideScore * 0.4));
  
  // Risk level classification
  let riskLevel = 'LOW';
  if (overallScore >= 70) riskLevel = 'HIGH';
  else if (overallScore >= 40) riskLevel = 'MODERATE';
  
  // Flood risk level
  let floodRisk = 'LOW';
  if (floodScore >= 60) floodRisk = 'HIGH';
  else if (floodScore >= 35) floodRisk = 'MODERATE';
  
  // Landslide risk level
  let landslideRisk = 'LOW';
  if (landslideScore >= 60) landslideRisk = 'HIGH';
  else if (landslideScore >= 35) landslideRisk = 'MODERATE';
  
  // Generate AI explanation
  const explanations = [];
  if (rainfall_mm > 150) explanations.push(`Heavy rainfall of ${rainfall_mm}mm`);
  if (river_distance_km < 2) explanations.push(`proximity to water body (${river_distance_km.toFixed(1)}km)`);
  if (elevation_m < 50) explanations.push(`low elevation (${elevation_m}m)`);
  if (soil_moisture > 80) explanations.push(`saturated soil (${soil_moisture}% moisture)`);
  if (wind_speed_kmh > 50) explanations.push(`strong winds (${wind_speed_kmh}km/h)`);
  if (elevation_m > 800 && rainfall_mm > 100) explanations.push(`steep terrain at ${elevation_m}m elevation`);
  
  let aiExplanation = 'Normal conditions with minimal risk factors detected.';
  if (explanations.length > 0) {
    aiExplanation = `${explanations.join(', ')} ${riskLevel === 'HIGH' ? 'creates significant' : 'may cause'} ${floodRisk !== 'LOW' ? 'flooding' : ''} ${floodRisk !== 'LOW' && landslideRisk !== 'LOW' ? 'and' : ''} ${landslideRisk !== 'LOW' ? 'landslide' : ''} risk.`;
  }
  
  // Recommended actions
  let recommendedAction = 'No immediate action required. Stay informed about weather updates.';
  if (riskLevel === 'HIGH') {
    if (floodRisk === 'HIGH') {
      recommendedAction = 'Evacuate low-lying areas immediately. Move to higher ground. Avoid river banks and coastal areas. Follow official evacuation orders.';
    } else if (landslideRisk === 'HIGH') {
      recommendedAction = 'Evacuate hillside homes and avoid mountain roads. Do not travel during rainfall. Seek stable ground away from slopes.';
    } else {
      recommendedAction = 'Stay alert and prepare for possible evacuation. Keep emergency supplies ready. Monitor official channels for updates.';
    }
  } else if (riskLevel === 'MODERATE') {
    recommendedAction = 'Stay alert for changing conditions. Avoid low-lying areas and water bodies. Keep emergency contacts accessible. Monitor weather updates.';
  }
  
  return {
    flood_risk: floodRisk,
    landslide_risk: landslideRisk,
    overall_score: overallScore,
    risk_level: riskLevel,
    rainfall_mm,
    wind_speed_kmh,
    soil_moisture,
    river_distance_km,
    elevation_m,
    recommended_action: recommendedAction,
    ai_explanation: aiExplanation
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const { location_name, latitude, longitude, weather, terrain } = req.body;
      
      // Perform AI analysis
      const analysis = analyzeRisk(weather, terrain);
      
      // Store the analysis result
      const riskZone = {
        location_name,
        latitude,
        longitude,
        ...analysis,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('risk_zones')
        .upsert(riskZone, { onConflict: 'location_name' })
        .select()
        .single();
      
      if (error) {
        // If upsert fails, try insert
        const { data: insertData, error: insertError } = await supabase
          .from('risk_zones')
          .insert(riskZone)
          .select()
          .single();
        if (insertError) throw insertError;
        return res.status(201).json(insertData);
      }
      
      return res.status(200).json(data);
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}