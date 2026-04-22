"use client";

import React, { useEffect, useState } from "react";
import { useCode } from "@/context/CodeContext";
import { useRouter } from "next/navigation";

export default function ConsentFormComponent() {
  const router = useRouter();
  const { code, isLoaded } = useCode();
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingConsent, setIsCheckingConsent] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const normalizedCode = code.trim().toUpperCase();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!normalizedCode) {
      setIsCheckingConsent(false);
      return;
    }

    const controller = new AbortController();
    let isActive = true;

    const checkConsent = async () => {
      try {
        const response = await fetch(
          `/api/consent?accessCode=${encodeURIComponent(normalizedCode)}`,
          { signal: controller.signal },
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to check consent status");
        }

        if (isActive && result.hasConsented) {
          router.replace("/survey");
          return;
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to check consent status", error);
        }
      } finally {
        if (isActive && !controller.signal.aborted) {
          setIsCheckingConsent(false);
        }
      }
    };

    void checkConsent();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [isLoaded, normalizedCode, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (!normalizedCode) {
        setMessage({
          type: "error",
          text: "Missing access code. Please return to the start and re-enter your code.",
        });
        setIsLoading(false);
        return;
      }

      if (!agreed) {
        setMessage({
          type: "error",
          text: "You must agree to continue.",
        });
        setIsLoading(false);
        return;
      }

      // Submit to API
      const response = await fetch("/api/consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessCode: normalizedCode,
          agreed,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const detail = result?.details ? `: ${result.details}` : "";
        throw new Error((result.error || "Failed to save consent form") + detail);
      }

      setMessage({
        type: "success",
        text: `Consent recorded for access code ${result.accessCode}. Redirecting to instructions...`,
      });

      router.push("/instructions");
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to save consent form",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingConsent) {
    return (
      <div className="flex items-center justify-center min-h-screen py-8 px-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-lg font-semibold">Checking consent status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-8 px-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Consent Form</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <label className="flex items-start gap-3 text-sm text-gray-800">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <span>
              This study is approved by UCSD IRB (#200201). By checking the box and proceeding, you consent to participating in this study.
            </span>
          </label>
        </div>

        {/* Messages */}
        {message && (
          <div
            className={`${
              message.type === "success"
                ? "text-green-600"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="py-3 px-6 bg-green1 text-white font-medium rounded-lg hover:bg-green2 disabled:bg-gray-400 transition"
          >
            {isLoading ? "Saving..." : "I Agree and Continue"}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
