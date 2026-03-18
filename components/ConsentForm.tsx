"use client";

import React, { useState } from "react";
import { useCode } from "@/context/CodeContext";
import { useRouter } from "next/navigation";

export default function ConsentFormComponent() {
  const router = useRouter();
  const { code } = useCode();
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (!code) {
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
          accessCode: code,
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

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Consent Form</h1>

    <div className="grid grid-cols-[3fr_2fr] gap-8">
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
            Please review the consent form below. This survey is anonymous.
            </p>    

            {/* PDF Embedded */}
            <iframe
            src="/consent-form.pdf"
            width="100%"
            height="600"
            className="border border-gray-300 rounded mb-4"
            title="Consent Form PDF"
            />
      </div>

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
              I have read the consent information and I agree to participate in this anonymous study.
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
        <button
          type="submit"
          disabled={isLoading}
          className="w-8/12 py-3 px-4 bg-green1 text-white font-medium rounded-lg hover:bg-green2 disabled:bg-gray-400 transition"
        >
          {isLoading ? "Saving..." : "I Agree and Continue"}
        </button>
      </form>
    </div>
      
    </div>
  );
}
