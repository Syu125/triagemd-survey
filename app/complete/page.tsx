import Link from "next/link";

export default function Complete() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-8 py-8 gap-8">
      <h1 className="text-4xl font-bold">
        Thank you for your feedback!
      </h1>

      <p className="max-w-2xl text-center">
        Your survey responses have been submitted anonymously. As a reminder, you are 
        already entered into the gift card lottery from your initial sign-up. 
      </p>
      <h2 className="text-2xl font-bold">Interested in a Follow-Up Interview?</h2>
      <div className="max-w-2xl text-left">
        <p>We are seeking clinicians for a follow-up interview to provide deeper clinical feedback.</p>
        <div className="flex justify-center mt-4">
          <a
            href="https://forms.gle/v8i7JMBd8Ktuh2MK8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 text-sm bg-green1 text-white font-semibold rounded-lg hover:bg-green5 transition"
          >
            Sign Up for Follow-Up Interview
          </a>
        </div>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><span className="font-bold">Time commitment:</span> 30 minutes</li>
          <li>
            <span className="font-bold">Compensation:</span> As a thank you for this additional time, participants who complete
            the interview will receive a $5 gift card.
          </li>
          <li><span className="font-bold">Note:</span> This is separate from your existing entry in the gift card lottery.</li>
        </ul>
      </div>
    </div>
  );
}
