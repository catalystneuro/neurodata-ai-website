---
title: Benchmarking the ephys-atlas brain-region classifier on Allen (AIND) Neuropixels data
event: "2026"
investigators:
  - name: Pranav Rai
    person: pranav-rai
dandisets:
  - id: "001637"
    url: https://dandiarchive.org/dandiset/001637
topics: []
links:
  slides: >-
    https://docs.google.com/presentation/d/1DWt8IvR__rND_BdXnbNABd31hSR3lhvG/edit?usp=sharing&ouid=109716987555267811989&rtpof=true&sd=true
summary: >-
  The goal of the project was to develop a FeatureCalculator module for NWB datasets, and use that to test how a region
  classification model built on IBL data transfers to the AIND Neuropixels 1 dataset.
hasBody: true
---

## Project Description

  - The goal of the project was to develop a FeatureCalculator module for NWB datasets, and use that to test how a region classification model built on IBL data transfers to the AIND Neuropixels 1 dataset.

## Dandiset(s) Used

  - DANDI:001637 (AIND ecephys): contains CCF acronyms and coordinates for per-channel brain-region labeling. <https://dandiarchive.org/dandiset/001637/draft>
  - Used WavPack-compressed Zarr files to stream raw AP and LF signals from the aind-open-data S3 bucket, cross-referenced with allen\_info.tsv.

\- \*\*DANDI 001637\*\* (AIND \`ecephys\`) — per-channel Allen brain-region labels (CCF acronyms +

  coordinates): https://dandiarchive.org/dandiset/001637/draft

\- Raw AP/LF signal streamed from the \*\*AIND public S3 bucket\*\* \`aind-open-data\`

  (WavPack-compressed Zarr), matched to the DANDI files listed in \`allen\_info.tsv\`.

## Objectives and Approach

  - Stream raw AP + LF per probe directly from AIND S3 (no downloads) and compute the full ephys-atlas feature set (LF, CSD, AP, spike-waveforms) on 5 × 5 s snippets, aggregated and denoised with the library's own pipeline — the same pipeline that built the training vintage.
  - Attach per-channel Cosmos region labels from the matching DANDI 001637 NWB electrodes table (joined on the channel index within each probe).
  - Retrain an XGBoost Cosmos classifier on the latest ea\_active vintage (\`2026\_W26\`), predict the Allen channels, and report accuracy grouped by probe id.
  -

## Progress

  - Implemented \`AllenAindFeatureCalculator\`, a small plug-in to the modular feature-calculator class hierarchy that streams AIND WavPack-Zarr from S3.
  - Processed 129 probes (≈49k channels); Scraped the information about the CCFv3 brain region from DANDI dataset.
  - Applied the pretrained model on Allen dataset - Allen transfer = 0.58 ± 0.13 all-channel, matching the model's own IBL grouped-by-PID cross-validation (0.58)
  - Per-region: hippocampus 0.91 and cortex 0.74 transfer strongly; thalamus 0.18 and olfactory 0.00 are the weak spots (mostly collapsed into cortex/HPF)

## Next Steps

Test with recording of different probes.

Improve out of brain detection, and detection of some regions like Olfactory areas.

Slides -

<https://docs.google.com/presentation/d/1DWt8IvR__rND_BdXnbNABd31hSR3lhvG/edit?usp=sharing&ouid=109716987555267811989&rtpof=true&sd=true>
