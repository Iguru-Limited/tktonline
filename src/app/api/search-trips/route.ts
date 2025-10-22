import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://tkt-backup.onrender.com/";

export async function GET(request: NextRequest) {
  // Extract query parameters from the URL
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");
  
  try {
    console.log("Search trips API called");
    
    console.log("Parameters:", { from, to, date });

    // Validate required parameters
    if (!from || !to || !date) {
      console.log("Missing required parameters");
      return NextResponse.json(
        { error: "Missing required parameters: from, to, date" },
        { status: 400 }
      );
    }
    
    // Test if we can reach the external API at all
    console.log("Testing external API connectivity...");
    try {
      const testResponse = await fetch(BASE_URL, { 
        method: "GET",
        signal: AbortSignal.timeout(5000) // 5 second timeout for test
      });
      console.log("External API test response:", testResponse.status);
    } catch (testError: unknown) {
      console.log("External API test failed:", testError instanceof Error ? testError.message : 'Unknown error');
    }

    // Construct the external API URL
    const externalUrl = `${BASE_URL}online/search_trips.php?from=${encodeURIComponent(
      from
    )}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`;
    
    console.log("Making request to external API:", externalUrl);

    // Make the request to the external API (server-side, no CORS issues)
    const response = await fetch(externalUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    console.log("External API response status:", response.status, response.statusText);

    if (!response.ok) {
      console.error(`External API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { 
          error: `External API returned ${response.status}: ${response.statusText}`,
          details: "The external trip search service may be temporarily unavailable"
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("External API response:", data);

    // Return the data to the client
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in search-trips API route:", error);
    
    // If it's a network error or timeout, provide fallback data
    if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('fetch'))) {
      console.log("External API unavailable, returning fallback data");
      
      // Return mock data as fallback
      const fallbackData = {
        trips: [
          {
            trip_id: 1,
            company_id: 1,
            company_name: "Easy Coach",
            route_name: `${from} - ${to}`,
            vehicle_type: "Bus",
            departure_time: "08:00:00",
            fare: 1500,
            available_seats: 45
          },
          {
            trip_id: 2,
            company_id: 2,
            company_name: "Modern Coast",
            route_name: `${from} - ${to}`,
            vehicle_type: "Bus",
            departure_time: "10:30:00",
            fare: 1800,
            available_seats: 32
          },
          {
            trip_id: 3,
            company_id: 3,
            company_name: "Guardian Coach",
            route_name: `${from} - ${to}`,
            vehicle_type: "Bus",
            departure_time: "14:15:00",
            fare: 1650,
            available_seats: 28
          }
        ],
        message: "Using fallback data - external API temporarily unavailable"
      };
      
      return NextResponse.json(fallbackData, { status: 200 });
    }
    
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
