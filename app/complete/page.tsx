import Link from "next/link";

export default function Complete() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-8 py-8 gap-8">
      <h1 className="text-4xl font-bold">
        Thank you for completing the survey!
      </h1>

      <p className="max-w-2xl text-center">
        Your responses have been recorded. You may now close this window.
      </p>
    </div>
  );
}
