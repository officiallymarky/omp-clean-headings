# OMP Clean Headings

Removes the visible Markdown `###` through `######` prefixes from level 3–6 headings in OMP, preserving heading colors and bold styling.

## Before

```text
### Heading 3
#### Heading 4
```

## After

```text
Heading 3
Heading 4
```

Requires OMP 19.2.0 or later. OMP 19.2 removed the `getMarkdownTheme` export and
rebuilds the Markdown theme object on every paint, so this extension patches the
theme's styling methods instead: H3–H6 text that reaches the `mdHeading` color
(`tui.colorfulMarkdown` off) or palette slot 4 (on, the default) loses its leading
hashes. Code blocks and other text that merely starts with `###` are untouched.

## Installation

```bash
omp plugin install github:officiallymarky/omp-clean-headings
```

Restart OMP after installation.

## Local Development

Clone the repository and link it to OMP:

```bash
git clone https://github.com/officiallymarky/omp-clean-headings.git
cd omp-clean-headings
omp plugin link .
```

## License

MIT
