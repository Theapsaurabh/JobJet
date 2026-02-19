"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Sparkles, Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ResumeAnalysisResponse } from "@/type";
import { utils_service } from "@/type";
import ResumeResponse from "./ui/ResumeResponse";

export const ResumeAnalyzerPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] =
    useState<ResumeAnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ================= Disable Background Scroll ================= */
  useEffect(() => {
    if (response) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [response]);

  /* ================= File Select ================= */
  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setErrorMessage("Please upload a PDF file.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMessage("File size must be under 5MB.");
      return;
    }

    setErrorMessage(null);
    setFile(selectedFile);
  };

  /* ================= Convert to Base64 ================= */
  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve(reader.result as string);
      reader.onerror = reject;
    });

  /* ================= API Call ================= */
  const analyzeResume = async () => {
    if (!file) {
      setErrorMessage("Please upload your resume first.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const base64 = await convertToBase64(file);

      const { data } =
        await axios.post<ResumeAnalysisResponse>(
          `${utils_service}/resume-analyser`,
          { pdfBase64: base64 }
        );

      setResponse(data);
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
          "Failed to analyze resume."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET ================= */
  const resetPage = () => {
    setFile(null);
    setResponse(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      {/* ================= HOME INPUT SCREEN ================= */}
      <div className="min-h-screen flex items-center justify-center px-6 bg-white dark:bg-zinc-950">
        <div className="max-w-3xl w-full space-y-8">

          <h1 className="text-4xl font-bold text-center">
            AI Resume Intelligence
          </h1>

          <p className="text-center text-muted-foreground">
            Upload your resume and get a full ATS audit,
            keyword gap analysis, and optimization roadmap.
          </p>

          {/* Upload Box */}
          <div
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
          >
            <Upload size={40} className="mx-auto text-blue-600" />

            <p className="mt-6 font-medium text-lg">
              {file
                ? file.name
                : "Click to upload your resume (PDF)"}
            </p>

            <p className="text-sm opacity-60 mt-2">
              Maximum file size: 5MB
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {errorMessage && (
            <div className="text-red-600 text-sm text-center">
              {errorMessage}
            </div>
          )}

          {/* Analyze Button */}
          <Button
            onClick={analyzeResume}
            disabled={loading || !file}
            className="w-full h-12"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Sparkles className="mr-2" />
                Analyze Resume
              </>
            )}
          </Button>

        </div>
      </div>

      {/* ================= FULL SCREEN OVERLAY ================= */}
      {response && (
        <>
          {/* Dark Overlay Background */}
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />

          {/* Resume Panel */}
          <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-950 overflow-y-auto animate-in fade-in duration-300">

            {/* Close Button */}
            <div className="fixed top-6 right-6 z-50">
              <Button onClick={resetPage}>
                Close Report
              </Button>
            </div>

            {/* Resume Content */}
            <div className="min-h-screen w-full">
              <ResumeResponse data={response} />
            </div>

          </div>
        </>
      )}
    </>
  );
};
