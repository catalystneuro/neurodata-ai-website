export const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function parts(date: string) {
  const [y, m, d] = date.split("-").map((x) => parseInt(x, 10));
  return { y, m: (m ?? 1) - 1, d: d ?? 1 };
}

/** "2025-12-19" -> "December 19, 2025" */
export function longDate(date?: string): string {
  if (!date) return "";
  const { y, m, d } = parts(date);
  return `${MONTHS[m]} ${d}, ${y}`;
}

/** "2027-07-18" -> "Sunday, July 18" */
export function weekdayDate(date?: string, withYear = false): string {
  if (!date) return "";
  const { y, m, d } = parts(date);
  const wd = DAYS[new Date(Date.UTC(y, m, d)).getUTCDay()];
  return `${wd}, ${MONTHS[m]} ${d}${withYear ? `, ${y}` : ""}`;
}

/** "2027-07-19", "2027-07-24" -> "July 19–24, 2027"; across months "September 5 – October 2, 2027" */
export function dateRange(start: string, end?: string): string {
  const a = parts(start);
  if (!end) return longDate(start);
  const b = parts(end);
  if (a.y === b.y && a.m === b.m) return `${MONTHS[a.m]} ${a.d}–${b.d}, ${a.y}`;
  if (a.y === b.y) return `${MONTHS[a.m]} ${a.d} – ${MONTHS[b.m]} ${b.d}, ${a.y}`;
  return `${longDate(start)} – ${longDate(end)}`;
}

/** "14:15" -> "2:15 PM" */
export function time12(t?: string): string {
  if (!t) return "";
  const [h, m] = t.split(":").map((x) => parseInt(x, 10));
  const suffix = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m ?? 0).padStart(2, "0")} ${suffix}`;
}

/** Seconds -> "56 min" */
export function minutes(seconds?: number): string {
  if (!seconds) return "";
  return `${Math.round(seconds / 60)} min`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-zÀ-ÿ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export const TOPIC_LABELS: Record<string, string> = {
  nwb: "NWB",
  dandi: "DANDI",
  streaming: "Streaming",
  ephys: "Electrophysiology",
  ophys: "Calcium imaging",
  behavior: "Behavior",
  "spike-sorting": "Spike sorting",
  pynapple: "Pynapple",
  neurosift: "Neurosift",
  openscope: "OpenScope",
  ibl: "IBL",
  "foundation-models": "Foundation models",
  llm: "LLMs",
  agents: "AI agents",
  conversion: "Conversion",
  "dimensionality-reduction": "Dimensionality reduction",
  "state-space": "State space models",
  showcase: "Dataset showcase",
  "open-source": "Open source",
  welcome: "Welcome",
};
export const topicLabel = (t: string) => TOPIC_LABELS[t] ?? t;
