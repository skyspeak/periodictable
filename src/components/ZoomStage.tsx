import {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import {
  clampScale,
  clampToStage,
  zoomAtPoint,
  type Transform,
} from "../lib/zoom.ts";

export type ZoomHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
  centerOn: (id: string) => void;
};

type ZoomStageProps = {
  ref?: Ref<ZoomHandle>;
  className?: string;
  children: ReactNode;
};

const MARGIN = 12;

export function ZoomStage({ ref, className, children }: ZoomStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const transform = useRef<Transform>({ x: 0, y: 0, scale: 1 });
  const limits = useRef({ min: 0.2, max: 3.4 });
  const userAdjusted = useRef(false);
  const movedAt = useRef(0);
  const [fitted, setFitted] = useState(false);

  function sizes() {
    return {
      stageW: stageRef.current?.clientWidth ?? 0,
      stageH: stageRef.current?.clientHeight ?? 0,
      contentW: contentRef.current?.offsetWidth ?? 0,
      contentH: contentRef.current?.offsetHeight ?? 0,
    };
  }

  function paint(next: Transform) {
    const { stageW, stageH, contentW, contentH } = sizes();
    if (stageW < 20 || contentW < 20) return;
    const scale = clampScale(next.scale, limits.current.min, limits.current.max);
    const clamped = clampToStage(
      { ...next, scale },
      stageW,
      stageH,
      contentW,
      contentH,
      MARGIN,
    );
    transform.current = clamped;
    if (contentRef.current) {
      contentRef.current.style.transform = `translate(${clamped.x}px, ${clamped.y}px) scale(${clamped.scale})`;
    }
  }

  function fit() {
    const { stageW, stageH, contentW, contentH } = sizes();
    if (stageW < 20 || contentW < 20) return;
    const sample = contentRef.current?.querySelector<HTMLElement>("[data-cell]");
    const cell = sample?.offsetWidth || 76;
    const target = stageW < 800 ? 64 : 68;
    const pad = 16;
    const fitAll = Math.min((stageW - pad) / contentW, (stageH - pad) / contentH);
    const readable = target / cell;
    const scale =
      fitAll >= readable
        ? Math.min(fitAll, 1.2)
        : Math.min(Math.max(readable, fitAll), 1.4);
    limits.current = {
      min: Math.max(0.15, Math.min(fitAll * 0.92, scale)),
      max: 3.4,
    };
    const scaledW = contentW * scale;
    const scaledH = contentH * scale;
    paint({
      scale,
      x: scaledW + pad <= stageW ? (stageW - scaledW) / 2 : 8,
      y: scaledH + pad <= stageH ? (stageH - scaledH) / 2 : 8,
    });
    setFitted(true);
  }

  function zoomBy(factor: number) {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const next = zoomAtPoint(
      transform.current,
      rect.width / 2,
      rect.height / 2,
      transform.current.scale * factor,
    );
    userAdjusted.current = true;
    paint(next);
  }

  useImperativeHandle(ref, () => ({
    zoomIn: () => zoomBy(1.28),
    zoomOut: () => zoomBy(1 / 1.28),
    reset: () => {
      userAdjusted.current = false;
      fit();
    },
    centerOn: (id: string) => {
      const stage = stageRef.current;
      const target = document.getElementById(id);
      if (!stage || !target) return;
      const stageRect = stage.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      userAdjusted.current = true;
      paint({
        scale: transform.current.scale,
        x:
          transform.current.x +
          (stageRect.left +
            stageRect.width / 2 -
            (targetRect.left + targetRect.width / 2)),
        y:
          transform.current.y +
          (stageRect.top +
            stageRect.height / 2 -
            (targetRect.top + targetRect.height / 2)),
      });
    },
  }));

  useLayoutEffect(() => {
    fit();
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    type Pan = {
      kind: "pan";
      id: number;
      startX: number;
      startY: number;
      originX: number;
      originY: number;
      moved: boolean;
    };
    type Pinch = {
      kind: "pinch";
      startDist: number;
      origin: Transform;
      midX: number;
      midY: number;
    };
    let gesture: { kind: "none" } | Pan | Pinch = { kind: "none" };
    let lastTouch = 0;

    const markMoved = () => {
      movedAt.current = Date.now();
      userAdjusted.current = true;
    };

    const onTouchStart = (event: TouchEvent) => {
      lastTouch = Date.now();
      if (event.touches.length >= 2) {
        const a = event.touches[0];
        const b = event.touches[1];
        gesture = {
          kind: "pinch",
          startDist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) || 1,
          origin: { ...transform.current },
          midX: (a.clientX + b.clientX) / 2,
          midY: (a.clientY + b.clientY) / 2,
        };
        markMoved();
        return;
      }
      if (event.touches.length === 1 && gesture.kind !== "pinch") {
        const touch = event.touches[0];
        gesture = {
          kind: "pan",
          id: -1,
          startX: touch.clientX,
          startY: touch.clientY,
          originX: transform.current.x,
          originY: transform.current.y,
          moved: false,
        };
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (gesture.kind === "none") return;
      event.preventDefault();
      if (gesture.kind === "pinch" && event.touches.length >= 2) {
        const a = event.touches[0];
        const b = event.touches[1];
        const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) || 1;
        const rect = stage.getBoundingClientRect();
        const nextScale = gesture.origin.scale * (dist / gesture.startDist);
        const zoomed = zoomAtPoint(
          gesture.origin,
          gesture.midX - rect.left,
          gesture.midY - rect.top,
          nextScale,
        );
        const midX = (a.clientX + b.clientX) / 2;
        const midY = (a.clientY + b.clientY) / 2;
        paint({
          scale: zoomed.scale,
          x: zoomed.x + (midX - gesture.midX),
          y: zoomed.y + (midY - gesture.midY),
        });
        markMoved();
        return;
      }
      if (gesture.kind === "pan" && event.touches.length === 1) {
        const touch = event.touches[0];
        const dx = touch.clientX - gesture.startX;
        const dy = touch.clientY - gesture.startY;
        if (Math.hypot(dx, dy) > 8) gesture.moved = true;
        if (!gesture.moved) return;
        markMoved();
        paint({
          scale: transform.current.scale,
          x: gesture.originX + dx,
          y: gesture.originY + dy,
        });
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (gesture.kind === "pinch") markMoved();
      if (gesture.kind === "pan" && gesture.moved) markMoved();
      if (event.touches.length === 0) {
        gesture = { kind: "none" };
        return;
      }
      if (event.touches.length === 1) {
        const touch = event.touches[0];
        gesture = {
          kind: "pan",
          id: -1,
          startX: touch.clientX,
          startY: touch.clientY,
          originX: transform.current.x,
          originY: transform.current.y,
          moved: true,
        };
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (Date.now() - lastTouch < 700) return;
      if (event.button !== 0) return;
      gesture = {
        kind: "pan",
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: transform.current.x,
        originY: transform.current.y,
        moved: false,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (gesture.kind !== "pan" || gesture.id !== event.pointerId) return;
      const dx = event.clientX - gesture.startX;
      const dy = event.clientY - gesture.startY;
      if (Math.hypot(dx, dy) > 6) {
        gesture.moved = true;
        if (!stage.hasPointerCapture(event.pointerId)) {
          stage.setPointerCapture(event.pointerId);
        }
      }
      if (!gesture.moved) return;
      markMoved();
      paint({
        scale: transform.current.scale,
        x: gesture.originX + dx,
        y: gesture.originY + dy,
      });
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (gesture.kind === "pan" && gesture.id === event.pointerId) {
        if (gesture.moved) markMoved();
        gesture = { kind: "none" };
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (event.ctrlKey || event.metaKey) {
        const rect = stage.getBoundingClientRect();
        const nextScale = transform.current.scale * Math.exp(-event.deltaY * 0.002);
        paint(
          zoomAtPoint(
            transform.current,
            event.clientX - rect.left,
            event.clientY - rect.top,
            nextScale,
          ),
        );
        userAdjusted.current = true;
        return;
      }
      userAdjusted.current = true;
      paint({
        x: transform.current.x - event.deltaX,
        y: transform.current.y - event.deltaY,
        scale: transform.current.scale,
      });
    };

    const onClickCapture = (event: MouseEvent) => {
      if (Date.now() - movedAt.current < 450) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const observer = new ResizeObserver(() => {
      if (!userAdjusted.current) fit();
      else paint(transform.current);
    });
    observer.observe(stage);

    const listen = { passive: false } as const;
    stage.addEventListener("touchstart", onTouchStart, listen);
    stage.addEventListener("touchmove", onTouchMove, listen);
    stage.addEventListener("touchend", onTouchEnd);
    stage.addEventListener("touchcancel", onTouchEnd);
    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerUp);
    stage.addEventListener("wheel", onWheel, listen);
    stage.addEventListener("click", onClickCapture, true);

    return () => {
      observer.disconnect();
      stage.removeEventListener("touchstart", onTouchStart);
      stage.removeEventListener("touchmove", onTouchMove);
      stage.removeEventListener("touchend", onTouchEnd);
      stage.removeEventListener("touchcancel", onTouchEnd);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerUp);
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  return (
    <div ref={stageRef} className={`stage ${className ?? ""}`}>
      <div
        ref={contentRef}
        className="w-max"
        style={{
          transformOrigin: "0 0",
          visibility: fitted ? "visible" : "hidden",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
