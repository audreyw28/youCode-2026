'use client';

import { QRCodeSVG } from 'qrcode.react';

type ResidentQRProps = {
  residentId: string;
  className?: string;
  size?: number;
};

export function ResidentQR({ residentId, className, size = 132 }: ResidentQRProps) {
  return (
    <figure className={`resident-qr ${className ?? ''}`.trim()}>
      <div className="resident-qr__code">
        <QRCodeSVG
          value={residentId}
          size={size}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin
        />
      </div>
      <figcaption className="resident-qr__caption">Unique ID: {residentId}</figcaption>
    </figure>
  );
}
