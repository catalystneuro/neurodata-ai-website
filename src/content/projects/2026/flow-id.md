---
title: Flow-ID
event: "2026"
investigators:
  - name: Alice Wang
dandisets:
  - id: "000715"
    url: https://dandiarchive.org/dandiset/000715
  - id: "000714"
    url: https://dandiarchive.org/dandiset/000714
  - id: "000541"
    url: https://dandiarchive.org/dandiset/000541
  - id: "000565"
    url: https://dandiarchive.org/dandiset/000565
  - id: "000692"
    url: https://dandiarchive.org/dandiset/000692
  - id: "000776"
    url: https://dandiarchive.org/dandiset/000776
topics: []
links: {}
summary: Aligning calcium recordings across individuals remains challenging to neuron or cell type level.
hasBody: true
---

## Project Description

  - Aligning calcium recordings across individuals remains challenging to neuron or cell type level. To tackle, this project will use the dandisets on *C. elegans* to develop approaches that can potentially be extended to more species.

## Objectives and Approach

  - Reproduce Sprague et al. (2025) results that 1) CRF\_ID \> StatAtlas and 2) more datasets included for producing the common atlas help with generalization
  - Propose new alignment and ID algorithms and evaluate on benchmark against CRF\_ID and StatAtlas

## Progress

  - Proposed and benchmarked 8 new algorithms variants against CRF\_ID and StatAtlas, including normalizing flow based methods and inclusion of functional information.
  - Demonstrated normalizing flow based variants win across the board, including the previous SOTA CRF\_ID.

## Next Steps

  - Improve on functional embedding which is currently not helpful in improving alignment scores.
