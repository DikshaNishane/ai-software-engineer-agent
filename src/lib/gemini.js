import { GoogleGenAI, Type } from "@google/genai";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseRetryDelayMs(errorText) {
  // Handles patterns like: "Please retry in 15.45s" or "retryDelay":"15s"
  const messageMatch = errorText.match(/retry in\s+([\d.]+)s/i);
  if (messageMatch) {
    return Math.max(250, Math.ceil(Number(messageMatch[1]) * 1000));
  }

  const retryInfoMatch = errorText.match(/"retryDelay"\s*:\s*"([\d.]+)s"/i);
  if (retryInfoMatch) {
    return Math.max(250, Math.ceil(Number(retryInfoMatch[1]) * 1000));
  }

  return 1500;
}

function isQuotaError(errorText) {
  return (
    errorText.includes("RESOURCE_EXHAUSTED") ||
    errorText.includes("Quota exceeded") ||
    errorText.includes("rate limit") ||
    errorText.includes("429")
  );
}

function isUnavailableError(errorText) {
  return (
    errorText.includes("UNAVAILABLE") ||
    errorText.includes("high demand") ||
    errorText.includes("503")
  );
}

export async function invokeLLM({ prompt, responseJsonSchema }) {
  const singleApiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  const apiKeysRaw = import.meta.env.VITE_GEMINI_API_KEYS || process.env.GEMINI_API_KEYS || "";
  const apiKeys = [singleApiKey, ...apiKeysRaw.split(",")]
    .map(k => (k || "").trim())
    .filter(Boolean)
    .filter((key, idx, arr) => arr.indexOf(key) === idx);
  const configuredModel =
    import.meta.env.VITE_GEMINI_MODEL || process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const fallbackModelsRaw =
    import.meta.env.VITE_GEMINI_FALLBACK_MODELS ||
    process.env.GEMINI_FALLBACK_MODELS ||
    "gemini-2.5-flash-lite,gemini-2.0-flash";
  const fallbackModels = fallbackModelsRaw
    .split(",")
    .map(m => m.trim())
    .filter(Boolean);
  const modelsToTry = [configuredModel, ...fallbackModels].filter(
    (model, idx, arr) => arr.indexOf(model) === idx
  );
  
  if (!apiKeys.length || apiKeys.every(key => /YOUR_GEMINI_API_KEY_HERE/i.test(key))) {
    throw new Error("Missing Gemini API key. Set GEMINI_API_KEY or GEMINI_API_KEYS in .env.local and restart the dev server.");
  }
  
  const config = {
    temperature: 0.7,
  };

  if (responseJsonSchema) {
    config.responseMimeType = "application/json";
    config.responseSchema = responseJsonSchema;
  }
  
  let response;
  let lastError = null;

  for (const model of modelsToTry) {
    for (const apiKey of apiKeys) {
      const ai = new GoogleGenAI({ apiKey });

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: prompt,
            config
          });
          break;
        } catch (error) {
          const msg = String(error?.message || "");
          lastError = error;

          if (msg.includes("API_KEY_INVALID") || msg.includes("API key not valid")) {
            // Try next key from the pool.
            break;
          }

          if (isQuotaError(msg)) {
            // Retry once per key+model using API-provided delay when available.
            if (attempt < 2) {
              await sleep(parseRetryDelayMs(msg));
              continue;
            }
            break;
          }

          if (isUnavailableError(msg)) {
            // Service is under temporary pressure. Retry with backoff,
            // then fall through to next key/model.
            if (attempt < 3) {
              const delay = Math.max(parseRetryDelayMs(msg), 1000 * attempt);
              await sleep(delay);
              continue;
            }
            break;
          }

          throw error;
        }
      }

      if (response) {
        break;
      }
    }

    if (response) {
      break;
    }
  }

  if (!response) {
    const msg = String(lastError?.message || "");
    if (isQuotaError(msg)) {
      throw new Error(
        "Gemini quota exceeded for all configured keys/models. In AI Studio, check Rate limits and Billing, add more keys via GEMINI_API_KEYS in .env.local, or switch to a lower-cost model via GEMINI_MODEL (for example: gemini-2.5-flash)."
      );
    }
    if (isUnavailableError(msg)) {
      throw new Error(
        "Gemini is temporarily overloaded (503 UNAVAILABLE). Please retry in a few moments. You can also keep GEMINI_MODEL as gemini-2.5-flash and fallback models enabled in .env.local for better resilience."
      );
    }
    throw lastError || new Error("Gemini request failed.");
  }
  
  const text = response.text;
  
  if (responseJsonSchema) {
    try {
      return JSON.parse(text);
    } catch (e) {
      // In case the model returns markdown JSON blocks
      const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(clean);
    }
  }
  
  return text;
}
