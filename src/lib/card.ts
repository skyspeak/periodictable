import type { ElementInfo } from "../data/elements.ts";

export type CardModel =
  | { missing: true }
  | { missing: false; element: ElementInfo };

export function describeCard(element: ElementInfo | undefined): CardModel {
  if (!element || element.line.trim().length === 0) return { missing: true };
  return { missing: false, element };
}
