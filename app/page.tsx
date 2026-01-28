"use client";

import Image from "next/image";
import Link from "next/link";
import { useCode } from "@/context/CodeContext";
import { VALID_CODES } from "@/constants";
import welcomeImage from "@/public/welcome.png";

export default function Home() {
  const { code, setCode } = useCode();
  const isValidCode = VALID_CODES.includes(code.toUpperCase());

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
        {isValidCode && (
          <Link href="/instructions">
            <button className="bg-green1 hover:bg-green2 text-white font-bold py-2 px-4 rounded mt-8">
              Continue
            </button>
          </Link>
        )}
      </div>
      <div>
        <Image src={welcomeImage} alt="Welcome Image"></Image>
      </div>
    </div>
  );
}
