"use client";

import React, { useState } from "react";
import axios from "axios";
import { Sparkles, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CareerGuideResponse } from "@/type";
import { utils_service } from "@/type";
import { CareerResponse } from "./ui/CareerResponse";

export const CareerGuide = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [location, setLocation] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [salaryExpectation, setSalaryExpectation] = useState("");
  const [interests, setInterests] = useState("");

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CareerGuideResponse | null>(null);

  const addSkill = () => {
    const trimmed = currentSkill.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setCurrentSkill("");
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const getCareerGuidance = async () => {
    if (!skills.length) return;

    setLoading(true);

    try {
      const { data } = await axios.post(`${utils_service}/career`, {
        skills: skills.join(", "),
        location,
        experienceLevel,
        salaryExpectation,
        interests,
      });

      setResponse(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (response) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <CareerResponse data={response} />
        <div className="fixed bottom-6 right-6">
          <Button onClick={() => setResponse(null)}>
            Generate Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-white dark:bg-zinc-950">
      <div className="max-w-3xl w-full space-y-8">
        <h1 className="text-4xl font-bold text-center">
          AI Career Intelligence
        </h1>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add Skill"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
            />
            <Button onClick={addSkill}>Add</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30"
              >
                {skill}
                <button onClick={() => removeSkill(skill)}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            placeholder="Experience Level"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
          />
          <Input
            placeholder="Salary Expectation"
            value={salaryExpectation}
            onChange={(e) => setSalaryExpectation(e.target.value)}
          />
          <Input
            placeholder="Interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />

          <Button
            onClick={getCareerGuidance}
            disabled={loading}
            className="w-full h-12"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2" />
                Generate Career Strategy
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
