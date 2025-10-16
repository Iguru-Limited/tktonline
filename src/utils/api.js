let URL = "https://icollections.onrender.com";

export async function fetchDynamicReport({ signal, queryKey }) {
  const [_key, routeId, company_id, user_id, formattedDate, end_date] =
    queryKey;

  const obj = {
    user_id: user_id,
    company_id: company_id,
    date_from: formattedDate,
    date_to: end_date,
  };

  const userData = Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  );

  try {
    const response = await fetch(
      `${URL}${routeId}?company_id=${company_id}&user_id=${user_id}&start_date=${formattedDate}&end_date=${end_date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch  data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  } finally {
    console.log("fetching done");
  }
}
