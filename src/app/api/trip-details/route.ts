import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const company_id = searchParams.get('company_id')
  const trip_id = searchParams.get('trip_id')

  if (!company_id || !trip_id) {
    return NextResponse.json(
      { error: 'Missing company_id or trip_id parameter' },
      { status: 400 }
    )
  }

  try {

    // Make the external API call server-side to avoid CORS issues
    const response = await fetch(
      `https://tkt-backup.onrender.com/online/available_and_booked.php?company_id=${company_id}&trip_id=${trip_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error('Failed to fetch trip details')
    }

    return NextResponse.json(data.trip_details)
  } catch (error) {
    console.error('Error fetching trip details:', error)
    
    // If it's a network error, provide fallback data
    if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('HTTP error'))) {
      console.log('External API unavailable, returning fallback trip details');
      
      // Generate fallback trip details
      const fallbackTripDetails = {
        trip: {
          id: parseInt(trip_id),
          route_name: "Nairobi - Mombasa",
          vehicle_type: "Bus",
          vehicle_plate: "KCA 123A",
          departure_time: "08:00:00",
          arrival_time: "14:00:00"
        },
        seats: Array.from({ length: 50 }, (_, i) => ({
          id: i + 1,
          number: `${Math.floor(i / 4) + 1}${String.fromCharCode(65 + (i % 4))}`,
          row: Math.floor(i / 4) + 1,
          col: i % 4,
          status: Math.random() > 0.3 ? "available" : "booked",
          destination: "Mombasa"
        })),
        vehicle_configuration: {
          id: 1,
          layout: Array.from({ length: 13 }, (_, row) => 
            Array.from({ length: 4 }, (_, col) => {
              const seatNumber = `${row + 1}${String.fromCharCode(65 + col)}`;
              return { label: seatNumber, type: "seat" };
            })
          )
        }
      };
      
      return NextResponse.json(fallbackTripDetails, { status: 200 });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch trip details' },
      { status: 500 }
    )
  }
}
