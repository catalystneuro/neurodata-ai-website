---
title: Psilocybin influence on mice behavior and brain state
event: "2026"
investigators:
  - name: Yuxin Pan
dandisets:
  - id: "001417"
    url: https://dandiarchive.org/dandiset/001417
    note: Psycode
topics: []
links: {}
summary: >-
  Psilocybin is a naturally occurring psychedelic compound found in over 200 species of mushrooms, often called “magic
  mushrooms.” In the body, psilocybin is rapidly converted into psilocin, which is the active molecule…
hasBody: true
---

## Project Description

Psilocybin is a naturally occurring psychedelic compound found in over 200 species of mushrooms, often called “magic mushrooms.” In the body, psilocybin is rapidly converted into **psilocin**, which is the active molecule that affects the brain. It mainly activates **serotonin 5-HT2A receptors**, which are abundant in the cerebral cortex. Here I want to use the OpenScope dataset with multiple stimuli, sex, and behavioral measurements to explore how it influences animal behavior and brain state.

## Objectives and Approach

My goal is to explore how psilocybin influences mice behavior (pupil size and running) and brain state, trying to answer following question:

  - Which variables influence neural population activity most
  - Does different variables influence independent aspects of population activity or pose common influence
  - Does psilocybin influence behavior, such as pupil size and running?
  - Does psilocybin influence brain state, such as neuronal firing rate, population dimensionality, how information is organized in population activity, etc.

## Progress and Next Steps

  - Done: downloaded openscope NWB dataset and explored data organization, tried several packages such as pynapple, cicada, NeMoS, etc. to do basic analysis to get a feel for how each data modality looks. did dimension reduction, got subspaces for different sensory or motor variables, quantified relationship between subspaces for different brain regions
  - TODO: learn to do cell-cell correlation and see how psilocybin influences that.

## Background and References

1.  ## Elsayed, G., Lara, A., Kaufman, M. et al. Reorganization between preparatory and movement population responses in motor cortex. Nat Commun 7, 13239 (2016). <https://doi.org/10.1038/ncomms13239>
2.  ## Reitman, M.E., Tse, V., Mi, X. et al. Norepinephrine links astrocytic activity to regulation of cortical state. Nat Neurosci 26, 579–593 (2023). https://doi.org/10.1038/s41593-023-01284-w
