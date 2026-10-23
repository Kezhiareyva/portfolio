export type PixelGrid = readonly string[]
export type Palette = Record<string, string>

/**
 * Renders a sprite from rows of palette keys ('.' is transparent).
 * Runs of one colour share a single path, so a sprite costs one node per colour.
 */
export function PixelArt({
  grid,
  palette,
  className,
  title,
}: {
  grid: PixelGrid
  palette: Palette
  className?: string
  title?: string
}) {
  const width = Math.max(...grid.map((row) => row.length))
  const height = grid.length
  const paths = new Map<string, string>()

  grid.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const char = row[x]
      if (char === '.' || !palette[char]) {
        x++
        continue
      }
      let run = 1
      while (row[x + run] === char) run++
      paths.set(char, `${paths.get(char) ?? ''}M${x} ${y}h${run}v1h-${run}z`)
      x += run
    }
  })

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      shapeRendering="crispEdges"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {Array.from(paths, ([char, d]) => (
        <path key={char} d={d} fill={palette[char]} />
      ))}
    </svg>
  )
}
