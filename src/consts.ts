export const CURRENT_EVENT = "2027";

export const SITE = {
  name: "NeuroData AI Summer School",
  shortName: "NeuroData AI",
  defaultTitle: "NeuroData AI Summer School",
  titleTemplate: (t: string) => `${t} · NeuroData AI Summer School`,
  description:
    "A one-week residential summer school at HHMI Janelia on reanalysis of open neurophysiology data and AI methods for neural data. Formerly NeuroDataReHack.",
  ogImage: "/social-card.png",
  email: "ben.dichter@catalystneuro.com",
  github: "https://github.com/catalystneuro/neurodata-ai-website",
  youtube: "https://www.youtube.com/@NeurodataWithoutBorders",
  mailingList: "https://mailchi.mp/fe2a9bc55a1a/nwb-signup",
  codeOfConduct: "https://neurodatawithoutborders.github.io/nwb_hackathons/code_of_conduct",
  grant: {
    number: "R25NS149357",
    funder: "National Institute of Neurological Disorders and Stroke",
    url: "https://reporter.nih.gov/search/-/projects?projectNumber=1R25NS149357",
  },
};

export const NAV = [
  { label: "Program", href: "/program/" },
  { label: `${CURRENT_EVENT} School`, href: `/events/${CURRENT_EVENT}/` },
  { label: "Apply", href: "/apply/" },
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
      { label: "Apply", href: "/apply/" },
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
      { label: "Code of conduct", href: SITE.codeOfConduct, external: true },
    ],
  },
];
