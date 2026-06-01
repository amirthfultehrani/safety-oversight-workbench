# Contributing to Safety Oversight Workbench

First off, in advance, thank you for considering contributing to the Safety Oversight Workbench! This project is only a prototype, but it is people like you that will make it a powerful asset for AI safety research.

## Adding New Case Studies

The primary way to contribute is by adding new cases to the Case Library. All cases are simulated reconstructions of real-world failure modes.

1. Open `src/cases.js`.
2. Study the existing format of the exported `cases` object.
3. Add a new key for your case. Ensure you provide:
   - `id`: A unique identifier.
   - `title`: A concise, descriptive title.
   - `description`: A 1-sentence summary of the failure mode.
   - `metricType`, `metricValue`, `riskProfile`: Telemetry data for the drift dashboard.
   - `driftHistory`: An array of numbers (0-100) representing alignment drift over time.
   - `evidenceText`: The ground-truth text for the Evidence Vault.
   - `dialogue`: An array of conversation objects (must include a `simulatedLatentTrace` for the AI).
4. Test your case locally by running `npm run dev` and selecting it from the dropdown.

## Submitting a Pull Request

1. Fork the repository and create your branch from `main`.
2. Ensure your code passes all linting checks by running `npm run lint`.
3. Create a Pull Request with a clear description of the new case or feature you've added.
