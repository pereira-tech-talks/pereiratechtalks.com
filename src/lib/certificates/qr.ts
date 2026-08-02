import QRCode from 'qrcode';

/** Build a PNG data URL for the verification QR (SSG / build-time). */
export async function buildVerifyQrDataUrl(verifyUrl: string): Promise<string> {
  return QRCode.toDataURL(verifyUrl, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 160,
    color: {
      dark: '#1a1a1a',
      light: '#ffffff',
    },
  });
}
