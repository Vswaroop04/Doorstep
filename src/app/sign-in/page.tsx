import SignInComponent from "@/components/form/SignIn";
import { Suspense } from "react";

const SuccessPage: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<div className="absolute left-1/2">Loading...</div>}>
        <SignInComponent />
      </Suspense>
    </div>
  );
};

export default SuccessPage;