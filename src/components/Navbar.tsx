import Link from "next/link";
import { Icons } from "./Icons";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { SearchBar } from "@/components/home/SearchBar";

const Navbar = () => {
  const user = null;
  return (
    <div className="sticky inset-x-0 h-16 top-0 z-50 bg-white">
      <header className="relative bg-white">
        <div className="flex items-center h-16">
          <div className="ml-4 flex lg:ml-10">
            <Link href={"/"}>
              <Image src="/Doorstep.png" alt="logo" width="64" height="64" />
            </Link>
            <h1 className="py-5 ">D O O R S T E P</h1>
          </div>
          <div className="ml-auto  flex justify-center items-center">
            <SearchBar />
          </div>
          <div className="ml-auto flex items-center">
            <div className="hidden lg:flex lg:justify-end lg:items-center lg:space-x-6">
              {user ? null : (
                <Link
                  href={"/sign-in"}
                  className={buttonVariants({ variant: "ghost" })}
                >
                  {" "}
                  Sign In{" "}
                </Link>
              )}

              {user ? null : (
                <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
              )}

              {user ? (
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

              {user ? null : (
                <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
              )}

              {user ? null : (
                <div className="flex lg:ml-6">
                  <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
