---
layout: doc
sidebar: false
aside: false
---

# Resume

## Summary

Full stack developer with a decade of engineering experience in regulated software environments. Background spans UAT ownership, SDLC participation, Agile delivery, and AI/ML model validation at Philips under FDA consent decree. Now building full-time — current project is pyr (pyrun.dev), an open-source Python runtime manager built in TypeScript on Deno with cross-platform CI/CD. Stack includes React, JavaScript/TypeScript, Python, PostgreSQL, and Node.js. BS Mechanical Engineering (Drexel), EMBA (Quantic), MSSE candidate 2026.

## Skills

Polyglot developer — academically trained in Java and C++, originally bootcamped in Python and JS with formal study in JavaScript including Eloquent JavaScript, solidified with graduate level studies, self-taught TypeScript, Bun, Deno, and some Go.

- **Frontend:** React, CSS, JavaScript, ES6+
- **Backend:** Node.js, Python
- **Database:** PostgreSQL
- **APIs:** RESTful API design and integration
- **Tooling:** Git, CI/CD, Deno
- **AI:** Early adopter — built tooling around frontier models, including a proxy to route between Mistral, Claude, and others. (Including home grown solutions, i.e. [chat-responses-proxy](https://github.com/jasenc7/chat-responses-proxy).)

## Education

**Master of Science, Software Engineering** — Quantic School of Business and Technology *(anticipated Aug 2026)*

**Executive Master of Business Administration** — Quantic School of Business and Technology *(2023)*

**Bachelor of Science, Mechanical Engineering** — Drexel University *(2012)*
Honors Society | OOP in C++, mechatronics, robotics, custom MATLAB rarified gas simulators

## Certifications

- Certified Software Quality Engineer (CSQE) — ASQ *(2020–2023)*
- Six Sigma Green Belt — DVIRC
- Data Science Foundations — Quantic *(2025)*
- Intermediate JavaScript — Udacity *(2024)*
- Full Stack Developer Nanodegree — Udacity *(2015, 2024)*

## Experience

**Founder** — Jasen Carroll, LLC | Philadelphia, PA | *Mar 2026 – Present*

Building and maintaining open-source developer tools.

- Designed and shipped pyr (pyrun.dev) — a Python project manager that bootstraps its own CPython runtime, manages virtualenvs, and gets out of the way. Six commands. One binary. No Python required to install.
- Built in TypeScript, compiled with Deno, cross-platform CI/CD across Linux, macOS, and Windows.
- Key design decision: rather than rolling a custom package resolver, designed `pyr sync` to reconcile declared dependencies against the installed virtualenv state using pip as the resolver — constraint-driven architecture.

## Projects

**QMS Assistant** — [rag.jasencarroll.com](https://rag.jasencarroll.com)
A publicly queryable AI assistant over a Software as a Medical Device (SaMD) Quality Management System corpus. Built on a RAG architecture — Flask API, Mistral embeddings, Chroma vector DB, top-k retrieval with citation injection. Domain expertise (12+ years FDA-regulated QMS) converted directly into a working AI product. Bootstrapped with pyr. Deployed to Railway.

**Cafe Fausse** — [cafe-fausse.jasencarroll.com](https://cafe-fausse.jasencarroll.com)
Full stack restaurant reservation system. React + Vite frontend, Flask + SQLAlchemy backend, PostgreSQL, deployed to Railway with GitHub Actions CI/CD. CORS-controlled API, table availability logic, newsletter signup, production-grade entrypoint with gunicorn.

**Goodware** — [goodware.jasencarroll.com](https://goodware.jasencarroll.com)
Anomaly detection toolkit trained on 50,000+ labeled executable samples — applicable to fleet telemetry, risk, and insurance domains. Python, scikit-learn, PyTorch MLP, XGBoost, LightGBM. Flask web app with CSV upload, `/predict` API endpoint, AUC/accuracy reporting, and confusion matrix. Full CI/CD with gated deployment on Railway.

**Recipe Recommender** — [recipe-recommender.jasencarroll.com](https://recipe-recommender.jasencarroll.com)
Full stack ML recommendation engine trained on 41,932 Food.com recipes using K-means clustering. React + Vite + Tailwind + shadcn/ui frontend, FastAPI + Uvicorn backend, scikit-learn pipeline with serialized joblib model artifacts for instant inference. Multi-stage Docker build, GitHub Actions CI/CD with lint/test/build gates, deployed to Railway.

---

**Senior Quality Engineer / Quality Engineer — NPI** — PCI Pharma Services | Philadelphia, PA | *Sep 2023 – Mar 2026*

- Designed source code review and software backup processes to strengthen GAMP5 compliance and data integrity controls
- Designed User Access Management evaluation tools consolidating 21 CFR 211, 21 CFR 820, Part 11, and Data Integrity guidance into a single baseline assessment framework
- Led LEAN/Six Sigma cleaning optimization project — $0.5M in labor savings, 3,600 hours of production time recovered

---

**Senior Software QA Engineer** — Dexcom (via Beacon Hill) | Remote | *Aug 2022 – Oct 2022*

- Released redlined procedures addressing documentation gaps for FDA and ISO compliance
- Provided governance to Change Control Boards over quality-impacting systems

---

**Quality Engineer** — Acumed LLC | Hillsboro, OR | *Dec 2021 – Jul 2022*

- Developed 21 CFR Part 11 compliance checklist for software validation using phased implementation approach
- Harmonized software validation SOPs across multiple QMS platforms through LEAN methodology
- Defended BSI tech file audit for EU MDR submission solo — zero additional non-conformities

---

**Software Validation Engineer / Quality Engineer** — Philips | Remote | *Jul 2019 – Sep 2021*

- Owned UAT and acceptance protocols for regulated software systems under FDA consent decree
- Validated two AI/ML models — an aggregator and a recommendation engine — human-in-the-loop, before FDA had a formal framework for it
- Managed Non-Product System Software validation lifecycle end to end
- Worked within Agile delivery cycles on global QMS software teams supporting NPSS solutions
- Reduced active CAPA load 50% — from 150 to 75 open worldwide — through data analysis and KPI reporting to SteerCo

---

**Validation Engineer / Quality Engineer** — Acumed LLC | Hillsboro, OR | *Feb 2015 – Jun 2019, Dec 2021 – Jul 2022*

- Co-owned risk-based Master Validation Plan covering all software validation packages including IQ/OQ/PQ
- Owned UAT and acceptance protocols for QMS software systems supporting Class II/III orthopedic medical device manufacturing
- Managed CAPA Review Board ensuring timeliness and effectiveness of site-wide corrective actions

---

**Validation Engineer / Pilot Plant Lead** — Johnson & Johnson Consumer | Los Angeles, CA | *Sep 2012 – Nov 2014*
