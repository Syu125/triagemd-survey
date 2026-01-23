import { useState, useEffect } from "react";

interface Component1Props {
  data: {
    id: number;
    sex: string;
    age: string;
    flowchart_options: string[];
    patientDialog: string;
  };
  onResponse: (value: string) => void;
  savedResponse?: string;
  onSubmit: (answer?: string | null) => void;
}

export default function Component1({
  data,
  onResponse,
  savedResponse,
  onSubmit,
}: Component1Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (savedResponse) {
      // console.log("Saved response:", savedResponse);
      setSelected(savedResponse);
      setSubmitted(true);
    } else {
      setSelected(null);
      setSubmitted(false);
    }
  }, [data.id, savedResponse]);

  const handleSubmit = () => {
    // console.log("Handle submit called with selected:", selected);
    if (selected) {
      // console.log("Submitting response:", selected);
      setSubmitted(true);
      onSubmit();
      onResponse(selected);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-8 w-full max-w-4xl mx-auto mb-16">
      <div className="flex flex-col justify-center align-self-center justify-center w-96 h-96 bg-gray-100 gap-2 p-12 rounded-lg">
        <div className="text-2xl font-bold pb-8"> Patient Demographics: </div>
        <div>
          <span className="font-bold">Sex:</span> {data.sex}
        </div>
        <div>
          <span className="font-bold">Age:</span> {data.age}
        </div>
        <div>
          <span className="font-bold">Chief Complaint:</span>{" "}
          {data.patientDialog}
        </div>
      </div>
      <div className="w-120 max-w-2xl">
        <h2 className="text-1xl font-bold mb-4">
          Select the most appropriate flowchart:
        </h2>
        <div className="space-y-4">
          {data.flowchart_options.map((option, index) => (
            <label key={index} className="flex items-center gap-3">
              <input
                type="radio"
                name="component1"
                value={option}
                className="w-4 h-4"
                checked={selected === option}
                onChange={(e) => setSelected(e.target.value)}
              />
              <span>{option}</span>
            </label>
          ))}
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
