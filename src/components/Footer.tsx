"use client";

import { usePathname } from "next/navigation";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const pathname = usePathname();
  const pathsToMinimize = ["/verify-email", "/sign-up", "/sign-in"];

  return (
    <footer className="bg-white flex-grow-0">
      <div className="border-t  border-gray-200 pt-10">
        {pathsToMinimize.includes(pathname) ? null : (
          <div className="relative pb-8 pt-16 ">
            <div className="flex items-center justify-center mx-auto mb-5 pb-10">
              <p className="text-center font-semibold italic sm:text-sm  lg:text-lg text-gray-600 ">
                &quot;Through streamlined operations and enhanced
                decision-making, we aim to deliver seamless experiences.&quot;
              </p>
              <div className="flex absolute top-1/2 right-20">
                <p className="mt-5">{"~ "}</p>
                <h1 className="py-5 pl-2"> D O O R S T E P</h1>
                <Image src="/Doorstep.png" alt="logo" width="64" height="64" />
              </div>
            </div>
          </div>
        )}

        {pathsToMinimize.includes(pathname) ? null : (
          <div>
            <div className="relative flex items-center px-6 py-6 sm:py-8 lg:mt-0">
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <div
                  aria-hidden="true"
                  className="absolute bg-zinc-50 inset-0 bg-gradient-to-br bg-opacity-90"
                />
              </div>

              <div className="text-center relative mx-auto max-w-sm">
                <h3 className="font-semibold text-gray-900">
                  Become a provider
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  If you&apos;d like to provide high-quality services, you can
                  sign up here.{" "}
                  <Link
                    href="/sign-in?as=provider"
                    className="whitespace-nowrap font-medium text-black hover:text-zinc-900"
                  >
                    Get started &rarr;
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mx-10 py-10 md:flex md:items-center md:justify-between">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>

        <div className="mx-10 mt-4 flex items-center justify-center md:mt-0">
          <div className="flex space-x-8">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-gray-600"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-gray-600"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-gray-600"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
