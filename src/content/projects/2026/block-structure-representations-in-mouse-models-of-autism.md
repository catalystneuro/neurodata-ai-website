---
title: Neural representations of block structure in mouse models of autism
event: "2026"
investigators:
  - name: Jake Pennington
    person: jacob-pennington
  - name: Nicole G.-Rangel
dandisets: []
topics: []
links:
  slides: >-
    https://docs.google.com/presentation/d/1n1f92196kwIp5j3f0PE1LaIyBEdsd_PQ/edit?usp=sharing&ouid=115771392828445456075&rtpof=true&sd=true
summary: >-
  Many disparate genetic variations are associated with autistic traits in both humans and mouse models, which
  complicates the study of genetic and neurophysiological bases for autism.
hasBody: true
---

## Project Description

Many disparate genetic variations are associated with autistic traits in both humans and mouse models, which complicates the study of genetic and neurophysiological bases for autism. [Noel et al. (2025)](https://doi.org/10.1038/s41593-025-01965-8) found that, despite this diversity, some neural computation strategies associated with ASD are common across several mouse models, suggesting that autistic traits in humans may also emerge from a variety of genetic variations rather than having a single cause. The authors employed a visual detection task to probe the learning strategies of three mouse models of ASD and wild-type mice. They showed that ASD models update their priors more slowly with prior encoding shifting from sensory to frontal lobe. We hypothesize that these differences in strategy reflect a change in neural dynamics rather than in the underlying representational geometry: block-related population structure may be geometrically similar across genotypes but converge to it more slowly or less stably in ASD models. To investigate this, we will look for differences in population ensembles or low-level manifolds using methods from [Carillo-Reid et al. 2019](https://doi.org/10.1016/j.cell.2019.05.045) and [Kohli et al. 2024](https://doi.org/10.1101/2024.10.31.621292). We will also test whether block-related (prior) information is linearly decodable from neural activity.

## Dandiset(s) Used

  - [IBL 2025 Autism data release](https://docs.internationalbrainlab.org/notebooks_external/2025_data_release_autism_noel.html)

## Objectives and Approach

  - Determine  whether block-related (prior) information is linearly decodable from neural activity
  - Compare the low-dimensional manifold structure of block representations across genotypes
  - Measure convergence dynamics (how quickly and how stably the population representation settles into a block-specific state after block switch comparing genotypes)
  - Assess local ensemble coactivity related to block variables, following the operational definition from [Carillo-Reid et al. 2019](https://doi.org/10.1016/j.cell.2019.05.045).

## Progress and Next Steps

  - Solved data-loading through IBL ONE-api, explored dataset.
  - Observed difference in population ensembles for WT vs autism models.
  - Tried PyRATS for manifold embedding, but it was too unwieldy for real data. Seemed tailored to small synthetic datasets. Attempted modifying the codebase to make improvements, but was more involved than initial impression.
  - Visualized manifolds with tSNE instead, for several examples from each genotype.

## Background and References

  - [Noel et al. 2025](https://doi.org/10.1038/s41593-025-01965-8)
  - [Carillo-Reid et al. 2019](https://doi.org/10.1016/j.cell.2019.05.045)
  - [Kohli et al. 2024](https://doi.org/10.1101/2024.10.31.621292)

[SLIDES](https://docs.google.com/presentation/d/1n1f92196kwIp5j3f0PE1LaIyBEdsd_PQ/edit?usp=sharing&ouid=115771392828445456075&rtpof=true&sd=true)
