export const getAllServices = async (limit: number) => {
  const response = await fetch("/api/services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ limit }),
  });

  if (!response.ok) {
    throw new Error("Failed to perform search");
  }

  return response.json();
};
