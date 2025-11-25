import { GoogleGenAI } from "@google/genai";
import { UserPreferences, AgentResponse, StockRecommendation, InvestmentStrategy } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDailyPicks = async (prefs: UserPreferences): Promise<AgentResponse> => {
  const currentDate = new Date().toLocaleDateString();

  let strategyInstruction = "";
  
  if (prefs.strategy === InvestmentStrategy.VALUE) {
    strategyInstruction = `
      CRITICAL STRATEGY: "Deep Value / 5x Potential Turnaround".
      You must find stocks that meet the following strict criteria:
      1. **High Return Potential**: Target 500% (5x) growth potential over the ${prefs.horizon}.
      2. **Contrarian Entry**: The stock price should be currently depressed or have a declining chart/trend (buying the dip).
      3. **Undervalued**: Look for low P/E (Price to Earnings) or extremely low P/S (Price to Sales) ratios relative to peers.
      4. **Strong Fundamentals**: The company MUST have a solid user base, high brand awareness, or inelastic market demand.
      5. **Turnaround Story**: Identify a clear catalyst (e.g., new product, management change, market cycle shift) that will drive the 5x growth.
      
      Do NOT recommend generic blue-chip stocks like Apple or Microsoft unless they are severely crashed. Focus on hidden gems, beaten-down tech, or misunderstood companies.
    `;
  } else if (prefs.strategy === InvestmentStrategy.GROWTH) {
    strategyInstruction = `
      CRITICAL STRATEGY: "Momentum Growth".
      Focus on companies with accelerating revenue earnings, high relative strength, and sector leadership.
    `;
  } else {
    strategyInstruction = `
      CRITICAL STRATEGY: "Dividend & Stability".
      Focus on safe, income-generating stocks with low volatility.
    `;
  }

  const prompt = `
    You are an elite hedge fund analyst AI. Today is ${currentDate}.
    
    User Profile:
    - Risk Tolerance: ${prefs.riskLevel}
    - Investment Horizon: ${prefs.horizon}
    - Strategy: ${prefs.strategy}
    - Interested Sectors: ${prefs.sectors.join(", ")}
    - Capital: $${prefs.capital}

    ${strategyInstruction}

    Task:
    1. Search for current real-time market data, news, valuations, and technical trends.
    2. Identify 3 specific stock recommendations that perfectly match the "CRITICAL STRATEGY" above.
    3. Determine the overall market sentiment based on today's news.

    Output Requirements:
    - Return a VALID JSON object wrapped in a \`\`\`json\`\`\` code block.
    - The JSON must follow this structure exactly:
      {
        "recommendations": [
          {
            "symbol": "TICKER",
            "name": "Company Name",
            "price": "Current Price",
            "changePercent": "Today's change",
            "rationale": "Detailed explanation of WHY this matches the 5x turnaround criteria. Mention valuation metrics (P/E, P/S) and the specific fundamental strength (brand/users) vs price decline.",
            "riskRating": "Low" | "Medium" | "High",
            "potentialUpside": "Estimated upside (e.g. +450% over 5y)",
            "sector": "Sector Name"
          }
        ],
        "marketSentiment": "A brief summary of the market mood today."
      }
    - Ensure 3 unique recommendations.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.9, // Higher temperature for more creative/contrarian picks
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
    let jsonStr = jsonMatch ? jsonMatch[1] : text;
    jsonStr = jsonStr.trim();

    let data: { recommendations: StockRecommendation[]; marketSentiment: string };
    
    try {
        data = JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse Gemini response as JSON", e);
        throw new Error("The agent could not format the market data correctly. Please try again.");
    }

    const sources = groundingChunks
      .map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
      .filter((s: any) => s !== null) as { title: string; uri: string }[];

    const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values()).slice(0, 5);

    return {
      recommendations: data.recommendations,
      marketSentiment: data.marketSentiment,
      sources: uniqueSources,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};