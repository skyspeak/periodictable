import { useEffect, useRef, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ElementCard } from "./components/ElementCard.tsx";
import { PeriodicTable } from "./components/PeriodicTable.tsx";
import { ZoomStage, type ZoomHandle } from "./components/ZoomStage.tsx";
import {
  CATEGORY_COLOR,
  CATEGORY_LABEL,
  elementsByNumber,
  type Category,
  type ElementInfo,
} from "./data/elements.ts";
import { loadElements } from "./data/load.ts";

type Status = "loading" | "ready" | "empty" | "error";

const FAMILIES = Object.keys(CATEGORY_LABEL) as Category[];

export default function App() {
  const [status, setStatus] = useState<Status>("loading");
  const [elements, setElements] = useState<ElementInfo[]>([]);
  const [attempt, setAttempt] = useState(0);
  const [openZ, setOpenZ] = useState<number | null>(null);
  const zoomRef = useRef<ZoomHandle>(null);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams(window.location.search);
    const preview = import.meta.env.DEV ? params.get("state") : null;

    if (preview === "error") {
      setStatus("error");
      return;
    }
    if (preview === "empty") {
      setElements([]);
      setStatus("empty");
      return;
    }

    setStatus("loading");
    loadElements()
      .then((list) => {
        if (cancelled) return;
        if (list.length === 0) {
          setElements([]);
          setStatus("empty");
          return;
        }
        setElements(list);
        setStatus("ready");
        if (preview === "missing") setOpenZ(-1);
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  if (status === "loading") return <LoadingScreen />;
  if (status === "error") {
    return <MessageScreen title="The table did not show up" body="Tap try again." action="Try again" onAction={() => setAttempt((n) => n + 1)} />;
  }
  if (status === "empty") {
    return <MessageScreen title="The squares are missing" body="We do not have any elements to show yet." action="Try again" onAction={() => setAttempt((n) => n + 1)} />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex flex-wrap items-center gap-3 px-3 pt-3 pb-2 sm:px-5">
        <div className="min-w-48 flex-1">
          <h1 className="text-2xl leading-none font-extrabold text-stone-900 sm:text-3xl">
            Element Spotter
          </h1>
          <p className="mt-1 max-w-xl text-sm font-bold text-stone-600 sm:text-base">
            Tap a square. Pinch, or press Bigger, to zoom in.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="h-12 px-4 text-base font-extrabold" onClick={() => zoomRef.current?.zoomIn()}>
            <Plus />
            Bigger
          </Button>
          <Button
            variant="secondary"
            className="h-12 px-4 text-base font-extrabold"
            onClick={() => zoomRef.current?.zoomOut()}
          >
            <Minus />
            Smaller
          </Button>
          <Button
            variant="outline"
            className="h-12 bg-white px-4 text-base font-extrabold"
            onClick={() => zoomRef.current?.reset()}
          >
            <RotateCcw />
            Reset
          </Button>
        </div>
      </header>
      <div className="legend-row" aria-label="Color families">
        <span className="legend-chip">
          <span className="star legend-swatch grid place-items-center bg-white text-[0.7rem] text-orange-700">
            ★
          </span>
          You see this
        </span>
        {FAMILIES.map((family) => (
          <span key={family} className="legend-chip">
            <span className="legend-swatch" style={{ backgroundColor: CATEGORY_COLOR[family] }} />
            {CATEGORY_LABEL[family]}
          </span>
        ))}
      </div>
      <p className="px-3 pb-2 text-sm font-bold text-stone-600 sm:px-5">
        Same color means the same family. Drag the table to look around.
      </p>
      <ZoomStage ref={zoomRef} className="min-h-0 flex-1">
        <PeriodicTable
          elements={elements}
          onPick={setOpenZ}
          onJump={(id) => zoomRef.current?.centerOn(id)}
        />
      </ZoomStage>
      <ElementCard atomicNumber={openZ} elements={elementsByNumber} onClose={() => setOpenZ(null)} />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="grid h-full place-items-center px-6 text-center">
      <div>
        <div className="mb-4 flex justify-center gap-2" aria-hidden="true">
          {["#fda4af", "#fcd34d", "#93c5fd", "#86efac"].map((color) => (
            <span
              key={color}
              className="size-10 animate-pulse rounded-xl"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <p className="text-2xl font-extrabold text-stone-800">Setting the table…</p>
      </div>
    </div>
  );
}

function MessageScreen({
  title,
  body,
  action,
  onAction,
}: {
  title: string;
  body: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="grid h-full place-items-center px-6 text-center">
      <div className="max-w-sm">
        <h1 className="text-3xl font-extrabold text-stone-900">{title}</h1>
        <p className="mt-3 text-lg font-bold text-stone-600">{body}</p>
        <Button className="mt-6 h-14 px-6 text-lg font-extrabold" onClick={onAction}>
          {action}
        </Button>
      </div>
    </div>
  );
}
