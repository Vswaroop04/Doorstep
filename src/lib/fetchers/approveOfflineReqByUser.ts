export const ApproveOfflineMeeting = async (id: string, status: string) => {
  const response = await fetch("/api/user/acceptOfflineReq", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, status }),
  });

  const res = await response.json();

  if (!response.ok) {
    throw Error(res?.message || "There Is Some Issue In Approving");
  }
  return res;
};
