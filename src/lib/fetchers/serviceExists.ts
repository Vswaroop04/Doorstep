export const serviceExists = async (searchQuery: string) => {
  const response = await fetch(`${process.env.SERVER_URL}/api/serviceExists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ serviceName: searchQuery }),
  });

  if (!response.ok) {
    throw new Error("Failed to perform search");
  }

  return response.json();
};
