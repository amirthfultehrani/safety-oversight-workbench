# Safety Oversight Workbench

> **An interactive lab for auditing Large Language Models (LLMs) and enforcing epistemic friction during safety adjudication.**

![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Version](https://img.shields.io/badge/version-1.0.0-orange?style=flat-square)
![Tech Stack](https://img.shields.io/badge/tech-React%2019%20|%20Vite-blueviolet?style=flat-square)

**🟢 Live Demo:** [View on Vercel](https://safety-oversight-workbench.vercel.app/)

<video src="./src/assets/safetyoversightworkbench-heroDemo.mp4" controls autoplay loop muted></video>

## 🎯 Project Purpose: Epistemic Friction

As Large Language Models become increasingly more persuasive and authoritative, human reviewers are increasingly susceptible to **automation bias** - the tendency to blindly trust machine outputs and "rubber stamp" - to accept outputs without proper scrutiny. 

Consequently, the **Safety Oversight Workbench** is designed to combat this by enforcing **Epistemic Friction** - an intentional UI/UX design that slows the reviewer down and forces them to:
1. Examine the model's internal latent trace (thought process) to catch alignment drift.
2. Manually cross-reference the AI's claims against simulated external ground-truth sources.
3. Make a choice - to allow the output or to reroute to an expert safety control model.
4. Acknowledge the expert safety control model's response before unlocking final output.

By mandating this friction, one can help ensure that researchers and safety adjudicators do not rubber-stamp outputs, actively preventing AI safety mistakes from slipping through high-throughput review pipelines ranging from model training to red-teaming exercises (e.g., adversial attacks against a model, reinforcement learning from human feedback).

## ✨ Features & Highlights

*   **Trust-Trap Transcripts:** Analyze model drift with simulated latent traces (thinking tokens) and ToF (Turn-of-Flip) event markers.
*   **Static Case Library:** The provided interaction logs are curated from actual real-world conversations sourced directly from **LMSYS Chatbot Arena (lmarena.ai)**, allowing researchers to safely study genuine catastrophic policy violations and model drift in a deterministic sandboxed environment.
*   **Conflicting Evidence Resolver:** Cross-reference model outputs against verified external API sources using a split-pane slider to flag deception or confirm ground truth.
*   **Pre-Commitment Gating:** Enforce expert review workflows with visual risk profiling, drift history, and expert safety rerouting controls.
*   **Works entirely offline:** No server required. Analyze cases safely inside a contained frontend environment.

## ⚡ Quick Start (The 5-Minute Success Path)

### Prerequisites
*   **Node.js:** ≥ 18
*   **npm:** ≥ 9

### Installation

| Tool | Command |
| :--- | :--- |
| **npm** | `npm install` |
| **pnpm** | `pnpm install` |
| **yarn** | `yarn install` |

### Hello World

```bash
# Start the interactive workbench locally
npm run dev
```

*Expected output: Vite will start a local server at `http://localhost:5173`. Open this URL to interact with the Safety Oversight Workbench dashboard.*

## 🚀 Usage / Deep Dive

### Running an Adjudication Case

1.  **Select a Case:** Choose a scenario from the Case Library. The workbench currently includes:
    *   **Medical Sycophancy:** Model abandons medical consensus and validates dangerous health misinformation.
    *   **Financial Deception:** Model provides psychological manipulation tactics and scam pitch materials targeting vulnerable individuals.
    *   **Parasocial Enmeshment:** Model violates its duty to affirm user autonomy by encouraging isolation and emotional dependency.
    *   **Social Bias Flip:** Model provides discriminatory hiring criteria when the prompt is disguised as an "educational workshop."
    *   **Authoritarian Backsliding:** Model generates highly realistic deployable propaganda and an autogolpe speech.

2.  **Inspect the Transcript:** Read the dialogue and expand the Researcher Overlay to view the model's simulated latent trace (thinking tokens).

    ![Transcript Inspection](./src/assets/safetyoversightworkbench_transcript-screenshot.png)

3.  **Resolve Evidence:** Navigate to the **Evidence Vault** and use the **Conflicting Evidence Resolver** slider.
    *   **What is this?** Resolver juxtaposes the primary model's generated claim (**Source A**) against a simulated external database like PubMed or the SEC (**Source B**). 
    *   **Why?** By forcing you to manually drag the slider to either flag deception or confirm ground truth, the UI breaks automation bias and ensures the reviewer has actually read and verified the external evidence.

    ![Evidence Adjudication](./src/assets/safetyoversightworkbench_evidenceSlider-screenshot.png)

4.  **Acknowledge Reroute:** Review the Expert Safety Reroute response and acknowledge it to unlatch the final AI turn.
    *   **What is the Expert Reroute?** In a production environment, this simulates a "Control Model" or "Safety Policy System" - a secondary, highly-aligned AI designed to monitor the primary model and intervene when it detects a policy violation. You must acknowledge this intervention to pass the gate.

### Configuration

| Env Var | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | String | `undefined` | (Optional) Backend endpoint if extending to a live AI API. |
| `VITE_DEBUG_MODE` | Boolean | `false` | Enables verbose console logging for latent traces. |

## 🏗️ Architecture / How it Works

The Safety Oversight Workbench operates through a strictly enforced, state-driven workflow designed to prevent automation bias:

1.  **Context Initialization:** User selects a case, loading the transcript, evidence vault, and telemetry dashboard into memory.
2.  **Transcript Analysis:** User reviews the AI interaction, identifying the exact Turn-of-Flip (ToF) where the model's alignment collapsed. Simulated latent traces reveal the model's internal "thinking" before generating the output.
3.  **Evidence Adjudication:** User must cross-reference the model's claims against ground-truth API sources. The Conflicting Evidence Resolver forces the user to actively flag deception or confirm the truth via a split-pane slider.
4.  **Pre-Commitment Gate:** The final, most dangerous AI turn is completely locked, which can only be revealed after the user has reviewed all evidence artifacts, resolved the conflict slider, and acknowledged the expert safety reroute.

## 🛠️ Troubleshooting / FAQ

**Error: `Failed to resolve entry for package "lucide-react"`**
*   **Fix:** Ensure you have run `npm install`, as the project relies heavily on `lucide-react` for iconography.

**Issue: The styling looks broken or utility classes aren't applying.**
*   **Fix:** The project uses Tailwind v4 (`@tailwindcss/postcss`). Ensure your PostCSS configuration is active and you are running the `npm run dev` process so the Vite plugin compiles the CSS correctly.

**Issue: The final AI turn is locked and I can't read it.**
*   **Fix:** You must complete the adjudication workflow first! Review all evidence artifacts, resolve the conflict slider, and acknowledge the expert reroute to pass the pre-commitment gate.

## 🤝 Community & Meta

*   **Testing:** Run `npm run lint` to execute the ESLint suite and ensure code quality.
*   **Contributing:** Pull requests are welcomed! Please check out `CONTRIBUTING.md` for guidelines on how to add new edge cases to `src/cases.js`.
*   **Security:** Do not file public issues for vulnerabilities. Please see `SECURITY.md`.
*   **License:** This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.