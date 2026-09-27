import type { ElementInfo } from "./elements.ts";

export async function loadElements(): Promise<ElementInfo[]> {
  const mod = await import("./elements.ts");
  if (import.meta.env.DEV) {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 350);
    });
  }
  if (!Array.isArray(mod.elements)) {
    throw new Error("The element list did not load.");
  }
  return mod.elements;
}
