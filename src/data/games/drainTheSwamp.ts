import type { GameDetails } from "../gameTypes";

const media = "/games/drain-the-swamp";
const screenshot = (name: string) => ({ thumb: `${media}/screenshots/${name}-thumb.webp`, full: `${media}/screenshots/${name}.webp` });

// Unreleased: no Steam page yet, so these details are written by hand.
const drainTheSwamp: GameDetails = {
  name: "Drain the Swamp!",
  shortDescription: "The site's been bought and the permits are signed, but there's one small problem. You're in a swamp!",
  about: [
    {
      type: "paragraph",
      text: "You're the newest crocodile on the job, and it's time to get to work. Start with nothing but a bucket and a bin to drain the water. Work your way up to a garage full of trucks, a crew on the payroll, and sixteen lakes drained to the dirt so the building can go in!",
    },
    { type: "heading", text: "Play with friends!" },
    {
      type: "paragraph",
      text: "Bring your crew into the bog! Team up to handle massive pumps, split the workload, and turn total swamp chaos into clean building sites. Everything is more fun when you're draining lakes together.",
    },
    { type: "heading", text: "Simulated water, yes really!" },
    {
      type: "paragraph",
      text: "Every lake is real, simulated water, not flat geometry that slides down. It sloshes when you wade in, pours when you tip a bucket, streams out of a hose and swirls around the drains. Scoop it, suck it up, pump it out.",
    },
  ],
  releaseDate: "TBA",
  comingSoon: true,
  price: null,
  isFree: false,
  platforms: ["Windows", "Linux"],
  genres: ["Simulation", "Management"],
  features: ["Co-op"],
  languages: "",
  headerImage: `${media}/header.webp`,
  background: `${media}/background.webp`,
  screenshots: ["drain-the-swamp", "hoses", "drive-trucks", "in-water", "manage-staff"].map(screenshot),
  trailer: null,
  achievements: { total: 0, highlighted: [] },
  requirements: {
    Windows: {
      minimum: [
        { label: null, value: "Requires a 64-bit processor and operating system" },
        { label: "OS", value: "Windows 11" },
        { label: "Processor", value: "Intel Core i5-8400 / AMD Ryzen 5 2600 (6 cores)" },
        { label: "Memory", value: "8 GB RAM" },
        { label: "Graphics", value: "NVIDIA GTX 1060 6 GB / AMD RX 580 8 GB (Vulkan required)" },
        { label: "Storage", value: "1 GB available space" },
        { label: "Sound Card", value: "Windows-compatible DirectSound / WASAPI audio device" },
        { label: "VR Support", value: "Not Supported" },
        { label: "Additional Notes", value: "Internet not required for singleplayer. Internet required for multiplayer." },
      ],
      recommended: [
        { label: null, value: "Requires a 64-bit processor and operating system" },
        { label: "OS", value: "Windows 11" },
        { label: "Processor", value: "Intel Core i5-12400 / AMD Ryzen 5 5600" },
        { label: "Memory", value: "16 GB RAM" },
        { label: "Graphics", value: "NVIDIA RTX 3060 / AMD RX 6600 XT (8 GB)" },
        { label: "Network", value: "Broadband Internet connection" },
        { label: "Storage", value: "8 GB available space" },
        {
          label: "Sound Card",
          value:
            "16-bit / 48 kHz (or higher) Stereo Sound Card or class-compliant USB DAC / Audio Interface with native WASAPI / ASIO support.",
        },
        { label: "VR Support", value: "Not Supported" },
      ],
    },
  },
};

export default drainTheSwamp;
