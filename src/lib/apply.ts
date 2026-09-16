import type { CollectionEntry } from "astro:content";
import { longDate } from "./format";

export interface ApplyState {
  state: "not_open" | "open" | "closed";
  label: string;
  href: string;
  external: boolean;
  sentence: string;
  /** The application form. Only the apply page links to it; everywhere else links to the apply page. */
  formUrl?: string;
}

/** The single source of truth for the apply CTA across header, hero, and event page. */
export function applyState(event: CollectionEntry<"events"> | undefined, basePathApply: string, mailingList: string): ApplyState {
  const a = event?.data.applications;
  const year = event?.data.year ?? "";
  if (!a || a.state === "not_open") {
    return {
      state: "not_open",
      label: "Get notified",
      href: a?.notifyUrl ?? mailingList,
      external: true,
      sentence: a?.opensOn ? `Applications for the ${year} school open in ${a.opensOn}.` : `Applications for the ${year} school are not yet open.`,
    };
  }
  if (a.state === "open") {
    return {
      state: "open",
      label: "Apply",
      href: basePathApply,
      external: false,
      formUrl: a.formUrl,
      sentence: a.deadline ? `Applications for the ${year} school are open until ${longDate(a.deadline)}.` : `Applications for the ${year} school are open.`,
    };
  }
  return {
    state: "closed",
    label: "Get notified",
    href: a.notifyUrl ?? mailingList,
    external: true,
    sentence: `Applications for the ${year} school closed${a.deadline ? ` on ${longDate(a.deadline)}` : ""}. Join the mailing list to hear about the next one.`,
  };
}
