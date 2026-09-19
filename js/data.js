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
    dates: "Sept 2024 – Present",
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
      "Designed a fleet-deployable embedded sensor node (ESP32, Si4732 RF receiver, RTC, SD storage), targeting a $50 BOM across a multi-unit production run.",
      "Diagnosed and resolved an ADC/WiFi radio resource conflict at the SoC level, routing analog sensing to ADC and firmware-gating RF transmission to eliminate noise coupling into sensitive analog signal paths.",
      "Completed schematic-to-layout PCB design and routing for a two-layer board, released for fab and SMT assembly.",
    ],
  },
  {
    role: "Power and Signals Designer",
    company: "UBC Solar Car",
    location: "Vancouver, BC",
    dates: "Sept 2025 – Present",
    bullets: [
      "Designing and testing PCB assemblies for the vehicle's electrical and control systems, currently focused on the steering wheel board responsible for the majority of driver input including CAN-enabled functions.",
      "Utilizing Altium Designer and hardware debugging tools to iterate board layouts, validate circuit performance, and ensure compliance with system-level power and safety requirements.",
      "Ran integration meetings with relevant teams to ensure requirements were satisfied and board development deadlines were met.",
      "Assembled and hand-soldered PCB prototypes and final boards used in the vehicle, ensuring reliable electrical connections and readiness for integration.",
      "Created and managed the PCB Bill of Materials (BOM), optimizing component selection for cost.",
    ],
  },
  {
    role: "Project Technician Intern",
    company: "Aecon Group Inc.",
    location: "Toronto, ON",
    dates: "May 2026 – Present",
    bullets: [
      "Collected, cleaned, and validated engineering design data to support training of a machine learning model for automated Bill of Materials (BOM) generation.",
      "Created and reviewed electrical BOMs, verifying component selections and ensuring consistency with engineering design standards and project specifications.",
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
    model: "assets/models/steering-wheel.step",
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
    future:
      "Next revision: replace the ESP32 DevKitC carrier with a bare STM32 MCU. Dropping the dev-board module cuts real per-unit BOM cost, and STM32's ADC blocks aren't time-shared with a radio the way the ESP32's are — sidestepping the ADC/WiFi conflict this revision needed a firmware workaround for. Its deep-sleep current is also a better starting point if the fleet moves to battery power.",
    model: "assets/models/enav.step",
  },
  {
    id: "pcb1",
    name: "PCB1",
    tool: "Altium Designer",
    dates: "",
    summary: "Add a one-line summary for PCB1 here.",
    bullets: [
      "Add project details here — what does this board do, what was your role, and what were the key design challenges?",
    ],
    tags: ["Altium Designer"],
    model: "assets/models/pcb1.step",
  },
];
