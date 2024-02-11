import SignInComponent from "@/components/form/SignIn";
import { Suspense } from "react";

const SuccessPage: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SignInComponent />
      </Suspense>
    </div>
  );
};

export default SuccessPage;