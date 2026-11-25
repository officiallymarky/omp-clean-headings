import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent"
import { currentTheme } from "@oh-my-pi/pi-tui/theme/runtime"

// H3+ headings reach the styling methods after bold styling, so an ANSI
// sequence may appear before the hashes. Preserve that sequence while
// removing the leading ###–###### and its space.
const H3_PLUS_PREFIX = /^((?:\x1b\[[0-9;:]*m)*)#{3,6}[ \t]+/

// Colorful markdown (tui.colorfulMarkdown, on by default) colors H3–H6
// headings through palette slot 4. With it off, every heading uses mdHeading.
const H3_PLUS_PALETTE_SLOT = 4

const PATCHED = Symbol.for("omp-clean-headings.patched")

interface ThemePrototype {
  fg(this: ThemePrototype, name: string, text: string): string
  palette(this: ThemePrototype, slot: number, text: string): string
}

// The markdown theme object is rebuilt on every paint, so patching it has no
// lasting effect. The Theme instance it is built from is long-lived, and a
// theme switch creates a new instance of the same class: patch the prototype
// once and every heading drawn afterwards passes through it.
function patchTheme(theme: ThemePrototype): void {
  const proto = Object.getPrototypeOf(theme) as ThemePrototype | null
  if (!proto?.fg || !proto.palette) {
    return
  }

  const marked = proto as unknown as Record<symbol, unknown>
  if (marked[PATCHED]) {
    return
  }

  const fg = proto.fg
  const palette = proto.palette

  proto.fg = function (this: ThemePrototype, name: string, text: string): string {
    const styled = fg.call(this, name, text)
    return name === "mdHeading" ? styled.replace(H3_PLUS_PREFIX, "$1") : styled
  }

  proto.palette = function (this: ThemePrototype, slot: number, text: string): string {
    const styled = palette.call(this, slot, text)
    return slot === H3_PLUS_PALETTE_SLOT ? styled.replace(H3_PLUS_PREFIX, "$1") : styled
  }

  marked[PATCHED] = true
}

export default function cleanHeadings(_pi: ExtensionAPI): void {
  patchTheme(currentTheme() as ThemePrototype)
}
