import { getCollection, getEntry, type CollectionEntry } from "astro:content";

export type ScheduleItem = CollectionEntry<"schedules">["data"]["days"][number]["items"][number];
export type Speaker = ScheduleItem["speakers"][number];

export interface Lecture {
  id: string;
  title: string;
  youtubeId: string;
  speakers: Speaker[];
  topics: string[];
  year: string;
  eventName: string;
  eventSlug: string;
  date?: string;
  start?: string;
  dayLabel?: string;
  featured: boolean;
  slidesUrl?: string;
  notebookUrl?: string;
  colabUrl?: string;
  dandihubUrl?: string;
  repoUrl?: string;
  abstract?: string;
}

/** Every schedule item with a recording, across all years, newest first. */
export async function allLectures(): Promise<Lecture[]> {
  const schedules = await getCollection("schedules");
  const events = await getCollection("events");
  const byYear = new Map(events.map((e) => [e.id, e]));
  const out: Lecture[] = [];
  for (const s of schedules) {
    const ev = byYear.get(s.data.event.id);
    if (!ev) continue;
    const push = (it: ScheduleItem, date?: string, dayLabel?: string) => {
      if (!it.youtubeId) return;
      out.push({
        id: it.id,
        title: it.title,
        youtubeId: it.youtubeId,
        speakers: it.speakers,
        topics: it.topics,
        year: ev.data.year,
        eventName: ev.data.name,
        eventSlug: ev.id,
        date,
        start: it.start,
        dayLabel,
        featured: !!it.featured,
        slidesUrl: it.slidesUrl,
        notebookUrl: it.notebookUrl,
        colabUrl: it.colabUrl,
        dandihubUrl: it.dandihubUrl,
        repoUrl: it.repoUrl,
        abstract: it.abstract,
      });
    };
    for (const day of s.data.days) for (const it of day.items) push(it, day.date, day.label);
    for (const it of s.data.unscheduled) push(it);
  }
  out.sort((a, b) => (a.year === b.year ? (a.date ?? "").localeCompare(b.date ?? "") || (a.start ?? "").localeCompare(b.start ?? "") : b.year.localeCompare(a.year)));
  return out;
}

export async function lecturesBy(personSlug: string): Promise<Lecture[]> {
  return (await allLectures()).filter((l) => l.speakers.some((s) => s.person === personSlug));
}

/** Slugs of everyone who spoke at any installment, from the schedules. */
export async function speakerSlugs(): Promise<Map<string, Set<string>>> {
  const schedules = await getCollection("schedules");
  const map = new Map<string, Set<string>>();
  for (const s of schedules) {
    const items = [...s.data.days.flatMap((d) => d.items), ...s.data.unscheduled];
    for (const it of items) for (const sp of it.speakers) {
      if (!sp.person) continue;
      if (!map.has(sp.person)) map.set(sp.person, new Set());
      map.get(sp.person)!.add(s.data.event.id);
    }
  }
  return map;
}

/** Years in which a person is listed as instructor or organizer or spoke. */
export async function yearsFor(personSlug: string): Promise<string[]> {
  const events = await getCollection("events");
  const spoke = (await speakerSlugs()).get(personSlug) ?? new Set();
  const years = new Set<string>();
  for (const e of events) {
    if (e.data.instructors.some((r) => r.id === personSlug) || e.data.organizers.some((r) => r.id === personSlug) || spoke.has(e.id)) years.add(e.data.year);
  }
  return [...years].sort();
}

export async function siteStats() {
  const events = (await getCollection("events")).filter((e) => e.data.status === "past");
  const projects = await getCollection("projects");
  const lectures = await allLectures();
  const alumni = events.reduce((n, e) => n + (e.data.stats.participants ?? 0), 0);
  const countries = Math.max(...events.map((e) => e.data.stats.countries ?? 0));
  return { years: events.length, alumni, projects: projects.length, lectures: lectures.length, countries };
}

export async function currentEvent(year: string) {
  return getEntry("events", year);
}

export function topicCounts(lectures: Lecture[]) {
  const m = new Map<string, number>();
  for (const l of lectures) for (const t of l.topics) m.set(t, (m.get(t) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}
