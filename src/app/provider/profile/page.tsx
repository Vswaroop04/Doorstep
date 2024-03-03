"use client";
import { AccountForm } from "@/components/Provider/AccountForm";
import { Separator } from "@radix-ui/react-dropdown-menu";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function SettingsAccountPage() {
  const router = useRouter();

  const { auth, setAuth } = useAuth();
  const provider = auth?.provider;
  if (!provider) {
    toast.message("Please Login As Provider");
    setTimeout(() => {
      router.push("/sign-in?as=provider");
    }, 1000);
    return (
      <div className="relative">
        <div className="absolute left-1/2">
          Please Login As A Provider to Continue
        </div>
      </div>
    );
  }

  return (
    <div className="px-36 py-10 ">
      <div className="border p-10">
        <div className="">
          <h3 className="text-lg font-medium">Account</h3>
          <p className="text-sm text-muted-foreground">
            Update your account settings. Set your preferred language and
            timezone.
          </p>
        </div>
        <div className="">
          {provider && <AccountForm provider={provider} />}
        </div>
      </div>
    </div>
  );
}
