export const scheduleOfflineMeeting = async (Req: RequestType) => {
  const response = await fetch("/api/provider/scheduleOfflineMeeting", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Req),
  });

  if (!response.ok) {
    let errorMessage = "Failed to perform";
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (error) {
      console.error("Error parsing error response:", error);
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

interface RequestType {
  date: string;
  userId: string;
  offlineSlotTime: string;
  offlineSlotDuration: string;
  priority: number;
}
