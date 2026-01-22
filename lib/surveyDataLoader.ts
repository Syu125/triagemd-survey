import Papa from "papaparse";

export interface SurveyItem {
  id: number;
  flowchart: string;
  path: string;
  sex: string;
  age: string;
  dialog: string;
  previousNode: string;
  previousProtocol: string;
  nextNode: string;
  nextProtocol: string;
}

export async function loadSurveyData(
  versionIndex: number,
): Promise<SurveyItem[]> {
  try {
    const response = await fetch(
      `/content/selected_topics_${versionIndex}.csv`,
    );
    const csvText = await response.text();
    // console.log("CSV Text:", csvText); // Debugging line

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results: { data: any[] }) => {
          const items: SurveyItem[] = (results.data as any[]).map(
            (row, index) => ({
              id: index + 1,
              flowchart: row.Flowchart || "",
              path: row.Path || "",
              sex: row.Sex || "",
              age: row.Age || "",
              dialog: row.Dialog || "",
              previousNode: row["Previous Node"] || "",
              previousProtocol: row["Previous Protocol"] || "",
              nextNode: row["Next Node"] || "",
              nextProtocol: row["Next Protocol"] || "",
            }),
          );
          resolve(items);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error("Error loading survey data:", error);
    throw error;
  }
}
