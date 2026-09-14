# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: prospective applicants, mostly PhD students, postdocs, and early-career faculty in neuroscience (about four in five) or in computational fields wanting to work on neurophysiology (about one in five). They arrive from a mailing-list announcement, a colleague's recommendation, or a search, usually on a laptop between other tasks, deciding whether the school is worth a week away and an application. Their job on the home page: understand what the school teaches, judge whether they qualify, and either apply or join the mailing list to be told when applications open.

Secondary, confirmed: past participants and self-learners who use the archive of recorded lectures, projects, and tutorials without attending; faculty checking their own pages; NINDS program staff and future sponsors verifying that the program is real, well run, and producing outcomes.

## Product Purpose

The NeuroData AI Summer School is a one-week residential program at HHMI's Janelia Research Campus that trains about 35 researchers a year to find, access, and reanalyze open neurophysiology data in the NWB format on the DANDI Archive, and to apply AI methods to it. It continues NeuroDataReHack, which ran from 2022 to 2026, and is funded for five years by an NINDS R25 research education grant (R25NS149357) awarded to CatalystNeuro in 2026. The website is the program's single home: it presents the upcoming school and the application process, holds the archive of every past installment (schedules, recordings, projects, reports, photos, survey results), publishes the faculty and advisory committee, links to tutorials that run in the cloud, and carries a blog of project highlights and outcomes. Success is a qualified visitor joining the mailing list or applying, and a self-learner finding and using a recording or tutorial.

## Positioning

The school is the only intensive, residential, project-based program devoted specifically to reanalysis of standardized open neurophysiology data, with the analysis tools taught by the people who wrote them and a curriculum strand on AI methods for neural data. Neuromatch Academy teaches computational neuroscience online at scale; NeuroHackademy teaches data science for neuroimaging. This school is specific to NWB data on DANDI and the AI methods applied to it, in person, with a week of real project work on real files.

## Operating Context

Participants apply through an online form (CV, list of contributions, a 300-word benefit statement, a 300-word project idea), are scored by four to six reviewers on five dimensions, and receive preparatory NeuroHackademy modules six to eight weeks before arrival. The week runs Sunday evening to Saturday at HHMI-Janelia with lodging and meals provided; mornings are lectures, afternoons are project work; teams present on the last day. Lectures are recorded and posted to YouTube; projects are documented in a shared document and later a report PDF; exit surveys are published in aggregate. Recurring artifacts: NWB files, Dandisets identified by six-digit IDs, Jupyter notebooks, DANDI Hub and Colab, GitHub repositories, YouTube playlists, the HHMI-Janelia campus (classroom named Synapse, breakout room Spectrum, the pond, the pub).

## Capabilities and Constraints

Static site built with Astro, deployed to GitHub Pages under a project path (`/neurodata-ai-website/`) with a later move to a custom domain; no server, no forms of its own (applications use an external form, notifications use the school's own Mailchimp audience). Content lives in Markdown and YAML collections: events, schedules (from which lectures are derived), people, projects, testimonials, sponsors, resources, outcomes, blog. Lazy YouTube embeds only. Undecided: the custom domain, the 2027 application form URL and deadline, a school-specific mailing list, analytics (none at launch).

Terminology: "NeuroData AI Summer School" is the program; past installments keep the name "NeuroDataReHack 20XX"; "installment" or "school" for a year's event; "participants" not "students"; "faculty" and "instructors"; "Dandiset"; "NWB" and "DANDI" are used unexpanded after first mention.

## Brand Commitments

Name: NeuroData AI Summer School, with the lineage "formerly NeuroDataReHack" stated in the home intro and the history, not in the wordmark. Voice: measured and plain, first person plural for the program, no promotional superlatives. The visual identity is new and must be distinct from nwb.org (orange and blue, Inter) and catalystneuro.com (navy and cyan, Figtree, Inter, JetBrains Mono). The banner image from the CatalystNeuro blog announcement is not to be reused. No logo exists yet; a simple wordmark is acceptable. Standing preference (September 2026): play the category straight. The site is a conventional academic program site executed at full fidelity, in the register of the Flatiron Institute CCN software workshop pages, alongside Neuromatch Academy and NeuroHackademy, with its own distinct color palette; no conceptual visual world, no gimmick interactions.

## Evidence on Hand

Real: five years of event records with participant counts (28, 31, 20, 24, 24), 84 project titles with 20 full write-ups from 2026, 32 recorded lectures from 2025 and 2026 with YouTube IDs, report PDFs for every year, exit-survey numbers (2026 overall 4.86/5, recommend 4.95/5, n=22; 2024 unanimous 5/5), seven attributed testimonials, photos from HHMI-Janelia in 2024 and 2026 and from Granada in 2023 (in `src/assets/photos/`), headshots for 16 of 28 people (`public/images/people/`), sponsor logos (NIH, HHMI-Janelia, Kavli, Allen, LBNL, DANDI, NWB, CatalystNeuro). Absent, do not fabricate: recordings from 2022 to 2024, headshots for twelve people, alumni publication counts, a 2027 speaker-confirmed schedule, the application form, and the two advisory committee members (Dyer, Ghosh) who had not yet confirmed as of 2026-09-12; only confirmed members are listed.

## Product Principles

- The archive is the proof. Show real recordings, real projects, and real numbers rather than describing them.
- Applicants can answer "am I eligible, what does it cost, when do I apply" from the first screen of any event page.
- Every year adds content without redesign: new event, schedule, projects, and people entries are plain files.
- Nothing on the site claims more than the reports support.
- Recordings and tutorials are usable by people who will never attend.

## Accessibility & Inclusion

International audience; many visitors read English as a second language, so copy stays plain. Photos of participants carry alt text; embedded videos are opt-in. WCAG AA contrast on all text.
