# No Paid APIs Configured

This project is currently submission-safe from a billing perspective.

## Current Status

- No paid API keys are stored in this repository.
- No active OpenAI key is configured in the project env files.
- No active Razorpay merchant key is configured in the project env files.
- No GitHub token is configured in the project env files.
- The checked local runtime env for this machine also had no active values for:
  - `OPENAI_API_KEY`
  - `VITE_OPENAI_API_KEY`
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
  - `GITHUB_TOKEN`
  - `POLLINATIONS_TOKEN`

## What Works Without Payment

- Frontend application flows
- Browser-persisted demo data
- Pollinations free AI mode
- GitHub public profile fetch
- LeetCode public/third-party stats fetch
- Razorpay payment-link redirection entered by users

## What Would Only Need Payment If Enabled Later

- OpenAI API usage after manually adding an OpenAI API key
- Real Razorpay merchant integration after manually adding Razorpay merchant keys
- Any future paid authenticated third-party APIs added later

## Important Note

The repository may still contain optional integration code paths for OpenAI or payment gateways, but they are not configured right now. Billing can only happen later if someone intentionally adds valid paid credentials.
