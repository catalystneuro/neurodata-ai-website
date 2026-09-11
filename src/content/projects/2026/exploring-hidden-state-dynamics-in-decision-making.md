---
title: Exploring hidden state dynamics in decision making
event: "2026"
investigators:
  - name: Dinesh Natesan
  - name: Teo Fantacci
dandisets:
  - id: "000620"
    url: https://dandiarchive.org/dandiset/000620
  - id: "000409"
    url: https://dandiarchive.org/dandiset/000409
topics: []
links: {}
summary: The aim of the project is to explore the effectiveness of Hidden Markov Models in describing the neural dynamics.
hasBody: true
---

## Project Description

The aim of the project is to explore the effectiveness of Hidden Markov Models in describing the neural dynamics.

## Objectives and Approach

Decision making often involves recognizing cues, storing them in memory and performing an action based on the stimulus, stored memory and context. Hidden Markov Models (HMMs) are a class of models that describe observable events as the output of a set of hidden states and transition between states. We reasoned that animal behavior, and the underlying neural dynamics, could be described by HMMs.

## Progress

  - Preliminary exploration of the data (Done)
  - Unsupervised clustering of the data (Done)
  - Investigate why unsupervised clustering failed using pca decomposition (Done)
  - Investigated with supervised dPCA to cluster task condition (Done)
  - Building of HMM frameworks (Done)
  - Fitting HMMs to the data (Done)
  - Comparison and reliability of the fit HMM model states for mouse and monkey datasets (In progress)

## Next Steps

  - Investigate and implement approaches to remove the first principal component from the data and rerun analyses.
  - Identify the percentage of neurons that are showing visual and memory related states.
  - Testing alignments with respect to different task conditions to measure reliability and reduce noise in fits.
  - If the identification of hidden states fails after removing the first principal component, are there other independent approaches we can try before concluding our assumptions are wrong?
