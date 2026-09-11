---
title: Support S3 read in the AqNWB C++ API
event: "2026"
investigators:
  - name: Oliver Rübel
    person: oliver-ruebel
  - name: Ben Dichter
    person: ben-dichter
dandisets:
  - id: "000717"
    url: https://dandiarchive.org/dandiset/000717
    note: was used for benchmarking
topics: []
links:
  repo: https://github.com/NeurodataWithoutBorders/aqnwb
  slides: https://docs.google.com/presentation/d/1zVNPSExseWzS_k6aYgZWY86vwwQiMp04MoXY09uedso/edit?slide=id.p#slide=id.p
featured: true
summary: >-
  The goal of the project is to support data streaming from NWB files in S3 via the AqNWB C++ API using the HDF5 ROS3
  driver.
hasBody: true
---

## Project Description

  - The goal of the project is to support data streaming from NWB files in S3 via the AqNWB C++ API using the HDF5 ROS3 driver.

## Objectives and Approach

  - Enhance AqNWB’s HDF5IO class to support opening a file with the ROS3 driver. ROS3 support should be optional to support building AqNWB with HDF5 with ROS3 disabled.
  - Create brief tutorial on how to use S3 read with AqNWB
  - Profile performance of ROS3 in AqNWB compared to h5py (and/or PyNWB)

## Progress

  - Implemented ROS3 support in AqNWB: <https://github.com/NeurodataWithoutBorders/aqnwb/pull/307>
  - Implemented demo benchmark to compare performance of AqNWB ROS3 vs PyNWB using ROS3 and REMFILE: <https://github.com/NeurodataWithoutBorders/aqnwb/pull/308>
  - Ported remfile to CPP: <https://github.com/catalystneuro/remfile-cpp>
  - Integrated remfile with AqNWB: <https://github.com/NeurodataWithoutBorders/aqnwb/pull/309>
  - Collected initial performance results from the demo benchmark: [ruebel\_aqnwb\_performance](https://docs.google.com/spreadsheets/d/1sOtshRlo9kaQiR_lTon_t-Z4dLOb_wjiXBQz03ZI0lQ/edit?gid=2135774827#gid=2135774827)
  - Prepared summary presentation: [ruebel\_aqnwb\_s3\_ndrh\_2026](https://docs.google.com/presentation/d/1zVNPSExseWzS_k6aYgZWY86vwwQiMp04MoXY09uedso/edit?slide=id.p#slide=id.p)

## Next Steps

  - Finalize testing and review of the two MR’s and incorporate in upcoming AqNWB release
