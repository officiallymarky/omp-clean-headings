# OMP Clean Headings

Removes the visible Markdown `###` through `######` prefixes from level 3–6 headings in OMP.

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

Heading colors and bold styling are preserved.

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
