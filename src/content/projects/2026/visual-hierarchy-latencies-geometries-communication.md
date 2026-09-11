---
title: Visual hierarchy - onset latencies, representational geometries, communication
event: "2026"
investigators:
  - name: Aravind Krishna
dandisets:
  - id: "000022"
    url: https://dandiarchive.org/dandiset/000022
topics: []
links:
  slides: https://docs.google.com/presentation/d/1_iOyrPy9GQWfIkZ9m05C-Y4w8SD7Kba8ic-6TaMafxc/edit?usp=sharing
summary: >-
  This project investigates the spatiotemporal processing and representational geometry of the mouse visual system by
  leveraging the Allen Institute Visual Coding Neuropixels dataset.
hasBody: true
---

## Project Description

This project investigates the spatiotemporal processing and representational geometry of the mouse visual system by leveraging the Allen Institute Visual Coding Neuropixels dataset. By quantifying onset latencies, response magnitude, and parametric representational geometries across the cortical hierarchy, the study characterizes the transformation of sensory signals as they propagate through distributed brain-wide networks. The primary objective is to determine how inter-neuronal communication and population-level dynamics underlie the functional organization of vision, exploring whether visual input features like contrast modulate the strength and coordination of inter-areal signaling

## Objectives and Approach

  - Learn how to explore NWB datasets, recreate some known results (onset latencies)
  - Explore representational geometry of orientation tuning and contrasts along visual the hierarchy
  - Study the strength and dynamics of inter-neuronal communication and assess whether visual input contrast enhances communication

## Progress and Next Steps

  - Completed the three sets of analysis - focusing on single neuron responses

      - Onset latencies follow the visual area hierarchy: LGN-\>V1-\>higher order visual areas (other thalamic regions lie somewhere in the middle of this hierarchy)
      - Both orientation and contrast information are organized parametrically within neuronal population firing rates
      - Inter-areal (neuron pair) communication of v1-lm is contrast sensitive but all other area pairs are insensitive to contrast (contrast invariant)
  - Next steps: study signaling within and between areas from a population perspective

## Background and References

  - Siegle et al., 2021; Jia et al., 2022

[NeuroDataReHack slides](https://docs.google.com/presentation/d/1_iOyrPy9GQWfIkZ9m05C-Y4w8SD7Kba8ic-6TaMafxc/edit?usp=sharing)
