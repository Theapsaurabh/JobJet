import express, { json } from 'express';
import cloudinary from 'cloudinary';
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv"
dotenv.config()
const router= express.Router();
router.post('/upload', async (req,res)=>{
    try {
        const {buffet, public_id}= req.body;
        if(public_id){
            await cloudinary.v2.uploader.destroy(public_id);

        }
        const cloud= await cloudinary.v2.uploader.upload(buffet)
        res.json({
            url: cloud.secure_url,
            public_id: cloud.public_id
        })


    } catch (error:any) {
        res.status(500).json({message: "Image upload failed", error});
        
    }

})
// setting genAi Api key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const ai = new GoogleGenAI({  apiKey: apiKey,});
router.post("/career", async(req,res)=>{
try {
    const {skills, location, experienceLevel,salaryExpectation,interests}= req.body;
    if(!skills){
        return res.status(400).json({
            message:"Skills required"
        });
        
    }
    const prompt = `
You are a Senior AI Career Architect, Hiring Strategist, and Labor Market Intelligence Analyst.

USER PROFILE:
- Skills: ${skills || "Not provided"}
- Experience Level: ${experienceLevel || "Not provided"}
- Preferred Location: ${location || "Not provided"}
- Salary Expectation: ${salaryExpectation || "Not provided"}
- Interests: ${interests || "Not provided"}

YOUR OBJECTIVE:
Generate a structured, realistic, market-aligned, data-driven career roadmap using strict labor market reasoning.

STRICT OUTPUT RULES (MANDATORY):
- Output ONLY valid JSON.
- No markdown.
- No commentary.
- No explanations outside JSON.
- No extra keys.
- Use EXACT field names.
- Use camelCase consistently.
- confidenceScore MUST be a number (0–100).
- Salary must be realistic and aligned with Indian market benchmarks.
- estimatedSalaryRange must follow this structure:
  {
    "min": number,
    "max": number,
    "currency": "INR",
    "period": "annual"
  }
- Responsibilities must be an array of 4–6 bullet points.
- All job roles must strictly align with provided skills and experience.
- Do NOT inflate salary unrealistically.
- If insufficient data → return fallback JSON exactly as defined.

MARKET SALARY CONSTRAINTS (INDIA BASELINE):
- 0–1 year: 3–6 LPA
- 2–3 years: 5–12 LPA
- 4–6 years: 10–22 LPA
Adjust only if strong justification exists.

RETURN EXACT STRUCTURE:

{
  "summary": "2–4 sentence strategic overview.",

  "profileAssessment": {
    "experienceLevelDetected": "Beginner | Intermediate | Advanced",
    "marketPositioning": "Realistic current standing.",
    "confidenceScore": 0
  },

  "jobOptions": [
    {
      "title": "Specific job title",
      "industryDemand": "Low | Moderate | High",
      "estimatedSalaryRange": {
        "min": 0,
        "max": 0,
        "currency": "INR",
        "period": "annual"
      },
      "responsibilities": [
        "Responsibility 1",
        "Responsibility 2",
        "Responsibility 3",
        "Responsibility 4"
      ],
      "whyGoodFit": "Clear skill-role alignment.",
      "growthPotential": "3–5 year trajectory."
    }
  ],

  "skillGapAnalysis": {
    "strongSkills": ["Skill 1"],
    "missingCriticalSkills": ["Skill A"],
    "improvementPriorityOrder": [
      "First improvement priority",
      "Second improvement priority",
      "Third improvement priority"
    ]
  },

  "learningRoadmap": {
    "3MonthPlan": [
      "Short-term milestone",
      "Second short-term milestone"
    ],
    "6MonthPlan": [
      "Mid-term milestone",
      "Second mid-term milestone"
    ],
    "12MonthPlan": [
      "Long-term milestone",
      "Second long-term milestone"
    ]
  },

  "skillsToLearn": [
    {
      "category": "Category name",
      "skills": [
        {
          "title": "Skill name",
          "whyImportant": "Business impact explanation.",
          "howToLearn": "Practical learning steps."
        }
      ]
    }
  ],

  "marketIntelligence": {
    "topHiringCompanies": ["Company 1", "Company 2"],
    "averageInterviewRounds": 0,
    "keyInterviewTopics": ["Topic 1", "Topic 2"]
  },

  "certifications": [
    {
      "name": "Certification Name",
      "priority": "High | Medium | Low",
      "estimatedTime": "X months",
      "costEstimate": "INR amount"
    }
  ],

  "salaryNegotiation": {
    "expectedRange": "X–Y LPA realistic range",
    "negotiationLeverage": "User's strongest leverage factors",
    "marketComparables": "What similar professionals are earning in this region."
  },

  "learningStrategy": {
    "approachTitle": "Strategic Growth Framework",
    "principles": [
      "Principle 1",
      "Principle 2",
      "Principle 3"
    ]
  },

  "riskFactors": [
    "Market risk",
    "Skill-related risk"
  ],

  "finalAdvice": "Clear next action recommendation."
}

FALLBACK (ONLY IF skills missing or empty):

{
  "summary": "Insufficient information to generate guidance.",
  "profileAssessment": {
    "experienceLevelDetected": "Unknown",
    "marketPositioning": "Cannot determine",
    "confidenceScore": 0
  },
  "jobOptions": [],
  "skillGapAnalysis": {
    "strongSkills": [],
    "missingCriticalSkills": [],
    "improvementPriorityOrder": []
  },
  "learningRoadmap": {
    "3MonthPlan": [],
    "6MonthPlan": [],
    "12MonthPlan": []
  },
  "skillsToLearn": [],
  "marketIntelligence": {
    "topHiringCompanies": [],
    "averageInterviewRounds": 0,
    "keyInterviewTopics": []
  },
  "certifications": [],
  "salaryNegotiation": {
    "expectedRange": "Unknown",
    "negotiationLeverage": "Insufficient data",
    "marketComparables": "Insufficient data"
  },
  "learningStrategy": {
    "approachTitle": "Next Step",
    "principles": ["Provide at least 3 technical or domain skills."]
  },
  "riskFactors": [],
  "finalAdvice": "Provide detailed skills, experience level, and preferences."
}
`;

const response= await ai.models.generateContent({
    model:"gemini-3-flash-preview",
    contents:prompt
});
let jsonResponse;
try {
    const rawText= response.text?.replace(/```json/g,"").replace(/```/g,"").trim();
    if(!rawText){
        throw new Error("Ai did not return a valid text response.");
    }
    jsonResponse= JSON.parse(rawText)

    
} catch (error) {
    return res.status(500).json({
        message:"Ai returned response that was not valid json",
        rawResponse:response.text
    })
    
}
res.json(jsonResponse)
    
} catch (error:any) {
    res.status(500).json({
        message:error.message
    })

    
}
    




    

})
router.post("/resume-analyser", async (req, res) => {
  try {
    const { pdfBase64 } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({
        message: "PDF base64 data is required",
      });
    }

    // Remove data URI prefix if present
    const cleanedBase64 = pdfBase64.replace(
      /^data:application\/pdf;base64,/,
      ""
    );

    // Basic size guard (approx 5MB limit)
    const MAX_SIZE = 5_000_000;
    if (cleanedBase64.length > MAX_SIZE) {
      return res.status(400).json({
        message: "PDF too large. Maximum allowed size is 5MB.",
      });
    }

    const prompt = `
You are a Senior ATS (Applicant Tracking System) Simulation Engine and Technical Resume Auditor with expertise in Fortune 500 recruitment systems (Workday, Greenhouse, Lever, Taleo).

RESUME CONTENT TO ANALYZE:

YOUR TASK:
1. FIRST: Automatically detect the candidate's target role(s) from their resume content (skills, experience, projects)
2. SECOND: Identify the industry-standard keywords for those detected roles
3. THIRD: Analyze how well the resume would perform in ATS systems for those roles
4. FOURTH: Provide role-specific optimization suggestions

AUTOMATIC ROLE DETECTION LOGIC:
Analyze the resume content and infer the most likely target role(s) based on:
- Technical skills mentioned (e.g., React + Node.js = Full Stack Developer)
- Job titles in work experience
- Project descriptions and technologies used
- Years of experience
- Domain expertise (FinTech, E-commerce, Healthcare, etc.)

Common Role Mappings:
- React/Angular/Vue + Node/Express/NestJS = "Full Stack Developer (MERN/MEAN)"
- Node.js + MongoDB/PostgreSQL + AWS = "Backend Engineer"
- React/Vue/Angular only = "Frontend Developer"
- Python + Django/Flask = "Backend Developer (Python)"
- Python + Pandas/NumPy/TensorFlow = "Data Scientist / ML Engineer"
- AWS/Azure/GCP + Terraform/Kubernetes = "DevOps Engineer / Cloud Engineer"
- Java + Spring Boot = "Backend Developer (Java)"
- React Native / Flutter = "Mobile App Developer"
- Python + Selenium + Pytest = "QA Automation Engineer"
- HTML/CSS/JS + Photoshop/Figma = "UI/UX Developer"

AUTOMATIC KEYWORD GENERATION:
Based on detected role, generate industry-standard keywords the resume SHOULD contain:

For Full Stack Developer (MERN):
- Core: React.js, Node.js, Express.js, MongoDB, JavaScript, TypeScript
- DevOps: Docker, Kubernetes, AWS, CI/CD, Git
- Testing: Jest, Mocha, Cypress, Unit Testing
- Architecture: REST APIs, Microservices, MVC, GraphQL
- Soft: Agile, Scrum, Cross-functional collaboration

For Backend Engineer:
- Languages: Node.js, Python, Java, Go
- Databases: PostgreSQL, MySQL, MongoDB, Redis
- Cloud: AWS (EC2, S3, Lambda), Azure, GCP
- Architecture: Microservices, Event-driven, Scalability
- Tools: Docker, Kubernetes, Jenkins, Git

For Frontend Developer:
- Frameworks: React, Vue, Angular, Next.js
- Styling: CSS3, Sass, Tailwind CSS, Material-UI
- State: Redux, Context API, Zustand
- Build: Webpack, Vite, npm, yarn
- Testing: Jest, React Testing Library

For Data Scientist:
- Languages: Python, R, SQL
- Libraries: Pandas, NumPy, Scikit-learn, TensorFlow, PyTorch
- Visualization: Matplotlib, Seaborn, Tableau, Power BI
- ML: Regression, Classification, Clustering, Deep Learning
- Tools: Jupyter, Git, Docker

EXPERIENCE LEVEL DETECTION:
- 0-1 years: Entry Level / Junior
- 1-3 years: Mid-Level / Intermediate
- 3-5 years: Senior
- 5-8 years: Senior / Lead
- 8+ years: Lead / Principal / Architect

STRICT OUTPUT RULES (MANDATORY):
- Respond ONLY in valid JSON
- Do NOT include markdown code fences (no \`\`\`json)
- Do NOT include commentary outside JSON structure
- All scores must be integers between 0 and 100
- atsScore MUST equal: (formatting×0.20) + (keywords×0.30) + (structure×0.20) + (readability×0.15) + (impact×0.15)
- Be realistic about scores - most resumes score 50-75
- If resume text is empty, return fallback JSON

EVALUATION CRITERIA:

1. FORMATTING (20% weight):
   Critical ATS Killers:
   - Two-column layouts (ATS reads left-to-right, scrambles content)
   - Tables for work experience (breaks chronological parsing)
   - Text boxes or graphics (invisible to most ATS)
   - Headers/footers (often skipped by parsers)
   - Fancy fonts (Brush Script, Comic Sans, etc.)
   - Special unicode (★, →, •, ✓)
   
   ATS-Friendly:
   - Single-column layout
   - Standard fonts: Arial, Calibri, Helvetica, Times New Roman
   - Simple bullets: - or • (not custom symbols)
   - Clean PDF or .docx format
   - No images/logos embedded
   - Standard margins (0.5-1 inch)

2. KEYWORDS (30% weight):
   Based on AUTO-DETECTED role, check for:
   - Core technical skills (programming languages, frameworks)
   - Tools and platforms (Git, Docker, AWS, etc.)
   - Methodologies (Agile, Scrum, TDD)
   - Soft skills (Leadership, Communication)
   - Industry buzzwords (Machine Learning, Cloud-Native, Scalability)
   
   Keyword Density:
   - Under-optimized: <1.5% of total words
   - Optimal: 1.5-3.5%
   - Over-stuffed: >4% (penalty for keyword spamming)

3. STRUCTURE (20% weight):
   Required sections in order:
   1. Contact Info (Name, Email, Phone, LinkedIn, GitHub/Portfolio)
   2. Professional Summary (optional but recommended, 2-4 lines)
   3. Work Experience (reverse chronological, most recent first)
   4. Skills (categorized by type)
   5. Education
   6. Optional: Projects, Certifications, Awards
   
   Red Flags:
   - Missing email/phone
   - Education before Experience (for 3+ years exp)
   - No dates on work experience
   - Inconsistent date formats
   - Personal info (photo, age, marital status)

4. READABILITY (15% weight):
   - Bullet points: max 2 lines each
   - Action verbs: Developed, Architected, Led, Optimized, Implemented
   - No first-person: avoid "I", "me", "my"
   - Consistent tense: past for old roles, present for current
   - No jargon without context
   - No typos or grammar errors

5. IMPACT (15% weight):
   Quantified Achievements Formula:
   - [Action Verb] + [What you did] + [Metric/Result]
   - Example: "Optimized database queries, reducing load time by 45% for 100K users"
   
   Look for:
   - Numbers: percentages, dollar amounts, time saved
   - Scale: user count, data volume, team size
   - Business impact: revenue, efficiency, cost reduction
   - Technical complexity: distributed systems, high availability

RETURN EXACT STRUCTURE:

{
  "atsScore": 0,
  
  "autoDetectedContext": {
    "inferredTargetRoles": ["Primary Role", "Secondary Role"],
    "detectedExperienceLevel": "Entry | Mid | Senior | Lead",
    "primaryTechStack": ["Tech 1", "Tech 2", "Tech 3"],
    "detectedDomain": "FinTech | E-commerce | Healthcare | SaaS | etc.",
    "resumeWordCount": 0,
    "estimatedPages": 0
  },
  
  "scoreBreakdown": {
    "formatting": {
      "score": 0,
      "maxScore": 20,
      "weight": "20%",
      "feedback": "Detailed ATS compatibility assessment. Mention specific parsing risks.",
      "criticalIssues": ["Two-column layout detected", "Tables used for experience"],
      "atsCompatibility": "High | Medium | Low"
    },
    "keywords": {
      "score": 0,
      "maxScore": 30,
      "weight": "30%",
      "feedback": "Keyword coverage for detected role(s).",
      "detectedKeywords": ["React", "Node.js", "MongoDB"],
      "missingCriticalKeywords": ["Docker", "AWS", "CI/CD", "Jest"],
      "keywordDensity": "2.3%",
      "densityAssessment": "Under-optimized | Optimal | Over-stuffed",
      "roleMatchPercentage": 65
    },
    "structure": {
      "score": 0,
      "maxScore": 20,
      "weight": "20%",
      "feedback": "Section organization and completeness.",
      "presentSections": ["Contact", "Experience", "Skills", "Education"],
      "missingSections": ["Projects", "Certifications"],
      "sectionOrder": "Correct | Incorrect",
      "dateConsistency": "Consistent | Inconsistent"
    },
    "readability": {
      "score": 0,
      "maxScore": 15,
      "weight": "15%",
      "feedback": "Clarity and professional language assessment.",
      "averageBulletLength": "12 words",
      "actionVerbStrength": "Strong | Moderate | Weak",
      "tenseConsistency": "Consistent | Inconsistent",
      "grammarIssues": 0
    },
    "impact": {
      "score": 0,
      "maxScore": 15,
      "weight": "15%",
      "feedback": "Quantification and business value.",
      "totalBulletPoints": 18,
      "quantifiedBullets": 5,
      "quantificationRate": "28%",
      "impactLevel": "Strong | Moderate | Weak"
    }
  },

  "contactInfoValidation": {
    "hasEmail": true,
    "hasPhone": true,
    "hasLinkedIn": false,
    "hasGitHub": false,
    "hasPortfolio": false,
    "hasLocation": true,
    "missingCritical": ["GitHub profile (recommended for tech roles)"],
    "emailFormat": "Valid | Invalid",
    "phoneFormat": "Valid | Invalid"
  },

  "parsingRisks": [
    {
      "severity": "critical | high | medium | low",
      "issue": "Specific ATS parsing problem",
      "impact": "How this affects ATS readability",
      "fix": "Step-by-step solution",
      "estimatedScoreImpact": "+10 points if fixed"
    }
  ],

  "sectionAnalysis": [
    {
      "section": "Professional Summary",
      "present": true,
      "quality": "Strong | Adequate | Weak | Missing",
      "currentContent": "Brief excerpt if present",
      "feedback": "Specific analysis",
      "suggestion": "Improvement recommendation",
      "priority": "high | medium | low"
    },
    {
      "section": "Work Experience",
      "present": true,
      "quality": "Strong | Adequate | Weak",
      "bulletPointCount": 15,
      "quantifiedCount": 5,
      "feedback": "Analysis of experience descriptions",
      "suggestion": "How to strengthen bullets"
    },
    {
      "section": "Skills",
      "present": true,
      "quality": "Adequate",
      "categorized": false,
      "feedback": "Skills are listed but not categorized",
      "suggestion": "Group into: Languages, Frameworks, Tools, Cloud, Databases"
    },
    {
      "section": "Projects",
      "present": false,
      "quality": "Missing",
      "feedback": "No projects section found",
      "suggestion": "Add 2-3 notable projects with tech stack and impact metrics"
    }
  ],

  "keywordGapAnalysis": {
    "forDetectedRole": "Full Stack Developer (MERN)",
    "industryStandardKeywords": [
      "React.js", "Node.js", "Express.js", "MongoDB", "TypeScript",
      "Docker", "AWS", "CI/CD", "Jest", "REST APIs", "Git"
    ],
    "yourKeywords": ["React", "Node.js", "MongoDB", "JavaScript"],
    "matchedKeywords": ["React", "Node.js", "MongoDB"],
    "missingKeywords": [
      "TypeScript (High Priority - 70% of jobs require)",
      "Docker (High Priority - 60% of jobs require)",
      "AWS (Medium Priority - 50% of jobs require)",
      "Jest/Testing (Medium Priority)",
      "CI/CD (Medium Priority)"
    ],
    "matchScore": 45,
    "recommendations": [
      "Add 'TypeScript' to skills section (if you know it)",
      "Include 'Docker' if used in any project",
      "Mention cloud platform (AWS/Azure/GCP) if applicable"
    ]
  },

  "suggestions": [
    {
      "category": "Keywords",
      "issue": "Missing 5 high-value keywords for Full Stack Developer role",
      "recommendation": "Add to Skills section: TypeScript, Docker, AWS, Jest, CI/CD Pipeline",
      "priority": "high",
      "estimatedScoreIncrease": "+12 points",
      "example": {
        "before": "Skills: React, Node.js, MongoDB",
        "after": "Skills: React, Node.js, MongoDB, TypeScript, Docker, AWS, Jest, CI/CD"
      }
    },
    {
      "category": "Impact",
      "issue": "Only 5 of 18 bullets are quantified (28% vs 70% target)",
      "recommendation": "Add metrics to 8 more bullet points using [Action] + [Result] + [Impact]",
      "priority": "high",
      "estimatedScoreIncrease": "+8 points",
      "example": {
        "before": "Developed REST APIs for user authentication",
        "after": "Developed REST APIs handling 50K+ daily auth requests with 99.9% uptime"
      }
    },
    {
      "category": "Formatting",
      "issue": "Two-column layout will scramble content in most ATS systems",
      "recommendation": "Convert to single-column layout with sections stacked vertically",
      "priority": "critical",
      "estimatedScoreIncrease": "+15 points",
      "example": {
        "before": "[Skills on left] | [Experience on right]",
        "after": "[Contact] → [Summary] → [Experience] → [Skills] → [Education]"
      }
    }
  ],

  "strengths": [
    "Clear technical stack (React, Node.js) aligns with Full Stack Developer roles",
    "Consistent date formatting (MM/YYYY) throughout experience",
    "Education section properly placed after experience"
  ],

  "roleAlignment": {
    "detectedPrimaryRole": "Full Stack Developer (MERN Stack)",
    "alignmentScore": 72,
    "roleMatchStrength": "Strong | Moderate | Weak",
    "alternateRoles": ["Backend Engineer (Node.js)", "Frontend Developer (React)"],
    "bestFitCompanies": ["Startups", "Product Companies", "SaaS firms"],
    "missingForRole": [
      "System Design experience for senior roles",
      "Leadership/mentoring examples",
      "Cloud deployment experience"
    ],
    "recommendedJobTitles": [
      "Full Stack Developer - MERN",
      "Software Engineer - JavaScript",
      "Backend Developer - Node.js"
    ]
  },

  "competitivePositioning": {
    "marketLevel": "Competitive",
    "atsPassProbability": "65%",
    "recruiterShortlistProbability": "55%",
    "riskOfAutoRejection": "Medium",
    "reasoning": "Resume has solid technical foundation but lacks quantified impact and some key modern stack keywords (Docker, AWS, TypeScript). With suggested improvements, can reach 85%+ ATS pass rate.",
    "comparisonToAverage": {
      "averageATSScore": 58,
      "yourScore": 65,
      "percentile": "Top 40%"
    }
  },

  "employmentHistory": {
    "totalYearsExperience": 2.5,
    "currentlyEmployed": true,
    "employmentGaps": [],
    "jobHoppingRisk": "None",
    "careerProgression": "Positive | Stable | Unclear",
    "notes": "Steady growth in responsibilities"
  },

  "quickWins": [
    "Add 5 missing keywords (TypeScript, Docker, AWS, Jest, CI/CD) - Est. +12 pts",
    "Quantify 8 bullet points with metrics (users served, performance improvements, etc.) - Est. +8 pts",
    "Convert two-column layout to single-column - Est. +15 pts",
    "Add GitHub profile link with 3+ notable projects - Est. +5 pts"
  ],

  "estimatedScoreAfterFixes": 95,

  "summary": "Your resume is currently scoring 65/100 for Full Stack Developer (MERN) roles - competitive but with room for improvement. Main issues: (1) Two-column layout will cause ATS parsing failures, (2) Missing 5 high-value keywords (TypeScript, Docker, AWS), and (3) Only 28% of bullets are quantified. Quick fixes can boost your score to 95/100 and increase shortlist probability from 55% to 85%+."
}

FALLBACK (IF resume content empty or unreadable):

{
  "atsScore": 0,
  "autoDetectedContext": {
    "inferredTargetRoles": [],
    "detectedExperienceLevel": "Unknown",
    "primaryTechStack": [],
    "detectedDomain": "Unknown",
    "resumeWordCount": 0,
    "estimatedPages": 0
  },
  "scoreBreakdown": {
    "formatting": {
      "score": 0,
      "maxScore": 20,
      "weight": "20%",
      "feedback": "No resume content provided.",
      "criticalIssues": [],
      "atsCompatibility": "Unknown"
    },
    "keywords": {
      "score": 0,
      "maxScore": 30,
      "weight": "30%",
      "feedback": "Cannot analyze keywords without resume.",
      "detectedKeywords": [],
      "missingCriticalKeywords": [],
      "keywordDensity": "0%",
      "densityAssessment": "Unknown",
      "roleMatchPercentage": 0
    },
    "structure": {
      "score": 0,
      "maxScore": 20,
      "weight": "20%",
      "feedback": "Cannot evaluate structure.",
      "presentSections": [],
      "missingSections": ["All sections"],
      "sectionOrder": "Unknown",
      "dateConsistency": "Unknown"
    },
    "readability": {
      "score": 0,
      "maxScore": 15,
      "weight": "15%",
      "feedback": "No content to assess.",
      "averageBulletLength": "0 words",
      "actionVerbStrength": "Unknown",
      "tenseConsistency": "Unknown",
      "grammarIssues": 0
    },
    "impact": {
      "score": 0,
      "maxScore": 15,
      "weight": "15%",
      "feedback": "Cannot measure impact.",
      "totalBulletPoints": 0,
      "quantifiedBullets": 0,
      "quantificationRate": "0%",
      "impactLevel": "Unknown"
    }
  },
  "contactInfoValidation": {
    "hasEmail": false,
    "hasPhone": false,
    "hasLinkedIn": false,
    "hasGitHub": false,
    "hasPortfolio": false,
    "hasLocation": false,
    "missingCritical": ["All contact information"],
    "emailFormat": "Unknown",
    "phoneFormat": "Unknown"
  },
  "parsingRisks": [],
  "sectionAnalysis": [],
  "keywordGapAnalysis": {
    "forDetectedRole": "Unknown",
    "industryStandardKeywords": [],
    "yourKeywords": [],
    "matchedKeywords": [],
    "missingKeywords": [],
    "matchScore": 0,
    "recommendations": ["Provide resume content for analysis"]
  },
  "suggestions": [
    {
      "category": "Content",
      "issue": "No resume provided",
      "recommendation": "Upload resume in PDF or DOCX format",
      "priority": "critical",
      "estimatedScoreIncrease": "N/A",
      "example": {
        "before": "No content",
        "after": "Complete resume with all sections"
      }
    }
  ],
  "strengths": [],
  "roleAlignment": {
    "detectedPrimaryRole": "Unknown",
    "alignmentScore": 0,
    "roleMatchStrength": "Unknown",
    "alternateRoles": [],
    "bestFitCompanies": [],
    "missingForRole": [],
    "recommendedJobTitles": []
  },
  "competitivePositioning": {
    "marketLevel": "Unknown",
    "atsPassProbability": "0%",
    "recruiterShortlistProbability": "0%",
    "riskOfAutoRejection": "High",
    "reasoning": "No resume content available for analysis.",
    "comparisonToAverage": {
      "averageATSScore": 58,
      "yourScore": 0,
      "percentile": "N/A"
    }
  },
  "employmentHistory": {
    "totalYearsExperience": 0,
    "currentlyEmployed": false,
    "employmentGaps": [],
    "jobHoppingRisk": "Unknown",
    "careerProgression": "Unknown",
    "notes": "No employment data"
  },
  "quickWins": ["Upload resume for personalized ATS optimization recommendations"],
  "estimatedScoreAfterFixes": 0,
  "summary": "Please upload your resume in PDF or DOCX format. The ATS analysis will automatically detect your target role, identify missing keywords, check formatting compatibility, and provide specific recommendations to improve your ATS score from current industry average of 58/100 to 85-95/100."
}
`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      config: {
  temperature: 0.2,
  topP: 0.8,
  responseMimeType: "application/json",
},

      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: cleanedBase64,
              },
            },
          ],
        },
      ],
    });

    const rawText = response.text?.trim();

    if (!rawText) {
      throw new Error("AI did not return a valid response.");
    }

    let parsed;

    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      return res.status(500).json({
        message: "AI returned invalid JSON.",
        rawResponse: rawText,
      });
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error("Resume analyser error:", error);

    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
});



export default router;

