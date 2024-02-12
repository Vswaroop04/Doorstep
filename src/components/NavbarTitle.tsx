"use client";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRightSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { LogOut } from "@/lib/fetchers/Logout";
import { useState } from "react";

const NavbarTitle = () => {
  const { auth, setAuth } = useAuth();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const router = useRouter();
  const logout = async () => {
    await LogOut();
    setAuth({});
    router.push("/");
  };
  return (
    <div>
      {" "}
      <div className="hidden lg:flex lg:justify-end lg:items-center lg:space-x-6">
        {auth?.user || auth?.provider || auth?.admin ? null : (
          <Link
            href={"/sign-in"}
            className={buttonVariants({ variant: "ghost" })}
          >
            {" "}
            Sign In{" "}
          </Link>
        )}

        {auth?.user || auth?.provider || auth?.admin ? null : (
          <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
        )}

        {auth?.user || auth?.provider || auth?.admin ? (
          <p></p>
        ) : (
          <Link
            href={"/sign-up"}
            className={buttonVariants({ variant: "ghost" })}
            aria-hidden="true"
          >
            Create Account
          </Link>
        )}

        {auth ? null : (
          <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
        )}

        {auth?.user || auth?.provider || auth?.admin ? (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger>
              <Avatar className="mr-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="mr-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  {auth.provider ? (
                    <>
                      {" "}
                      <h4 className="font-medium leading-none">
                        Hi {auth?.provider?.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Hope You&apos;re Providing Good Services!
                      </p>
                    </>
                  ) : (
                    <></>
                  )}
                  {auth.user ? (
                    <>
                      {" "}
                      <h4 className="font-medium text-lg leading-none">
                        Hi {auth?.user?.name} !
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Hope You&apos;re Good!
                      </p>
                    </>
                  ) : (
                    <></>
                  )}
                  {auth.admin ? (
                    <>
                      {" "}
                      <h4 className="font-medium leading-none">Hi Admin</h4>
                      <p className="text-sm text-muted-foreground">
                        Hope You&apos;re Good!
                      </p>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="grid gap-2">
                  <div
                    className="grid grid-cols-3 items-center gap-4 border p-3 cursor-pointer"
                    onClick={() => {
                      setPopoverOpen(false);
                      auth?.user && router.push("/user/services");
                      auth?.admin && router.push("/admin");
                      auth?.provider && router.push("/provider/dashboard");
                    }}
                  >
                    {" "}
                    Dashboard{" "}
                  </div>
                  <div
                    className="grid grid-cols-3 items-center border p-3 cursor-pointer"
                    onClick={logout}
                  >
                    {" "}
                    LogOut <ArrowRightSquare />{" "}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <div className="flex lg:ml-6">
            <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarTitle;
