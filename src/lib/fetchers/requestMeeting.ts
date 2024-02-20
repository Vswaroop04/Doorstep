export const RequestMeeting = async (
  slotId: string
): Promise<Response> => {
  const response = await fetch("/api/user/requestMeeting", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ slotId }),
  });

  const res = await response.json();

  if (!response.ok) {
    throw Error(res?.message || "There Is Some Issue In Approving");
  }
  return res;
};

interface Response {
  message: string;
  onlineSchedule?: OnlineSchedule[];
}

interface OnlineSchedule {
  id: string;
  slotId: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
