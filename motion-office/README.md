# ELUS office: from concept to reality
12-second silent 1600×900 / 30fps HyperFrames background.
0–2s: architectural line drawing. 2–8s: left-to-right reveal of a photorealistic version of the same office. 8–10s: hold. 10–12s: soft return to the drawing for continuous looping.
Both states were produced with ImageGen. The line image was edited directly from the real office asset to preserve viewpoint and architecture. The illustrated office is conceptual, not a claim about ELUS premises.
Source: index.html → compositions/office.html. GSAP 3.14.2 vendored locally.
Check: `hyperframes check --snapshots --json`
Render: `hyperframes render --quality delivery --fps 30 --output ../public/brand/office-transition.mp4`
The readable left-to-right navy gradient is applied by the website CSS, separately from this reusable video.
