import { CATEGORY_COLOR, categoryOf } from "../data/elements.ts";
import { describeCard } from "../lib/card.ts";
import type { ElementInfo } from "../data/elements.ts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type ElementCardProps = {
  atomicNumber: number | null;
  elements: ReadonlyMap<number, ElementInfo>;
  onClose: () => void;
};

export function ElementCard({ atomicNumber, elements, onClose }: ElementCardProps) {
  const open = atomicNumber !== null;
  const card = open ? describeCard(elements.get(atomicNumber)) : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="top-auto bottom-0 left-0 max-h-[88dvh] max-w-none translate-x-0 translate-y-0 gap-4 overflow-y-auto rounded-t-3xl rounded-b-none p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-left sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl">
        {card?.missing ? (
          <>
            <DialogTitle className="pr-12 text-3xl font-extrabold">
              That square is missing
            </DialogTitle>
            <DialogDescription className="text-xl leading-snug font-bold text-foreground">
              We could not open this card. Tap another square.
            </DialogDescription>
          </>
        ) : card ? (
          <FoundCard element={card.element} />
        ) : (
          <DialogTitle className="sr-only">Element card</DialogTitle>
        )}
        <DialogClose asChild>
          <Button className="h-14 w-full text-lg font-extrabold">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function FoundCard({ element }: { element: ElementInfo }) {
  const color = CATEGORY_COLOR[categoryOf(element.z)];
  return (
    <>
      <div className="flex items-center gap-4 pr-12">
        <div
          className="grid size-20 shrink-0 place-items-center rounded-2xl text-4xl font-extrabold text-stone-900"
          style={{ backgroundColor: color }}
        >
          {element.symbol}
        </div>
        <div>
          <DialogTitle className="text-4xl leading-none font-extrabold">
            {element.name}
          </DialogTitle>
          <p className="mt-2 text-lg font-bold text-stone-600">Number {element.z}</p>
        </div>
      </div>
      {element.everyday ? (
        <p className="w-fit rounded-full bg-amber-100 px-3 py-1 text-base font-extrabold text-orange-800">
          ★ You see this
        </p>
      ) : null}
      <DialogDescription className="text-xl leading-snug font-bold text-foreground">
        {element.line}
      </DialogDescription>
    </>
  );
}
