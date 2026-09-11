---
title: Geometric analysis of behaviorally derived neural latent state dynamics in IBL BWM data
event: "2026"
investigators:
  - name: Ariana Tortolani
  - name: Camila Maura
dandisets:
  - id: "000409"
    url: https://dandiarchive.org/dandiset/000409
    note: IBL brain wide map
topics: []
links:
  slides: https://docs.google.com/presentation/d/1XuzNsylt0jU4_Cg2v6Pw75uqVxGbA_r0E307AMsN5VQ/edit?slide=id.p1#slide=id.p1
summary: >-
  Recent work has established that decision-related signals are distributed across the brain, spanning sensory,
  association, and motor cortices (International Brain Laboratory et al., 2025).
hasBody: true
---

## Project Description

Recent work has established that decision-related signals are distributed across the brain, spanning sensory, association, and motor cortices (International Brain Laboratory et al., 2025). At the same time, Ashwood et al. (2022) and Bolkan et al. (2022) have demonstrated that animals do not use a single decision-making strategy but instead alternate between discrete latent behavioral states, including an engaged state in which choices closely track sensory evidence and disengaged or biased states characterized by frequent errors. While these states have been characterized behaviorally, their neural correlates remain an open question. In particular, it is unclear whether state-dependent changes in neural activity are uniform across the cortical hierarchy or whether engagement differentially modulates early sensory versus higher-order areas. In this context, our aim was to identify how neural selectivity for task variables changed as a function of both the animal's behavioral state and cortical area. To this end, we wanted to analyze population activity across areas spanning the cortical hierarchy, segmenting neural responses by behaviorally derived latent states. Understanding how internal states reshape neural representations at different stages of cortical processing may help reconcile conflicting reports about the locus of decision-related activity and reveal how the brain gates the flow of sensory evidence toward adaptive behavior.

## Objectives and Approach

  - Understand IBL brainwide map dataset structure,

    1.  Load and explore behavioral and neural data
  - Explore methods for geometric analysis of neural data

## Progress and Next Steps

  - Successfully loaded in datasets and followed similar preprocessing to Posani 2025 for binning and aligning trials to stimulus onset
  - Made several data visualization plots such as PSTHs and rasters to get acquainted with the neural data. We also separated out neural activity from different brain regions and in different block types (50-50 / 80-20 / 20-80) to see if there were large differences within or across regions during blocks of different stimulus bias.
  - Performed linear SVM decoding for various behavioral task elements such as task block, choice and stimulus side for different brain regions to understand how each regions may differentially encode these variables
  - Started geometry / dimensionality reduction analyses by first using PCA to visualize the data
  - Next steps are running the GLM-HMM and the Viterbi algorithm to extract the behavioral states and use this to differentially analyze the neural data

## Background and References

  - [Posani et al 2025](https://www.nature.com/articles/s41586-026-10668-4)
  - [Slides](https://docs.google.com/presentation/d/1XuzNsylt0jU4_Cg2v6Pw75uqVxGbA_r0E307AMsN5VQ/edit?slide=id.p1#slide=id.p1)
