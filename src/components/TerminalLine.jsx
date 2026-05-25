export function TerminalLine({ text, color, bold, italic, style }) {
  return (
    <div
      style={{
        color,
        fontWeight: bold ? 700 : 400,
        fontStyle: italic ? 'italic' : 'normal',
        lineHeight: 1.7,
        minHeight: '1.7em',
        ...style,
      }}
    >
      {text || '\u00A0'}
    </div>
  )
}

export function MixedLine({ parts }) {
  return (
    <div style={{ lineHeight: 1.7, minHeight: '1.7em' }}>
      {parts.map((p, i) => (
        <span
          key={i}
          style={{
            color: p.color,
            fontWeight: p.bold ? 700 : 400,
            fontStyle: p.italic ? 'italic' : 'normal',
          }}
        >
          {p.text}
        </span>
      ))}
    </div>
  )
}

export function OutputLine({ line }) {
  if (line.parts) return <MixedLine parts={line.parts} />
  return (
    <TerminalLine
      text={line.text}
      color={line.color}
      bold={line.bold}
      italic={line.italic}
    />
  )
}
