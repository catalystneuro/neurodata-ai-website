---
title: Hippocampal - Prefrontal Manifold Geometry Across Novelty and Learning
event: "2026"
investigators:
  - name: Mikhail (Misha) Proskurin
dandisets:
  - id: "000978"
    url: https://dandiarchive.org/dandiset/000978
  - id: "000447"
    url: https://dandiarchive.org/dandiset/000447
topics: []
links:
  repo: https://github.com/M-Proskurin/NeuroDataReHack
  slides: >-
    https://docs.google.com/presentation/d/1eX72Ko6HlObZNdqTwiutOsCfCZ-qhIyG/edit?usp=sharing&ouid=100090146882484316895&rtpof=true&sd=true
summary: >-
  Population-geometry ("cognitive map") analysis of hippocampal CA1 and prefrontal (PFC) ensemble recordings from the
  Jadhav lab, using manifold and dimensionality-reduction methods.
hasBody: true
---

## Project Description

Population-geometry ("cognitive map") analysis of hippocampal CA1 and prefrontal (PFC) ensemble recordings from the Jadhav lab, using manifold and dimensionality-reduction methods. Two W-track dandisets from the same lab are analyzed in parallel, not merged: one probing how the map differs between novel and familiar environments, the other how it evolves as an animal learns a new environment across a single day. CA1 and PFC are always processed separately.

## Objectives and Approach

**Questions**:

  - (000447) How does the population geometry transform between novel and familiar contexts, and how do CA1 and PFC relate?
  - (000978) How does the manifold evolve session-by-session during learning, and does it change its dimensionality or just its shape?

**Approach**.

  - Data is streamed lazily from DANDI (pynwb/remfile). A common pipeline runs per dandiset: (1) extract time-binned spike-rate matrices with position/velocity and epoch/condition/session labels; (2) linear baselines, PCA, lap-resolved dPCA (cross-validated regularization + permutation significance), and GPFA with latents indexed by linearized track position; (3) nonlinear embeddings, UMAP and CEBRA (supervised and unsupervised CEBRA-Time) on a validated 50 ms / Gaussian-smoothed / speed-filtered representation; (4) geometry comparison, Procrustes/CCA on position-matched centroids, with tracks linearized onto a common W topology so different physical mazes are comparable; (5) intrinsic-dimensionality triangulation, TwoNN, PCA participation ratio, Isomap residual variance, and a decoding-vs-dimension curve, all cross-validated.

## Progress and Next Steps

**Done**

  - compared in track-relative (linearized) coordinates the maps show a spatially-structured transformation, clear shared geometry plus real reshaping. dPCA confirms a genuine space×condition interaction (remap), significant in all animals.
  - 000978: the manifold converges monotonically toward its final-session geometry across the day, robust to bin size, embedding, region, and 2-D vs. track-relative binning.
  - Dimensionality: both maps are low-dimensional and curved, TwoNN/Isomap give \~3–5 intrinsic dimensions vs. a much higher linear participation ratio (the gap is a curvature signal). Intrinsic dimensionality is largely unchanged by familiarisation (000447) and, within a session, is stable (\~3) across learning (000978), the pooled \~8 reflects cross-session drift, not within-session complexity. Conclusion: learning/novelty reshape the geometry of a fixed-low-dimensional map rather than changing its dimensionality.

## Next Steps

  - Topology (persistent homology, ripser) to test whether the low-D geometry is the expected ring structure and whether that topology is preserved across the novel→familiar transformation.
  - Per-animal vs. pooled alignment, and consistency checks across animals for the learning trajectory.

## Background and References

  - Reference paper: Shin & Jadhav, Geometric transformation of cognitive maps for generalization across hippocampal-prefrontal circuits, Cell Reports 2023 <https://www.sciencedirect.com/science/article/pii/S2211124723002577>
  - Slides: <https://docs.google.com/presentation/d/1eX72Ko6HlObZNdqTwiutOsCfCZ-qhIyG/edit?usp=sharing&ouid=100090146882484316895&rtpof=true&sd=true>
  - Github repo: <https://github.com/M-Proskurin/NeuroDataReHack>
