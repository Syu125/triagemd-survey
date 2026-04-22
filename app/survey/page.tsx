"use client";
import { useState, useEffect } from "react";
import Component1 from "@/components/Question/Component1";
import Component2 from "@/components/Question/Component2";
import { useCode } from "@/context/CodeContext";
import { CODE_TO_VERSION, FLOWCHART_GROUPS } from "@/constants";
import { loadSurveyData, SurveyItem } from "@/lib/surveyDataLoader";
import { useRef } from "react";
import { saveSurvey } from "./actions";

const createDefaultSurveyState = (accessCode: string): SurveyState => ({
  code: accessCode,
  surveyId: 1,
  topics: Array.from({ length: 10 }, () => ({
    component1: null,
    component2: [],
  })),
});

const createDefaultResponses = () => ({});

const getStorageKey = (accessCode: string, key: string) =>
  `survey:${accessCode}:${key}`;

const readStoredValue = <T,>(
  accessCode: string,
  key: string,
  fallback: T,
): T => {
  if (typeof window === "undefined" || !accessCode) {
    return fallback;
  }

  const namespacedValue = localStorage.getItem(getStorageKey(accessCode, key));
  if (namespacedValue) {
    return JSON.parse(namespacedValue) as T;
  }

  const legacyValue = localStorage.getItem(key);
  return legacyValue ? (JSON.parse(legacyValue) as T) : fallback;
};

const clampIndex = (index: number, length: number) => {
  if (!Number.isFinite(index)) return 0;
  if (length <= 0) return 0;
  return Math.max(0, Math.min(index, length - 1));
};

const buildResponsesFromSurveyState = (surveyState: SurveyState) => {
  const restoredResponses: {
    [key: number]: { component1?: string; component2?: string };
  } = {};

  surveyState.topics.forEach((topic, index) => {
    const restoredTopic: { component1?: string; component2?: string } = {};

    if (topic.component1) {
      restoredTopic.component1 = topic.component1;
    }

    if (topic.component2.length > 0) {
      restoredTopic.component2 = topic.component2
        .map((component2) => component2.answer ?? "")
        .join("\n");
    }

    if (restoredTopic.component1 || restoredTopic.component2) {
      restoredResponses[index] = restoredTopic;
    }
  });

  return restoredResponses;
};

const hasMeaningfulProgress = (surveyState: SurveyState) => {
  return surveyState.topics.some(
    (topic) => Boolean(topic.component1) || topic.component2.length > 0,
  );
};

export default function Survey() {
  const { code, isLoaded } = useCode();
  const [surveyItems, setSurveyItems] = useState<SurveyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const normalizedCode = code.trim().toUpperCase();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<{
    [key: number]: { component1?: string; component2?: string };
  }>(createDefaultResponses);
  const component2Ref = useRef<HTMLDivElement>(null);
  const [storageReady, setStorageReady] = useState(false);
  const hydratedCodeRef = useRef<string | null>(null);
  const lastSavedSignatureRef = useRef("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Survey storage
  const [surveyState, setSurveyState] = useState<SurveyState>(() =>
    createDefaultSurveyState(""),
  );

  const [currentTopic, setCurrentTopic] = useState(0);

  // For Component 1
  const [patientSymptoms, setPatientSymptoms] = useState<string[]>([]);
  interface PatientDemographics {
    id: number;
    sex: string;
    age: string;
    options: string[];
    flowchart: string;
  }
  const [patientDemographics, setPatientDemographics] = useState<
    PatientDemographics[]
  >([]);

  // For Component 2

  const getFlowchartOptions = (flowchartName: string): string[] => {
    for (const [groupName, flowcharts] of Object.entries(FLOWCHART_GROUPS)) {
      if (flowcharts.includes(flowchartName)) {
        return [...flowcharts, "None of the above"];
      }
    }
    return [];
  };
  const handleSubmit = () => {
    setTimeout(() => {
      component2Ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!normalizedCode) {
      hydratedCodeRef.current = null;
      setSurveyState(createDefaultSurveyState(""));
      setResponses(createDefaultResponses());
      setCurrentIndex(0);
      setCurrentTopic(0);
      setStorageReady(true);
      return;
    }

    if (hydratedCodeRef.current === normalizedCode) {
      setStorageReady(true);
      return;
    }

    setStorageReady(false);

    const savedCurrentIndex = readStoredValue(normalizedCode, "currentIndex", 0);
    const savedCurrentTopic = readStoredValue(normalizedCode, "currentTopic", 0);
    const savedResponses = readStoredValue(
      normalizedCode,
      "responses",
      createDefaultResponses(),
    );
    const savedSurveyState = readStoredValue(
      normalizedCode,
      "surveyState",
      createDefaultSurveyState(normalizedCode),
    );

    setCurrentIndex(savedCurrentIndex);
    setCurrentTopic(savedCurrentTopic);
    setResponses(savedResponses);
    setSurveyState({
      ...savedSurveyState,
      code: normalizedCode,
    });
    hydratedCodeRef.current = normalizedCode;
    setStorageReady(true);
  }, [isLoaded, normalizedCode]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const versionIndex = CODE_TO_VERSION[normalizedCode];
        // console.log("Version Index:", versionIndex); // Debugging line
        if (!versionIndex) {
          setError("Invalid code");
          return;
        }

        console.log("Version INdex: ", versionIndex);
        const data = await loadSurveyData(versionIndex);

        console.log("Loaded survey data:", data[0].flowchart); // Debugging line
        setSurveyItems(data);

        const symptomsList: string[] = [];
        const demographics: PatientDemographics[] = [];
        for (let i = 0; i < 10; i++) {
          const entry = data[i * 3];
          // console.log("Processing entry:", entry); // Debugging line
          // const patientMatch = entry.dialog.match(
          //   /Patient:\s*(.+?)(?=\nTriageMD:|$)/,
          // );
          // symptomsList.push(patientMatch ? patientMatch[1].trim() : "");
          symptomsList.push(entry.dialog.split("\n")[0].replace("Patient:", "").trim());
          demographics.push({
            id: entry.id,
            sex: entry.sex,
            age: entry.age,
            options: getFlowchartOptions(entry.flowchart),
            flowchart: entry.flowchart,
          });
        }

        console.log("Demographics: ", demographics);
        console.log("Symptoms: ", symptomsList);
        setPatientSymptoms(symptomsList);
        setPatientDemographics(demographics);
      } catch (err) {
        setError(
          `Failed to load survey data: ${
            err instanceof Error ? err.message : "Unknown error"
          }`,
        );
      } finally {
        setLoading(false);
      }
    };

    if (normalizedCode) {
      loadData();
    }
  }, [normalizedCode]);

  useEffect(() => {
    if (!storageReady || !normalizedCode) {
      return;
    }

    localStorage.setItem(
      getStorageKey(normalizedCode, "surveyState"),
      JSON.stringify(surveyState),
    );
  }, [normalizedCode, storageReady, surveyState]);

  useEffect(() => {
    if (!storageReady || !normalizedCode) {
      return;
    }

    localStorage.setItem(
      getStorageKey(normalizedCode, "responses"),
      JSON.stringify(responses),
    );
  }, [normalizedCode, responses, storageReady]);

  useEffect(() => {
    if (!storageReady || !normalizedCode) {
      return;
    }

    localStorage.setItem(
      getStorageKey(normalizedCode, "currentIndex"),
      JSON.stringify(currentIndex),
    );
  }, [currentIndex, normalizedCode, storageReady]);

  useEffect(() => {
    if (!storageReady || !normalizedCode) {
      return;
    }

    localStorage.setItem(
      getStorageKey(normalizedCode, "currentTopic"),
      JSON.stringify(currentTopic),
    );
  }, [currentTopic, normalizedCode, storageReady]);

  useEffect(() => {
    if (!normalizedCode) {
      return;
    }

    setSurveyState((prev) =>
      prev.code === normalizedCode ? prev : { ...prev, code: normalizedCode },
    );
  }, [normalizedCode]);

  useEffect(() => {
    if (!normalizedCode || !storageReady) {
      return;
    }

    const controller = new AbortController();
    let isActive = true;

    const loadSavedProgress = async () => {
      try {
        const response = await fetch(
          `/api/survey-progress?accessCode=${encodeURIComponent(normalizedCode)}`,
          { signal: controller.signal },
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to load survey progress");
        }

        if (!isActive || !result.hasProgress) {
          return;
        }

        const restoredSurveyState = {
          ...result.surveyState,
          code: normalizedCode,
        } as SurveyState;
        const restoredResponses = buildResponsesFromSurveyState(restoredSurveyState);

        setSurveyState(restoredSurveyState);
        setResponses(restoredResponses);
        setCurrentIndex(result.currentIndex);
        setCurrentTopic(result.currentTopic);

        lastSavedSignatureRef.current = JSON.stringify({
          surveyState: restoredSurveyState,
          currentIndex: result.currentIndex,
          currentTopic: result.currentTopic,
        });
        setSaveStatus("saved");
      } catch (loadError) {
        if (!controller.signal.aborted) {
          console.error("Failed to load survey progress", loadError);
        }
      }
    };

    void loadSavedProgress();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [normalizedCode, storageReady]);

  useEffect(() => {
    if (!normalizedCode || !storageReady || loading || error) {
      return;
    }

    if (!hasMeaningfulProgress(surveyState)) {
      return;
    }

    const signature = JSON.stringify({
      surveyState,
      currentIndex,
      currentTopic,
    });

    if (signature === lastSavedSignatureRef.current) {
      return;
    }

    setSaveStatus("saving");

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/survey-progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            surveyState: {
              ...surveyState,
              code: normalizedCode,
            },
          }),
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to save survey progress");
        }

        lastSavedSignatureRef.current = signature;
        setSaveStatus("saved");
      } catch (saveError) {
        console.error("Failed to save survey progress", saveError);
        setSaveStatus("error");
      }
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentIndex, currentTopic, error, loading, normalizedCode, storageReady, surveyState]);

  useEffect(() => {
    if (patientSymptoms.length === 0) return;

    const boundedIndex = clampIndex(currentIndex, patientSymptoms.length);
    if (boundedIndex !== currentIndex) {
      setCurrentIndex(boundedIndex);
      setCurrentTopic(boundedIndex);
    }
  }, [patientSymptoms.length, currentIndex]);

  useEffect(() => {
    setSurveyState((prev) => {
      if (!prev.topics || !prev.topics[currentTopic]) return prev;
      const copy = [...prev.topics];
      const latestResponse = responses[currentIndex];
      copy[currentTopic].component1 = latestResponse?.component1;
      const q2responses = latestResponse?.component2?.split("\n") || [];
      copy[currentTopic].component2 = q2responses.map((response, qIdx) => {
        return {
          question: qIdx.toString(),
          answer: response,
        };
      });
      return { ...prev, topics: copy };
    });
  }, [responses, currentIndex, currentTopic]);

  if (!isLoaded || (normalizedCode && !storageReady)) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <p className="text-lg font-semibold">Loading survey...</p>
      </div>
    );
  }

  if (!normalizedCode) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <p className="text-lg font-semibold">No access code provided.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <p className="text-lg font-semibold">Loading survey...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  if (surveyItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <p className="text-lg font-semibold">No survey items found.</p>
      </div>
    );
  }

  const isLast = currentIndex === surveyItems.length / 3 - 1;
  const currentResponse = responses[currentIndex] || {};
  const component1Answered = !!currentResponse.component1;
  const component2Visited = !!responses[currentIndex]?.component2;

  const handleComponent1Response = (value: string) => {
    setResponses((prev) => ({
      ...prev,
      [currentIndex]: { ...prev[currentIndex], component1: value },
    }));
  };

  const handleComponent2Response = (value: string) => {
    setResponses((prev) => ({
      ...prev,
      [currentIndex]: { ...prev[currentIndex], component2: value },
    }));
  };

  const handleNext = async () => {
    if (!isLast) {
      const nextIndex = currentIndex + 1;
      const isBrandNew = !responses[nextIndex]?.component1;

      setCurrentIndex(nextIndex);
      setCurrentTopic(nextIndex);

      if (isBrandNew) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      await saveSurvey(surveyState);
      window.location.href = "/complete";
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentTopic(prevIndex);
    }
  };

  const getConversationSnippets = (index: number) => {
    return [
      surveyItems[index * 3].dialog,
      surveyItems[index * 3 + 1].dialog,
      surveyItems[index * 3 + 2].dialog,
    ];
  };

  const getPreviousProtocols = (index: number) => {
    return [
      surveyItems[index * 3].previousProtocol,
      surveyItems[index * 3 + 1].previousProtocol,
      surveyItems[index * 3 + 2].previousProtocol,
    ];
  };

  const getNextProtocols = (index: number) => {
    return [
      surveyItems[index * 3].nextProtocol,
      surveyItems[index * 3 + 1].nextProtocol,
      surveyItems[index * 3 + 2].nextProtocol,
    ];
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen px-8">
      {/* Progress Bar */}
      <div className="w-full max-w-4xl sticky top-0 bg-green1 z-50 px-8 py-4 shadow-md rounded-b-xl">
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-4 bg-green2 rounded-full transition-all duration-500"
            style={{
              width: `${((currentIndex + 1) / patientSymptoms.length) * 100}%`,
            }}
          />
        </div>
        <p className="text-sm font-semibold mt-1 text-right">
          Question {currentIndex + 1} of {patientSymptoms.length}
        </p>
        <p className="text-sm mt-1 text-right text-white/90">
          {saveStatus === "saving"
            ? "Saving progress..."
            : saveStatus === "saved"
              ? "Progress saved"
              : saveStatus === "error"
                ? "Unable to save progress"
                : ""}
        </p>
      </div>

      <div className="mt-10">
        {/* Component 1 */}
        <Component1
          key={`q-${currentIndex}-${responses[currentIndex]?.component1 || "empty"}`}
          data={{
            id: patientDemographics[currentIndex].id,
            sex: patientDemographics[currentIndex].sex,
            age: patientDemographics[currentIndex].age,
            flowchart_options: patientDemographics[currentIndex].options,
            patientDialog: patientSymptoms[currentIndex],
          }}
          onResponse={handleComponent1Response}
          savedResponse={currentResponse.component1}
          onSubmit={handleSubmit}
        />
        {/* Component 2 - Only show after Component1 is answered */}
        {component1Answered && (
          <div>
            <Component2
              key={`topic-${currentIndex}`}
              flowchartName={patientDemographics[currentIndex].flowchart}
              snippets={getConversationSnippets(currentIndex)}
              previousProtocols={getPreviousProtocols(currentIndex)}
              nextProtocols={getNextProtocols(currentIndex)}
              onResponse={handleComponent2Response}
              savedResponse={currentResponse.component2}
              ref={component2Ref}
            />

            {/* Navigation */}

            <div className="flex gap-4 align-self-center justify-center mt-12 mb-36">
              {currentIndex > 0 && (
                <button
                  onClick={handleBack}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={currentIndex === 10} // Last component
                className="bg-green1 hover:bg-green2 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
              >
                {isLast ? "Complete" : "Next"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
