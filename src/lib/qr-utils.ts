import QRCode from 'qrcode';

/**
 * QR Code generation utilities for RestaurantOS table ordering system.
 * Generates high-resolution, printable QR codes linked to table-specific menu URLs.
 */

// Base domain — uses window.location.origin in browser, fallback for SSR
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://restaurant-os.vercel.app';
}

/**
 * Generate a table-specific menu URL.
 */
export function getTableMenuUrl(tableNumber: number | string): string {
  return `${getBaseUrl()}/menu?table=${tableNumber}`;
}

/**
 * Generate a QR scan entrance URL (shows animated scan transition before redirecting to menu).
 */
export function getTableScanUrl(tableNumber: number | string): string {
  return `${getBaseUrl()}/qr/scan?table=${tableNumber}`;
}

/**
 * Generate a QR code as a data URL (base64 PNG).
 * High resolution for print-quality output.
 */
export async function generateQRDataUrl(
  tableNumber: number | string,
  options?: {
    width?: number;
    margin?: number;
    darkColor?: string;
    lightColor?: string;
    useScanEntrance?: boolean;
  }
): Promise<string> {
  const {
    width = 512,
    margin = 2,
    darkColor = '#0C0705',
    lightColor = '#F6F0E8',
    useScanEntrance = true,
  } = options || {};

  const url = useScanEntrance
    ? getTableScanUrl(tableNumber)
    : getTableMenuUrl(tableNumber);

  const dataUrl = await QRCode.toDataURL(url, {
    width,
    margin,
    color: {
      dark: darkColor,
      light: lightColor,
    },
    errorCorrectionLevel: 'H', // Highest error correction for print reliability
    type: 'image/png',
  });

  return dataUrl;
}

/**
 * Generate a QR code as a Canvas element (for embedding in custom layouts).
 */
export async function generateQRCanvas(
  canvas: HTMLCanvasElement,
  tableNumber: number | string,
  options?: {
    width?: number;
    margin?: number;
    darkColor?: string;
    lightColor?: string;
    useScanEntrance?: boolean;
  }
): Promise<void> {
  const {
    width = 512,
    margin = 2,
    darkColor = '#0C0705',
    lightColor = '#F6F0E8',
    useScanEntrance = true,
  } = options || {};

  const url = useScanEntrance
    ? getTableScanUrl(tableNumber)
    : getTableMenuUrl(tableNumber);

  await QRCode.toCanvas(canvas, url, {
    width,
    margin,
    color: {
      dark: darkColor,
      light: lightColor,
    },
    errorCorrectionLevel: 'H',
  });
}

/**
 * Download a QR code as a PNG file.
 */
export async function downloadQR(
  tableNumber: number | string,
  filename?: string
): Promise<void> {
  const dataUrl = await generateQRDataUrl(tableNumber, { width: 1024 });
  
  const link = document.createElement('a');
  link.download = filename || `RestaurantOS-Table-${tableNumber}-QR.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate a batch of QR data URLs for multiple tables.
 */
export async function generateBatchQR(
  tableNumbers: (number | string)[],
  options?: {
    width?: number;
    darkColor?: string;
    lightColor?: string;
  }
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  await Promise.all(
    tableNumbers.map(async (table) => {
      const dataUrl = await generateQRDataUrl(table, options);
      results.set(String(table), dataUrl);
    })
  );

  return results;
}
