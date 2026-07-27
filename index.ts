import {
  getMarkdownTheme,
  type ExtensionAPI,
} from "@oh-my-pi/pi-coding-agent"

const patchedThemes = new WeakSet<object>()

// H3+ reaches heading() after bold styling, so an ANSI sequence may
// appear before the hashes. Preserve that sequence while removing ###–######.
const H3_PLUS_PREFIX =
  /^((?:\x1b\[[0-9;:]*m)*)#{3,6}[ \t]+/

function patchMarkdownHeadings(): void {
  const markdownTheme = getMarkdownTheme()

  if (patchedThemes.has(markdownTheme)) {
    return
  }

  const originalHeading = markdownTheme.heading

  markdownTheme.heading = (text: string): string => {
    const withoutPrefix = text.replace(H3_PLUS_PREFIX, "$1")
    return originalHeading(withoutPrefix)
  }

  patchedThemes.add(markdownTheme)
}

export default function cleanHeadings(pi: ExtensionAPI): void {
  // Patch the initially loaded theme.
  pi.on("session_start", () => {
    patchMarkdownHeadings()
  })

  // A theme change produces a new cached MarkdownTheme object,
  // so patch again before subsequent agent runs.
  pi.on("before_agent_start", () => {
    patchMarkdownHeadings()
  })
}