export const editProvider = async ({
  offlinePrice,
  onlinePrice,
  offlineDuration,
}: {
  offlinePrice?: number;
  onlinePrice?: number;
  offlineDuration?: number;
}) => {
  const response = await fetch("/api/provider/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ offlinePrice, onlinePrice, offlineDuration }),
  });

  if (!response.ok) {
    throw new Error("Failed to perform search");
  }

  return response.json();
};
