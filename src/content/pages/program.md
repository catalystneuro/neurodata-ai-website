---
title: The program
---
## Why the school exists

The DANDI Archive now holds more than 550 neurophysiology datasets in the Neurodata Without Borders format, spanning a wide range of species, brain areas, task designs, and recording modalities. Some of them are extraordinary resources, large, thoroughly documented, and enormously expensive to collect, including releases from Allen Institute OpenScope, the MICrONS project, and the International Brain Laboratory Brain Wide Map. Reuse of these datasets is growing, but it is still far below what they cost to collect or what they could support.

Reanalysis is welcome, but the groups doing it tend to be computationally sophisticated ones that already know their way around standardized formats and cloud-hosted archives, and that expertise is distributed unevenly. Many neuroscientists who want to do this work have never been taught how: how standardized formats are organized, how to stream data from a cloud archive instead of downloading it, which analysis tools read NWB files directly, and how to judge whether a method developed on one lab's recordings will transfer to another's. None of it is hard to learn, but it is rarely taught.

The NeuroData AI Summer School teaches it. Participants arrive with a reanalysis question they care about, form teams around shared datasets and interests, take instruction in the mornings, and spend most of the week on project work with faculty and dataset stewards on hand. Teams present on the final day. Lectures and tutorials are recorded and published afterward.

## Aims

The school is organized around four aims.

1. **Intensive, hands-on training in neurophysiology data standards and analysis.** Participants learn the structure of the NWB standard, validation, and programmatic access, alongside navigating and streaming from the DANDI Archive, and they work with the analysis ecosystem built around the standard: SpikeInterface, Pynapple, NeMoS, Neurosift, suite2p and its companions, Spyglass, and the OpenScope DataBook.
2. **AI-enhanced approaches for neural data analysis.** The curriculum covers foundation models for neural data, coding with large language models and AI agents, machine learning for dimensionality reduction and neural decoding, state space models, and transfer learning across datasets, with attention to where these methods are reliable and where they are not.
3. **A community of practice in open neurophysiology data science.** Teams form around datasets and questions, receive mentorship from dataset stewards and tool developers, and learn open science practices including how to report issues and contribute to open source software. Participants return to their institutions as practitioners and local resources.
4. **New scientific insight through secondary analysis.** Projects are real reanalyses of open datasets. Many produce preliminary results and publication-quality figures within the week, and analysis workflows are contributed back to the community.

## Format

The school runs once a year at HHMI Janelia Research Campus. Participants arrive on a Sunday evening for a welcome reception, and the program runs through the following Saturday, with sessions scheduled from nine in the morning to the early evening and the evenings free for continued project work and campus life. About 35 participants attend each year, with roughly eight faculty on site throughout, which keeps the ratio close enough for sustained one-on-one mentorship. Six to eight teams of four to six people is the usual shape of the project work.

Days one and two establish the foundations: the NWB standard, the DANDI Archive, streaming access, the flagship datasets, and the classic analysis tools, most of them taught by the people who wrote them. Day three introduces the AI methods and hands the week over to project work. Days four through six are devoted to projects, with daily check-ins, a laboratory tour, a session on the responsible conduct of research with open data, and the final presentations. The exact agenda changes from year to year based on participant feedback and on what is new in the field; the [2026 schedule](/events/2026/) is a good guide to the shape of the week.

Throughout, we work with real files rather than tidy prepared examples. Nearly all the difficulty in reanalysis lives in the parts of a dataset that do not match your expectations, and that cannot be learned from a sanitized notebook.

## Before you arrive

Accepted participants complete a short skills assessment covering Python, version control, data visualization, and machine learning, and receive personalized recommendations from the free NeuroHackademy modules on those topics six to eight weeks before the school. The school is designed for people with foundational skills rather than complete beginners: we do not teach programming from scratch, and we do not offer an accelerated neuroscience course for computational researchers with no biological background.

## Funding and hosting

The school is supported by a five-year research education grant (R25NS149357) from the National Institute of Neurological Disorders and Stroke, awarded to CatalystNeuro in 2026. The award covers participant travel, faculty, and the production of recorded lectures and open educational materials, and it lets the curriculum accumulate across years instead of being rebuilt each spring.

HHMI Janelia Research Campus has hosted and sponsored the program since 2024, providing housing, meals, and meeting space, which is what allows the school to be offered at no cost to participants. The Kavli Foundation supported the first four installments and offered Neurodata Discovery Awards to continue projects begun at the workshop. The first NeuroDataReHack was hosted by the Allen Institute in Seattle.

## How the school fits alongside other programs

Two other programs cover adjacent ground and both are excellent. [Neuromatch Academy](https://neuromatch.io/) teaches computational neuroscience and NeuroAI at a far larger scale and with no travel required. [NeuroHackademy](https://neurohackademy.org/) covers scientific computing, reproducibility, and data science for neuroimaging. This school is focused on reanalysis of neurophysiology data in the NWB format on the DANDI Archive, and on the AI methods now being applied to it, for people who arrive with a programming background and some neurophysiology behind them. We schedule around these programs so that anyone who would benefit from more than one can attend more than one.

## Materials and licensing

All lectures are recorded and published on the [lectures page](/lectures/) within a few weeks of each installment. Tutorials, notebooks, and project code live in the program's GitHub repository, and project teams document their work in Jupyter notebooks that anyone can run, since every dataset used is public. Educational content is released under CC BY and software under permissive open source licenses.
