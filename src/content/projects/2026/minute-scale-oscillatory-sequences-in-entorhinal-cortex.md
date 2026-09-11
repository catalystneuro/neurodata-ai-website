---
title: Replicating minute-scale oscillatory sequences in entorhinal cortex
event: "2026"
investigators:
  - name: Ben Dichter
    person: ben-dichter
  - name: Ryan Ly
    person: ryan-ly
dandisets:
  - id: "000053"
    url: https://dandiarchive.org/dandiset/000053
  - id: "001701"
    url: https://dandiarchive.org/dandiset/001701
  - id: "000897"
    url: https://dandiarchive.org/dandiset/000897
topics: []
links:
  repo: https://github.com/catalystneuro/mec-ultraslow-replication
  slides: https://docs.google.com/presentation/d/1Sm5ccVNK1LUi3mmSAlyS77oo7OgRBrrAefBQVjZ57oc/edit?usp=sharing
featured: true
summary: >-
  Gonzalo Cogno et al. (2024) reported that mouse medial entorhinal cortex (MEC) activity can organize into ultraslow
  oscillations, with periods of tens of seconds to minutes, and that during those oscillations the cells…
hasBody: true
---

## Project Description

Gonzalo Cogno et al. (2024) (<https://doi.org/10.1038/s41586-023-06864-1>) reported that mouse medial entorhinal cortex (MEC) activity can organize into ultraslow oscillations, with periods of tens of seconds to minutes, and that during those oscillations the cells fire in periodic sequences. The effect was observed in a sensory-minimized condition: head-fixed mice on a rotating wheel in darkness. We tested whether the phenomenon replicates in other public entorhinal recordings, and whether it survives navigation and appears outside the mouse. Darkness is where the paper observed the effect, not a condition it showed to be required, so testing navigation datasets is a partial answer to the authors' own stated open question about whether the sequences persist across a broader range of behaviors and in the presence of salient visual feedback.

The central methodological point of the project is that single-cell rhythmicity is not specific and cannot be the replication criterion. The load-bearing test is at the population level, so we validated the whole pipeline against the paper's own Neuropixels wheel data, obtained from EBRAINS, before trusting any null result elsewhere.

## Dandiset(s) Used

  - EBRAINS doi:10.25493/SKKX-4W3 (<https://doi.org/10.25493/SKKX-4W3>): the paper's own mouse MEC Neuropixels wheel-in-darkness data, used as the positive control
  - DANDI 000053 (<https://dandiarchive.org/dandiset/000053>) (Mallory/Giocomo): mouse MEC, VR straight track
  - DANDI 001701 (<https://dandiarchive.org/dandiset/001701>) (Aery Jones): mouse MEC and visual cortex, X-maze
  - DANDI 000897 (<https://dandiarchive.org/dandiset/000897>) (Neupane/Fiete/Jazayeri): macaque entorhinal cortex, mental navigation

## Objectives and Approach

  - Reimplement the paper's ephys pipeline: bin spikes at 120 ms, smooth (Gaussian, sigma = 5 s), binarize, and detect an ultraslow power-spectral peak below 0.1 Hz absent from shuffled data.
  - Make the population sequence test the criterion: PCA on the time-by-cell activity matrix, each cell's phase from its (PC1, PC2) loading, with a null that circularly shifts each cell independently so it isolates a shared oscillation with staggered phases from cells being individually slow.
  - Run the test windowed (300 s windows) rather than whole-session, because the sequences are intermittent and a whole-session statistic washes them out.
  - Report the quantity the paper reports, the fraction of sessions with periodic sequences, over every session in every dataset.
  - Use within-dataset region controls (001701 visual cortex) and dedicated behavioral controls to separate an intrinsic rhythm from task or behavioral periodicity.

## Progress and Next Steps

Done

  - The pipeline reproduces the original effect on the paper's wheel data: ultraslow rhythmicity in about 64 percent of MEC cells, a median period near 39 s, and coherent population sequences in both Neuropixels mice (104638 p about 1e-6, 102335 p = 0.025).
  - Two statistical traps were found and fixed, each caught only because the positive control existed: a band-power statistic that is blind because the 5 s kernel puts most power in-band for real and shuffled data alike, and a permutation resolution floor that makes per-cell FDR unreachable. The fixes are an excess-power ratio that whitens the background and a pooled-across-cells null.
  - We do not replicate minute-scale oscillatory sequences in mouse MEC during navigation. Across 134 mouse MEC navigation sessions (0 of 20 VR track, 3 of 114 X-maze) the sequence rate is at chance, and the within-session visual-cortex control is higher (9 of 110), which is the opposite of an intrinsic MEC-specific effect.
  - The two apparent positives outside the wheel are behavioral or task confounds, each shown with a dedicated control. Mouse visual cortex (9 of 110) tracks the lap cycle. Macaque entorhinal cortex (8 of 15) tracks trial-onset density over a multi-hour session, so it is task-engagement block structure. Running PCA on the macaque rest periods only (the long disengaged blocks) yields different components but no oscillatory sequence, which reinforces the task-driven reading.
  - Code and a written walkthrough are public at <https://github.com/catalystneuro/mec-ultraslow-replication>, and a summary is posted back to the helpdesk discussion at <https://github.com/dandi/helpdesk/discussions/156>.

Slides: [slow-oscillations-ndrh2026](https://docs.google.com/presentation/d/1Sm5ccVNK1LUi3mmSAlyS77oo7OgRBrrAefBQVjZ57oc/edit?usp=sharing)

## Next Steps

  - A sharper open question is whether cells with similar sequence phase also have similar spatial tuning, tested where the fields are not being driven so it is not circular. The clean design is phase from the wheel (no spatial drive) and rate maps from the open field, same units. The open-field position for the two Neuropixels sessions is not in the public deposit, so we have requested it from EBRAINS curation.
  - Depositing the EBRAINS wheel data on DANDI in NWB would be valuable, since it is the only public recording in the condition where the effect is known to exist.

## Background and References

  - Gonzalo Cogno, S. et al. Minute-scale oscillatory sequences in medial entorhinal cortex. Nature 625, 338-344 (2024). <https://doi.org/10.1038/s41586-023-06864-1>
  - Earlier NeuroDataReHack work this builds on: <https://github.com/rly/replicate-gonzalo-cogno-2023>
