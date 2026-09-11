---
title: "Toward Non-Invasive Depth Recording: Learning Mesial Temporal iEEG from Scalp EEG"
event: "2026"
investigators:
  - name: Yinuo Qin
dandisets:
  - id: "000574"
    url: https://dandiarchive.org/dandiset/000574
topics: []
links:
  slides: >-
    https://docs.google.com/presentation/d/1bCSjRsfNwuvTS47nd9jhHD_lJ87RkIUM/edit?usp=share_link&ouid=110471764117566012897&rtpof=true&sd=true
summary: This project develops a transformer model that generates intracranial EEG from non-invasive scalp EEG.
hasBody: true
---

## Project Description

This project develops a transformer model that generates intracranial EEG from non-invasive scalp EEG. The goal is a virtual depth recording: given only scalp signals, predict the activity that a depth electrode would have captured. I train and evaluate on the Boran et al. (2020) dataset, which provides simultaneously recorded scalp EEG, intracranial EEG, and medial temporal lobe single-unit activity from nine epilepsy patients performing a verbal working memory task. Because the intracranial electrodes target the hippocampus, entorhinal cortex, and amygdala, every prediction target lies in deep mesial tissue. This is the region the scalp encodes least well, so the dataset defines the hardest and most clinically relevant limit of the problem.

## Objectives and Approach

  - Develop a transformer that synthesizes intracranial EEG from non-invasive scalp EEG, trained on simultaneously recorded scalp-depth pairs.
  - Design a unified architecture that supports both EEG-only and EEG+iEEG inputs through shared multimodal representations.
  - Build an NWB-compatible preprocessing and training pipeline and evaluate model performance across both input settings.

## Progress and Next Steps

  - Dataset acquisition: Downloaded and organized the multimodal EEG/iEEG dataset.
  - Data visualization: Explored EEG and iEEG signals to understand recording characteristics.
  - Data understanding: Analyzed data structure, channel organization, and event annotations.
  - Pipeline development: Built the preprocessing and simulation pipeline for model training.
  - Model selection: Evaluated architectures (MLP, LSTM, etc.) and selected a multi-head attention model.
  - Data preparation:Generated training, validation, and testing datasets. All on subject 01 due to limited time and storage space on my laptop.
  - Model training & testing: Trained and evaluated the multi-head attention model.
  - Results visualization: Plotted performance metrics and qualitative prediction results.
  - Presentation preparation: Created slides summarizing methods, results, and future work. [Slides](https://docs.google.com/presentation/d/1bCSjRsfNwuvTS47nd9jhHD_lJ87RkIUM/edit?usp=share_link&ouid=110471764117566012897&rtpof=true&sd=true)

Next Steps:

  - Cross-subject generalization: Expand the model to train and evaluate across multiple subjects.
  - Longer model training: Increase training epochs (currently 30) to improve convergence and performance.
  - Hyperparameter tuning: Optimize learning rate, attention architecture, and regularization.

## Background and References

  - Boran, Ece, et al. "Dataset of human medial temporal lobe neurons, scalp and intracranial EEG during a verbal working memory task." *Scientific data* 7.1 (2020): 30.
  - Pham, Tien-Dat, and Xuan-The Tran. "Cross-Subject Intracranial EEG Reconstruction from Scalp Recordings Using Multi-Scale Cross-Attention Transformers." *arXiv preprint arXiv:2605.18897* (2026).
