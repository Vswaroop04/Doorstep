export const editSlots = async (slots: number[]) => {
  const response = await fetch("/api/provider/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ slots }),
  });

  if (!response.ok) {
    throw new Error("Failed to perform search");
  }

  return response.json();
};
