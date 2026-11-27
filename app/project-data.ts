export const researchDate = "2026-11-24";
export const researchDateLabel = "Nov 24, 2026";

export const victory = "https://github.com/Marvisak/VIctory";
export const xcl = "https://github.com/ivall/xcl";
export const anyXboxX = "https://github.com/LooperSalty/AnyXboxX";
export const xbox2Windows = "https://github.com/R0Y00/Xbox2Windows";
export const fiveStar = "https://github.com/ThatRecompDev/five-star-recomp";
export const scarlettX = "https://github.com/Freminet/ScarlettX";
export const victoryStatus = `${victory}#status-2026-11-23`;
export const xclWorldReport = "https://portwatch-vi.xyz/news/2026-11-24-xcl-30fps-in-game.html";
export const cgbj = {
  id: "cgbj",
  name: "CGBJ",
  milestone: "Player movement reported in a private build",
  summary: "PortWatch reports player movement and NPC interaction with a black screen. Separate footage shows unlit scenes. The build is private.",
  source: "https://portwatch-vi.xyz/news/2026-11-24-cgbj-in-game.html",
};

export const xclStatus = `${xcl}#games`;
export const anyXboxXResults = `${anyXboxX}/blob/main/docs/research/victory-xcl-fivestar.md`;
export const leonidaRemoval = `${anyXboxX}/commit/dfa0f2c3ce5c95dfddf02bf203ddf61542952972`;

export const projects = [
  {
    id: "victory",
    name: "VIctory",
    repo: "Marvisak/VIctory",
    milestone: "Opening mission reached",
    summary: "The furthest public GTA VI milestone we found. The title card renders, and the scene after it remains dark and too slow for play.",
    source: victoryStatus,
  },
  {
    id: "anyxboxx",
    name: "AnyXboxX",
    repo: "LooperSalty/AnyXboxX",
    milestone: "Opening cutscene reached via a VIctory fork",
    summary: "Its team reports opening credits and a mostly black final image at 0.3–0.5 FPS in the world using a patched VIctory build.",
    source: anyXboxXResults,
  },
  {
    id: "xcl",
    name: "XCL",
    repo: "ivall/xcl",
    milestone: "World load reported behind a spinner",
    summary: "The README reports 30 FPS in menus for an unnamed retail title. PortWatch attributes it to GTA VI and reports that testers reached the world behind a loading spinner.",
    source: xclWorldReport,
  },
  {
    id: "five-star-recomp",
    name: "Five Star Recomp",
    repo: "ThatRecompDev/five-star-recomp",
    milestone: "Story mode load started",
    summary: "The project reports first-run screens, intro video, and menus. Story loading stops on corrupted game memory.",
    source: fiveStar,
  },
  {
    id: "xbox2windows",
    name: "Xbox2Windows",
    repo: "R0Y00/Xbox2Windows",
    milestone: "CPU and GPU tests",
    summary: "Source-built programs run and selected shader tests produce checked output. The team has yet to verify GTA VI startup.",
    source: xbox2Windows,
  },
  {
    id: "scarlettx",
    name: "ScarlettX",
    repo: "Freminet/ScarlettX",
    milestone: "Other Xbox titles playable",
    summary: "The team reports playing Concept Destruction and Unicorn Overlord on a hardware GPU. A GTA VI result remains unverified.",
    source: scarlettX,
  },
] as const;
