export type Category =
  | "alkali"
  | "alkaline"
  | "transition"
  | "post"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble"
  | "lanthanide"
  | "actinide";

export type ElementInfo = {
  z: number;
  symbol: string;
  name: string;
  everyday: boolean;
  line: string;
};

export const CATEGORY_LABEL: Record<Category, string> = {
  alkali: "Alkali metals",
  alkaline: "Alkaline earth metals",
  transition: "Transition metals",
  post: "Other metals",
  metalloid: "Metalloids",
  nonmetal: "Nonmetals",
  halogen: "Halogens",
  noble: "Noble gases",
  lanthanide: "Lanthanides",
  actinide: "Actinides",
};

export const CATEGORY_COLOR: Record<Category, string> = {
  alkali: "#fda4af",
  alkaline: "#fdba74",
  transition: "#fcd34d",
  post: "#86efac",
  metalloid: "#67e8f9",
  nonmetal: "#bef264",
  halogen: "#d8b4fe",
  noble: "#93c5fd",
  lanthanide: "#f9a8d4",
  actinide: "#c4b5fd",
};

const NONMETAL = new Set([1, 6, 7, 8, 15, 16, 34]);
const NOBLE = new Set([2, 10, 18, 36, 54, 86, 118]);
const HALOGEN = new Set([9, 17, 35, 53, 85, 117]);
const ALKALI = new Set([3, 11, 19, 37, 55, 87]);
const ALKALINE = new Set([4, 12, 20, 38, 56, 88]);
const METALLOID = new Set([5, 14, 32, 33, 51, 52, 84]);
const POST = new Set([13, 31, 49, 50, 81, 82, 83, 113, 114, 115, 116]);

export function categoryOf(z: number): Category {
  if (z >= 57 && z <= 71) return "lanthanide";
  if (z >= 89 && z <= 103) return "actinide";
  if (NONMETAL.has(z)) return "nonmetal";
  if (NOBLE.has(z)) return "noble";
  if (HALOGEN.has(z)) return "halogen";
  if (ALKALI.has(z)) return "alkali";
  if (ALKALINE.has(z)) return "alkaline";
  if (METALLOID.has(z)) return "metalloid";
  if (POST.has(z)) return "post";
  return "transition";
}

export function positionOf(z: number): { row: number; col: number } {
  if (z === 1) return { row: 1, col: 1 };
  if (z === 2) return { row: 1, col: 18 };
  if (z >= 3 && z <= 4) return { row: 2, col: z - 2 };
  if (z >= 5 && z <= 10) return { row: 2, col: z + 8 };
  if (z >= 11 && z <= 12) return { row: 3, col: z - 10 };
  if (z >= 13 && z <= 18) return { row: 3, col: z };
  if (z >= 19 && z <= 36) return { row: 4, col: z - 18 };
  if (z >= 37 && z <= 54) return { row: 5, col: z - 36 };
  if (z === 55) return { row: 6, col: 1 };
  if (z === 56) return { row: 6, col: 2 };
  if (z >= 57 && z <= 71) return { row: 9, col: z - 54 };
  if (z >= 72 && z <= 86) return { row: 6, col: z - 68 };
  if (z === 87) return { row: 7, col: 1 };
  if (z === 88) return { row: 7, col: 2 };
  if (z >= 89 && z <= 103) return { row: 10, col: z - 86 };
  if (z >= 104 && z <= 118) return { row: 7, col: z - 100 };
  throw new Error(`No place for element ${z}`);
}

const SCIENTISTS = "Mostly used by scientists.";

function el(
  z: number,
  symbol: string,
  name: string,
  everyday: boolean,
  line: string,
): ElementInfo {
  return { z, symbol, name, everyday, line };
}

function lab(z: number, symbol: string, name: string): ElementInfo {
  return el(z, symbol, name, false, SCIENTISTS);
}

export const elements: ElementInfo[] = [
  el(1, "H", "Hydrogen", true, "Every sip of water has hydrogen in it."),
  el(2, "He", "Helium", true, "Party balloons that float are filled with helium."),
  el(3, "Li", "Lithium", true, "Phone and tablet batteries use lithium."),
  lab(4, "Be", "Beryllium"),
  el(5, "B", "Boron", false, "Some glass that can take heat has boron in it."),
  el(6, "C", "Carbon", true, "The black part of a pencil is carbon. Lots of food is too."),
  el(7, "N", "Nitrogen", true, "Most of the air around you is nitrogen."),
  el(8, "O", "Oxygen", true, "You breathe oxygen from the air. Water has it too."),
  el(9, "F", "Fluorine", true, "Toothpaste has fluorine in it. It helps keep teeth strong."),
  el(10, "Ne", "Neon", true, "Some bright red shop signs glow with neon."),
  el(11, "Na", "Sodium", true, "Table salt is part sodium."),
  el(12, "Mg", "Magnesium", true, "Nuts and green leaves have magnesium."),
  el(13, "Al", "Aluminum", true, "Drink cans and kitchen foil are aluminum. Some bikes are too."),
  el(14, "Si", "Silicon", true, "Sand and glass have silicon in them. Phones use it too."),
  el(15, "P", "Phosphorus", true, "Your bones have phosphorus in them."),
  el(16, "S", "Sulfur", false, "Eggs have a little sulfur in them."),
  el(17, "Cl", "Chlorine", true, "Table salt has chlorine in it. Many pools do too."),
  el(18, "Ar", "Argon", false, "Some light bulbs have argon inside."),
  el(19, "K", "Potassium", true, "Bananas have potassium in them."),
  el(20, "Ca", "Calcium", true, "Your bones have calcium in them. Milk and cheese do too."),
  lab(21, "Sc", "Scandium"),
  el(22, "Ti", "Titanium", true, "White paint often uses titanium. Some bike frames do too."),
  el(23, "V", "Vanadium", false, "Some strong steel has vanadium in it."),
  el(24, "Cr", "Chromium", true, "The shiny coat on some faucets and bikes is chromium."),
  el(25, "Mn", "Manganese", false, "Some steel has manganese in it."),
  el(26, "Fe", "Iron", true, "Nails and lots of bikes are made from steel, which is mostly iron."),
  el(27, "Co", "Cobalt", false, "Some phone batteries use cobalt."),
  el(28, "Ni", "Nickel", true, "Some coins and shiny forks use nickel."),
  el(29, "Cu", "Copper", true, "Wires that carry electricity are often copper. Some coins are too."),
  el(30, "Zn", "Zinc", true, "Some sunscreen has zinc in it."),
  el(31, "Ga", "Gallium", false, "Some LED lights use gallium."),
  lab(32, "Ge", "Germanium"),
  lab(33, "As", "Arsenic"),
  el(34, "Se", "Selenium", false, "Some foods, like Brazil nuts, have a little selenium."),
  lab(35, "Br", "Bromine"),
  el(36, "Kr", "Krypton", false, "Some bright lamps use krypton."),
  lab(37, "Rb", "Rubidium"),
  el(38, "Sr", "Strontium", false, "Some fireworks use strontium to make red light."),
  el(39, "Y", "Yttrium", false, "Some white LED lights use yttrium."),
  el(40, "Zr", "Zirconium", false, "Some sparkly costume gems are made with zirconium."),
  el(41, "Nb", "Niobium", false, "Some steel is stronger because of niobium."),
  el(42, "Mo", "Molybdenum", false, "Some steel has molybdenum in it."),
  el(43, "Tc", "Technetium", false, "Doctors use technetium for some body pictures."),
  lab(44, "Ru", "Ruthenium"),
  el(45, "Rh", "Rhodium", false, "A shiny coat on some jewelry is rhodium."),
  el(46, "Pd", "Palladium", false, "Some cars and jewelry use palladium."),
  el(47, "Ag", "Silver", true, "Some necklaces and old coins are silver."),
  lab(48, "Cd", "Cadmium"),
  el(49, "In", "Indium", false, "Many touch screens have a thin layer of indium."),
  el(50, "Sn", "Tin", true, "Many food cans have a thin coat of tin."),
  lab(51, "Sb", "Antimony"),
  lab(52, "Te", "Tellurium"),
  el(53, "I", "Iodine", true, "Some table salt has iodine added."),
  el(54, "Xe", "Xenon", false, "Some camera flashes use xenon."),
  lab(55, "Cs", "Cesium"),
  el(56, "Ba", "Barium", false, "Some fireworks use barium to make green light."),
  el(57, "La", "Lanthanum", false, "Some camera lenses use lanthanum."),
  el(58, "Ce", "Cerium", false, "Cerium is used to polish some glass."),
  lab(59, "Pr", "Praseodymium"),
  el(60, "Nd", "Neodymium", true, "Strong magnets in some headphones and toys use neodymium."),
  lab(61, "Pm", "Promethium"),
  lab(62, "Sm", "Samarium"),
  el(63, "Eu", "Europium", false, "Some lights use europium to make red."),
  el(64, "Gd", "Gadolinium", false, "Doctors use gadolinium for some body pictures."),
  lab(65, "Tb", "Terbium"),
  lab(66, "Dy", "Dysprosium"),
  lab(67, "Ho", "Holmium"),
  lab(68, "Er", "Erbium"),
  lab(69, "Tm", "Thulium"),
  lab(70, "Yb", "Ytterbium"),
  lab(71, "Lu", "Lutetium"),
  lab(72, "Hf", "Hafnium"),
  el(73, "Ta", "Tantalum", false, "Phones use a little tantalum inside."),
  el(74, "W", "Tungsten", false, "The thin wire in old light bulbs is tungsten."),
  lab(75, "Re", "Rhenium"),
  lab(76, "Os", "Osmium"),
  el(77, "Ir", "Iridium", false, "Some spark plugs use iridium."),
  el(78, "Pt", "Platinum", false, "Some rings and necklaces are platinum."),
  el(79, "Au", "Gold", true, "Some rings and medals are gold."),
  lab(80, "Hg", "Mercury"),
  lab(81, "Tl", "Thallium"),
  el(82, "Pb", "Lead", false, "Some car batteries use lead."),
  el(83, "Bi", "Bismuth", false, "One pink tummy medicine uses bismuth."),
  lab(84, "Po", "Polonium"),
  lab(85, "At", "Astatine"),
  lab(86, "Rn", "Radon"),
  lab(87, "Fr", "Francium"),
  lab(88, "Ra", "Radium"),
  lab(89, "Ac", "Actinium"),
  lab(90, "Th", "Thorium"),
  lab(91, "Pa", "Protactinium"),
  lab(92, "U", "Uranium"),
  lab(93, "Np", "Neptunium"),
  lab(94, "Pu", "Plutonium"),
  lab(95, "Am", "Americium"),
  lab(96, "Cm", "Curium"),
  lab(97, "Bk", "Berkelium"),
  lab(98, "Cf", "Californium"),
  lab(99, "Es", "Einsteinium"),
  lab(100, "Fm", "Fermium"),
  lab(101, "Md", "Mendelevium"),
  lab(102, "No", "Nobelium"),
  lab(103, "Lr", "Lawrencium"),
  lab(104, "Rf", "Rutherfordium"),
  lab(105, "Db", "Dubnium"),
  lab(106, "Sg", "Seaborgium"),
  lab(107, "Bh", "Bohrium"),
  lab(108, "Hs", "Hassium"),
  lab(109, "Mt", "Meitnerium"),
  lab(110, "Ds", "Darmstadtium"),
  lab(111, "Rg", "Roentgenium"),
  lab(112, "Cn", "Copernicium"),
  lab(113, "Nh", "Nihonium"),
  lab(114, "Fl", "Flerovium"),
  lab(115, "Mc", "Moscovium"),
  lab(116, "Lv", "Livermorium"),
  lab(117, "Ts", "Tennessine"),
  lab(118, "Og", "Oganesson"),
];

export const elementsByNumber: ReadonlyMap<number, ElementInfo> = new Map(
  elements.map((element) => [element.z, element]),
);
