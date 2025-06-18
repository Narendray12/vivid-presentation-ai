"use server";
import { GoogleGenAI } from "@google/genai";

export const generateCreativePrompt = async (userPrompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMENI_KEY });

  const finalPrompt = `
    Create a coherent and relevant outline for the following prompt: ${userPrompt}.
    The outline should consist of at least 6 points, with each point written as a single sentence.
    Ensure the outline is well-structured and directly related to the topic.
    Return the output in the following JSON format:

    {
        "outlines": [
            "Point 1",
            "Point 2",
            "Point 3",
            "Point 4",
            "Point 5",
            "Point 6"
        ]
    }

    Ensure that the JSON is valid and properly formatted. Do not include any other text or explanations outside the JSON.
  `;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
      config: {
        maxOutputTokens: 1000,
        temperature: 0.0,
      },
    });

    let textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("Raw Response Text:", textResponse);

    // Strip triple backticks and optional language tag
    if (textResponse?.startsWith("```")) {
      textResponse = textResponse.replace(/^```[a-z]*\n?/, "").replace(/```$/, "");
    }

    if (textResponse) {
      try {
        const jsonResponse = JSON.parse(textResponse);
        if (jsonResponse.outlines) {
          return { status: 200, data: jsonResponse.outlines };
        } else {
          return { status: 400, error: "Invalid response structure" };
        }
      } catch (error) {
        console.error("JSON parse error:", error);
        return { status: 500, error: "Failed to parse JSON from AI response" };
      }
    } else {
      return { status: 400, error: "No text in AI response" };
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { status: 500, error: "Internal server error" };
  }
};
