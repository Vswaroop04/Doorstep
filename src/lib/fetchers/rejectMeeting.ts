
export const RejectMeeting = async (
  meetingId: string,
  slotId: string
): Promise<Response> => {
  const response = await fetch("/api/provider/rejectRequest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({meetingId,slotId}),
  });

  const res = await response.json();

  if (!response.ok) {
    throw Error(res?.message || "There Is Some Issue In Approving");
  }
  return res;
};

interface Response {
  message: string;
  rejectedMeeting?: rejectedMeeting[];
}

interface rejectedMeeting {
  id: string;
  slotId: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}