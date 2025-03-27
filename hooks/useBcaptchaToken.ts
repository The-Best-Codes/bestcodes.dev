import { useCallback, useState } from "react";

function useBCaptchaToken() {
  const [bcaptchaToken, setBCaptchaToken] = useState<string | null>(null);

  const handleTokenReceived = useCallback((token: string) => {
    setBCaptchaToken(token);
  }, []);

  return { bcaptchaToken, handleTokenReceived };
}

export default useBCaptchaToken;
