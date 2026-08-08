---
title: "I built an AI assistant that can't phone home"
date: 2026-08-08
---

# I built an AI assistant that can't phone home

The security bug wasn't in my code. It was in a config file I almost didn't read.

I was wiring up a local image embedding model - `nomic-embed-vision-v1.5` - and the standard way to load it is one line of Python:

```python
AutoModel.from_pretrained("nomic-ai/nomic-embed-vision-v1.5", trust_remote_code=True)
```

That flag means: download Python from the model repo and execute it in this process. Fine, I thought. It's a well-known model, 150,000 downloads, I'll read the code first.

There is no code in that repo. It ships weights, a config, and some ONNX exports. No `.py` files at all. What it has is this, in `config.json`:

```json
"auto_map": {
  "AutoModel": "nomic-ai/nomic-bert-2048--modeling_hf_nomic_bert.NomicVisionModel"
}
```

The flag executes code from a **different repo**. One I never named, never looked at, and wouldn't have thought to audit. If I'd reviewed `nomic-embed-vision-v1.5` line by line I'd have found nothing and felt good about it.

For most projects that's an acceptable risk. This one is a process with Full Disk Access to my Messages database, my photo library, my contacts, and my notes.

## The problem

I wanted one thing: ask Claude a question and have it answer from everything my Mac already knows about me. Messages, call history, contacts, photos, Bear notes. Not summaries I'd written - the actual record.

Every product that does this ships your data somewhere. That's the deal, and for this particular pile of data I'm not taking it. So the constraint was absolute from the start: nothing from those five sources leaves the machine. Not the text, not the images, not the embeddings.

That constraint does most of the architectural work for you. An MCP server that speaks stdio only - no port, no auth surface, nothing to misconfigure. Embedding models running locally on `127.0.0.1`. Readers that open Apple's live SQLite databases read-only and never copy them. An index that lives outside the repo.

It also kills the easy version. You can't call an embedding API. You're running the models.

## The fix nobody mentions

The usual advice for `trust_remote_code` is "pin the revision" or "vendor the code." I went to vendor it - pulled both files, 2,611 lines, read them. Clean. No network calls, no `subprocess`, no `eval`. I'd have shipped it.

Then I noticed the repo also had `onnx/model.onnx`.

An ONNX graph is data, not code. Same weights, no `auto_map`, nothing to execute, nothing to re-review every time upstream bumps a version. It also meant deleting torch, torchvision, and transformers - about 3 GB of dependencies - and replacing them with `onnxruntime`, `pillow`, and `numpy`.

The catch is that you now own preprocessing. The model's config specifies a stock CLIP pipeline: resize to 224, center crop, rescale, normalize with specific constants. Twenty lines. And exactly the kind of code that looks correct and silently shifts every vector in your index.

So `transformers` stayed - as a test-only dependency that never ships. The test builds deliberately awkward fixtures (wide, tall, tiny, already-square), runs both implementations, and compares pixel arrays:

```
ok  wide.png    max|delta|=0.000e+00
ok  tall.png    max|delta|=0.000e+00
ok  tiny.png    max|delta|=0.000e+00
ok  square.png  max|delta|=0.000e+00
```

Byte-identical. Including the part I'd have gotten wrong: the config specifies `{height: 224, width: 224}` rather than a shortest-edge resize, so it squashes the aspect ratio instead of preserving it. That looks like a bug. It isn't, and the test is what stops someone fixing it later.

## Three things I only learned by running it

**CoreML is four times slower than the CPU.** Apple Silicon, Neural Engine available, obvious win. It isn't: 209 ms per image against 53 ms. The runtime can only claim 699 of the graph's 1,188 nodes, so it splits into 104 partitions and every boundary is a round trip. Cold start also spends minutes compiling. I'd never have guessed that from reading anything.

**The default micro-batch silently ate a third of my notes.** `llama-server` rejects any input longer than `n_ubatch`, which defaults to 512 tokens. The model trains to 2048. Seventeen of my forty-six Bear notes were longer than 512, so they failed to embed - and because I'd wrapped each record in its own error handler, the run kept going and told me, rather than dying at note 28 with everything before it committed and nothing after.

**Text and image vectors share a space but not a scale.** Both models emit 768 dimensions into one latent space, so the obvious move is one vector table and one nearest-neighbor search. Cross-modal ranking does work - I checked it with images I generated so I knew the answer, and the matching query wins every time. But look at the magnitudes:

| pair | matching | unrelated |
|---|---|---|
| text - text | 0.83 | 0.36 |
| image - image | 0.95 | 0.63 |
| text - image | 0.10 | 0.03 |

The entire cross-modal range sits below the score two *unrelated* text records get. One combined search ranks every photo beneath every message, always. And it presents as "semantic search is bad at photos," which is the wrong place to look. The fix is partitioning the vector table by modality, running one search per partition, and fusing by rank - so raw distances are never compared across the two.

None of these three are in any documentation. All three took ten minutes to find once something was actually running against real data.

## The part that surprised me

Most of the bugs that mattered were not findable by reading code.

A filter that skipped every contact forever, because contacts carry a timestamp of zero and the checkpoint also starts at zero. Messages with no text that turned out to be group-chat system events rather than attachments - so the tidy fix, labelling them `[attachment]`, would have written a false statement into the index on all sixty-two. A record indexed without an embedding that could never earn one later, because the timestamp checkpoint had moved past it and the file only arrived afterward.

That last one is the iCloud lifecycle. Photos offloads your originals, you index what's there, the file comes back, and nothing tells the indexer to reconsider. Your library is permanently unsearchable by image content and there's no error anywhere.

Every one of those was invisible in review and obvious within seconds of running the thing against a real machine. I've spent a decade in validation and this is the entire argument for it, compressed: the specification and the code can both be right and the system can still be wrong, and you find that out by executing it against the real world.

## What it does now

Ask it a question in Claude and it searches across all five sources - keyword and semantic - and answers from what's actually there. Nothing leaves the Mac. The morning digest is a `launchd` job driving a terminal session, and it deliberately excludes anything I already asked about, so it never tells me something I know.

The whole thing is about 2,500 lines of TypeScript, one Python file, and a SQLite database.

I used Claude Code to build it, and I'll say what I said about pyr: the leverage is real and the judgment is still yours. Every decision worth anything in this project - dropping `trust_remote_code` for ONNX, keeping transformers as a test oracle, partitioning by modality rather than normalizing scores, refusing to synthesize a caption for a message that had no content - came from arguing about tradeoffs, not from generating code. The measuring is what took the time. The typing was never the bottleneck.

