/**
 * Student Academic Hub - Handcrafted Human-Made Vector Icons
 * Clean, modern SVG line icons crafted for the architectural copper/graphite design system.
 * Eliminates generic OS system emojis in favor of bespoke iconography.
 */

const Icons = {
  // Brand Emblem: Modern Academic Mortarboard & Book Crest
  logo: `
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <path d="M16 4L3 11L16 18L29 11L16 4Z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7 13.5V20C7 23 11 25.5 16 25.5C21 25.5 25 23 25 20V13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M29 11V20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <circle cx="29" cy="21.5" r="1.5" fill="currentColor"/>
    </svg>
  `,

  // Search Icon
  search: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M20 20L16.2 16.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  // Star / Favorites Icon
  star: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  starFilled: `
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
    </svg>
  `,

  // Sun (Light Mode Toggle)
  sun: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
      <path d="M12 2V4M12 20V22M4 12H2M22 12H20M5.64 5.64L4.22 4.22M19.78 19.78L18.36 18.36M5.64 18.36L4.22 19.78M19.78 4.22L18.36 5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  // Moon (Dark Mode Toggle)
  moon: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // Settings / Admin Gear
  settings: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2"/>
      <path d="M19.4 15A1.65 1.65 0 0019.73 16.82L20 17.15A2 2 0 0117.17 20L16.84 19.67A1.65 1.65 0 0015 19.4V20A2 2 0 0111 20V19.4A1.65 1.65 0 009.18 19.07L8.85 19.4A2 2 0 016 16.57L6.33 16.24A1.65 1.65 0 006 14.4H5.4A2 2 0 015.4 10.4H6A1.65 1.65 0 006.33 8.58L6 8.25A2 2 0 018.83 5.42L9.16 5.75A1.65 1.65 0 0011 6V5.4A2 2 0 0115 5.4V6A1.65 1.65 0 0016.82 6.33L17.15 6A2 2 0 0120 8.83L19.67 9.16A1.65 1.65 0 0019.4 11V11.6A1.65 1.65 0 0019.4 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // Home Icon
  home: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
      <path d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // Regulation / Curriculum Scroll
  regulation: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <path d="M19 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" stroke-width="2"/>
      <path d="M7 8H17M7 12H17M7 16H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  // Department / Pillars
  department: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <path d="M3 21H21M4 18V10M8 18V10M12 18V10M16 18V10M20 18V10M2 10L12 3L22 10V10H2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // Code / CS Department
  code: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
      <path d="M16 18L22 12L16 6M8 6L2 12L8 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // AI & Data Science
  ai: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
      <circle cx="19" cy="5" r="2" stroke="currentColor" stroke-width="2"/>
      <circle cx="5" cy="5" r="2" stroke="currentColor" stroke-width="2"/>
      <circle cx="5" cy="19" r="2" stroke="currentColor" stroke-width="2"/>
      <circle cx="19" cy="19" r="2" stroke="currentColor" stroke-width="2"/>
      <path d="M7 6.5L10 10.5M17 6.5L14 10.5M7 17.5L10 13.5M17 17.5L14 13.5" stroke="currentColor" stroke-width="1.8"/>
    </svg>
  `,

  // Network / IT
  network: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
      <path d="M3.6 9H20.4M3.6 15H20.4M12 3C14.5 5.5 16 8.5 16 12C16 15.5 14.5 18.5 12 21C9.5 18.5 8 15.5 8 12C8 8.5 9.5 5.5 12 3Z" stroke="currentColor" stroke-width="1.8"/>
    </svg>
  `,

  // Hardware / ECE
  chip: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
      <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" stroke-width="2"/>
      <path d="M9 2V5M15 2V5M9 19V22M15 19V22M2 9H5M2 15H5M19 9H22M19 15H22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  // Mechanical
  gear: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
      <path d="M19.4 15A1.65 1.65 0 0019.73 16.82L20 17.15A2 2 0 0117.17 20L16.84 19.67A1.65 1.65 0 0015 19.4V20A2 2 0 0111 20V19.4A1.65 1.65 0 009.18 19.07L8.85 19.4A2 2 0 016 16.57L6.33 16.24A1.65 1.65 0 006 14.4H5.4A2 2 0 015.4 10.4H6A1.65 1.65 0 006.33 8.58L6 8.25A2 2 0 018.83 5.42L9.16 5.75A1.65 1.65 0 0011 6V5.4A2 2 0 0115 5.4V6A1.65 1.65 0 0016.82 6.33L17.15 6A2 2 0 0120 8.83L19.67 9.16A1.65 1.65 0 0019.4 11V11.6A1.65 1.65 0 0019.4 15Z" stroke="currentColor" stroke-width="2"/>
    </svg>
  `,

  // --- 9 Subject Resource Categories ---
  syllabus: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <path d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20V3H6.5C5.11929 3 4 4.11929 4 5.5V19.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M4 19.5C4 20.8807 5.11929 22 6.5 22H20V17H6.5C5.11929 17 4 18.1193 4 19.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 7H15M9 11H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  notes: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 13H16M8 17H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  videos: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <rect x="2" y="4" width="20" height="15" rx="3" stroke="currentColor" stroke-width="2"/>
      <polygon points="10 8 16 11.5 10 15 10 8" fill="currentColor"/>
    </svg>
  `,

  classwork: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" stroke-width="2"/>
      <path d="M9 2V6M15 2V6M3 9H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <circle cx="8" cy="14" r="1" fill="currentColor"/>
      <circle cx="12" cy="14" r="1" fill="currentColor"/>
      <circle cx="16" cy="14" r="1" fill="currentColor"/>
    </svg>
  `,

  labManual: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <path d="M9 3H15M10 3V8L4.5 18.5C3.8 19.8 4.7 21.5 6.2 21.5H17.8C19.3 21.5 20.2 19.8 19.5 18.5L14 8V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7 15H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  practicalQuestions: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <rect x="3" y="3" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
      <path d="M7 8L10 10L7 12M12 12H16M3 21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  questionPapers: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <path d="M9 12H15M9 16H12M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H13.5L19 8.5V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="8" r="1.5" fill="currentColor"/>
    </svg>
  `,

  importantQuestions: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <path d="M12 3L14.5 8.5L20.5 9.3L16 13.5L17.2 19.5L12 16.5L6.8 19.5L8 13.5L3.5 9.3L9.5 8.5L12 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="11" r="2" fill="currentColor"/>
    </svg>
  `,

  otherResources: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <path d="M10 13C10.4 13.6 11 14 11.7 14.2C12.4 14.4 13.1 14.3 13.7 14L16.7 11C17.5 10.2 17.5 8.9 16.7 8.1C15.9 7.3 14.6 7.3 13.8 8.1L12.9 9M14 11C13.6 10.4 13 10 12.3 9.8C11.6 9.6 10.9 9.7 10.3 10L7.3 13C6.5 13.8 6.5 15.1 7.3 15.9C8.1 16.7 9.4 16.7 10.2 15.9L11.1 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
    </svg>
  `,

  // Arrow right
  arrowRight: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // External open
  external: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
      <path d="M18 13V19C18 19.5523 17.5523 20 17 20H5C4.44772 20 4 19.5523 4 19V7C4 6.44772 4.44772 6 5 6H11M15 4H20M20 4V9M20 4L10 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // Official Shield Badge
  shield: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
      <path d="M12 3L4 7V12C4 16.5 7.5 20.5 12 21.5C16.5 20.5 20 16.5 20 12V7L12 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // Check
  check: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
      <path d="M5 13L9 17L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
};

// Global export
if (typeof window !== "undefined") {
  window.Icons = Icons;
}
