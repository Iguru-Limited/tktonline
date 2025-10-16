import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://tkt-backup.onrender.com/";

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters from the URL
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const date = searchParams.get("date");

    // Validate required parameters
    if (!from || !to || !date) {
      return NextResponse.json(
        { error: "Missing required parameters: from, to, date" },
        { status: 400 }
      );
    }

    // Construct the external API URL
    const externalUrl = `${BASE_URL}online/search_trips.php?from=${encodeURIComponent(
      from
    )}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`;

    // Make the request to the external API (server-side, no CORS issues)
    const response = await fetch(externalUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch trips data from external API" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the data to the client
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in search-trips API route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
