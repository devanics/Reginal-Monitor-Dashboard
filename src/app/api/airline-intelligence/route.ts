import { NextRequest, NextResponse } from 'next/server';

// AviationStack API Configuration
const API_KEY = process.env.AVIATION_STACK_KEY;
const AIRPORTS = ['RUH', 'DXB', 'DOH', 'JED', 'KWI', 'AUH', 'LHR', 'IST', 'CDG', 'FRA', 'JFK', 'SIN', 'HKG', 'HND', 'AMS'];

async function getAirportOps() {
  // In a real app, we'd fetch from AviationStack or a similar API
  // For now, we simulate the status based on a base risk + occasional delays
  return AIRPORTS.map(code => {
    const isMajor = ['RUH', 'DXB', 'IST', 'LHR'].includes(code);
    const delayBase = isMajor ? 15 : 5;
    const randomDelay = Math.floor(Math.random() * 20);
    const status = (delayBase + randomDelay > 30) ? 'DELAYED' : 'NORMAL';
    
    const names: Record<string, string> = {
      RUH: 'Riyadh King Khalid',
      DXB: 'Dubai International',
      DOH: 'Hamad International',
      JED: 'Jeddah King Abdulaziz',
      KWI: 'Kuwait International',
      AUH: 'Zayed International',
      LHR: 'London Heathrow',
      IST: 'Istanbul Airport',
      CDG: 'Paris Charles de Gaulle',
      FRA: 'Frankfurt Airport',
      JFK: 'New York JFK',
      SIN: 'Singapore Changi',
      HKG: 'Hong Kong International',
      HND: 'Tokyo Haneda',
      AMS: 'Amsterdam Schiphol'
    };

    return {
      iata: code,
      name: names[code] || code,
      status: status,
      severity: status === 'DELAYED' ? 'MODERATE' : 'NORMAL',
      avgDelay: status === 'DELAYED' ? 45 + randomDelay : 0,
      cancelRate: status === 'DELAYED' ? 1.2 : 0,
    };
  });
}

async function getFlights() {
  const flights = [
    { num: 'SV123', route: 'RUH → LHR', time: '14:20', status: 'boarding', delay: 0 },
    { num: 'EK202', route: 'DXB → JFK', time: '15:10', status: 'departed', delay: 15 },
    { num: 'QR001', route: 'DOH → LHR', time: '16:00', status: 'scheduled', delay: 0 },
    { num: 'TK1821', route: 'IST → CDG', time: '16:45', status: 'boarding', delay: 5 },
    { num: 'SV456', route: 'JED → DXB', time: '17:30', status: 'scheduled', delay: 0 },
    { num: 'BA123', route: 'LHR → RUH', time: '18:15', status: 'scheduled', delay: 0 },
  ];
  return flights;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'ops';
  const region = searchParams.get('region');

  try {
    if (type === 'ops') {
      let data = await getAirportOps();
      if (region === 'KSA') {
        const ksaCodes = ['RUH', 'JED', 'DMM', 'MED'];
        data = data.filter(a => ksaCodes.includes(a.iata));
        // Add DMM and MED if not present (simulated)
        if (!data.find(a => a.iata === 'DMM')) {
           data.push({ iata: 'DMM', name: 'Dammam King Fahd', status: 'NORMAL', severity: 'NORMAL', avgDelay: 0, cancelRate: 0 });
        }
        if (!data.find(a => a.iata === 'MED')) {
           data.push({ iata: 'MED', name: 'Madinah Prince Mohammad', status: 'NORMAL', severity: 'NORMAL', avgDelay: 0, cancelRate: 0 });
        }
      }
      return NextResponse.json({ data });
    }
    if (type === 'flights') {
      let data = await getFlights();
      if (region === 'KSA') {
        const ksaCodes = ['RUH', 'JED', 'DMM', 'MED'];
        data = data.filter(f => ksaCodes.some(code => f.route.includes(code)));
      }
      return NextResponse.json({ data });
    }
    
    // Default fallback
    return NextResponse.json({ data: [] });
  } catch (error) {
    console.error('Airline Intel API Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
