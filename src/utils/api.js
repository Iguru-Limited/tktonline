/**
 * Fetch dynamic report data through Next.js API route (proxy)
 * This avoids CORS issues by making the external API call server-side
 */
export async function fetchDynamicReport({ from, to, date }) {
  try {
    // Call the Next.js API route instead of the external API directly
    const response = await fetch(
      `/api/search-trips?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(15000), // 15 second timeout
      }
    );

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: Failed to fetch data`;
      
      try {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (parseError) {
        console.error("Failed to parse error response:", parseError);
        // Try to get text response instead
        try {
          const textResponse = await response.text();
          console.error("Raw error response:", textResponse);
          errorMessage = textResponse || errorMessage;
        } catch (textError) {
          console.error("Failed to get text response:", textError);
        }
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dynamic report:", error);
    
    // Provide more specific error messages
    if (error.name === 'AbortError') {
      throw new Error("Request timed out. Please try again.");
    } else if (error.message.includes('Failed to fetch')) {
      throw new Error("Network error. Please check your connection and try again.");
    } else {
      throw error;
    }
  }
}

/**
 * Fetch trip details from the backend API through Next.js API route (proxy)
 * This avoids CORS issues by making the external API call server-side
 * @param {number} company_id - The company ID
 * @param {number} trip_id - The trip ID
 * @returns {Promise<Object>} Trip details including seats and vehicle configuration
 */
export async function fetchTripDetails(company_id, trip_id) {
  try {
    // Call the Next.js API route instead of the external API directly
    const response = await fetch(
      `/api/trip-details?company_id=${company_id}&trip_id=${trip_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch trip details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching trip details:", error);
    throw error;
  }
}
