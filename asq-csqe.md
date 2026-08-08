---
title: "I passed the CSQE. The certificate is a signed JSON file."
date: 2026-08-08
---

# I passed the CSQE. The certificate is a signed JSON file.

As of August 3 I'm an ASQ Certified Software Quality Engineer, again. Certification number 7044. Expires 2030-12-31. Lapsed from 2024-12-31 until now.

That's the announcement. The interesting part is the artifact.

## What it certifies

ASQ's description of the CSQE, verbatim from the credential:

> The Certified Software Quality Engineer understands software quality development and implementation, software inspection, testing, verification and validation, and implements software development and maintenance processes and methods.

It's an exam. Multiple choice, against a published Body of Knowledge. Passing it doesn't make anyone good at this work; it establishes that the vocabulary I've been using for a decade in FDA-regulated device and pharma matches the vocabulary everyone else uses. In regulated software that's worth more than it sounds. Most arguments I've watched go sideways in a review were two people using "validation" to mean different things.

## The artifact

What I downloaded isn't a PDF of a certificate with a gold seal on it. It's 39 lines of JSON:

```json
{
  "@context": ["https://www.w3.org/ns/credentials/v2"],
  "type": ["VerifiableCredential"],
  "name": "ASQ Certified Software Quality Engineer",
  "issuer": {
    "id": "did:web:api.accredible.com:v1:verifiable_credential:organizations:53207",
    "name": "ASQ Certification"
  },
  "validFrom": "2026-08-03T00:00:00Z",
  "credentialSubject": { "name": "Jasen Carroll", "...": "..." },
  "proof": {
    "type": "DataIntegrityProof",
    "cryptosuite": "eddsa-rdfc-2022",
    "verificationMethod": "did:web:api.accredible.com:...#270bcb04-...",
    "proofPurpose": "assertionMethod",
    "proofValue": "z5aQbyVVnNpqruZ56tNaHedyVgxo5nDto..."
  }
}
```

W3C Verifiable Credentials 2.0. The `proof` block is an Ed25519 signature over the canonicalized document — RDF canonicalization first, so the signature survives reformatting the JSON but not changing a single claim in it. The issuer's public key resolves from `did:web`, which is an HTTPS fetch to a well-known path on `api.accredible.com`.

So you can check this yourself. Fetch the key once, verify the signature, and you know ASQ signed exactly these dates and exactly this certification number. No verification portal, no "contact the registrar," no trusting that the PDF I emailed you wasn't edited in Preview.

The subject identifier is the detail I liked. My email isn't in the file — what's in the file is `sha256$` of my email plus a random salt, with the salt included. Anyone who already knows my address can confirm the credential is mine in one line of code. Anyone who doesn't, can't harvest it. I downloaded the file twice and got two different hashes, because the salt is fresh each time. The claim is stable; the identifier isn't reusable as a tracking key.

The expiry is the other thing worth noticing. This one dies on 2030-12-31 unless I stay active on credits or pass the exam again before then, otherwise another lapse. A quality credential that never expires isn't measuring anything — the field moves, and an attestation with no end date is asserting something about 2026 while pretending to be about today.

## The part that doesn't follow

A signature proves the document is intact and came from ASQ. That's verification, and it's the entire claim. It says nothing about whether I'll be useful on your project.

Which is the same distinction the exam is about, and the same one I keep running into in my own work: you can verify a thing perfectly against its specification and still have built the wrong thing. The signature is airtight. The judgment is still mine, and you'll have to evaluate that the hard way.

Credential: [credential.net/30737cd0-e074-46d2-a7af-a1a31ac8dcfb](https://www.credential.net/30737cd0-e074-46d2-a7af-a1a31ac8dcfb)
