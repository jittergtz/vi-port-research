import type { TextHighlight } from "./highlighted-text";
import {
  anyXboxX,
  anyXboxXResults,
  cgbj,
  fiveStar,
  leonidaRemoval,
  scarlettX,
  victory,
  victoryStatus,
  xbox2Windows,
  xclStatus,
  xclWorldReport,
} from "./project-data";

export const topics = ["Xbox", "PC", "Graphics", "Repository"] as const;

const projectIndex = "https://github.com/Ahmet-Dedeler/awesome-gta6-reverse-engineering#console-translation-layers--static-recompilation";
const executableReport = "https://www.notebookcheck.net/Cyberleek-releases-GTA-6-Xbox-build-exe-boosting-playable-PC-port-chances.1457977.0.html";

type Source = { label: string; href: string };

type Entry = {
  slug: string;
  topic: (typeof topics)[number] | "Overview";
  title: string;
  summary: string;
  summaryHighlights?: TextHighlight[];
  sections: { title: string; text: string; sources: Source[] }[];
};

export const overview: Entry = {
  slug: "xbox-to-pc",
  topic: "Overview",
  title: "How close are community projects to running GTA VI on PC?",
  summary: "Leonida’s public repository went offline. VIctory leads the open-source projects we reviewed, reaching the opening mission. PortWatch reports player movement in a private CGBJ build. A playable GTA VI PC build remains unverified.",
  summaryHighlights: [{ phrase: "reaching the opening mission", color: "orange" }],
  sections: [
    {
      title: "Leonida goes offline",
      text: "By November 24, Leonida’s original public GitHub repository returned a 404. AnyXboxX removed its upstream Leonida submodule that day. The reason for the shutdown remains unconfirmed.",
      sources: [{ label: "AnyXboxX records the upstream removal", href: leonidaRemoval }],
    },
    {
      title: "VIctory reaches the opening mission",
      text: "VIctory’s November 23 report describes first-run screens, menus at 30 FPS, intro video with sound, and loading into the world on Windows 11 with an RX 6700 XT. The first mission’s title card appeared, followed by a dark scene at 0.5 to 1.8 seconds per frame. On November 24, AnyXboxX reported reaching the opening credits using its patched VIctory fork on an RTX 4070 SUPER. The final image remained largely black at 0.3 to 0.5 FPS in the world.",
      sources: [
        { label: "VIctory project status", href: victoryStatus },
        { label: "AnyXboxX’s VIctory fork test", href: anyXboxXResults },
      ],
    },
    {
      title: "CGBJ reports player movement in a private build",
      text: "PortWatch reports that CGBJ’s private build, based on VIctory and parts of XCL, accepted controller input for walking and talking to NPCs while the screen was black. PortWatch also cites separate footage of unlit opening scenes. The group’s changes are private, so other teams cannot reproduce the result from published code.",
      sources: [{ label: "PortWatch’s November 24 CGBJ report", href: cgbj.source }],
    },
    {
      title: "Progress across other projects",
      text: "Five Star Recomp reports starting to load story mode before hitting corrupted game memory. XCL’s README reports reaching settings at 30 FPS for an unnamed retail game. PortWatch identifies the title as GTA VI and reports that several testers reached the world while the screen stayed on a loading spinner. Xbox2Windows reports source-built CPU and GPU tests, with GTA VI startup still unverified. ScarlettX reports playable results for other Xbox Series titles, providing evidence for its compatibility layer.",
      sources: [
        { label: "Five Star Recomp project status", href: fiveStar },
        { label: "XCL compatibility report", href: xclStatus },
        { label: "PortWatch’s XCL world-load report", href: xclWorldReport },
        { label: "Xbox2Windows project status", href: xbox2Windows },
        { label: "ScarlettX project status", href: scarlettX },
      ],
    },
    {
      title: "What would count as playable",
      text: "The next milestone is a repeatable run into a visibly rendered scene with working player controls. Sustained frame times, loading between areas, and reliable saves would build confidence in longer play sessions. The reports available on November 24 leave those results unverified.",
      sources: [
        { label: "VIctory’s remaining rendering work", href: victoryStatus },
        { label: "AnyXboxX’s measured rendering limits", href: anyXboxXResults },
      ],
    },
  ],
};

export const entries: Entry[] = [
  {
    slug: "windows-bring-up",
    topic: "PC",
    title: "From the first menu to the opening mission",
    summary: "Compare VIctory’s opening mission run, AnyXboxX’s patched fork, XCL’s reported world load, and Five Star Recomp’s loading blocker.",
    sections: [
      {
        title: "VIctory’s Windows run",
        text: "VIctory’s report covers a Windows 11 run on an RX 6700 XT. The initial setup screens and menus ran at 30 FPS and the intro video played with sound. The world took about 50 seconds to load. The first mission title card appeared, and rendering after it remained dark. The team also reports that entering the world can hang the GPU and reset the display driver.",
        sources: [{ label: "VIctory’s test configuration and results", href: victoryStatus }],
      },
      {
        title: "A second hardware configuration",
        text: "AnyXboxX tested the Xbox Series 1.0.2.1 build on Windows 11 with an i7-13700KF and an RTX 4070 SUPER. Its team used a fork of VIctory carrying local changes and contributor pull requests. It reached the opening credits and recorded 0.3 to 0.5 FPS in the world, with the final scene still largely black.",
        sources: [{ label: "AnyXboxX’s November 24 test notes", href: anyXboxXResults }],
      },
      {
        title: "Five Star Recomp reaches story loading",
        text: "Five Star Recomp reports reaching first-run screens with scripted gamepad input. It presents the logo, intro video, and menus and begins loading story mode, where a memory corruption issue stops the run.",
        sources: [{ label: "Five Star Recomp project status", href: fiveStar }],
      },
      {
        title: "XCL’s world load reports",
        text: "XCL’s compatibility table describes an unnamed retail title that starts in about four seconds and reaches settings at 30 FPS, with gameplay still pending. The community project index identifies that entry as GTA VI. PortWatch subsequently reported that several tests reached the world while the screen remained on a spinner, with the GPU watchdog eventually ending the runs.",
        sources: [
          { label: "XCL compatibility table", href: xclStatus },
          { label: "XCL contributor’s GTA VI menu test", href: "https://github.com/ivall/xcl/pull/203" },
          { label: "Community project index", href: projectIndex },
          { label: "PortWatch’s XCL world-load report", href: xclWorldReport },
        ],
      },
    ],
  },
  {
    slug: "repository-snapshot",
    topic: "Repository",
    title: "The repositories to follow after Leonida",
    summary: "The public work spans title-specific runtimes, broader Xbox compatibility layers, and static recompilation research.",
    sections: [
      {
        title: "The original Leonida repository went offline",
        text: "Leonida’s original public repository became unavailable by November 24. AnyXboxX dropped its upstream Leonida submodule and kept frozen copies of some files. Its November 24 cutscene report credits work from the VIctory repository and its contributors.",
        sources: [
          { label: "AnyXboxX removes the Leonida integration", href: leonidaRemoval },
          { label: "AnyXboxX adds its VIctory fork", href: `${anyXboxX}/commit/a135c32114c9ae592727d11304c8cdc460e3b596` },
        ],
      },
      {
        title: "Where ongoing work is published",
        text: "VIctory publishes a status table for the title it targets. AnyXboxX documents shared work and tests a patched VIctory fork alongside its own Xbox emulation research. Five Star Recomp documents its loader and graphics work. XCL and ScarlettX publish compatibility results across multiple games. Xbox2Windows publishes source-built tests and experimental output comparisons.",
        sources: [
          { label: "VIctory repository", href: victory },
          { label: "AnyXboxX repository", href: anyXboxX },
          { label: "Five Star Recomp repository", href: fiveStar },
        { label: "XCL compatibility reports", href: xclStatus },
          { label: "ScarlettX repository", href: scarlettX },
          { label: "Xbox2Windows repository", href: xbox2Windows },
        ],
      },
    ],
  },
  {
    slug: "performance-budget",
    topic: "Graphics",
    title: "Why menus render before the game world",
    summary: "VIctory can draw the menus at 30 FPS. Rendering the opening mission requires more shader, lighting, and GPU work.",
    sections: [
      {
        title: "Menu graphics and world graphics",
        text: "VIctory translates console GPU code to DXIL as needed and caches the result. Its project report says the menu shaders translate, while the world still needs shader coverage across mesh, vertex, pixel, and compute stages. Missing shaders can prevent draws, and a frame in the opening mission took 0.5 to 1.8 seconds on the reported AMD setup.",
        sources: [{ label: "VIctory’s graphics and shader breakdown", href: victoryStatus }],
      },
      {
        title: "Geometry with missing lighting",
        text: "The AnyXboxX team could see 3D scene data in the intermediate buffers of its VIctory fork, while the final image stayed largely black. Their report points to untranslated lighting passes and describes compute shaders that expect 64-lane GPU waves on a driver that exposes 32.",
        sources: [{ label: "AnyXboxX’s NVIDIA test and graphics notes", href: anyXboxXResults }],
      },
      {
        title: "What small GPU tests measure",
        text: "Xbox2Windows checks selected translated shaders with controlled D3D12 tests. Comparing an output buffer or a small rendered image against a reference helps isolate translation errors. A full scene exercises shaders alongside resource binding, lighting, and frame presentation.",
        sources: [{ label: "Xbox2Windows graphics experiments", href: `${xbox2Windows}/blob/main/docs/experiments.md` }],
      },
    ],
  },
  {
    slug: "xbox-baseline",
    topic: "Xbox",
    title: "What it takes to run the Xbox Series build on PC",
    summary: "The console executable gives projects a way to test startup, system services, and graphics against the same title.",
    sections: [
      {
        title: "The Xbox build and executable",
        text: "On November 23, Notebookcheck reported that Cyberleek had shared the executable associated with a purported Xbox Series build. AnyXboxX subsequently documented experiments on version 1.0.2.1. The public results describe the builds and setups each team tested.",
        sources: [
          { label: "November 23 executable report", href: executableReport },
          { label: "AnyXboxX’s test notes", href: anyXboxXResults },
        ],
      },
      {
        title: "The work a compatibility layer has to do",
        text: "Xbox Series and Windows PCs share the x86-64 instruction set. VIctory and XCL can run the title’s CPU instructions on the host while supplying Xbox services such as storage, input, audio, and graphics. Console RDNA2 shaders need a translation path for the host GPU, even when the CPU code runs directly.",
        sources: [
          { label: "VIctory architecture notes", href: `${victory}/blob/main/docs/architecture.md` },
          { label: "XCL compatibility layer", href: xclStatus },
        ],
      },
      {
        title: "Static recompilation",
        text: "Xbox2Windows translates selected Xbox CPU code into C++ ahead of time and selected Xbox shaders into desktop DXIL. Its public tests establish results for source-built programs and shader fixtures, with execution of the full title still unverified.",
        sources: [{ label: "Xbox2Windows approach and results", href: xbox2Windows }],
      },
    ],
  },
];
