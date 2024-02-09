export const searchService = async (searchQuery: string) => {
  const response = await fetch("/api/searchService", {
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
