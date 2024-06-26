export const offlineMeetingReq = async (
  userId: string,
  offlinePrice: number
) => {
  const response = await fetch("/api/provider/offlineMeetingReq", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, offlinePrice }),
  });

  const res = await response.json();

  if (!response.ok) {
    throw Error(res?.message || "There Is Some Issue In Approving");
  }
  return res;
};
