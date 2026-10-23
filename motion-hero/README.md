# ELUS 360 — Hero motion
8-second silent 960×540 loop at 30 fps, generated using HyperFrames 0.8.186.
## Edit
`HYPERFRAMES_SKIP_SKILLS=1 hyperframes preview --background`
## Validate and render
`hyperframes check --snapshots --json`
`hyperframes render --quality delivery --fps 30 --output ../public/brand/hero-elus.mp4`
The orbit field adapts the installed `locked-nucleus-orbit` primitive. Root composition mounts `compositions/elus-orbit.html`. All motion returns to its initial state for a smooth loop.
## Assets
Official horizontal and vertical logos supplied by owner. Mascot edited from supplied reference with ImageGen to replace lime/yellow with ELUS blue/cyan/violet/magenta, preserving body, pose, eyes and clipboard. Native alpha preserved. GSAP 3.14.2 is vendored in assets/gsap.min.js to avoid render-time CDN dependency.
