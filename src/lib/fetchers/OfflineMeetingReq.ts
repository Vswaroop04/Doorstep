export const offlineMeetingReq = async (userId: string) => {
  const response = await fetch("/api/provider/offlineMeetingReq", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  const res = await response.json();

  if (!response.ok) {
    throw Error(res?.message || "There Is Some Issue In Approving");
  }
  return res;
};
