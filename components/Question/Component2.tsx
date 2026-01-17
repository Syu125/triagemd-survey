import { useState, useEffect } from "react";

interface Component2Props {
  data: {
    id: number;
    data: string;
  };
  onResponse: (value: string) => void;
  savedResponse?: string;
}

export default function Component2({
  data,
  onResponse,
  savedResponse,
}: Component2Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (savedResponse) {
      setValue(savedResponse);
    } else {
      setValue("");
    }
  }, [data.id, savedResponse]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onResponse(e.target.value);
  };

  return (
    <div className="w-full max-w-2xl bg-gray-50 border border-gray-200 rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-4">Component 2</h2>
      <p className="text-gray-700 mb-6">{data.data}</p>
      <textarea
        placeholder="Enter your response here..."
        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
