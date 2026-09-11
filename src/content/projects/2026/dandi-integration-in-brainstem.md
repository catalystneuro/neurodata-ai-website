---
title: DANDI Integration in BrainSTEM
event: "2026"
investigators:
  - name: Juan Castano
dandisets:
  - id: "000003"
    url: https://dandiarchive.org/dandiset/000003
  - id: "000056"
    url: https://dandiarchive.org/dandiset/000056
  - id: "000059"
    url: https://dandiarchive.org/dandiset/000059
  - id: "000061"
    url: https://dandiarchive.org/dandiset/000061
  - id: "000568"
    url: https://dandiarchive.org/dandiset/000568
topics: []
links:
  slides: https://canva.link/xla6yx8yrz5di5h
summary: >-
  The goal of this project is to import hundreds of published DANDI dandisets into BrainSTEM, extract metadata from NWB
  files with contextual information and capture missing values from the associated source paper.
hasBody: true
---

## Project Description

The goal of this project is to import hundreds of published [DANDI](https://dandiarchive.org/) dandisets into [BrainSTEM](https://www.brainstem.org/), extract metadata from NWB files with contextual information and capture missing values from the associated source paper. Every value is validated before it becomes part of BrainSTEM, so imported datasets are both rich and reliable.

## Objectives and Approach

  - Build a UI-driven pipeline to browse, import, and map dandisets into BrainSTEM.
  - Extract metadata from NWB files, DANDI API and source papers using AI agents.
  - Design a multi-layer validation workflow for every extracted value before materialization.

## Progress and Next Steps

  - Built a multi-layer CLI validation pipeline to catch conflicts/errors on agent’s outputs.
  - Validated multiple dandisets and applied flagged corrections on mapping files.
  - Next: Bring the validation workflow into a UI to be run without manual steps.
  - Next: Keep testing on dandisets from other labs to find bugs or improvements on code.

## Background and References

  - [Project Presentation Slides](https://canva.link/xla6yx8yrz5di5h)
