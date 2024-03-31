"use client";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const params = useSearchParams();
  const sessionFee: any = params.get("price");
  const taxa = sessionFee * 0.15; // 15% tax
  const taxb = sessionFee * 0.12; // 12% tax
  const tax1 = taxa.toFixed(2); // 15% tax
  const tax2 = taxb.toFixed(2); // 15% tax
  const roundedTotalCharge = parseFloat(sessionFee) + taxa + taxb; // Total charge
  const totalCharge = roundedTotalCharge.toFixed(2); // Round total charge to 2 decimal places

  const [isCardSelected, setIsCardSelected] = useState(true);
  const [isPaymentDone, setisPaymentDone] = useState(false);

  const handleCardClick = () => {
    setIsCardSelected(true);
  };

  const handlePaypalClick = () => {
    setIsCardSelected(false);
  };

  return (
    <section className="antialiased bg-gray-100 text-gray-600 min-h-screen p-4">
      {isPaymentDone ? (
        <div className="mt-50">
          {" "}
          <div className="flex flex-col items-center justify-center text-green-500 ">
            <CheckCircle size={64} />
            <p className="text-lg font-semibold mt-4">Payment Successful</p>
          </div>
        </div>
      ) : (
        <div className="h-full">
          <h1 className="text-xl leading-snug text-gray-800 font-semibold mb-2 pt-8 flex justify-center">
            Payment Details
          </h1>
          <div
            className="relative px-4 sm:px-6 lg:px-8 pb-8 max-w-xl   mx-auto"
            x-data="{ card: true }"
          >
            <div className="bg-white px-8 pb-6 rounded-b shadow-lg">
              <div className="text-center mb-6">
                <h1 className="text-lg underline leading-snug text-gray-800 font-semibold mb-2 pt-8  ml-8">
                  Price Summary
                </h1>
                <div className="relative px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
                  <div className="mb-4 pt-4">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                      <div className="text-md text-left">
                        <p>
                          <span className="font-bold ">Session Fee:</span>
                        </p>
                        <p>
                          <span className="font-bold">Tax (15%):</span>
                        </p>
                        <p>
                          <span className="font-bold">
                            Service Charge (12%):
                          </span>
                        </p>
                      </div>
                      <div className="text-md text-right">
                        <p>${sessionFee}</p>
                        <p>${tax1}</p>
                        <p>${tax2}</p>
                      </div>
                    </div>
                    <hr className="mt-4" />
                    <div className="flex justify-end text-md">
                      <p className="font-bold">Total Charge:</p>
                      <p className="ml-2">${totalCharge}</p>
                    </div>
                  </div>
                </div>
                <div className="text-sm">
                  Please select your preferred payment method.
                </div>
              </div>
              <div className="flex justify-center mb-6">
                <div className="relative flex w-full p-1 bg-gray-50 rounded">
                  <span
                    className="absolute inset-0 m-1 pointer-events-none"
                    aria-hidden="true"
                  >
                    <span className="absolute inset-0 w-1/2 bg-white rounded border border-gray-200 shadow-sm transform transition duration-150 ease-in-out"></span>
                  </span>
                  <button
                    className={`relative flex-1 text-sm font-medium p-1 transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2 ${
                      isCardSelected ? "bg-indigo-500" : "bg-gray-200"
                    }`}
                    onClick={handleCardClick}
                  >
                    Pay With Card
                  </button>
                  <button
                    className={`relative flex-1 text-sm font-medium p-1 transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2 ${
                      !isCardSelected ? "bg-indigo-500" : "bg-gray-200"
                    }`}
                    onClick={handlePaypalClick}
                  >
                    Pay With PayPal
                  </button>
                </div>
              </div>
              <div>
                {isCardSelected ? (
                  <div className="space-y-4">
                    <div className="mt-6">
                      <div className="mb-4">
                        <button
                          className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out w-full bg-indigo-500 hover:bg-indigo-600 text-white focus:outline-none focus-visible:ring-2"
                          onClick={() => setisPaymentDone(true)}
                        >
                          Pay ${totalCharge} Using Your Saved Card
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 italic text-center">
                        You&apos;ll be charged ${totalCharge}, including taxes
                        and service charge.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div x-show="!card" x-cloak>
                    <div>
                      <div className="mb-4">
                        <button className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out w-full bg-indigo-500 hover:bg-indigo-600 text-white focus:outline-none focus-visible:ring-2">
                          Pay with PayPal - ${totalCharge}
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 italic text-center">
                        You&apos;ll be charged ${totalCharge}, including taxes
                        and service charge.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
