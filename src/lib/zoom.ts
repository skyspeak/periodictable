export type Transform = {
  x: number;
  y: number;
  scale: number;
};

export function clampScale(scale: number, min: number, max: number): number {
  if (!Number.isFinite(scale)) return min;
  return Math.min(max, Math.max(min, scale));
}

export function zoomAtPoint(
  current: Transform,
  pointX: number,
  pointY: number,
  nextScale: number,
): Transform {
  const ratio = nextScale / current.scale;
  return {
    scale: nextScale,
    x: pointX - (pointX - current.x) * ratio,
    y: pointY - (pointY - current.y) * ratio,
  };
}

export function clampToStage(
  current: Transform,
  stageW: number,
  stageH: number,
  contentW: number,
  contentH: number,
  margin: number,
): Transform {
  const width = contentW * current.scale;
  const height = contentH * current.scale;
  let x = current.x;
  let y = current.y;

  if (width + margin * 2 <= stageW) {
    x = (stageW - width) / 2;
  } else {
    x = Math.min(margin, Math.max(stageW - width - margin, x));
  }

  if (height + margin * 2 <= stageH) {
    y = (stageH - height) / 2;
  } else {
    y = Math.min(margin, Math.max(stageH - height - margin, y));
  }

  return { x, y, scale: current.scale };
}
