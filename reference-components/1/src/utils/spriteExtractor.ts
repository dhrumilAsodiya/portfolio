export interface ExtractedSprite {
  canvas: HTMLCanvasElement;
  softBottomCanvas: HTMLCanvasElement;
  width: number;
  height: number;
  aspectRatio: number;
}

const WHITE_THRESHOLD = 236;
const INK_THRESHOLD = 212;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

function getLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Flood-fills exterior white background from outer borders while protecting
 * open torso bottoms so interior white clothing/skin stays 100% opaque.
 */
function keyOutExteriorWhite(
  sourceCanvas: HTMLCanvasElement,
  options: {
    preserveColor: boolean;
    protectOpenBottom: boolean;
  }
): HTMLCanvasElement {
  const { width, height } = sourceCanvas;
  const ctx = sourceCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return sourceCanvas;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const total = width * height;

  // Determine whether each pixel is near-white background candidate
  const isLight = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const lum = getLuminance(r, g, b);
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat = maxC - minC;
    if (lum >= WHITE_THRESHOLD && sat < 24) {
      isLight[i] = 1;
    }
  }

  // Build an optional virtual bottom closure across the torso span so open-bottom
  // waist-up shirts do not flood-fill inward from y = height - 1.
  let bottomSealLeft = width;
  let bottomSealRight = -1;
  if (options.protectOpenBottom) {
    const scanTop = Math.max(0, Math.floor(height * 0.82));
    for (let y = scanTop; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const lum = getLuminance(data[idx], data[idx + 1], data[idx + 2]);
        if (lum < INK_THRESHOLD) {
          if (x < bottomSealLeft) bottomSealLeft = x;
          if (x > bottomSealRight) bottomSealRight = x;
        }
      }
    }
  }

  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const enqueue = (x: number, y: number) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const pos = y * width + x;
    if (visited[pos] || !isLight[pos]) return;
    visited[pos] = 1;
    queue[tail++] = pos;
  };

  // Seed top edge
  for (let x = 0; x < width; x++) {
    enqueue(x, 0);
  }
  // Seed left & right edges
  for (let y = 0; y < height; y++) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }
  // Seed bottom edge (respecting open torso seal when enabled)
  for (let x = 0; x < width; x++) {
    if (options.protectOpenBottom && x >= bottomSealLeft && x <= bottomSealRight) {
      continue;
    }
    enqueue(x, height - 1);
  }

  // BFS flood-fill over 4-connected light pixels
  while (head < tail) {
    const pos = queue[head++];
    const x = pos % width;
    const y = (pos - x) / width;

    // Prevent crossing bottom torso seal row
    if (options.protectOpenBottom && y === height - 1 && x >= bottomSealLeft && x <= bottomSealRight) {
      continue;
    }

    if (x > 0) {
      const n = pos - 1;
      if (!visited[n] && isLight[n]) {
        visited[n] = 1;
        queue[tail++] = n;
      }
    }
    if (x < width - 1) {
      const n = pos + 1;
      if (!visited[n] && isLight[n]) {
        visited[n] = 1;
        queue[tail++] = n;
      }
    }
    if (y > 0) {
      const n = pos - width;
      if (!visited[n] && isLight[n]) {
        visited[n] = 1;
        queue[tail++] = n;
      }
    }
    if (y < height - 1) {
      const n = pos + width;
      const ny = y + 1;
      if (
        !visited[n] &&
        isLight[n] &&
        !(options.protectOpenBottom && ny === height - 1 && x >= bottomSealLeft && x <= bottomSealRight)
      ) {
        visited[n] = 1;
        queue[tail++] = n;
      }
    }
  }

  // Apply transparency to exterior pixels + clean anti-aliased ink edges + monochrome normalization
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pos = y * width + x;
      const idx = pos * 4;

      if (visited[pos]) {
        data[idx + 3] = 0;
        continue;
      }

      let r = data[idx];
      let g = data[idx + 1];
      let b = data[idx + 2];
      const lum = getLuminance(r, g, b);

      // Check if adjacent to exterior transparent background for crisp edge anti-aliasing
      const touchesBg =
        (x > 0 && visited[pos - 1]) ||
        (x < width - 1 && visited[pos + 1]) ||
        (y > 0 && visited[pos - width]) ||
        (y < height - 1 && visited[pos + width]);

      if (!options.preserveColor) {
        // Normalize crowd illustrations to crisp high-contrast black ink & pure white fills
        const normalized = lum < 75 ? 10 : lum > 225 ? 255 : Math.round(lum);
        r = normalized;
        g = normalized;
        b = normalized;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
      } else {
        // Keep yellow glasses & yellow sneakers vivid, crisp up near-black & near-white
        const sat = Math.max(r, g, b) - Math.min(r, g, b);
        if (sat < 35) {
          const normalized = lum < 65 ? 10 : lum > 232 ? 255 : Math.round(lum);
          data[idx] = normalized;
          data[idx + 1] = normalized;
          data[idx + 2] = normalized;
        }
      }

      if (touchesBg && lum > 175) {
        const edgeAlpha = Math.max(0, Math.min(255, Math.round(((242 - lum) / 67) * 255)));
        data[idx + 3] = edgeAlpha;
      } else {
        data[idx + 3] = 255;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return sourceCanvas;
}

function createSoftBottomVariant(spriteCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const out = document.createElement('canvas');
  out.width = spriteCanvas.width;
  out.height = spriteCanvas.height;
  const ctx = out.getContext('2d');
  if (!ctx) return spriteCanvas;

  ctx.drawImage(spriteCanvas, 0, 0);
  const fadeHeight = Math.max(18, Math.round(spriteCanvas.height * 0.14));
  ctx.globalCompositeOperation = 'destination-out';
  const grad = ctx.createLinearGradient(0, spriteCanvas.height - fadeHeight, 0, spriteCanvas.height);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, spriteCanvas.height - fadeHeight, spriteCanvas.width, fadeHeight);
  ctx.globalCompositeOperation = 'source-over';
  return out;
}

/**
 * Extracts and trims the centered standing portrait with preserved yellow accents.
 */
export async function extractStandingPortrait(src: string): Promise<string> {
  const img = await loadImage(src);
  const full = document.createElement('canvas');
  full.width = img.naturalWidth;
  full.height = img.naturalHeight;
  const ctx = full.getContext('2d', { willReadFrequently: true });
  if (!ctx) return src;
  ctx.drawImage(img, 0, 0);

  keyOutExteriorWhite(full, {
    preserveColor: true,
    protectOpenBottom: false,
  });

  // Compute tight non-transparent bounding box
  const { width, height } = full;
  const data = ctx.getImageData(0, 0, width, height).data;
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX <= minX || maxY <= minY) return src;

  const pad = 4;
  const sx = Math.max(0, minX - pad);
  const sy = Math.max(0, minY - pad);
  const sw = Math.min(width - sx, maxX - minX + 1 + pad * 2);
  const sh = Math.min(height - sy, maxY - minY + 1 + pad * 2);

  const trimmed = document.createElement('canvas');
  trimmed.width = sw;
  trimmed.height = sh;
  const tctx = trimmed.getContext('2d');
  if (!tctx) return src;
  tctx.drawImage(full, sx, sy, sw, sh, 0, 0, sw, sh);

  return trimmed.toDataURL('image/png');
}

interface Segment {
  start: number;
  end: number;
}

/**
 * Slices a horizontal character lineup sheet into individual crisp transparent sprites.
 */
export async function extractSpritesFromSheet(src: string): Promise<ExtractedSprite[]> {
  const img = await loadImage(src);
  const sheet = document.createElement('canvas');
  sheet.width = img.naturalWidth;
  sheet.height = img.naturalHeight;
  const ctx = sheet.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];
  ctx.drawImage(img, 0, 0);

  const { width, height } = sheet;
  const data = ctx.getImageData(0, 0, width, height).data;

  // 1D horizontal ink projection to find character columns
  const colCounts = new Int32Array(width);
  for (let x = 0; x < width; x++) {
    let count = 0;
    for (let y = 0; y < height; y++) {
      const idx = (y * width + x) * 4;
      const lum = getLuminance(data[idx], data[idx + 1], data[idx + 2]);
      if (lum < INK_THRESHOLD) count++;
    }
    colCounts[x] = count;
  }

  // Group contiguous ink columns into raw segments
  const rawSegments: Segment[] = [];
  let inSeg = false;
  let segStart = 0;
  for (let x = 0; x < width; x++) {
    const hasInk = colCounts[x] >= 2;
    if (hasInk && !inSeg) {
      inSeg = true;
      segStart = x;
    } else if (!hasInk && inSeg) {
      inSeg = false;
      rawSegments.push({ start: segStart, end: x - 1 });
    }
  }
  if (inSeg) {
    rawSegments.push({ start: segStart, end: width - 1 });
  }

  // Merge small nearby islands (e.g. floating soap bubbles next to the bubble girl)
  // with their closest major character segment.
  const minMajorWidth = Math.round(width * 0.08);
  const mergeGap = Math.round(width * 0.055);
  const merged: Segment[] = [];

  for (const seg of rawSegments) {
    const segW = seg.end - seg.start + 1;
    if (merged.length > 0) {
      const prev = merged[merged.length - 1];
      const gap = seg.start - prev.end;
      const prevW = prev.end - prev.start + 1;
      if (gap <= mergeGap && (segW < minMajorWidth || prevW < minMajorWidth)) {
        prev.end = seg.end;
        continue;
      }
    }
    merged.push({ ...seg });
  }

  // Keep valid character segments
  const sprites: ExtractedSprite[] = [];
  for (const seg of merged) {
    const segW = seg.end - seg.start + 1;
    if (segW < minMajorWidth) continue;

    // Find vertical bounds inside this horizontal segment
    let minY = height;
    let maxY = 0;
    for (let y = 0; y < height; y++) {
      for (let x = seg.start; x <= seg.end; x++) {
        const idx = (y * width + x) * 4;
        if (getLuminance(data[idx], data[idx + 1], data[idx + 2]) < INK_THRESHOLD) {
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxY - minY < height * 0.25) continue;

    const padX = 6;
    const padTop = 6;
    const sx = Math.max(0, seg.start - padX);
    const ex = Math.min(width - 1, seg.end + padX);
    const sy = Math.max(0, minY - padTop);
    const ey = Math.min(height - 1, maxY);

    const sw = ex - sx + 1;
    const sh = ey - sy + 1;

    const tile = document.createElement('canvas');
    tile.width = sw;
    tile.height = sh;
    const tctx = tile.getContext('2d', { willReadFrequently: true });
    if (!tctx) continue;

    tctx.fillStyle = '#FFFFFF';
    tctx.fillRect(0, 0, sw, sh);
    tctx.drawImage(sheet, sx, sy, sw, sh, 0, 0, sw, sh);

    keyOutExteriorWhite(tile, {
      preserveColor: false,
      protectOpenBottom: true,
    });

    const softBottomCanvas = createSoftBottomVariant(tile);
    sprites.push({
      canvas: tile,
      softBottomCanvas,
      width: sw,
      height: sh,
      aspectRatio: sw / sh,
    });
  }

  return sprites;
}

/**
 * Generates clean monochrome fallback silhouettes if image assets fail to load.
 */
export function createFallbackSprites(): ExtractedSprite[] {
  const variants = [
    { hair: 'round', glasses: false, scarf: false },
    { hair: 'tall', glasses: true, scarf: false },
    { hair: 'bun', glasses: false, scarf: true },
    { hair: 'curly', glasses: true, scarf: false },
  ];

  return variants.map((v) => {
    const canvas = document.createElement('canvas');
    canvas.width = 220;
    canvas.height = 300;
    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = '#0A0A0A';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Torso
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(35, 300);
    ctx.quadraticCurveTo(38, 185, 85, 165);
    ctx.lineTo(135, 165);
    ctx.quadraticCurveTo(182, 185, 185, 300);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Head
    ctx.beginPath();
    ctx.ellipse(110, 105, 42, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hair
    ctx.fillStyle = '#0A0A0A';
    ctx.beginPath();
    if (v.hair === 'bun') {
      ctx.arc(152, 72, 16, 0, Math.PI * 2);
    }
    ctx.arc(110, 82, 44, Math.PI, 0);
    ctx.fill();

    // Eyes & smile
    ctx.fillStyle = '#0A0A0A';
    ctx.beginPath();
    ctx.arc(95, 102, 4, 0, Math.PI * 2);
    ctx.arc(125, 102, 4, 0, Math.PI * 2);
    ctx.fill();

    if (v.glasses) {
      ctx.beginPath();
      ctx.arc(95, 102, 12, 0, Math.PI * 2);
      ctx.arc(125, 102, 12, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(110, 118, 12, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();

    if (v.scarf) {
      ctx.beginPath();
      ctx.moveTo(65, 175);
      ctx.lineTo(165, 285);
      ctx.stroke();
    }

    return {
      canvas,
      softBottomCanvas: createSoftBottomVariant(canvas),
      width: 220,
      height: 300,
      aspectRatio: 220 / 300,
    };
  });
}
