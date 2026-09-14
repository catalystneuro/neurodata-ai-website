import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";
import { glob, file } from "astro/loaders";

// YAML parses unquoted dates into Date objects; keep ISO "YYYY-MM-DD" strings.
const dateish = z
  .union([z.string(), z.date()])
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v));

const speaker = z.object({
  person: z.string().optional(), // slug in the people collection
  name: z.string().optional(),
  affiliation: z.string().optional(),
  remote: z.boolean().optional(),
});

export const TOPICS = [
  "nwb", "dandi", "streaming", "ephys", "ophys", "behavior", "spike-sorting", "pynapple",
  "neurosift", "openscope", "ibl", "foundation-models", "llm", "agents", "conversion",
  "dimensionality-reduction", "state-space", "showcase", "open-source", "welcome",
] as const;
const topic = z.enum(TOPICS);

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: z.object({
    year: z.string(),
    name: z.string(),
    shortName: z.string(),
    tagline: z.string(),
    series: z.enum(["ndrh", "ndaiss"]),
    status: z.enum(["upcoming", "past"]),
    startDate: dateish,
    endDate: dateish,
    arrivalDate: dateish.optional(),
    checkoutDate: dateish.optional(),
    venue: z.object({
      name: z.string(),
      city: z.string(),
      country: z.string(),
      url: z.string().url().optional(),
      note: z.string().optional(),
    }),
    applications: z
      .object({
        state: z.enum(["not_open", "open", "closed"]),
        opensOn: z.string().optional(),
        deadline: dateish.optional(),
        formUrl: z.string().url().optional(),
        notifyUrl: z.string().url().optional(),
        note: z.string().optional(),
      })
      .optional(),
    banner: z.string().optional(),
    organizers: z.array(reference("people")).default([]),
    instructors: z.array(reference("people")).default([]),
    playlistId: z.string().optional(),
    recordingsNote: z.string().optional(),
    reportUrl: z.string().url().optional(),
    slidesUrl: z.string().url().optional(),
    agendaPdf: z.string().optional(),
    githubUrl: z.string().url().optional(),
    liveProjectsDocUrl: z.string().url().optional(),
    stats: z
      .object({
        participants: z.number().optional(),
        institutions: z.number().optional(),
        countries: z.number().optional(),
        projects: z.number().optional(),
        applicants: z.number().optional(),
      })
      .default({}),
    survey: z
      .object({
        respondents: z.number().optional(),
        overall: z.number().optional(),
        recommend: z.number().optional(),
        helpAccess: z.number().optional(),
        lengthJustRight: z.number().optional(),
        notes: z.string().optional(),
      })
      .optional(),
    photos: z
      .array(z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() }))
      .default([]),
    groupPhoto: z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() }).optional(),
    sponsors: z.array(z.string()).default([]),
  }),
});

const scheduleItem = z.object({
  id: z.string(),
  start: z.string().optional(), // "09:00"
  end: z.string().optional(),
  title: z.string(),
  type: z
    .enum(["talk", "breakout", "hack", "meal", "break", "social", "discussion", "presentations", "tour", "checkin", "arrival"])
    .default("talk"),
  speakers: z.array(speaker).default([]),
  room: z.string().optional(),
  youtubeId: z.string().optional(),
  recordingStatus: z.enum(["available", "unavailable", "pending"]).optional(),
  slidesUrl: z.string().url().optional(),
  notebookUrl: z.string().url().optional(),
  colabUrl: z.string().url().optional(),
  dandihubUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  topics: z.array(topic).default([]),
  abstract: z.string().optional(),
  featured: z.boolean().optional(),
});

const schedules = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/schedules" }),
  schema: z.object({
    event: reference("events"),
    tentative: z.boolean().default(false),
    timezone: z.string().default("America/New_York"),
    note: z.string().optional(),
    days: z
      .array(
        z.object({
          date: dateish.optional(),
          label: z.string(),
          theme: z.string().optional(),
          items: z.array(scheduleItem).default([]),
        }),
      )
      .default([]),
    unscheduled: z.array(scheduleItem).default([]),
  }),
});

const people = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/people" }),
  schema: z.object({
    name: z.string(),
    affiliation: z.string(),
    title: z.string().optional(),
    photo: z.string().optional(),
    roles: z.array(z.enum(["director", "faculty", "advisory", "instructor", "organizer", "guest"])).default([]),
    tools: z.array(z.string()).default([]),
    links: z
      .object({
        website: z.string().url().optional(),
        github: z.string().url().optional(),
        scholar: z.string().url().optional(),
        orcid: z.string().url().optional(),
        bluesky: z.string().url().optional(),
        linkedin: z.string().url().optional(),
      })
      .default({}),
    order: z.number().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    event: reference("events"),
    investigators: z
      .array(z.object({ name: z.string(), affiliation: z.string().optional(), person: z.string().optional() }))
      .default([]),
    dandisets: z.array(z.object({ id: z.string(), url: z.string().url().optional(), note: z.string().optional() })).default([]),
    topics: z.array(z.string()).default([]),
    links: z
      .object({
        repo: z.string().url().optional(),
        slides: z.string().url().optional(),
        notebook: z.string().url().optional(),
        presentation: z.string().url().optional(),
        paper: z.string().url().optional(),
      })
      .default({}),
    featured: z.boolean().default(false),
    summary: z.string().optional(),
    hasBody: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: dateish,
    description: z.string(),
    image: z.string().optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
    event: reference("events").optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({ title: z.string() }),
});

const testimonials = defineCollection({
  loader: file("src/data/testimonials.yaml"),
  schema: z.object({
    id: z.string(),
    quote: z.string(),
    name: z.string(),
    affiliation: z.string(),
    event: reference("events"),
    featured: z.boolean().default(false),
  }),
});

const sponsors = defineCollection({
  loader: file("src/data/sponsors.yaml"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    logo: z.string(),
    url: z.string().url(),
    kind: z.enum(["funder", "host", "partner"]),
    note: z.string().optional(),
  }),
});

const resources = defineCollection({
  loader: file("src/data/resources.yaml"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    blurb: z.string().optional(),
    items: z.array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        url: z.string().url(),
        kind: z.enum(["repo", "tutorial", "docs", "video", "dataset", "tool", "slides", "course"]),
        colabUrl: z.string().url().optional(),
        dandihubUrl: z.string().url().optional(),
        year: z.string().optional(),
      }),
    ),
  }),
});

const outcomes = defineCollection({
  loader: file("src/data/outcomes.yaml"),
  schema: z.object({
    id: z.string(),
    year: z.string(),
    kind: z.enum(["paper", "poster", "repo", "award", "talk", "tool", "pr"]),
    title: z.string(),
    url: z.string().url().optional(),
    people: z.string().optional(),
    note: z.string().optional(),
  }),
});

export const collections = { events, schedules, people, projects, blog, pages, testimonials, sponsors, resources, outcomes };
