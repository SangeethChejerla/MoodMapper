"use client";
import { RingLoader } from "react-spinners";
import axios from "axios";
import { ChangeEvent, useEffect, useState, Suspense } from "react";
import { emotionConfig } from "./config";
import Slip from "@/components/slip";

// Define the type for emotion keys
type EmotionKey = keyof typeof emotionConfig;

export default function Home() {
  const defaultColor = "#cccccc";

  // State Variables
  const [rows, setRows] = useState(2);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<{ label: EmotionKey; score: number }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState(defaultColor);
  const [tagsVisible, setTagsVisible] = useState(false);

  useEffect(() => {
    const inputTimeout = setTimeout(() => {
      runPredictions();
    }, 1000);
    return () => clearTimeout(inputTimeout);
  }, [input]);

  useEffect(() => {
    handleColor();
    setTagsVisible(true);
  }, [output]);

  function handleColor() {
    if (output && output.length > 0) {
      const colorKey: EmotionKey = output[0].label;
      const colorHex = emotionConfig[colorKey].colorHex;
      setColor(colorHex);
    }
  }

  async function runPredictions() {
    if (input) {
      setLoading(true);
      setTagsVisible(false);

      const res = await axios.post("api/emotion", { input: input });
      console.log(res);
      setOutput(res.data.filteredResponse);
      setLoading(false);
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    setInput(event.target.value);
    // Increase the number of rows if required
    const newRows = Math.max(2, Math.ceil(event.target.scrollHeight / 20));
    setRows(newRows);
  }

  return (
    <Suspense fallback={renderLoader()}>
      <main
        style={{ backgroundColor: color + "aa" }}
        className="transition-all delay-500 gap-6 flex min-h-screen flex-col items-center p-12"
      >
        <h1 className="lg:text-5xl text-3xl font-bold tracking-tight text-gray-900 mb-8">
        🧠 Mood Mapper 
        </h1>
        <div className="w-full max-w-2xl border-2 border-gray-300 p-6 rounded-lg shadow-md bg-white">
        <textarea
          rows={rows}
          onChange={handleInputChange}
          placeholder="type how you feel . . ."
          className="resize-none outline-none block w-full text-sm placeholder-slate-600 bg-transparent"
        >

        </textarea>
        </div>
        <Slip input={input}>
          Express your words here and let us help map your mood.
        </Slip>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          {output?.map(({ label, score }) => {
            return (
              <span
              key={label}
              className={`${
                tagsVisible ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-300 cursor-pointer bg-indigo-100 text-indigo-800 text-lg px-4 py-1 rounded-full border border-indigo-400 shadow-lg hover:bg-indigo-200 hover:border-indigo-500`}
            >
              {label} {emotionConfig[label].emoji}
            </span>
            );
          })}
        </div>
        {loading && renderLoader()}
      </main>
    </Suspense>
  );

  function renderLoader() {
    return (
      <div className="flex justify-center items-center mt-6">
        <RingLoader size={50} color="#4A90E2" />
      </div>
    );
  }
}
