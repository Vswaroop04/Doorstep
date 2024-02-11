"use client";
import React, { Suspense } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const GlobalLoading: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <ProgressBar
        height="4px"
        color="#2563EB"
        options={{ showSpinner: false }}
        shallowRouting
      />{" "}
    </Suspense>
  );
};

export default GlobalLoading;
