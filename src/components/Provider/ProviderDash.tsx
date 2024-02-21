"use client";

import { GetProviderById } from "@/lib/fetchers/getProviderById";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const ProviderDash = async ({ providerId }: { providerId: string }) => {
  const router = useRouter();
  try {
    const provider = await GetProviderById(providerId);
    if (!provider) {
      toast.error("This provider does not exist");
      router.push("/");
      return <div> Provider Not Found</div>;
    }
  } catch (e) {
    toast.error("Provider Not Found");
    router.push("/");

    return <div> Provider Not Found</div>;
  }
  return <div>ProviderDash</div>;
};
