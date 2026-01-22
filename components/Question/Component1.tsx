import { useState, useEffect } from "react";

interface Component1Props {
  data: {
    id: number;
    sex: string;
    age: string;
  };
  onResponse: (value: string) => void;
  savedResponse?: string;
}

export default function Component1({
  data,
  onResponse,
  savedResponse,
}: Component1Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (savedResponse) {
      setSelected(savedResponse);
      setSubmitted(true);
    } else {
      setSelected(null);
      setSubmitted(false);
    }
  }, [data.id, savedResponse]);

  const handleSubmit = () => {
    if (selected) {
      setSubmitted(true);
      onResponse(selected);
    }
  };

  if (submitted) {
    return <div></div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 w-8/12">
      <div className="flex flex-col items-center justify-center w-8/12 h-full bg-gray-100 gap-2">
        <div className="text-2xl font-bold pb-8"> Patient Demographics: </div>
        <div>{data.age}</div>
        <div>{data.sex}</div>
      </div>
      <div className="w-full max-w-2xl bg-gray-50 border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Component 1</h2>
        <p className="text-gray-700 mb-6">{data.id}</p>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="component1"
              value="option1"
              className="w-4 h-4"
              checked={selected === "option1"}
              onChange={(e) => setSelected(e.target.value)}
            />
            <span>Option 1</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="component1"
              value="option2"
              className="w-4 h-4"
              checked={selected === "option2"}
              onChange={(e) => setSelected(e.target.value)}
            />
            <span>Option 2</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="component1"
              value="option3"
              className="w-4 h-4"
              checked={selected === "option3"}
              onChange={(e) => setSelected(e.target.value)}
            />
            <span>Option 3</span>
          </label>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="mt-6 bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
