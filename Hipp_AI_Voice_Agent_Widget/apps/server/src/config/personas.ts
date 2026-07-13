/**
 * Persona registry for the Twilio ↔ Gemini Live bridge.
 *
 * The bridge routes by the DIALED number (Twilio's `To`, passed through the
 * TwiML <Parameter>s): the live Hipp AI line always gets the demo-intake
 * persona; the rotating demo line (env DEMO_LINE_NUMBER) gets whichever
 * demo persona env DEMO_LINE_PERSONA selects. Rotating the demo line to a
 * new vertical = add a persona module here + flip DEMO_LINE_PERSONA. No
 * redeploy of concepts, no risk to the live line.
 *
 * Fail-safe direction: ANY doubt (missing To, unknown number, unset env,
 * unknown persona key) resolves to the Hipp AI persona — the worst possible
 * misroute is a demo caller hearing the real receptionist, never a real
 * lead hearing a demo brand.
 */
import type { GeminiFunctionDeclaration } from "../integrations/geminiLive";
import {
  DEMO_INTAKE_FIRST_MESSAGE,
  DEMO_INTAKE_SYSTEM_PROMPT,
  DEMO_INTAKE_TOOLS,
} from "./demoIntakeAssistant";
import {
  PEST_FIRST_MESSAGE,
  PEST_SYSTEM_PROMPT,
  PEST_TOOLS,
  PEST_VOICE,
} from "./pestControlAssistant";

export interface Persona {
  key: "hipp" | "pest";
  /** Human-readable label used in notifications/log lines. */
  label: string;
  systemPrompt: string;
  tools: GeminiFunctionDeclaration[];
  firstMessage: string;
  voiceName: string;
}

export const HIPP_PERSONA: Persona = {
  key: "hipp",
  label: "Hipp AI Voice Agent",
  systemPrompt: DEMO_INTAKE_SYSTEM_PROMPT,
  tools: DEMO_INTAKE_TOOLS,
  firstMessage: DEMO_INTAKE_FIRST_MESSAGE,
  voiceName: "Zephyr",
};

const DEMO_LINE_PERSONAS: Record<string, Persona> = {
  pest: {
    key: "pest",
    label: "Demo Pest Solutions (demo line)",
    systemPrompt: PEST_SYSTEM_PROMPT,
    tools: PEST_TOOLS,
    firstMessage: PEST_FIRST_MESSAGE,
    voiceName: PEST_VOICE,
  },
};

export function pickPersona(toNumber: string | undefined | null): Persona {
  const demoNumber = (process.env.DEMO_LINE_NUMBER ?? "").trim();
  const to = (toNumber ?? "").trim();
  if (!demoNumber || !to || to !== demoNumber) return HIPP_PERSONA;

  const key = (process.env.DEMO_LINE_PERSONA ?? "").trim().toLowerCase();
  const persona = DEMO_LINE_PERSONAS[key];
  if (!persona) {
    console.warn(
      `[personas] call to demo line ${demoNumber} but DEMO_LINE_PERSONA="${key}" is not in the registry — falling back to hipp`,
    );
    return HIPP_PERSONA;
  }
  return persona;
}
