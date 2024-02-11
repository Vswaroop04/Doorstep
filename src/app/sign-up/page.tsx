import SignUpComponent from "@/components/form/SignUp";
import { Suspense } from "react";

const SuccessPage: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SignUpComponent />
      </Suspense>
    </div>
  );
};

export default SuccessPage;
