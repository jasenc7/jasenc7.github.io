---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: ""
  text: "Jasen Carroll"
  tagline: "ASQ Certified Software Quality Engineer. I do quality and validation for FDA-regulated device and pharma software, where the evidence a reviewer can actually follow is the deliverable - not the paperwork around it. I also build developer tooling, classical ML, and RAG systems."
  image:
    src: /logo.svg


features:
  - title: I built an AI assistant that can't phone home
    details: Five local data sources, zero network egress, and the bugs that only show up when you run it.
    link: /local-assistant.md
    linkText: Read More
  - title: I passed the CSQE. The certificate is a signed JSON file.
    details: What an ASQ certification attests to, and what a W3C Verifiable Credential does and doesn't prove.
    link: /asq-csqe.md
    linkText: Read More
  - title: Milky - a night sky forecast with nothing behind it
    details: A 0-10 "is tonight worth going outside" score, two public APIs, no backend, and $0 a month.
    link: /milky.md
    linkText: Read More
  - title: The aurora map is two rectangles
    details: Resampling NOAA's equirectangular aurora grid into Web Mercator, and the framing bug that stopped happening.
    link: /aurora-map-projection.md
    linkText: Read More
  - title: QMS Assistant
    details: A publicly queryable AI assistant over a SaMD QMS, RAG architecture. Demonstration only - built on a synthetic QMS not authored by me.
    link: https://qms.jasencarroll.com
    linkText: View Project
  - title: Goodware
    details: Anomaly detection toolkit for fleet telemetry, risk, and insurance domains. Trained and validated on 50,000+ labeled executable samples.
    link: https://goodware.jasencarroll.com
    linkText: View Project
  - title: pyr
    details: Python without the ceremony. A project manager that bootstraps its own runtime.
    link: https://pyrun.dev
    linkText: View Project
  - title: I built a Python project manager in one night. Making it releasable took longer.
    details: What happens when uv sells to OpenAI and one engineer decides to ship an alternative.
    link: /python-project-manager.md
    linkText: Read More
  - title: How pyr Works
    details: A look under the hood at a tool that manages Python without being Python.
    link: /how-pyr-works.md
    linkText: Read More
  - title: Mistral Vibe Sandbox
    details: Kernel-enforced sandboxing for a coding agent, after a shipped desktop app ignored its own permission toggle.
    link: /mistral-vibe-sandbox.md
    linkText: Read More
  - title: Cafe Fausse
    details: Full stack restaurant reservation system. React + Vite, Flask + SQLAlchemy + PostgreSQL, Railway with GitHub Actions CI/CD.
    link: https://cafe-fausse.jasencarroll.com
    linkText: View Project
  - title: Recipe Recommender
    details: Full stack ML recommendation engine trained on 41,932 Food.com recipes using K-means clustering.
    link: https://recipe-recommender.jasencarroll.com/
    linkText: View Project
---
