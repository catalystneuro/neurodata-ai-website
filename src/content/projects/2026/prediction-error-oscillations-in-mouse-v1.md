---
title: "Oscillatory signatures of prediction error in mouse V1: stimulus-dependent, not error-general"
event: "2026"
investigators:
  - name: José Antonio Velázquez Ruiz
dandisets:
  - id: "001637"
    url: https://dandiarchive.org/dandiset/001637
    note: OpenScope Community Predictive Processing, AIND Neuropixels
topics: []
links:
  slides: https://docs.google.com/presentation/d/1opeOsHV7Efq8L8b1atEK-jjcrB09FEyObWZLck-xpKI/edit?usp=drivesdk
featured: true
summary: >-
  Prior work on the OpenScope Global/Local Oddball dataset reported a gamma-band (~30-90 Hz) power increase in V1 during
  prediction-error trials, interpreted as a general oscillatory signature of sensory prediction error.
hasBody: true
---

## Project Description

Prior work on the OpenScope Global/Local Oddball dataset reported a gamma-band (\~30-90 Hz) power increase in V1 during prediction-error trials, interpreted as a general oscillatory signature of sensory prediction error. We tested whether this signature generalizes across violation types using the newer OpenScope Community Predictive Processing dataset, which records the same animals across multiple distinct mismatch paradigms (standard visual oddball, sensorimotor mismatch, sequence mismatch), each sharing the same core set of deviant trial types (omission, orientation change, motor halt). Contrary to a general "error signal" account, we found that the gamma-band signature in VISp layer 2/3 is present specifically for stimulus-content violations (orientation changes) and absent for violations without new visual content (omission, motor halt), replicated across all three paradigms tested. This argues that the effect reflects processing of unexpected visual content rather than prediction error in the abstract, and refines the interpretation of the original Global/Local Oddball finding.

## Objectives and Approach

  - Identify which cortical layer of VISp carries an oscillatory (LFP) signature of prediction error, since the original Global/Local Oddball paper reported the effect originating in L4 and expressed most strongly in L2/3.
  - Test whether the signature is a general error response or specific to violation modality, using within-session comparisons across standard visual, sensorimotor, and sequence mismatch blocks (same animals, same shared deviant trial types: standard, omission, orientation\_45/90, halt).
  - Test whether gamma power scales with the number of preceding standard trials, a signature predicted by predictive-coding accounts of prediction-error accumulation.

## Progress and Next Steps

Done:

  - Built a full streaming pipeline (remfile + pynwb) to pull cortical LFP by exact CCF layer across all 9 animals with usable VISp coverage, without downloading NWB files.
  - Computed Gaussian-tapered per-trial PSDs (100 log-spaced bins, 4-100 Hz) and confirmed a robust gamma-band (\~25-35 Hz) power increase in VISp2/3 specific to orientation\_45/orientation\_90, absent in omission and halt, replicated across all 9 animals in the standard-oddball block and independently in the sensorimotor block (which shares the same trial types under a motor\_ prefix).
  - Confirmed the effect is time-locked to stimulus presentation using Hilbert-envelope power time courses (band-limited, zero-phase filtered), showing a transient rise beginning at true stimulus onset and returning to baseline by offset, ruling out a slow/tonic state effect.
  - Tested running speed around the motor-halt window directly; found no significant, consistent locomotion change at the population level, arguing against a pure locomotion-gain confound for the halt condition.
  - Tested and did not find a significant relationship between gamma magnitude and the number of preceding standard trials, weakening (though not ruling out, given limited dynamic range in run length) a simple prediction-accumulation account.
  - Ruled out several methodological confounds along the way: wavelet time-frequency resolution limits at low frequencies (theta/alpha were unusable at short analysis windows), and log-frequency-binning artifacts at low frequencies (resolved by computing PSDs at native periodogram resolution before log-scale display).

TODO:

  - Test whether the VISp2/3 gamma signature is locally generated or shared with downstream visual-hierarchy areas (e.g., VISlm) via band-limited coherence, cross-area analysis, not yet included in current results.
  - Extend the layer-specific analysis to the sequence-mismatch block's own deviant types (sequence\_omission) to test whether sequence-level violations recruit the same or a distinct oscillatory signature.
  - Formal cluster-based permutation statistics across animals for all reported effects (current results are descriptive, animal-averaged with SEM, not yet permutation-tested).

## Background and References

Sennesh, Westerberg, Spencer-Smith, Bastos. "Ubiquitous predictive processing in the spectral domain of sensory cortex" (eLife reviewed preprint, dandiset 000253).
 Bastos et al. (2015). "Visual Areas Exert Feedforward and Feedback Influences through Distinct Frequency Channels." Neuron.
OpenScope Community Predictive Processing project
