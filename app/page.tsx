import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-cols-2 place-items-center w-full h-screen px-32">
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
        <Link href="/instructions">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8">
            Continue
          </button>
        </Link>
      </div>
      <div>Image here</div>
    </div>
  );
}
