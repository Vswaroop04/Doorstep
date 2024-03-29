import SignUpComponent from "@/components/form/SignUp";
import { Suspense } from "react";

const SuccessPage: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<div className="absolute left-1/2">Loading...</div>}>
        <SignUpComponent />
      </Suspense>
    </div>
  );
};

export default SuccessPage;
