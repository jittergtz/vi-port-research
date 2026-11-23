import type { TextHighlight } from "./highlighted-text";

export const topics = ["Xbox", "PC", "Graphics", "Repository"] as const;

export const leonida = "https://github.com/ItsNotRexed/Leonida";
const readme = `${leonida}/blob/main/README.md`;
const status = `${readme}#project-status`;
const bootThread = `${leonida}/issues/7154`;

export const snapshot = {
  date: "2026-11-23",
  dateLabel: "Nov 23, 2026",
  openIssues: 133,
  openPullRequests: 3409,
  head: "dde82f2",
  headUrl: `${leonida}/commit/dde82f27e994337094afc476ded0b1426f6e87e2`,
};

type Source = { label: string; href: string };

type Entry = {
  slug: string;
  topic: (typeof topics)[number] | "Overview";
  title: string;
  summary: string;
  summaryHighlights?: TextHighlight[];
  sections: { title: string; text: string; highlights?: TextHighlight[]; sources: Source[] }[];
};

export const overview: Entry = {
  slug: "xbox-to-pc",
  topic: "Overview",
  title: "Where Leonida’s PC port stands",
  summary: "Cyberleek reportedly shared GTA VI’s Xbox executable on November 23. Leonida has reached graphics initialization in PC tests. A reproducible in-game scene is the next milestone, and a playable build remains unverified.",
  summaryHighlights: [
    { phrase: "Xbox executable on November 23", color: "orange" },
    { phrase: "a playable build remains unverified", color: "pink" },
  ],
  sections: [
    {
      title: "What Cyberleek shared",
      highlights: [
        { phrase: "Xbox Series 1.0.2.1 archive of about 209 GB", color: "orange" },
        { phrase: "the main executable", color: "pink" },
      ],
      text: "The anonymous account Cyberleek posted apparent GTA VI gameplay clips in August and October. On November 19, when Rockstar launched the game on PS5 and Xbox Series X|S, Cyberleek shared what they described as an Xbox Series 1.0.2.1 archive of about 209 GB. It reportedly contained assets such as models, textures, and audio. Cyberleek withheld the main executable, offered to release it early if their memecoin hit a target, and pledged to share it on November 23. News outlets reported that it appeared that day. The archive’s provenance and completeness remain unverified.",
      sources: [
        { label: "Rockstar’s launch announcement", href: "https://www.rockstargames.com/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available" },
        { label: "PC Gamer’s earlier leak timeline", href: "https://www.pcgamer.com/games/grand-theft-auto/who-is-cyberleek-what-we-know-about-the-gta-6-leaker/" },
        { label: "PC Gamer’s November 19 report", href: "https://www.pcgamer.com/games/grand-theft-auto/cyberleek-drops-what-they-claim-is-a-near-complete-gta-6-xbox-build-online/" },
        { label: "Notebookcheck’s November 23 report", href: "https://www.notebookcheck.net/Cyberleek-releases-GTA-6-Xbox-build-exe-boosting-playable-PC-port-chances.1457977.0.html" },
      ],
    },
    {
      title: "Why the November 23 executable matters",
      highlights: [{ phrase: "where its startup fails", color: "orange" }],
      text: "The executable contains the compiled instructions that start the engine, request Xbox system services, and tell the graphics hardware what to draw. With the executable, developers can see which services the game actually calls and where its startup fails. The file still expects Xbox-specific interfaces, which the community has to recreate for it to run on Windows.",
      sources: [
        { label: "GamesRadar’s executable coverage", href: "https://www.gamesradar.com/games/grand-theft-auto/gta-6-pc-version-is-close-modders-say-after-cyberleek-releases-executable-the-game-almost-boots/" },
        { label: "Leonida boot log", href: bootThread },
      ],
    },
    {
      title: "What the community is trying",
      highlights: [
        { phrase: "translate the console’s graphics work to Vulkan", color: "orange" },
        { phrase: "first-frame rendering still in progress", color: "pink" },
      ],
      text: "Leonida aims to run the game’s CPU code on x86-64 PCs, recreate Xbox system services, and translate the console’s graphics work to Vulkan. Contributors have reported graphics device creation and frame loops on patched builds, with first-frame rendering still in progress. The README reports translation of 26,503 known shaders and says the project ships compatibility code and tools. Parallel efforts include Xbox2Windows, which is testing static recompilation on Windows, and AnyXboxX, an emulation prototype.",
      sources: [
        { label: "Leonida’s project status", href: status },
        { label: "Contributor boot roadmap", href: `${bootThread}#roadmap` },
        { label: "Xbox2Windows", href: "https://github.com/R0Y00/Xbox2Windows" },
        { label: "AnyXboxX", href: "https://github.com/LooperSalty/AnyXboxX" },
      ],
    },
    {
      title: "Why it’s hard",
      highlights: [{ phrase: "working input, saves, and world streaming", color: "orange" }],
      text: "Xbox-specific memory allocation, graphics queues, and audio behavior can stop startup or leave a blank window. Shader validation also leaves open whether the game can feed the shaders the right resources and display the result across GPUs and drivers. Playability requires working input, saves, and world streaming, which loads parts of the map as the player moves.",
      sources: [
        { label: "Windows startup report", href: `${leonida}/issues/7831` },
        { label: "Shader and GPU validation", href: status },
        { label: "Remaining gameplay milestones", href: `${bootThread}#roadmap` },
      ],
    },
    {
      title: "Forecast",
      highlights: [{ phrase: "a reproducible run from launch to a rendered scene", color: "pink" }],
      text: "Expect more startup fixes and hardware-specific demos before a broadly playable build. The next convincing milestone would be a reproducible run from launch to a rendered scene with the build, hardware, and driver documented. Repeatable gameplay with input, saves, and streaming would give us a firmer basis for a release estimate. The public tests are still too early to put a date on that.",
      sources: [{ label: "Boot progress behind this forecast", href: bootThread }],
    },
  ],
};

export const entries: Entry[] = [
  {
    slug: "windows-bring-up",
    topic: "PC",
    title: "How far the retail build gets on Windows",
    summary: "Open reports cover an early TLS crash and later graphics milestones on locally patched builds.",
    sections: [
      {
        title: "An early startup failure",
        text: "Issue #7968 reports that the retail executable reaches thread-local storage initialization before an access violation. A contributor associates the crash with the loader’s assignment of the executable’s TLS slot and points to a proposed loader change.",
        sources: [{ label: "Open issue #7968", href: `${leonida}/issues/7968` }],
      },
      {
        title: "Window and graphics device creation",
        text: "In #7831, a contributor reports successful window and D3D12 device creation on Windows using a local patch stack. The run then stopped during RAGE engine initialization. The report identifies Xbox memory allocation behavior as an earlier blocker on that configuration.",
        sources: [{ label: "Open issue #7831", href: `${leonida}/issues/7831` }],
      },
      {
        title: "Presentation on experimental branches",
        text: "The boot coordination thread reports a white window on AMD Windows and Proton. One AMD Windows test stayed alive for the full 150-second test window and created 27,856 graphics pipeline state objects. Contributors still report command submission and allocator behavior as blockers to rendering the game.",
        sources: [
          { label: "Boot coordination #7154", href: bootThread },
          { label: "AMD Windows contributor report", href: `${bootThread}#issuecomment-7109340153` },
        ],
      },
    ],
  },
  {
    slug: "repository-activity",
    topic: "Repository",
    title: "What landed on main and what’s still open",
    summary: "Recent merges improved GPU test comparisons and command submission validation. Boot and driver issues remain open.",
    sections: [
      {
        title: "Recent merges",
        text: "At the captured main revision, the newest commit updated navmesh tool documentation. Other recent merges made cross-GPU pixel shader comparisons reject incomplete readbacks and made the D3D12 command queue reject invalid command lists before submitting them to Vulkan.",
        sources: [
          { label: "Captured main commit dde82f2", href: snapshot.headUrl },
          { label: "Cross-GPU comparison PR #6586", href: `${leonida}/pull/6586` },
          { label: "D3D12 submission PR #6610", href: `${leonida}/pull/6610` },
        ],
      },
      {
        title: "Open issues and review",
        text: "The captured issue and pull request listings showed 133 open issues and 3,409 open PRs. Open technical reports included a retail startup crash, an RX 6600 sparse-queue test crash, and an Intel Arc 140V texture sampling mismatch. The PR list included proposed changes for MSVC build compatibility and D3D12 test coverage.",
        sources: [
          { label: "Open issues", href: `${leonida}/issues` },
          { label: "Open pull requests", href: `${leonida}/pulls` },
          { label: "Main commit history", href: `${leonida}/commits/main/` },
        ],
      },
      {
        title: "How contributors coordinate",
        text: "The coordination thread tracks task claims so contributors can see who is already working on an area. The separate D3D12 issue tracks graphics work by dependency, including console method coverage and comparison tests.",
        sources: [
          { label: "Task coordination #8047", href: `${leonida}/issues/8047` },
          { label: "D3D12 critical path #313", href: `${leonida}/issues/313` },
        ],
      },
    ],
  },
  {
    slug: "performance-budget",
    topic: "Graphics",
    title: "Shader validation and open GPU issues",
    summary: "Full-corpus SPIR-V checks have passed in documented runs. GPU output tests still surface driver-specific failures.",
    sections: [
      {
        title: "Translation, validation, and output",
        text: "The README reports successful translation of 26,503 console shaders and complete SPIR-V validation in specific reruns. It also identifies remaining wave64 accuracy limitations in some graphics shader stages on 32-wide subgroups. GPU reports in #166 primarily exercise hand-written fixtures, so their results describe those tests rather than gameplay performance.",
        sources: [
          { label: "README shader status", href: status },
          { label: "GPU test results #166", href: `${leonida}/issues/166` },
        ],
      },
      {
        title: "One recent GPU test run",
        text: "Merged PR #6720 adds results for a Radeon RX 9070 GRE on RADV. Its reported GPU fixture run recorded 218 passes, 16 skips, and one intermittent mesh-shader failure.",
        sources: [{ label: "Radeon RX 9070 GRE results PR #6720", href: `${leonida}/pull/6720` }],
      },
      {
        title: "Driver reports to follow",
        text: "Issue #7972 reports a sparse queue test crash on an AMD RX 6600 with the Windows driver. Issue #7030 reports a texture sampling mismatch on an Intel Arc 140V under Windows. Each report documents the GPU, driver, and test involved.",
        sources: [
          { label: "RX 6600 sparse queue crash #7972", href: `${leonida}/issues/7972` },
          { label: "Intel Arc texture sampling #7030", href: `${leonida}/issues/7030` },
        ],
      },
    ],
  },
  {
    slug: "xbox-baseline",
    topic: "Xbox",
    title: "What the Xbox Series build provides",
    summary: "The README maps the original game data and shaders to the Windows runtime work Leonida still needs.",
    sections: [
      {
        title: "The input build",
        text: "The project documents Xbox Series version 1.0.2.1 as its input. Its tools work with locally readable files from a user’s own copy. The repository describes tooling for models, textures, and audio, with limitations still documented for some texture formats and archives.",
        sources: [{ label: "Leonida README", href: readme }],
      },
      {
        title: "Where the platforms differ",
        text: "The Xbox Series and Windows PCs share x86-64, but the runtime still needs to supply the services and calling conventions the console executable expects. The boot-chain notes track differences in memory allocation, graphics device setup, command queues, and resource placement. The D3D12 roadmap tracks how the project maps those interfaces onto Vulkan.",
        sources: [
          { label: "Retail boot-chain notes", href: `${leonida}/blob/main/docs/retail_boot_chain.md` },
          { label: "D3D12 → Vulkan roadmap #313", href: `${leonida}/issues/313` },
        ],
      },
    ],
  },
];
