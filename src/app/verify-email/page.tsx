"use client"
import { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";


const EmailVerification = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams()
  const token = searchParams.get('token')


  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/emailVerify?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setIsVerified(true);
        } else {
          setError(data.message || 'Error verifying email');
        }
      } catch (error) {
        setError('An error occurred');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center h-screen">
      {isVerified ? (
        <div className=" text-xl font-bold">Email verified successfully!</div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          {!error && <p className="text-gray-500">Verifying email...</p>}
          {error && <p className="text-red-500 mt-4">Error: {error}</p>}
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
