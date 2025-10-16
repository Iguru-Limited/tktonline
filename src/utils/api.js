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
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dynamic report:", error);
    throw error;
  }
}
