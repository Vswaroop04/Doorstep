export const feedbackExists = async (Req: RequestType) => {
  const response = await fetch("/api/user/feedbackExists", {
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
  providerId: string;
}
