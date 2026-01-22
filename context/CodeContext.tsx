"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CodeContextType {
  code: string;
  setCode: (code: string) => void;
  isLoaded: boolean;
}

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export function CodeProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCode = localStorage.getItem("surveyCode");
    if (savedCode) {
      setCode(savedCode);
    }
    setIsLoaded(true);
  }, []);

  const handleSetCode = (newCode: string) => {
    setCode(newCode);
    localStorage.setItem("surveyCode", newCode);
  };

  return (
    <CodeContext.Provider value={{ code, setCode: handleSetCode, isLoaded }}>
      {children}
    </CodeContext.Provider>
  );
}

export function useCode() {
  const context = useContext(CodeContext);
  if (context === undefined) {
    throw new Error("useCode must be used within a CodeProvider");
  }
  return context;
}
