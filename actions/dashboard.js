"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAIInsights = async (industry) => {
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  return JSON.parse(cleanedText);
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  // If no insights exist, generate them
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
}

export async function getUsersFeedback() {
  try {
    const feedbacks = await db.feedback.findMany({
      include: {
        user: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    return {
      feedbacks,
    };
  } catch (error) {
    console.error("Error getting feedback:", error);
    throw new Error("Failed to get feedback");
  }
}

export async function generateCoverLetter(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const prompt = `
    Generate a personalized cover letter for a ${
      user.industry
    } professional applying for the position of ${data.jobTitle} at ${
      data.companyName
    }. 
    The applicant's name is ${user.name} and has expertise in ${
      user.skills?.length ? user.skills.join(", ") : "various relevant skills"
    }.

    The cover letter should be structured as follows:
    - Introduction: Express enthusiasm for the role and the company.
    - Skills & Experience: Highlight relevant expertise and accomplishments.
    - Alignment with Job Description: Explain how the applicant's skills align with the job requirements.
    - Conclusion: Express eagerness for an interview and appreciation for the opportunity.
    - Concise (no more than 3 short paragraphs).
    - Natural, conversational, and engaging.
    - Fully written with **no placeholders** like "[mention this]" or "[describe that]".
    - Directly ready to send.
    - Be **fully written** with **no placeholders** (e.g., no text like "[mention this]" or "[describe that]").
    - Start with Dear and end with Regards
    
    Do not include any of the following:
    - Mentions like "previous company," "platform where the ad was seen," or anything that requires further input or explanation.
    - Any statements that need additional context, e.g., "mention this specific area of work" or "describe a relevant accomplishment."
    
    Format it as follows:
    "Cover Letter:
    [Generated Cover Letter]"
    
    Do **not** include extra explanations or formatting.
  `;
    console.log("geenratee");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const coverLetter = response.text().trim();
    return { success: true, coverLetter };
  } catch (error) {
    console.error("Error generating cover letter:", error);
  }
}
