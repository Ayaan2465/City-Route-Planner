const express = require('express');
const cors = require('cors');
const { buildGraph, buildRailwayPath, calculateShortestPath } = require('./graph');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const roadMap = {
  Delhi: [
    { city: 'Jaipur', distance: 281 },
    { city: 'Agra', distance: 243 },
    { city: 'Lucknow', distance: 555 }
  ],
  Jaipur: [
    { city: 'Delhi', distance: 281 },
    { city: 'Ahmedabad', distance: 657 },
    { city: 'Mumbai', distance: 1140 }
  ],
  Agra: [
    { city: 'Delhi', distance: 243 },
    { city: 'Lucknow', distance: 335 },
    { city: 'Varanasi', distance: 577 }
  ],
  Lucknow: [
    { city: 'Delhi', distance: 555 },
    { city: 'Agra', distance: 335 },
    { city: 'Varanasi', distance: 315 }
  ],
  Varanasi: [
    { city: 'Agra', distance: 577 },
    { city: 'Lucknow', distance: 315 },
    { city: 'Patna', distance: 252 }
  ],
  Ahmedabad: [
    { city: 'Jaipur', distance: 657 },
    { city: 'Mumbai', distance: 530 },
    { city: 'Bhopal', distance: 594 },
    { city: 'Pune', distance: 665 }
  ],
  Mumbai: [
    { city: 'Jaipur', distance: 1140 },
    { city: 'Ahmedabad', distance: 530 },
    { city: 'Bhopal', distance: 774 },
    { city: 'Pune', distance: 150 }
  ],
  Pune: [
    { city: 'Mumbai', distance: 150 },
    { city: 'Ahmedabad', distance: 665 },
    { city: 'Hyderabad', distance: 560 }
  ],
  Bhopal: [
    { city: 'Ahmedabad', distance: 594 },
    { city: 'Mumbai', distance: 774 },
    { city: 'Patna', distance: 950 },
    { city: 'Pune', distance: 650 }
  ],
  Patna: [
    { city: 'Varanasi', distance: 252 },
    { city: 'Bhopal', distance: 950 },
    { city: 'Kolkata', distance: 580 }
  ],
  Kolkata: [
    { city: 'Patna', distance: 580 },
    { city: 'Bengaluru', distance: 1870 }
  ],
  Bengaluru: [
    { city: 'Kolkata', distance: 1870 },
    { city: 'Chennai', distance: 346 }
  ],
  Chennai: [
    { city: 'Bengaluru', distance: 346 },
    { city: 'Hyderabad', distance: 626 }
  ],
  Hyderabad: [
    { city: 'Chennai', distance: 626 },
    { city: 'Bhopal', distance: 850 }
  ]
};

const graph = buildGraph(roadMap);

const cityCoordinates = {
  Delhi: [28.6139, 77.209],
  Jaipur: [26.9124, 75.7873],
  Agra: [27.1767, 78.0081],
  Lucknow: [26.8467, 80.9462],
  Varanasi: [25.3176, 82.9739],
  Ahmedabad: [23.0225, 72.5714],
  Mumbai: [19.076, 72.8777],
  Pune: [18.5204, 73.8567],
  Bhopal: [23.2599, 77.4126],
  Patna: [25.5941, 85.1376],
  Kolkata: [22.5726, 88.3639],
  Bengaluru: [12.9716, 77.5946],
  Chennai: [13.0827, 80.2707],
  Hyderabad: [17.385, 78.4867]
};

// Helper: Haversine direct aerial distance (km)
function calculateHaversineDistance([lat1, lon1], [lat2, lon2]) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Helper: Generates a curved aerial flight corridor arc for Leaflet
function buildFlightArc(from, to, points = 25) {
  const [lat1, lon1] = from;
  const [lat2, lon2] = to;
  const arcOffset = Math.max(0.2, Math.abs(lat2 - lat1) * 0.15 + Math.abs(lon2 - lon1) * 0.1);
  const geometry = [];

  for (let i = 0; i <= points; i++) {
    const fraction = i / points;
    const lat = lat1 + (lat2 - lat1) * fraction;
    const lon = lon1 + (lon2 - lon1) * fraction;
    const curveLat = lat + Math.sin(fraction * Math.PI) * arcOffset;
    geometry.push([curveLat, lon]);
  }

  return geometry;
}

app.get('/api/cities', (req, res) => {
  res.json({ cities: Object.keys(graph) });
});

app.post('/api/shortest-path', (req, res) => {
  const { source, destination } = req.body;

  if (!source || !destination) {
    return res.status(400).json({ message: 'Source and destination are required.' });
  }

  const result = calculateShortestPath(graph, source, destination);

  if (result.distance === Infinity) {
    return res.status(404).json({
      message: `No route found from ${source} to ${destination}.`
    });
  }

  return res.json({
    path: result.path,
    distance: result.distance
  });
});

app.post('/api/routes', async (req, res) => {
  const { source, destination, mode = 'driving' } = req.body;
  const sourceCoordinates = cityCoordinates[source];
  const destinationCoordinates = cityCoordinates[destination];

  if (!sourceCoordinates || !destinationCoordinates) {
    return res.status(400).json({ message: 'Choose valid source and destination cities.' });
  }

  // -------------------------
  // 1. TRAIN MODE (Real Track Coordinates via Junctions)
  // -------------------------
  if (mode === 'train') {
    const trainPath = calculateShortestPath(graph, source, destination);

    if (trainPath.distance === Infinity) {
      return res.status(404).json({ message: `No railway corridor found between ${source} and ${destination}.` });
    }

    const trainDistance = trainPath.distance;
    const trainSpeedKmH = 65; // Average Indian Railways Express speed: ~65 km/h
    const trainDurationSeconds = Math.round((trainDistance / trainSpeedKmH) * 3600);

    return res.json({
      mode,
      routes: [{
        id: 'train-corridor',
        label: `Exact train corridor (${trainPath.path.join(' → ')})`,
        distance: trainDistance,
        duration: trainDurationSeconds,
        geometry: buildRailwayPath(trainPath.path, cityCoordinates)
      }],
      message: 'Railway route mapped through actual Indian Railways junction corridors.'
    });
  }

  // -------------------------
  // 2. FLIGHT MODE (Aerial Arc & Duration)
  // -------------------------
  if (mode === 'flight') {
    const flightDistance = calculateHaversineDistance(sourceCoordinates, destinationCoordinates);
    const flightSpeedKmH = 750; // Jet cruising speed ~750 km/h
    const flightDurationSeconds = Math.round((flightDistance / flightSpeedKmH) * 3600) + 1800; // flight time + 30m taxi

    return res.json({
      mode,
      routes: [{
        id: 'flight-direct',
        label: `Direct aerial flight`,
        distance: flightDistance,
        duration: flightDurationSeconds,
        geometry: buildFlightArc(sourceCoordinates, destinationCoordinates)
      }],
      message: 'Direct flight corridor generated. For live airline schedules, connect to a flight tracking provider.'
    });
  }

  // -------------------------
  // 3. WALKING & DRIVING MODES
  // -------------------------
  try {
    let routes;

    if (mode === 'walking') {
      let walkingRouteFound = false;

      // 1. Try real highway road curves via OSRM
      try {
        const [sourceLat, sourceLon] = sourceCoordinates;
        const [destinationLat, destinationLon] = destinationCoordinates;
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${sourceLon},${sourceLat};${destinationLon},${destinationLat}?overview=full&geometries=geojson&steps=false`;

        const response = await fetch(osrmUrl, {
          headers: {
            'User-Agent': 'CityRoutePlanner/1.0 (educational-project)'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const distanceKm = Number((route.distance / 1000).toFixed(1));
            const walkingSpeedKmH = 5; // Standard 5 km/h walking pace
            const durationSeconds = Math.round((distanceKm / walkingSpeedKmH) * 3600);

            routes = [{
              id: 'walking-road-path',
              label: 'Walking route (via road network)',
              distance: distanceKm,
              duration: durationSeconds,
              geometry: route.geometry.coordinates.map(([lon, lat]) => [lat, lon])
            }];
            walkingRouteFound = true;
          }
        }
      } catch (err) {
        console.warn('OSRM walking routing error:', err.message);
      }

      // 2. Smooth corridor fallback if OSRM is unreachable
      if (!walkingRouteFound) {
        const walkPath = calculateShortestPath(graph, source, destination);
        const distance = walkPath.distance;
        const durationSeconds = Math.round((distance / 5) * 3600);

        routes = [{
          id: 'walking-corridor',
          label: 'Estimated walking route',
          distance: distance,
          duration: durationSeconds,
          geometry: buildRailwayPath(walkPath.path, cityCoordinates)
        }];
      }
    } else {
      // Driving mode (OSRM with alternatives)
      const [sourceLat, sourceLon] = sourceCoordinates;
      const [destinationLat, destinationLon] = destinationCoordinates;
      const url = `https://router.project-osrm.org/route/v1/driving/${sourceLon},${sourceLat};${destinationLon},${destinationLat}?overview=full&geometries=geojson&alternatives=true&steps=false`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'CityRoutePlanner/1.0 (educational-project)'
        }
      });
      const data = await response.json();

      if (!response.ok || data.code !== 'Ok') {
        return res.status(502).json({ message: 'The road routing service is unavailable.' });
      }

      routes = data.routes.map((route, index) => ({
        id: `driving-${index}`,
        label: index === 0 ? 'Fastest driving route' : `Alternative driving route ${index}`,
        distance: Number((route.distance / 1000).toFixed(1)),
        duration: Math.round(route.duration),
        geometry: route.geometry.coordinates.map(([longitude, latitude]) => [latitude, longitude])
      }));
    }

    return res.json({ mode, routes });
  } catch (error) {
    return res.status(502).json({ message: 'Unable to reach the routing service right now.' });
  }
});

function decodeValhallaShape(encodedShape) {
  const coordinates = [];
  let index = 0;
  let latitude = 0;
  let longitude = 0;

  while (index < encodedShape.length) {
    let result = 0;
    let shift = 0;
    let byte;

    do {
      byte = encodedShape.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    latitude += (result & 1) ? ~(result >> 1) : result >> 1;

    result = 0;
    shift = 0;
    do {
      byte = encodedShape.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    longitude += (result & 1) ? ~(result >> 1) : result >> 1;
    coordinates.push([latitude / 1e6, longitude / 1e6]);
  }

  return coordinates;
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});