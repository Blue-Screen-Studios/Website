// The Blue SDK: our open-source game libraries. Condensed by hand from each repo's README.
// Text fields may use `backticks` for inline code.

export interface SdkLibrary {
  slug: string;
  name: string;
  tagline: string;
  language: string;
  summary: string[];
  repo: string;
  /** Short highlights for the overview page. */
  highlights: string[];
  /** "Who does what" table between the library and the game. */
  split: { left: string; right: string; rows: [string, string][] };
  features: { title: string; text: string }[];
  quickStart: { language: string; code: string };
  requirements: string[];
  build: string;
  docs: { title: string; path: string; text: string }[];
  notes?: string[];
}

const GITHUB = "https://github.com/Blue-Screen-Studios";

const libraries: SdkLibrary[] = [
  {
    slug: "blueui",
    name: "BlueUI",
    tagline: "An accessible, self-narrating game UI library in C.",
    language: "C11",
    summary: [
      "BlueUI is an immediate-mode UI library for games. Every widget you declare is automatically reachable by keyboard and controller, and every interaction is spoken aloud through a built-in text-to-speech voice. A blind or low-vision player can use a BlueUI menu without the game doing any extra work.",
      "BlueUI does not own a window, a renderer or an audio device. Each frame the game passes in its input, and BlueUI hands back UI state, geometry to draw and audio to play.",
    ],
    repo: `${GITHUB}/BlueUI`,
    highlights: ["Screen reader and speech synthesis built in", "Keyboard, controller and mouse navigation", "Renderer and platform independent"],
    split: {
      left: "BlueUI hands back",
      right: "What the game does with it",
      rows: [
        ["UI state, from `bui_get_state`", "Reads the focused item, every item's value and position, and the last line spoken."],
        ["Geometry, from `bui_get_geometry`", "Draws a list of coloured rectangles with any renderer."],
        ["Audio, from `bui_next_audio`", "Plays WAV buffers of synthesized speech, and GUI sounds, through its own mixer."],
      ],
    },
    features: [
      { title: "Screen reader built in", text: "Screens, pages, items, values and changes are announced automatically: \"Settings, Audio tab. Volume, 80%. Item 1 of 4, slider.\"" },
      { title: "Speech synthesis included", text: "CMU Flite is compiled into the library and runs on a background thread. No system speech service is required." },
      { title: "Keyboard, controller and mouse", text: "Focus order follows declaration order. Tab switching, value stepping, slider dragging and a back action all work without game code." },
      { title: "Change detection", text: "When a value changes, by input or by the game's own code, only the new value is spoken." },
      { title: "Platform and renderer independent", text: "No dependency on SDL or any windowing or audio API. Output is a flat list of rectangles with a built-in 5×7 bitmap font." },
      { title: "Sounds and rumble", text: "Moving, pressing, toggling and switching tabs can each play a generated sound and, on a controller, a rumble." },
      { title: "Themed widgets and modals", text: "Buttons, tab bars, toggles, choices, sliders, foldouts, rebinding capture and scroll views, all following one `bui_theme`." },
      { title: "Testable", text: "Test menus by what is said and focused, not by pixel positions. Text-only mode makes tests deterministic." },
    ],
    quickStart: {
      language: "C",
      code: `#include <blueui/widgets.h>

bui_theme theme = bui_default_theme();        /* BlueUI's blue look; change any field */
theme.pixel = 3.0f;

bui_config config = {0};
config.theme = &theme;                        /* your game's look, set once */
bui_context* ui = bui_create(&config);        /* 48 kHz voice */

/* Every frame: */
bui_input in;
bui_input_clear(&in);
/* ...fill \`in\` from your platform's events: mouse, keys, time... */

bui_begin_frame(ui, &in);

bui_hints hints = {"Up and down to move, Enter to choose", NULL};
bui_screen(ui, "menu", "Main menu", &hints);
if (bui_button(ui, "play", "PLAY", play_rect, NULL)) start_game();
if (bui_button(ui, "quit", "QUIT", quit_rect, NULL)) quit_game();

bui_end_frame(ui);

/* Draw. */
size_t count;
const bui_draw_cmd* rects = bui_get_geometry(ui, &count);
my_renderer_draw(rects, count);

/* Speak. */
bui_audio line;
while (bui_next_audio(ui, &line)) {
  my_audio_handle(line.op, line.samples, line.sample_count, line.sample_rate);
  bui_audio_free(&line);
}

/* On shutdown: */
bui_destroy(ui);`,
    },
    requirements: [
      "CMake 3.21 or newer",
      "A C11 compiler with `<threads.h>` (GCC or Clang with glibc 2.28+; MSVC 2022 17.8+)",
      "Network access on first configure, to download Flite 2.2",
      "SDL3, for the demo only",
    ],
    build: `cmake -B build
cmake --build build
ctest --test-dir build        # run the test suite
./build/blueui_demo           # a tour of every feature (SDL3)`,
    docs: [
      { title: "Getting started", path: "docs/getting-started.md", text: "A complete frame loop: input, declaring a screen, drawing, playing speech." },
      { title: "Concepts", path: "docs/concepts.md", text: "Immediate mode, ids, focus and navigation, what is spoken and when." },
      { title: "Widgets", path: "docs/widgets.md", text: "Themes, every built-in widget, and building custom widgets." },
      { title: "Speech and audio", path: "docs/speech-and-audio.md", text: "The voice, the audio queue, the WAV format, priorities." },
      { title: "Feedback", path: "docs/feedback.md", text: "UI events, the sound and rumble packs, playing rumble timings." },
      { title: "Modals", path: "docs/modals.md", text: "The game's own modals, the narration offer, controller notices." },
      { title: "Integration", path: "docs/integration.md", text: "CMake, shared and static builds, shipping, C++ use, testing a game's menus." },
      { title: "API reference", path: "docs/api-reference.md", text: "Every type and function." },
    ],
    notes: [
      "Developed and tested on Linux with GCC. macOS is not supported at this time, as Apple's libc does not provide `<threads.h>`.",
      "Games that ship the voice should include Flite's `COPYING` file. CMake exposes its path as `BLUEUI_FLITE_LICENSE`.",
    ],
  },
  {
    slug: "blueaudio",
    name: "BlueAudio",
    tagline: "Ray-traced game audio mixing in C.",
    language: "C11",
    summary: [
      "BlueAudio works out how a game's world sounds from where the player stands. It fires rays from the listener, bounces them off the world's voxels, and turns what they find into a final mix with one waveform for each output channel.",
      "BlueAudio does not play anything and holds no audio data. The game declares sources, each with a callback that fills its waveform, and hands over its world as voxel grids. BlueAudio returns the mixed channels for the game to play through its own audio device.",
    ],
    repo: `${GITHUB}/BlueAudio`,
    highlights: ["Muffle, direction and echo from ray tracing", "Voxel worlds with per-material acoustics", "Mono through 7.1 and headphones"],
    split: {
      left: "The game hands in",
      right: "BlueAudio hands back",
      rows: [
        ["Sources: a callback per source that fills mono samples, plus its position", "The final mix: `bau_render` fills interleaved channels (mono, stereo, headphones, quad, 5.1 or 7.1)"],
        ["The world: voxel grids with a material per cell, each grid posed and movable", "What was heard: each source's muffle, direction, gain and delay, plus the listener's echo"],
        ["The listener: position and facing", "Debug paths: a fan of rays to draw, with each bounce's position and energy"],
      ],
    },
    features: [
      { title: "Muffle", text: "Each material lets through its own share in three bands, and highs always go first. A muffled source loses its high frequencies as well as volume." },
      { title: "Direction", text: "Sound is heard from the direction its ray first went. Music round a corner is heard from the corner, not through the wall." },
      { title: "Echo", text: "Rays that bounce back reveal how enclosed a place is and how long it rings (RT60). Every source goes through a reverb tuned to match." },
      { title: "Distance and delay", text: "Each path's length becomes a smoothly eased delay, so a moving source gets Doppler for free. Air absorbs highs over distance." },
      { title: "Voxel worlds", text: "Grids are stored sparsely in 4×4×4 bricks that rays skip when empty. Grids can move every frame or be edited in place." },
      { title: "Materials", text: "Absorption, transmission and scattering in three bands, with presets from concrete and glass to foliage and water." },
      { title: "Stable and thread friendly", text: "Results blend across simulations so the sound settles instead of jittering. Simulate on a worker thread, render on the audio thread." },
      { title: "No dependencies", text: "A single C11 shared library exporting only `bau_*` symbols, with headers that work from C and C++." },
    ],
    quickStart: {
      language: "C",
      code: `#include <blueaudio/blueaudio.h>

bau_context* au = bau_create(NULL);  /* 48 kHz stereo, 1024 rays, 4 bounces */
bau_set_material(au, 1, bau_material_preset(BAU_MATERIAL_CONCRETE));

/* The world: nx * ny * nz cells, 0.2 m each, cells[x + nx * (y + ny * z)] a material (0: air). */
bau_grid* level = bau_grid_create(au, nx, ny, nz, 0.2f, cells);

/* A source: BlueAudio pulls its waveform when it renders. */
static int fill_engine(void* user, float* mono, int frames) {
  engine_synth(user, mono, frames);
  return frames;  /* fewer than asked: finished */
}
bau_source* engine = bau_source_create(au, fill_engine, &my_engine);

/* Every frame (the game's thread): */
bau_set_listener(au, camera_pos, camera_ahead, camera_up);
bau_source_set_position(engine, engine_pos);

/* About 30 times a second (any one thread, e.g. a worker): */
bau_simulate(au);

/* The audio device's callback: */
bau_render(au, out, frames);  /* frames * bau_channels(au) floats, interleaved */`,
    },
    requirements: [
      "CMake 3.21 or newer",
      "A C11 compiler (GCC, Clang or MSVC)",
      "For the demo only: SDL3, BlueUI, and network access on first configure to download dr_mp3",
    ],
    build: `cmake -B build
cmake --build build
ctest --test-dir build        # run the test suite
./build/blueaudio_demo        # walk about a level and hear it (SDL3)`,
    docs: [
      { title: "Getting started", path: "docs/getting-started.md", text: "A complete setup: world, sources, the simulate thread, the audio callback." },
      { title: "Concepts", path: "docs/concepts.md", text: "How the rays work out muffle, direction and echo; how the mix is rendered." },
      { title: "Integration", path: "docs/integration.md", text: "CMake, shared and static builds, shipping, C++ use." },
      { title: "API reference", path: "docs/api-reference.md", text: "Every type and function." },
    ],
    notes: [
      "The demo is a level seen from above where you walk between rooms (an open field, a concrete hall, corridors, a canyon, a glass box) and watch the rays that shape what you hear. Its panel and narrator are built with BlueUI.",
    ],
  },
  {
    slug: "bluevk",
    name: "BlueVK",
    tagline: "The Vulkan groundwork a game's renderer sits on, in C++20.",
    language: "C++20",
    summary: [
      "BlueVK makes the instance, picks the GPU, creates the device, its queue and memory allocator, builds the window's swapchain and keeps one frame in flight. It also has the small helpers every renderer ends up writing: pipelines from a short description, images with their views, render passes, framebuffers, descriptors and barriers.",
      "BlueVK draws nothing and holds no render targets. The game derives its own context from `bvk::Ctx` and adds its passes and images to it, so its renderer reads `ctx.dev`, `ctx.swapchain` and `ctx.sceneColor` from the same struct.",
    ],
    repo: `${GITHUB}/BlueVK`,
    highlights: ["Instance, device and swapchain setup", "GPU selection with a feature picker", "Helpers for pipelines, images and barriers"],
    split: {
      left: "BlueVK does",
      right: "The game does",
      rows: [
        ["Instance, validation layer (debug builds) and debug messenger", "Says which GPU features and extensions it needs, in a picker callback"],
        ["Picks the GPU: discrete first, then the most VRAM", "Creates its render passes, targets and pipelines"],
        ["Device, queue, VMA allocator, optional shared descriptor pool", "Records and submits its frames"],
        ["Swapchain, rebuilt when the window resizes", "Rebuilds its framebuffers when the swapchain is rebuilt"],
        ["Command buffer, acquire/present semaphores, frame fence", "Routes BlueVK's log messages into its own logger (optional)"],
      ],
    },
    features: [
      { title: "Device setup", text: "Instance, validation layer in debug builds, debug messenger, device, queue and a Vulkan Memory Allocator." },
      { title: "GPU selection", text: "Prefers a discrete GPU, then the most VRAM. A picker callback states the features the game needs and logs why a GPU was passed over." },
      { title: "Swapchain", text: "Built for the window and rebuilt on resize. `bvk::ensureSwapchain` tells the game when to rebuild its framebuffers." },
      { title: "Frame in flight", text: "Command buffer, acquire and present semaphores, and a frame fence, ready to record into." },
      { title: "Renderer helpers", text: "Pipelines from a short description, images with their views, render passes, framebuffers, descriptors and barriers." },
      { title: "Extend, don't wrap", text: "The game derives its own context from `bvk::Ctx`, so its renderer and BlueVK share one struct." },
    ],
    quickStart: {
      language: "C++",
      code: `#include <bluevk/bluevk.hpp>

struct GameCtx : bvk::Ctx {  // BlueVK's context plus the game's own
  VkRenderPass presentPass = VK_NULL_HANDLE;
  std::vector<VkFramebuffer> presentFbs;
};

bvk::ContextDesc desc;
desc.appName = "My Game";
desc.pick = [](const bvk::DeviceCandidate& gpu, bvk::DeviceChoice& use, std::string& why) {
  if (!gpu.supported.core.features.independentBlend) {
    why = "no independent blending";  // logged; this GPU is passed over
    return false;
  }
  use.enable.core.features.independentBlend = VK_TRUE;
  use.enable.v13.shaderDemoteToHelperInvocation = VK_TRUE;
  return true;
};

GameCtx ctx;
if (!bvk::createContext(ctx, window, desc)) return false;  // window: SDL_WINDOW_VULKAN
// ... make presentPass and presentFbs from ctx.colorViews ...

// Every frame:
switch (bvk::ensureSwapchain(ctx, window)) {
  case bvk::Swapchain::Rebuilt: rebuildFramebuffers(ctx); break;
  case bvk::Swapchain::Failed: return false;
  case bvk::Swapchain::Unchanged: break;
}
// wait ctx.fence, acquire into ctx.image (signals ctx.acquire), record ctx.cmd,
// submit (signals ctx.present[ctx.image]), present.

// At the end: the game's own objects first, then
bvk::destroyContext(ctx);`,
    },
    requirements: [
      "A C++20 compiler",
      "The Vulkan loader (without a Vulkan SDK, BlueVK fetches the headers itself)",
      "SDL3",
      "Vulkan Memory Allocator 3.4.0 is included in `third_party/`",
    ],
    build: `cmake -S . -B build
cmake --build build
ctest --test-dir build      # skipped (not failed) without a Vulkan 1.3 GPU
./build/bluevk_demo         # a window cleared to a slowly changing colour`,
    docs: [
      { title: "Getting started", path: "docs/getting-started.md", text: "A context, a frame, resizing, cleaning up." },
      { title: "Integration", path: "docs/integration.md", text: "Adding BlueVK to a game's CMake, deriving its context, picking features, logging." },
      { title: "API reference", path: "docs/api-reference.md", text: "Every type and function." },
    ],
    notes: ["Vulkan Memory Allocator is AMD's, under MIT; its notice is at the top of `third_party/vk_mem_alloc.h`."],
  },
];

/** Listed alphabetically everywhere on the site. */
export const sdkLibraries = [...libraries].sort((a, b) => a.name.localeCompare(b.name));
