// ---------------------------------------------------------------------------
// Site content. Edit this file to update text without touching markup/JS.
// Anything marked "Add project details here" is a placeholder — the resume
// PDF only had a full writeup for the Steering Wheel PCB project, so eNav
// and PCB1 need a couple of bullet points from you.
// ---------------------------------------------------------------------------

export const profile = {
  name: "Hardy Wang",
  role: "Electrical Engineering — Hardware & Embedded Systems",
  tagline: "PCB design, embedded firmware, and power electronics.",
  email: "wanghardy56@gmail.com",
  linkedin: "https://www.linkedin.com/in/hardy-wang-658008316",
  github: "", // add your GitHub profile URL
  resumeFile: "assets/Hardy_Wang_Resume.pdf",
  location: "Vancouver, BC · Toronto, ON",
  bio: [
    "Electrical Engineering student at the University of British Columbia, focused on hardware design, PCB layout, and embedded systems.",
    "Currently building fleet-deployable sensor hardware at e-Radio, designing the steering-wheel electronics for UBC Solar Car, and supporting BOM/ML-data workflows at Aecon Group.",
    "Comfortable across the full stack of a board: schematic capture, layout and routing, bring-up and debug on the bench, and the firmware that runs on it.",
  ],
};

export const education = [
  {
    school: "University of British Columbia",
    location: "Vancouver, BC",
    degree: "Bachelor of Applied Science in Electrical Engineering",
    dates: "Sept 2024 – Dec 2028 (expected)",
  },
];

export const skills = {
  Computer: ["C/C++", "JavaScript / TypeScript", "MySQL", "Python", "MATLAB", "Arduino", "SystemVerilog", "RISC-V Assembly"],
  Software: ["Git", "Google Colab", "VS Code", "SolidWorks", "STM32CubeIDE", "Altium Designer", "AutoCAD", "LTspice", "FreeRTOS"],
  Electrical: ["PCB Design / Debugging", "Wire Harnessing", "Power Electronics", "THT / SMD Soldering"],
  "Bench Tools": ["Multimeters", "Oscilloscopes", "Function Generators", "Bench Power Supplies", "Circuit Design & Components"],
  Communication: ["CAN", "SPI", "I2C", "UART"],
};

export const experience = [
  {
    role: "Hardware Engineering Intern",
    company: "e-Radio Inc.",
    location: "Toronto, ON",
    dates: "May 2026 – Present",
    bullets: [
      "Took a two-layer RF sensor board from schematic through layout, fab, and bring-up, and wrote the ESP32 firmware that runs on it, including the I2C and SPI drivers.",
      "Tuned the receiver's per-channel settle time from measured data and added a warm-up dwell to remove a first-sweep reading error, so every sweep is usable.",
      "Built the data log to survive power loss and sped up uploads with batching so the backlog no longer grows.",
      "Traced an ADC fault to an ADC and WiFi SoC resource conflict, fixed it in firmware, and avoided a board respin. Used VNA S-parameter measurements to develop the RF front end.",
    ],
  },
  {
    role: "Power and Signals Designer",
    company: "UBC Solar Car",
    location: "Vancouver, BC",
    dates: "Sept 2025 – Present",
    bullets: [
      "One of ~8 engineers on the Power and Signals team. Designed the steering wheel board (7 driver inputs over CAN, UART, and I2C) from schematic to a race-ready unit, syncing weekly with mechanical and software subteams on connectors, mounting, and firmware interfaces.",
      "Selected components against the team budget, tracked issues and action items on my board and teammates' boards, and hand assembled and bench validated prototype and final boards.",
    ],
  },
  {
    role: "Project Technician Intern",
    company: "Aecon Group Inc.",
    location: "Toronto, ON",
    dates: "May 2026 – Present",
    bullets: [
      "Reviewed electrical Bills of Materials against engineering design standards, catching component mismatches before they reached procurement.",
    ],
  },
];

// Each project can optionally point at a `.step` file for the interactive
// 3D viewer. Paths are relative to the site root.
export const projects = [
  {
    id: "steering-wheel",
    name: "Steering Wheel PCB",
    tool: "Altium Designer",
    dates: "Dec 2025 – May 2026",
    summary:
      "Steering wheel interface board for UBC Solar Car — CAN bus driver input, opto-isolated switching, and JTAG debug.",
    bullets: [
      "Designed a steering wheel interface PCB in Altium Designer, implementing differential pair routing for CAN bus communication and discrete driver inputs including horn, push-to-talk, regenerative braking, and display controls.",
      "Led schematic design, component selection, and PCB layout, optimizing board size, connector orientation, and switch placement to match updated steering wheel geometry.",
      "Updated MCU programming and debug support from ST-Link to JTAG, ensuring proper STM32 pin routing, signal integrity, and test access.",
      "Mitigated noise and EMI through opto-isolation and dedicated return paths, protecting sensitive MCU logic from high-transient signals.",
    ],
    tags: ["Altium Designer", "STM32", "CAN Bus", "EMI Mitigation"],
    layoutNotes: [
      "Carved a power-pour cutout beneath the CAN High/Low differential pair to keep the matched routing clear of the surrounding ground/power fill.",
      "Added a power-pour cutout on the noisy side of the opto-isolated Push-to-Talk circuitry, keeping its high-transient signal from coupling into the plane.",
      "Grouped the four momentary switch inputs (Horn, Push-to-Talk, Cruise Control, Next Page) symmetrically around the CAN connector, keeping each debounce return path short.",
    ],
    images: [
      { src: "assets/img/steering-wheel-layout.webp", caption: "2D layout in Altium — CAN bus, cruise control, horn, and push-to-talk zones labeled." },
      { src: "assets/img/steering-wheel-assembly.webp", caption: "Hand-populating prototype boards." },
      { src: "assets/img/steering-wheel-populated.webp", caption: "Assembled and hand-soldered steering wheel board." },
    ],
    model: "assets/models/steering-wheel.glb",
  },
  {
    id: "enav",
    name: "eNav",
    tool: "Altium Designer",
    dates: "May 2026 – Present",
    summary:
      "Custom RF receiver PCB for a 20-unit ambient-RF data collection fleet — Si4732 FM tuner, ESP32 carrier, RTC, and SD logging, engineered for unattended field deployment.",
    bullets: [
      "Designed a fleet-deployable embedded sensor node around an ESP32 carrier, Si4732 FM receiver, RTC, and SD storage, targeting a $50 BOM across a multi-unit production run.",
      "Completed schematic-to-layout PCB design and routing for a two-layer board, released for fab and SMT assembly.",
      "Selected the SMA antenna front-end and designed its matching network, tuning component values on the bench for even gain across the whole FM band rather than a narrowband peak.",
      "Diagnosed and resolved an ADC/WiFi radio resource conflict at the SoC level, routing analog sensing to ADC and firmware-gating RF transmission to eliminate noise coupling into sensitive analog signal paths.",
    ],
    tags: ["Altium Designer", "ESP32", "RF Impedance Matching", "PCB Layout"],
    layoutNotes: [
      "Cut a notch in the board outline next to the ESP32's onboard WiFi module so no copper or plane sits underneath it, keeping the antenna's near-field clear during data uploads.",
      "Isolated the Si4732 RF receiver from every high-noise net on the board — the I2C bus, the WiFi module, and other digital switching — rather than relying on shielding alone.",
      "Added power-pour cutouts wherever the layout allowed, prioritizing a clean RF front end over maximum plane coverage.",
    ],
    images: [
      { src: "assets/img/enav-layout.png", caption: "2D layout in Altium — ESP32 carrier, RTC, and microSD sections labeled." },
      { src: "assets/img/enav-bringup.webp", caption: "Bringing up the eNav board." },
    ],
    future:
      "Next revision: replace the ESP32 DevKitC carrier with a bare STM32 MCU. Dropping the dev-board module cuts real per-unit BOM cost, and STM32's ADC blocks aren't time-shared with a radio the way the ESP32's are — sidestepping the ADC/WiFi conflict this revision needed a firmware workaround for. Its deep-sleep current is also a better starting point if the fleet moves to battery power.",
    model: "assets/models/enav.glb",
  },
  {
    id: "pcb1",
    name: "Driver Fan Controller Board",
    tool: "Altium Designer",
    dates: "",
    summary:
      "Fixed-speed driver fan controller board, simplified from an earlier PWM-based design and hardened with back-EMF protection and mis-connection-proof connectors.",
    bullets: [
      "Simplified the board from a PWM-based speed-control design to a fixed-speed switched circuit, removing the 555 timer, potentiometer, and associated PWM components to cut size and complexity.",
      "Added a Schottky rectifier diode across the fan terminals for back-EMF protection, sized with margin above the fan's actual operating current and voltage.",
      "Specified color-differentiated, right-angle power and fan connectors to prevent mis-connection and reduce wire strain versus a prior vertical-connector revision.",
      "Validated the board with continuity checks before power-up, functional testing under load on a bench supply, and measured diode forward-voltage drop against datasheet spec to confirm component selection.",
    ],
    tags: ["Altium Designer", "Power Electronics", "Connector Design", "Bench Validation"],
    model: "assets/models/pcb1.glb",
  },
];
