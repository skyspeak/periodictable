import {
  categoryOf,
  elements,
  positionOf,
  type Category,
} from "../src/data/elements.ts";
import { describeCard } from "../src/lib/card.ts";
import { clampScale, clampToStage, zoomAtPoint } from "../src/lib/zoom.ts";

const expectedSymbols = `
H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca
Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr
Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba
La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W
Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U
Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt
Ds Rg Cn Nh Fl Mc Lv Ts Og
`
  .trim()
  .split(/\s+/);

const banned =
  /bomb|poison|weapon|toxic|kill|deadly|radioactiv|explod|nuclear|gun|how to make|synthesis/i;

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

assert(elements.length === 118, `expected 118 elements, got ${elements.length}`);
assert(expectedSymbols.length === 118, "symbol key is not 118 long");

const numbers = new Set<number>();
const symbols = new Set<string>();
const names = new Set<string>();
const spots = new Set<string>();
const counts: Record<Category, number> = {
  alkali: 0,
  alkaline: 0,
  transition: 0,
  post: 0,
  metalloid: 0,
  nonmetal: 0,
  halogen: 0,
  noble: 0,
  lanthanide: 0,
  actinide: 0,
};

for (const element of elements) {
  assert(!numbers.has(element.z), `duplicate number ${element.z}`);
  assert(element.z >= 1 && element.z <= 118, `bad number ${element.z}`);
  numbers.add(element.z);
  assert(!symbols.has(element.symbol), `duplicate symbol ${element.symbol}`);
  symbols.add(element.symbol);
  assert(!names.has(element.name), `duplicate name ${element.name}`);
  names.add(element.name);
  assert(element.symbol === expectedSymbols[element.z - 1], `${element.name} symbol mismatch`);
  assert(element.line.trim().length > 0, `${element.name} has no line`);
  assert(element.line.length <= 140, `${element.name} line is too long`);
  assert(!banned.test(element.line), `${element.name} has a banned word: ${element.line}`);
  assert(!banned.test(element.name), `${element.name} name looks unsafe`);
  if (element.everyday) {
    assert(
      element.line !== "Mostly used by scientists.",
      `${element.name} is everyday but has no real-life line`,
    );
  }
  const place = positionOf(element.z);
  const key = `${place.row},${place.col}`;
  assert(!spots.has(key), `overlap at ${key} for ${element.symbol}`);
  spots.add(key);
  assert(place.col >= 1 && place.col <= 18, `${element.symbol} bad column`);
  counts[categoryOf(element.z)] += 1;
}

assert(!spots.has("6,3"), "lanthanide gap is occupied");
assert(!spots.has("7,3"), "actinide gap is occupied");
assert(counts.alkali === 6, `alkali ${counts.alkali}`);
assert(counts.alkaline === 6, `alkaline ${counts.alkaline}`);
assert(counts.noble === 7, `noble ${counts.noble}`);
assert(counts.halogen === 6, `halogen ${counts.halogen}`);
assert(counts.lanthanide === 15, `lanthanide ${counts.lanthanide}`);
assert(counts.actinide === 15, `actinide ${counts.actinide}`);
assert(counts.nonmetal === 7, `nonmetal ${counts.nonmetal}`);
assert(counts.metalloid === 7, `metalloid ${counts.metalloid}`);
assert(counts.post === 11, `post ${counts.post}`);
assert(counts.transition === 38, `transition ${counts.transition}`);

const oxygen = elements.find((element) => element.symbol === "O");
const carbon = elements.find((element) => element.symbol === "C");
const helium = elements.find((element) => element.symbol === "He");
const oganesson = elements.find((element) => element.symbol === "Og");
const uranium = elements.find((element) => element.symbol === "U");
assert(oxygen?.everyday && /air/i.test(oxygen.line), "oxygen fact");
assert(carbon?.everyday && /pencil/i.test(carbon.line), "carbon fact");
assert(helium?.everyday && /balloon/i.test(helium.line), "helium fact");
assert(oganesson?.line === "Mostly used by scientists.", "oganesson fact");
assert(uranium?.line === "Mostly used by scientists.", "uranium fact");
assert(describeCard(undefined).missing, "missing card");
assert(describeCard(oxygen).missing === false, "oxygen card");

const zoomed = zoomAtPoint({ x: 10, y: 20, scale: 1 }, 10, 20, 2);
assert(zoomed.x === 10 && zoomed.y === 20 && zoomed.scale === 2, "zoom keeps anchor");
assert(clampScale(9, 0.2, 3) === 3, "clamp high");
assert(clampScale(0.01, 0.2, 3) === 0.2, "clamp low");
const centered = clampToStage({ x: 0, y: 0, scale: 1 }, 400, 300, 100, 80, 12);
assert(centered.x === 150 && centered.y === 110, `center ${centered.x},${centered.y}`);

console.log(`Checked ${elements.length} elements.`);
