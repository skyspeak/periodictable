import {
  CATEGORY_COLOR,
  categoryOf,
  positionOf,
  type ElementInfo,
} from "../data/elements.ts";

type PeriodicTableProps = {
  elements: ElementInfo[];
  onPick: (atomicNumber: number) => void;
  onJump: (elementId: string) => void;
};

export function PeriodicTable({ elements, onPick, onJump }: PeriodicTableProps) {
  return (
    <div className="ptable" role="grid" aria-label="Periodic table">
      <button
        type="button"
        className="cell gap"
        style={{ gridColumn: 3, gridRow: 6 }}
        onClick={() => onJump("element-57")}
        aria-label="Show the lanthanum row"
      >
        <span className="sym">La-Lu</span>
        <span className="nm">extra row</span>
      </button>
      <button
        type="button"
        className="cell gap"
        style={{ gridColumn: 3, gridRow: 7 }}
        onClick={() => onJump("element-89")}
        aria-label="Show the actinium row"
      >
        <span className="sym">Ac-Lr</span>
        <span className="nm">extra row</span>
      </button>
      {elements.map((element) => {
        const place = positionOf(element.z);
        const color = CATEGORY_COLOR[categoryOf(element.z)];
        return (
          <button
            key={element.z}
            id={`element-${element.z}`}
            type="button"
            data-cell="true"
            data-testid={`element-${element.symbol}`}
            className={element.everyday ? "cell everyday" : "cell"}
            style={{
              gridColumn: place.col,
              gridRow: place.row,
              backgroundColor: color,
            }}
            onClick={() => onPick(element.z)}
            aria-label={
              element.everyday
                ? `${element.name}, number ${element.z}, you see this`
                : `${element.name}, number ${element.z}`
            }
          >
            <span className="num">{element.z}</span>
            {element.everyday ? (
              <span className="star" aria-hidden="true">
                ★
              </span>
            ) : null}
            <span className="sym">{element.symbol}</span>
            <span className="nm">{element.name}</span>
          </button>
        );
      })}
    </div>
  );
}
