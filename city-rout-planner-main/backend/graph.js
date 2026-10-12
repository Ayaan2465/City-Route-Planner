// Real Indian Railway Junctions & Waypoints for major inter-city rail corridors
const RAILWAY_CORRIDORS = {
  // Delhi - Jaipur Rail Corridor (via Rewari, Alwar, Bandikui)
  'Delhi-Jaipur': [
    [28.6609, 77.2289], // Old Delhi Jn
    [28.6139, 77.2090], // New Delhi
    [28.4682, 77.0326], // Gurgaon
    [28.3541, 76.9038], // Pataudi Road
    [28.1988, 76.6191], // Rewari Jn
    [27.9897, 76.6023], // Bawal
    [27.7842, 76.6215], // Khairthal
    [27.5530, 76.6346], // Alwar Jn
    [27.3512, 76.6120], // Rajgarh
    [27.0504, 76.5744], // Bandikui Jn
    [26.8928, 76.3356], // Dausa
    [26.8851, 75.8016], // Gandhinagar Jaipur
    [26.9196, 75.7878]  // Jaipur Jn
  ],

  // Delhi - Agra Rail Corridor (Main Trunk Line via Mathura)
  'Delhi-Agra': [
    [28.6139, 77.2090], // New Delhi
    [28.4089, 77.3178], // Faridabad
    [28.1487, 77.3320], // Palwal
    [27.8920, 77.5020], // Kosi Kalan
    [27.4924, 77.6737], // Mathura Jn
    [27.2830, 77.8920], // Raja Ki Mandi
    [27.1593, 77.9944]  // Agra Cantt
  ],

  // Delhi - Lucknow Rail Corridor (via Ghaziabad, Moradabad, Bareilly)
  'Delhi-Lucknow': [
    [28.6139, 77.2090], // New Delhi
    [28.6692, 77.4538], // Ghaziabad Jn
    [28.8386, 78.7733], // Moradabad Jn
    [28.3670, 79.4304], // Bareilly Jn
    [27.8805, 79.9130], // Shahjahanpur
    [27.3970, 80.1310], // Hardoi
    [26.8322, 80.9230]  // Lucknow Charbagh
  ],

  // Agra - Lucknow Rail Corridor (via Tundla, Etawah, Kanpur)
  'Agra-Lucknow': [
    [27.1593, 77.9944], // Agra Cantt
    [27.2072, 78.2393], // Tundla Jn
    [26.9450, 78.6820], // Shikohabad
    [26.7769, 79.0305], // Etawah Jn
    [26.4547, 80.3507], // Kanpur Central
    [26.5410, 80.4900], // Unnao Jn
    [26.8322, 80.9230]  // Lucknow Charbagh
  ],

  // Agra - Varanasi Rail Corridor (via Kanpur, Prayagraj)
  'Agra-Varanasi': [
    [27.1593, 77.9944], // Agra Cantt
    [27.2072, 78.2393], // Tundla Jn
    [26.7769, 79.0305], // Etawah Jn
    [26.4547, 80.3507], // Kanpur Central
    [26.0120, 80.8120], // Fatehpur
    [25.4358, 81.8463], // Prayagraj Jn (Allahabad)
    [25.2750, 82.5200], // Mirzapur
    [25.3283, 82.9900]  // Varanasi Jn
  ],

  // Lucknow - Varanasi Rail Corridor (via Sultanpur or Rae Bareli)
  'Lucknow-Varanasi': [
    [26.8322, 80.9230], // Lucknow Charbagh
    [26.2290, 81.2400], // Rae Bareli
    [26.2648, 82.0727], // Sultanpur Jn
    [25.7464, 82.6837], // Jaunpur Jn
    [25.3283, 82.9900]  // Varanasi Jn
  ],

  // Varanasi - Patna Rail Corridor (via Pt. Deen Dayal Upadhyaya / Mughalsarai, Buxar)
  'Varanasi-Patna': [
    [25.3283, 82.9900], // Varanasi Jn
    [25.2797, 83.1186], // Pt. Deen Dayal Upadhyaya Jn (DDU)
    [25.5647, 83.9777], // Buxar
    [25.5560, 84.6603], // Ara Jn
    [25.6093, 85.0760], // Danapur
    [25.6022, 85.1376]  // Patna Jn
  ],

  // Jaipur - Ahmedabad Rail Corridor (via Ajmer, Marwar, Abu Road, Palanpur)
  'Jaipur-Ahmedabad': [
    [26.9196, 75.7878], // Jaipur Jn
    [26.7450, 75.3200], // Phulera Jn
    [26.4499, 74.6399], // Ajmer Jn
    [26.0020, 74.2800], // Beawar
    [25.7290, 73.6120], // Marwar Jn
    [25.1320, 73.0120], // Falna
    [24.4820, 72.7820], // Abu Road
    [24.1720, 72.4320], // Palanpur Jn
    [23.8520, 72.3720], // Mehsana Jn
    [23.0225, 72.5714]  // Ahmedabad Jn (Kalupur)
  ],

  // Mumbai - Ahmedabad Rail Corridor (via Surat, Vadodara)
  'Mumbai-Ahmedabad': [
    [18.9400, 72.8350], // Mumbai CSMT / Central
    [19.2813, 72.8561], // Borivali
    [19.6970, 72.7660], // Palghar
    [20.3700, 72.9050], // Vapi
    [20.6010, 72.9320], // Valsad
    [21.2050, 72.8410], // Surat
    [21.7050, 72.9980], // Bharuch Jn
    [22.3107, 73.1812], // Vadodara Jn
    [22.5645, 72.9289], // Anand Jn
    [22.6916, 72.8634], // Nadiad Jn
    [23.0225, 72.5714]  // Ahmedabad Jn
  ],

  // Mumbai - Pune Rail Corridor (via Thane, Kalyan, Karjat, Lonavala Ghats)
  'Mumbai-Pune': [
    [18.9400, 72.8350], // Mumbai CSMT
    [19.0600, 72.8900], // Dadar
    [19.1860, 72.9760], // Thane
    [19.2437, 73.1355], // Kalyan Jn
    [18.9100, 73.3270], // Karjat Jn
    [18.8200, 73.3600], // Bhor Ghat (Palasdari to Monkey Hill)
    [18.7600, 73.4000], // Khandala
    [18.7547, 73.4062], // Lonavala
    [18.7200, 73.6800], // Talegaon
    [18.6275, 73.8131], // Chinchwad
    [18.5284, 73.8744]  // Pune Jn
  ],

  // Pune - Hyderabad Rail Corridor (via Daund, Solapur, Wadi)
  'Pune-Hyderabad': [
    [18.5284, 73.8744], // Pune Jn
    [18.4650, 74.5820], // Daund Jn
    [18.1880, 75.3370], // Kurduvadi Jn
    [17.6599, 75.9064], // Solapur
    [17.0500, 76.9900], // Wadi Jn
    [17.3400, 77.9000], // Vikarabad Jn
    [17.3984, 78.4734]  // Hyderabad Deccan (Nampally) / Secunderabad
  ],

  // Ahmedabad - Bhopal Rail Corridor (via Vadodara, Ratlam, Ujjain)
  'Ahmedabad-Bhopal': [
    [23.0225, 72.5714], // Ahmedabad
    [22.5645, 72.9289], // Anand Jn
    [22.3107, 73.1812], // Vadodara Jn
    [22.7500, 73.6100], // Godhra Jn
    [22.8400, 74.2500], // Dahod
    [23.3315, 75.0367], // Ratlam Jn
    [23.4000, 75.4200], // Nagda Jn
    [23.1765, 75.7885], // Ujjain Jn
    [23.2000, 76.8500], // Sehore
    [23.2660, 77.4126]  // Bhopal Jn
  ],

  // Bhopal - Mumbai Rail Corridor (via Itarsi, Khandwa, Bhusawal, Manmad, Nashik)
  'Bhopal-Mumbai': [
    [23.2660, 77.4126], // Bhopal Jn
    [22.9900, 77.5700], // Hoshangabad
    [22.6100, 77.7600], // Itarsi Jn
    [21.8200, 76.3500], // Khandwa Jn
    [21.0500, 75.7800], // Bhusawal Jn
    [20.9000, 75.3500], // Jalgaon Jn
    [20.2500, 74.4500], // Manmad Jn
    [19.9975, 73.7898], // Nashik Road
    [19.6980, 73.5400], // Igatpuri (Thal Ghat)
    [19.2437, 73.1355], // Kalyan Jn
    [18.9400, 72.8350]  // Mumbai CSMT
  ],

  // Bhopal - Pune Rail Corridor (via Itarsi, Bhusawal, Manmad, Daund chord)
  'Bhopal-Pune': [
    [23.2660, 77.4126], // Bhopal Jn
    [22.6100, 77.7600], // Itarsi Jn
    [21.0500, 75.7800], // Bhusawal Jn
    [20.2500, 74.4500], // Manmad Jn
    [19.5500, 74.4800], // Kopargaon
    [19.0900, 74.7400], // Ahmednagar
    [18.4650, 74.5820], // Daund Jn
    [18.5284, 73.8744]  // Pune Jn
  ],

  // Bengaluru - Chennai Rail Corridor (via Bangarapet, Jolarpettai, Katpadi)
  'Bengaluru-Chennai': [
    [12.9784, 77.5684], // KSR Bengaluru (City)
    [12.9934, 77.6534], // KR Puram
    [12.9900, 78.2000], // Bangarapet
    [12.5700, 78.5800], // Jolarpettai Jn
    [12.9700, 79.1300], // Katpadi Jn (Vellore)
    [13.0800, 79.6700], // Arakkonam Jn
    [13.0827, 80.2750]  // Chennai Central (MAS)
  ],

  // Chennai - Hyderabad Rail Corridor (via Gudur, Nellore, Ongole, Guntur)
  'Chennai-Hyderabad': [
    [13.0827, 80.2750], // Chennai Central
    [13.5600, 80.0300], // Sullurupeta
    [14.1500, 79.8500], // Gudur Jn
    [14.4400, 79.9800], // Nellore
    [15.5000, 80.0500], // Ongole
    [15.8200, 80.3500], // Bapatla
    [16.1800, 80.6200], // Tenali Jn
    [16.5100, 80.6400], // Vijayawada Jn
    [16.7800, 80.1200], // Khammam
    [17.3850, 78.4867]  // Secunderabad / Hyderabad
  ]
};

function buildGraph(roads) {
  const graph = {};

  for (const city in roads) {
    if (!graph[city]) graph[city] = [];

    for (const road of roads[city]) {
      graph[city].push({
        city: road.city,
        distance: Number(road.distance)
      });

      // Ensure reverse connectivity
      if (!graph[road.city]) graph[road.city] = [];
      if (!graph[road.city].some((edge) => edge.city === city)) {
        graph[road.city].push({
          city: city,
          distance: Number(road.distance)
        });
      }
    }
  }

  return graph;
}

// Generates real track coordinates through real junction waypoints
function buildRailwayPath(path, cityCoordinates) {
  if (!Array.isArray(path) || path.length < 2) {
    return path.map((city) => cityCoordinates[city]).filter(Boolean);
  }

  const geometry = [];

  for (let index = 0; index < path.length - 1; index += 1) {
    const fromCity = path[index];
    const toCity = path[index + 1];

    const forwardKey = `${fromCity}-${toCity}`;
    const reverseKey = `${toCity}-${fromCity}`;

    let segmentCoords = null;

    if (RAILWAY_CORRIDORS[forwardKey]) {
      segmentCoords = [...RAILWAY_CORRIDORS[forwardKey]];
    } else if (RAILWAY_CORRIDORS[reverseKey]) {
      segmentCoords = [...RAILWAY_CORRIDORS[reverseKey]].reverse();
    }

    if (segmentCoords) {
      if (index > 0) segmentCoords.shift(); // Avoid repeating endpoint
      geometry.push(...segmentCoords);
    } else {
      // Fallback: connect city coordinates with slight midpoint curve if corridor not mapped
      const fromCoord = cityCoordinates[fromCity];
      const toCoord = cityCoordinates[toCity];
      if (fromCoord && toCoord) {
        if (index === 0) geometry.push(fromCoord);
        geometry.push(toCoord);
      }
    }
  }

  return geometry;
}

function calculateShortestPath(graph, source, destination) {
  if (!graph[source] || !graph[destination]) {
    return { path: [], distance: Infinity };
  }

  const shortestDistance = {};
  const previousCity = {};
  const unvisitedCities = [];

  for (const city in graph) {
    shortestDistance[city] = Infinity;
  }

  shortestDistance[source] = 0;
  unvisitedCities.push({ city: source, distance: 0 });

  while (unvisitedCities.length > 0) {
    unvisitedCities.sort((a, b) => a.distance - b.distance);
    const current = unvisitedCities.shift();

    if (current.distance > shortestDistance[current.city]) {
      continue;
    }

    for (const road of graph[current.city]) {
      const newDistance = current.distance + road.distance;

      if (newDistance < (shortestDistance[road.city] ?? Infinity)) {
        shortestDistance[road.city] = newDistance;
        previousCity[road.city] = current.city;
        unvisitedCities.push({ city: road.city, distance: newDistance });
      }
    }
  }

  if (shortestDistance[destination] === Infinity) {
    return { path: [], distance: Infinity };
  }

  const path = [];
  let currentCity = destination;

  while (currentCity) {
    path.unshift(currentCity);
    currentCity = previousCity[currentCity];
  }

  return {
    path,
    distance: shortestDistance[destination]
  };
}

module.exports = {
  buildGraph,
  buildRailwayPath,
  calculateShortestPath
};