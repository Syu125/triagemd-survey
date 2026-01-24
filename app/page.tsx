"use client";

import Image from "next/image";
import Link from "next/link";
import { useCode } from "@/context/CodeContext";
import { VALID_CODES } from "@/constants/constants";

export default function Home() {
  const { code, setCode } = useCode();
  const isValidCode = VALID_CODES.includes(code.toUpperCase());

  return (
    <div className="grid grid-cols-2 place-items-center place-self-center w-8/12 h-screen px-32">
      <div className="header">
        <p className="grid grid-rows text-4xl py-8">TriageMD Survey</p>
        <p>
          Thank you for participating in this study! In this study, you will
          review brief excerpts from simulated AI-patient triage conversations
          and provide your professional judgment on specific aspects of the AI’s
          responses. This study is expected to take approximately 30-45 minutes.
          Your participation is voluntary. You may stop at any time without
          penalty. Your responses will be anonymized and used for research
          purposes only. By clicking “Continue,” you indicate that you are at
          least 18 years old and consent to participate in this study.
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
        {isValidCode && (
          <Link href="/instructions">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8">
              Continue
            </button>
          </Link>
        )}
      </div>
      <div>Image here</div>
    </div>
  );
}
