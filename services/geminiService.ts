import { GoogleGenAI } from "@google/genai";
import { META_PROMPT_XML } from '../constants';
import { GenerationRequest, RealityFilterType } from '../types';

export const streamArchitectureGeneration = async (
  request: GenerationRequest,
  onChunk: (text: string) => void
) => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Construct the prompt by combining the meta-prompt with the user's specific request
  const activeFilters = request.activeFilters.map(f => ` - ${f}`).join('\n');
  
  const userPrompt = `
    GOVERNANCE CONTEXT:
    - TARGET_ENVIRONMENT: ${request.environment || 'Experimentation'}
    - RISK_LEVEL: ${request.riskLevel || 'Medium'}
    
    TASK: ${request.task}
    
    CONTEXT: ${request.context || 'No additional context provided.'}
    
    ACTIVE REALITY FILTERS:
    ${activeFilters}
    
    Please provide the complete deliverable following the <output_format> structure defined in the meta-prompt. 
    Ensure security protocols match the ${request.riskLevel} risk profile.
  `;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: request.riskLevel === 'High' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
      config: {
        systemInstruction: META_PROMPT_XML,
        temperature: 0.7,
      },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    });

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        onChunk(text);
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
