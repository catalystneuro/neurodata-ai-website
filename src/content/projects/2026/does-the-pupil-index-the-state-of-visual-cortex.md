---
title: Does the pupil index the state of visual cortex?
event: "2026"
investigators:
  - name: Emmanuel González González
  - name: Rebeca Santé Arsenal
dandisets:
  - id: "000021"
    url: https://dandiarchive.org/dandiset/000021
topics: []
links:
  slides: >-
    https://docs.google.com/presentation/d/1vc8672c5jRWuYBj-fEzR_r2AMik9j13y/edit?usp=sharing&ouid=108832080242510792482&rtpof=true&sd=true
summary: >-
  We propose a high-performance machine learning framework to decode and predict primary visual cortex (VISp) latent
  population states using solely the temporal dynamics of the pupil.
hasBody: true
---

## Project Description

We propose a high-performance machine learning framework to decode and predict primary visual cortex (VISp) latent population states using solely the temporal dynamics of the pupil. By mapping behavioral data to neural manifolds, we intend to establish the predictive horizon (t+h) for physical changes in cortical networks driven by neuromodulation.

## Objectives and Approach

Our goal is to predict the neural latent space from peripheral behavioral signals using a three-pillar approach:

  - Smart Feature Extraction and Alignment.
  - Physiologically Valid Dimensionality Reduction.
  - Predictive Modeling and Horizon Evaluation.

## Progress and Next Steps

  - Validate NWB behavioral extraction, complete spatiotemporal alignment via pynapple, establish linear decoding baselines, and extract latent states using PCA.
  - Fine-tune LSTM parameters to account for pupillary inertia versus cortical modulation speed
  - Evaluate prediction error across multiple forecasting horizons (t+h)
  - Create presentation: [Does the pupil index the state of visual cortex.pptx](https://docs.google.com/presentation/d/1vc8672c5jRWuYBj-fEzR_r2AMik9j13y/edit?usp=sharing&ouid=108832080242510792482&rtpof=true&sd=true) (Slides)

## Background and References

  - **Reimer et al., 2014, ** pupil size tracks fast switches of cortical state in quiet wakefulness.
  - **McGinley et al., 2015, ** pupil-indexed arousal modulates neural and behavioral responses.
  - **Vinck et al., 2015, ** arousal and locomotion make distinct contributions to cortical activity.
  - **Stringer et al., 2019, ** spontaneous facial movements drive brain-wide activity; 1-D signals (pupil, running) capture only a slice.
  - **Musall et al., 2019, ** single-trial neural dynamics are dominated by movement.
