# AI Buying Signal Demo

Job-specific MVP demonstrating a narrow slice of an AI automation engineer brief: turn website behavior into an explained buying signal and a safe next action.

## What it does

The demo receives visitor events, scores intent from visible evidence, shows the recommended CRM action, and exposes mock-mode status for the AI and CRM adapters. The interface is designed for an operator who needs to understand why a visitor is interesting without reading workflow logs. It starts with an empty event stream; every event shown after that comes from a login or tracking request made during the current run.

The demo login accepts a generic username and password. Submitting it creates a visitor event, mock Salesforce lead, mock email, mock Slack notification, and n8n-ready event.

The server also exposes a small tracking adapter at `/tracking.js`. It masks the observed IP before storing it, assigns a coarse demo region, and routes US and EU examples differently. Use usernames containing `us` or `eu` to exercise both demo paths; this is deterministic mock geolocation, not a production IP geolocation service.

## Demo boundary

This is a portfolio/demo artifact, not a production deployment. Salesforce, Slack, Firecrawl, email, OpenRouter, and Ollama are documented integration points; the current default is mock mode. The full sanitized brief is in `docs/job-description.md`.

## OpenRouter budget guard

The intended account-level cap is **$1.00**. Before using a real key, set a $1 monthly/spend limit in the OpenRouter dashboard. The app also reads `MAX_AI_SPEND_USD=1`; no API key belongs in Git. Use `.env` locally or Railway secrets.

## Run locally

```bash
cp .env.example .env
npm start
```

Open `http://localhost:3000`. Docker also starts local n8n:

```bash
docker compose up --build
```

App: `http://localhost:3000` · n8n: `http://localhost:5678`

## Railway

The Dockerfile and `railway.json` are included for Railway. Start with `AI_MODE=mock`, `SALESFORCE_MODE=mock`, and `MAX_AI_SPEND_USD=1`. Add the OpenRouter secret only after setting the account-level $1 limit.

## Not implemented in this demo

- Production Salesforce, Slack, email, Twilio, Microsoft 365, or Google Workspace credentials.
- Firecrawl or reverse-IP provider.
- Ollama or Mac Mini deployment.
- Automated outbound sales messages.
- Production security, deliverability, scale, or model-accuracy claims.

## Mock email and n8n

High-intent events appear in the in-memory mock mail activity and notification panel. Import `n8n-workflow.json` into local n8n; it exposes a visitor webhook and forwards the payload to the app's mock processing endpoint.

## Optional live OpenRouter mode

Set `AI_MODE=live` only after confirming the OpenRouter account-level $1 limit. Each demo request has a local estimated-cost guard of $0.01 and will not call the provider after the configured cap is reached. The default remains `AI_MODE=mock`.
