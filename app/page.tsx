"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCode } from "@/context/CodeContext";
import { VALID_CODES } from "@/constants";
import welcomeImage from "@/public/welcome.png";

export default function Home() {
  const router = useRouter();
  const { code, setCode, isLoaded } = useCode();
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const [isCheckingConsent, setIsCheckingConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);
  const normalizedCode = code.trim().toUpperCase();
  const isValidCode = VALID_CODES.includes(normalizedCode);

  const fetchConsentStatus = async (accessCode: string, signal?: AbortSignal) => {
    const response = await fetch(
      `/api/consent?accessCode=${encodeURIComponent(accessCode)}`,
      { signal },
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to check consent status");
    }

    return Boolean(result.hasConsented);
  };

  useEffect(() => {
    if (!isLoaded || !isValidCode) {
      setHasConsented(null);
      setConsentError(null);
      setIsCheckingConsent(false);
      return;
    }

    const controller = new AbortController();
    let isActive = true;

    const checkConsent = async () => {
      setIsCheckingConsent(true);
      setConsentError(null);

      try {
        const consented = await fetchConsentStatus(normalizedCode, controller.signal);
        if (isActive) {
          setHasConsented(consented);
        }
      } catch (error) {
        if (controller.signal.aborted || !isActive) {
          return;
        }

        setHasConsented(null);
        setConsentError(
          error instanceof Error
            ? error.message
            : "Failed to check consent status",
        );
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
  }, [isLoaded, isValidCode, normalizedCode]);

  const handleContinue = async () => {
    if (!isValidCode || isCheckingConsent) {
      return;
    }

    try {
      const consented =
        hasConsented === null || consentError
          ? await fetchConsentStatus(normalizedCode)
          : hasConsented;

      router.push(consented ? "/survey" : "/irb");
    } catch (error) {
      setConsentError(
        error instanceof Error
          ? error.message
          : "Failed to check consent status",
      );
    }
  };

  return (
    <div className="grid grid-cols-[3fr_2fr] place-items-center place-self-center w-11/12 h-screen px-32 gap-8">
      <div className="header">
        <p className="grid grid-rows text-4xl">TriageMD Survey</p>
        <p>
          <br></br>Thank you for participating in this study! In this study, you
          will review brief excerpts from simulated AI–patient triage
          conversations and provide your professional judgment on specific
          aspects of the AI’s responses.
        </p>

        <p>
          <strong>
            <br></br>What to expect:
          </strong>
        </p>
        <ul className="list-disc pl-5">
          <li>
            Time commitment: approximately <strong>30–45 minutes</strong>
          </li>
          <li>
            Participation is <strong>voluntary</strong>, and you may stop at any
            time without penalty
          </li>
          <li>
            Responses are <strong>anonymous</strong> and used for research
            purposes only
          </li>
        </ul>

        <p>
          <br></br>By clicking <strong>“Continue,”</strong> you confirm that:
        </p>
        <ul className="list-disc pl-5">
          <li>
            You are <strong>at least 18 years old</strong>
          </li>
          <li>
            You <strong>consent to participate</strong> in this study
          </li>
        </ul>

        <p>
          <strong>
            <br></br>Please note:
          </strong>{" "}
          Your progress will not be saved, so please plan to complete the survey
          in one sitting.
        </p>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">
            Enter your access code:
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
            className="w-4/12 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {code && !isValidCode && (
            <p className="text-red-500 text-sm mt-2">Invalid code</p>
          )}
        </div>
        {consentError && isValidCode && (
          <p className="text-red-500 text-sm mt-2">{consentError}</p>
        )}
        {isValidCode && (
          <button
            type="button"
            onClick={handleContinue}
            disabled={isCheckingConsent}
            className="bg-green1 hover:bg-green2 disabled:opacity-50 text-white font-bold py-2 px-4 rounded mt-8"
          >
            {isCheckingConsent
              ? "Checking..."
              : hasConsented
                ? "Resume Survey"
                : "Continue"}
          </button>
        )}
      </div>
      <div>
        <Image src={welcomeImage} alt="Welcome Image"></Image>
      </div>
    </div>
  );
}
