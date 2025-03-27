"use client";

import { useEffect, useState } from "react";
import { generateAndSetBCaptcha } from "@/app/actions";

export default function BCaptchaComponent() {
  const [token, setToken] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generateToken() {
      setLoading(true);
      try {
        const newToken = await generateAndSetBCaptcha();
        setToken(newToken);
      } catch (error) {
        console.error("Error generating bcaptcha token:", error);
      } finally {
        setLoading(false);
      }
    }

    generateToken();
  }, []);

  useEffect(() => {
    if (isChecked && token) {
      // Send the token to the parent window
      window.parent.postMessage({ type: "bcaptcha-token", token }, "*");
    }
  }, [isChecked, token]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={isChecked}
              onChange={handleCheckboxChange}
              disabled={loading}
            />
            <span className="ml-2 text-gray-700">I'm not a robot</span>
          </label>
          {isChecked && <div className="mt-2 text-green-500">Verified!</div>}
        </>
      )}
    </>
  );
}
