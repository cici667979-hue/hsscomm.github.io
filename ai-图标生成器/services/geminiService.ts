import { GoogleGenAI } from "@google/genai";
import { IconStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const STYLE_PROMPTS: Record<IconStyle, string> = {
  [IconStyle.CLAY_3D]: "3d clay render style icon, cute, soft smooth lighting, vibrant pastel colors, isometric view, plastic texture, high quality, 4k, clean background",
  [IconStyle.FLAT]: "flat design icon, vector art style, simple geometric shapes, solid colors, minimal details, professional ui element, white background",
  [IconStyle.ICONFONT]: "pure black and white icon, solid black glyph, white background, high contrast, silhouette, stencil style, minimal, no shading, no gradients, vector ready",
};

/**
 * Generates icons using the Gemini Flash Image model.
 * Handles batching manually as generateContent typically returns 1 image per request.
 */
export const generateIcons = async (
  prompt: string,
  style: IconStyle,
  count: number
): Promise<string[]> => {
  // Using gemini-2.5-flash-image as it is the standard, reliable image generation model
  const modelName = 'gemini-2.5-flash-image'; 
  const fullPrompt = `${prompt}, ${STYLE_PROMPTS[style]}, isolated, centered`;

  // Batch requests to manage concurrency and avoid rate limits
  const BATCH_SIZE = 4; 
  const results: string[] = [];

  for (let i = 0; i < count; i += BATCH_SIZE) {
    const chunkCount = Math.min(BATCH_SIZE, count - i);
    const chunkPromises = [];

    for (let j = 0; j < chunkCount; j++) {
      const p = ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [{ text: fullPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
          }
        }
      }).then(response => {
        // Parse the response to find the image part
        for (const candidate of response.candidates || []) {
          for (const part of candidate.content?.parts || []) {
            if (part.inlineData && part.inlineData.data) {
              return part.inlineData.data;
            }
          }
        }
        return null;
      }).catch(err => {
        console.error("Gemini API Error:", err);
        return null;
      });
      
      chunkPromises.push(p);
    }

    const chunkResults = await Promise.all(chunkPromises);
    chunkResults.forEach(base64 => {
      if (base64) results.push(base64);
    });
  }

  return results;
};