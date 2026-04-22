<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/a0602fc9-a31b-4f41-9e4f-372a8fb2189a

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create `.env.local` and set `GEMINI_API_KEY` to a valid Gemini key from Google AI Studio
   - Optional: set `GEMINI_API_KEYS` as comma-separated keys for automatic key failover
   - Optional: set `GEMINI_MODEL` (default: `gemini-2.5-flash`)
   - Optional: set `GEMINI_FALLBACK_MODELS` as comma-separated models for automatic fallback
3. Run the app:
   `npm run dev`

### Quota / 429 troubleshooting

If you see `RESOURCE_EXHAUSTED` or `Quota exceeded`:

- Check your active limits in AI Studio rate limits
- Ensure billing/tier is enabled for the project if your free-tier limit is 0
- Use a lower-cost/default model in `.env.local`, e.g. `GEMINI_MODEL=gemini-2.5-flash`
# ai-software-engineer-agent
