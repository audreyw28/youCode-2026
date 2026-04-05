'use client';

type ResidentQRProps = {
  residentId: string;
  className?: string;
  size?: number;
};

function patternBits(value: string) {
  return Array.from({ length: 21 * 21 }, (_, index) => {
    const charCode = value.charCodeAt(index % value.length) || 0;
    return (charCode + index * 7 + value.length) % 2 === 0;
  });
}

export function ResidentQR({ residentId, className, size = 132 }: ResidentQRProps) {
  const cells = 21;
  const padding = 16;
  const innerSize = size - padding * 2;
  const cellSize = innerSize / cells;
  const bits = patternBits(residentId);

  return (
    <figure className={`resident-qr ${className ?? ''}`.trim()}>
      <div className="resident-qr__code">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`Resident code for ${residentId}`}
        >
          <rect width={size} height={size} rx="12" fill="#ffffff" />
          {bits.map((filled, index) => {
            if (!filled) return null;

            const x = index % cells;
            const y = Math.floor(index / cells);

            return (
              <rect
                key={`${x}-${y}`}
                x={padding + x * cellSize}
                y={padding + y * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#111111"
              />
            );
          })}
          <rect x={padding} y={padding} width={cellSize * 7} height={cellSize * 7} fill="#ffffff" />
          <rect x={padding} y={padding} width={cellSize * 7} height={cellSize * 7} stroke="#111111" strokeWidth={cellSize} fill="none" />
          <rect x={padding + cellSize * 2} y={padding + cellSize * 2} width={cellSize * 3} height={cellSize * 3} fill="#111111" />
          <rect x={size - padding - cellSize * 7} y={padding} width={cellSize * 7} height={cellSize * 7} fill="#ffffff" />
          <rect x={size - padding - cellSize * 7} y={padding} width={cellSize * 7} height={cellSize * 7} stroke="#111111" strokeWidth={cellSize} fill="none" />
          <rect x={size - padding - cellSize * 5} y={padding + cellSize * 2} width={cellSize * 3} height={cellSize * 3} fill="#111111" />
          <rect x={padding} y={size - padding - cellSize * 7} width={cellSize * 7} height={cellSize * 7} fill="#ffffff" />
          <rect x={padding} y={size - padding - cellSize * 7} width={cellSize * 7} height={cellSize * 7} stroke="#111111" strokeWidth={cellSize} fill="none" />
          <rect x={padding + cellSize * 2} y={size - padding - cellSize * 5} width={cellSize * 3} height={cellSize * 3} fill="#111111" />
        </svg>
      </div>
      <figcaption className="resident-qr__caption">Unique ID: {residentId}</figcaption>
    </figure>
  );
}
