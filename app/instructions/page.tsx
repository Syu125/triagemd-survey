import Link from "next/link";

export default function Instructions() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-8 py-8 gap-8">
      <h1 className="text-4xl font-bold">Instructions</h1>

      {/* Video Embed */}
      <div className="w-full max-w-2xl">
        <iframe
          width="100%"
          height="400"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Instructions Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg"
        ></iframe>
      </div>

      <p className="max-w-2xl text-center">
        Watch the video above to understand how to complete the survey.
      </p>

      <Link href="/survey">
        <button className="bg-green1 hover:bg-green2 text-white font-bold py-2 px-4 rounded">
          Start Survey
        </button>
      </Link>
    </div>
  );
}
