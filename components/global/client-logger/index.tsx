"use client";

import { useEffect, useRef } from "react";

const ClientLogger = () => {
  const hasLogged = useRef(false);

  useEffect(() => {
    try {
      if (!hasLogged.current) {
        console.log(
          `%cWelcome, developer! 🤓`,
          "color: #3b82f6; background-color: #f0f0f0; font-size: 32px;",
        );
        hasLogged.current = true;
      }
    } catch (error) {
      console.error("Error in ClientLogger:", error);
    }
  }, []);

  return null;
};

export default ClientLogger;
