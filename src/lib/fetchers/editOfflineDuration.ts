export const editOfflineDuration = async (offlineDuration: number) => {
  const response = await fetch("/api/provider/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ offlineDuration }),
  });

  if (!response.ok) {0
    throw new Error("Failed to perform search");
  }

  return response.json();
};
