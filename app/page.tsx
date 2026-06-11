export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Survey Closed</h1>
        <p className="mt-4 text-lg text-gray-700">
          This survey is no longer accepting responses.
        </p>
        <p className="mt-2 text-gray-600">
          Thank you for your interest and support.
        </p>
      </section>
    </main>
  );
}
