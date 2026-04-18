"use client";

import { useState } from "react";

export default function Complete() {
  const [wantsInterview, setWantsInterview] = useState<boolean | null>(null);

  const handleChoice = (choice: boolean) => {
    setWantsInterview(choice);
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen px-8 py-8">
      <div className="mx-auto max-w-2xl text-center space-y-8">
        <h1 className="text-4xl font-bold">Thank you for your feedback!</h1>

        <p className="text-center">
          Your survey responses have been submitted anonymously. As a reminder, you
          are already entered into the gift card lottery from your initial sign-up.
        </p>
        <h2 className="text-2xl font-bold">Interested in a Follow-Up Interview?</h2>
        <div className="w-full">
        <p className="text-center">
          We are seeking clinical team members for a follow-up interview to provide deeper
          clinical feedback.
        </p>

        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            type="button"
            onClick={() => handleChoice(true)}
            className={`px-5 py-2 text-sm font-semibold rounded-lg border transition ${
              wantsInterview === true
                ? "bg-green1 text-white border-green1"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => handleChoice(false)}
            className={`px-5 py-2 text-sm font-semibold rounded-lg border transition ${
              wantsInterview === false
                ? "bg-orange1 text-white border-orange1"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
            }`}
          >
            No
          </button>
        </div>

        {wantsInterview && (
          <div className="mt-8 w-full">
            <iframe
              src="https://forms.gle/v8i7JMBd8Ktuh2MK8"
              width="100%"
              height="1200"
              className="border border-gray-200 rounded-lg"
              title="Follow-Up Interview Form"
            >
              Loading...
            </iframe>
          </div>
        )}

        {wantsInterview === false && (
          <div className="mt-8 w-full rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
            <h3 className="text-xl font-semibold">No problem, thank you!</h3>
            <p className="mt-2 text-gray-700">
              You have completed the survey and are still entered in the gift card
              lottery from your initial sign-up.
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
