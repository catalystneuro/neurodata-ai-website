export const CURRENT_EVENT = "2027";

export const SITE = {
  name: "NeuroData AI Summer School",
  shortName: "NeuroData AI",
  defaultTitle: "NeuroData AI Summer School at HHMI-Janelia",
  titleTemplate: (t: string) => `${t} · NeuroData AI Summer School`,
  description:
    "A one-week residential summer school at HHMI-Janelia on reanalysis of open neurophysiology data and AI methods for neural data. Formerly NeuroDataReHack.",
  ogImage: "/social-card.png",
  email: "ben.dichter@catalystneuro.com",
  github: "https://github.com/catalystneuro/neurodata-ai-website",
  youtube: "https://www.youtube.com/@NeurodataWithoutBorders",
  mailingList: "https://gmail.us3.list-manage.com/subscribe?u=eacaccc485a4e5f36034bbdbd&id=cad842f402",
  codeOfConduct: "/code-of-conduct/",
  // GoatCounter site code (public). The script is emitted only in production builds; see Base.astro.
  goatcounter: "neurodata-ai",
  grant: {
    number: "R25NS149357",
    funder: "National Institute of Neurological Disorders and Stroke",
    url: "https://reporter.nih.gov/search/-/projects?projectNumber=1R25NS149357",
  },
};

/** Where every Apply link on the site goes. The current event's page carries the application details and the only link to the form. */
export const APPLY_PATH = `/events/${CURRENT_EVENT}/`;

export const NAV = [
  { label: "Program", href: "/program/" },
  { label: `${CURRENT_EVENT} School`, href: `/events/${CURRENT_EVENT}/` },
  { label: "Faculty", href: "/faculty/" },
  {
    label: "Archive",
    href: "/events/",
    children: [
      { label: "Past events", href: "/events/" },
      { label: "Lectures", href: "/lectures/" },
      { label: "Projects", href: "/projects/" },
      { label: "Outcomes", href: "/outcomes/" },
    ],
  },
  { label: "Resources", href: "/resources/" },
  { label: "Blog", href: "/blog/" },
];

export const FOOTER = [
  {
    title: "Program",
    links: [
      { label: "About the school", href: "/program/" },
      { label: `${CURRENT_EVENT} school`, href: `/events/${CURRENT_EVENT}/` },
      { label: "Faculty", href: "/faculty/" },
    ],
  },
  {
    title: "Archive",
    links: [
      { label: "Past events", href: "/events/" },
      { label: "Lectures", href: "/lectures/" },
      { label: "Projects", href: "/projects/" },
      { label: "Outcomes", href: "/outcomes/" },
      { label: "Blog", href: "/blog/" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Mailing list", href: SITE.mailingList, external: true },
      { label: "YouTube", href: SITE.youtube, external: true },
      { label: "GitHub", href: SITE.github, external: true },
      { label: "Code of conduct", href: "/code-of-conduct/" },
    ],
  },
];
