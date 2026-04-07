// ─── Landmark Indices ─────────────────────────────────────────────────────────

export const LM = {
  forehead: 10,
  noseTip: 1,
  philtrum: 2,
  chinCenter: 152,
  leftEyeOuter: 33,
  rightEyeOuter: 263,
  mouthLeft: 61,
  mouthRight: 291,
  lowerLipInner: 14,
  leftPupil: 468,
  rightPupil: 473,
  noseAlaLeft: 129,
  noseAlaRight: 358,
  tragusLeft: 234,
  tragusRight: 454,
  upperCanineLeft: 73,
  upperCanineRight: 303,
  upperLipInner: 13,
  nasion: 168,
  upperLipInnerBottom: [80, 81, 82, 13, 312, 311, 310, 415],
  upperTeethIncisal: [80, 81, 82, 13, 312, 311, 310],
  lowerLipInnerTop: [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308],
  upperLipOuterTop: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291],
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Point {
  x: number;
  y: number;
}

export interface DentalLine {
  id: string;
  label: string;
  color: string;
  points: Point[];
  type: 'line' | 'dashed' | 'curve';
}

// ─── Profile Config ──────────────────────────────────────────────────────────

export const PROFILE_CONFIG: Record<string, string[]> = {
  'Lateral Profile': ['campers-plane - left', 'campers-plane - right'],
  'Facial Profile': [
    'Facial Midline',
    'Interpupillary Line',
    'Intercommissural Line',
  ],
  'Smile Profile': [
    '6. Dental Midline',
    'Facial Midline',
    '7. Incisal Edge',
    '10. Smile Arc',
    '10b. Lower Lip Curve',
    '15. Upper Lip Line',
  ],
  'Lateral Occlusion': ['Canine Line', '9. Occlusal Plane'],
  'Intraoral Lateral': ['6. Dental Midline', '7. Incisal Edge', 'Canine Line'],
  'Teeth Segmentation': ['6. Dental Midline', 'Canine Line'],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pt(
  landmarks: Array<{ x: number; y: number }>,
  idx: number,
  w: number,
  h: number,
): Point {
  return { x: landmarks[idx].x * w, y: landmarks[idx].y * h };
}

function ptArr(
  landmarks: Array<{ x: number; y: number }>,
  indices: number[],
  w: number,
  h: number,
): Point[] {
  return indices.map((i) => pt(landmarks, i, w, h));
}

// ─── Compute All Dental Lines ────────────────────────────────────────────────

export function computeDentalLines(
  landmarks: Array<{ x: number; y: number }>,
  width: number,
  height: number,
): DentalLine[] {
  const lines: DentalLine[] = [];

  // Points
  const nasion = pt(landmarks, LM.nasion, width, height);
  const chin = pt(landmarks, LM.chinCenter, width, height);
  const mouthL = pt(landmarks, LM.mouthLeft, width, height);
  const mouthR = pt(landmarks, LM.mouthRight, width, height);
  const eyeL = pt(landmarks, LM.leftEyeOuter, width, height);
  const eyeR = pt(landmarks, LM.rightEyeOuter, width, height);
  const noseAlaL = pt(landmarks, LM.noseAlaLeft, width, height);
  const noseAlaR = pt(landmarks, LM.noseAlaRight, width, height);
  const tragusL = pt(landmarks, LM.tragusLeft, width, height);
  const tragusR = pt(landmarks, LM.tragusRight, width, height);
  const upperLip = pt(landmarks, LM.upperLipInner, width, height);
  const canineL = pt(landmarks, LM.upperCanineLeft, width, height);
  const canineR = pt(landmarks, LM.upperCanineRight, width, height);
  const upperLipInner = pt(landmarks, LM.upperLipInner, width, height);
  const lowerLipInner = pt(landmarks, LM.lowerLipInner, width, height);

  // Pupil landmarks (indices 468+ require iris model)
  const hasPupils = landmarks.length > 473;
  const pupilL = hasPupils ? pt(landmarks, LM.leftPupil, width, height) : eyeL;
  const pupilR = hasPupils ? pt(landmarks, LM.rightPupil, width, height) : eyeR;

  const midlineTop: Point = { x: upperLip.x, y: height * 0.1 };
  const midlineBottom: Point = { x: upperLip.x, y: height * 0.95 };

  const ipAngle = Math.atan2(eyeR.y - eyeL.y, eyeR.x - eyeL.x);
  const mouthWidth = Math.sqrt(
    Math.pow(mouthR.x - mouthL.x, 2) + Math.pow(mouthR.y - mouthL.y, 2),
  );

  // ══ PROFILE 1 — Lateral Profile (Camper's Plane) ══
  lines.push({
    id: 'campers-plane-left',
    label: 'campers-plane - left',
    color: '#009688',
    points: [noseAlaL, tragusL],
    type: 'line',
  });
  lines.push({
    id: 'campers-plane-right',
    label: 'campers-plane - right',
    color: '#64ffda',
    points: [noseAlaR, tragusR],
    type: 'line',
  });

  // ══ PROFILE 2 — Facial Profile ══
  lines.push({
    id: 'facial-midline',
    label: 'Facial Midline',
    color: '#f44336',
    points: [nasion, chin],
    type: 'dashed',
  });
  lines.push({
    id: 'interpupillary-line',
    label: 'Interpupillary Line',
    color: '#2196f3',
    points: [pupilL, pupilR],
    type: 'line',
  });
  lines.push({
    id: 'intercommissural-line',
    label: 'Intercommissural Line',
    color: '#4caf50',
    points: [mouthL, mouthR],
    type: 'line',
  });

  // ══ PROFILE 3 — Smile Profile ══
  lines.push({
    id: 'dental-midline',
    label: '6. Dental Midline',
    color: '#2196f3',
    points: [midlineTop, midlineBottom],
    type: 'dashed',
  });

  // 7. Incisal Edge
  const halfLen = mouthWidth * 0.13;
  const incisalY = upperLipInner.y + (lowerLipInner.y - upperLipInner.y) * 0.4;
  const incisalCenter: Point = { x: upperLipInner.x, y: incisalY };
  lines.push({
    id: 'incisal-edge',
    label: '7. Incisal Edge',
    color: '#ff9800',
    points: [
      {
        x: incisalCenter.x - halfLen * Math.cos(ipAngle),
        y: incisalCenter.y - halfLen * Math.sin(ipAngle),
      },
      {
        x: incisalCenter.x + halfLen * Math.cos(ipAngle),
        y: incisalCenter.y + halfLen * Math.sin(ipAngle),
      },
    ],
    type: 'line',
  });

  // 9. Occlusal Plane
  const occlusalY = (mouthL.y + mouthR.y) / 2;
  const occlusalCenter: Point = { x: (mouthL.x + mouthR.x) / 2, y: occlusalY };
  const occlusalHalf = mouthWidth * 0.9;
  lines.push({
    id: 'occlusal-plane',
    label: '9. Occlusal Plane',
    color: '#4caf50',
    points: [
      {
        x: occlusalCenter.x - occlusalHalf * Math.cos(ipAngle),
        y: occlusalCenter.y - occlusalHalf * Math.sin(ipAngle),
      },
      {
        x: occlusalCenter.x + occlusalHalf * Math.cos(ipAngle),
        y: occlusalCenter.y + occlusalHalf * Math.sin(ipAngle),
      },
    ],
    type: 'line',
  });

  // 10. Smile Arc
  const upperTeeth = ptArr(landmarks, [...LM.upperTeethIncisal], width, height)
    .sort((a, b) => a.x - b.x)
    .map((p) => ({ x: p.x, y: p.y + height * 0.022 }));
  lines.push({
    id: 'smile-arc',
    label: '10. Smile Arc',
    color: '#9c27b0',
    points: upperTeeth,
    type: 'curve',
  });

  // 10b. Lower Lip Curve
  const lowerLipTop = ptArr(landmarks, [...LM.lowerLipInnerTop], width, height);
  lines.push({
    id: 'lower-lip-curve',
    label: '10b. Lower Lip Curve',
    color: 'rgba(156, 39, 176, 0.4)',
    points: lowerLipTop,
    type: 'curve',
  });

  // 15. Upper Lip Line
  // Build upper lip inner bottom points
  const ulibIndices = [80, 81, 82, 13, 312, 311, 310, 415];
  const lm78 = landmarks[78];
  const lm80 = landmarks[80];
  const fixedPt: Point = {
    x: ((lm78.x + lm80.x) / 2) * width,
    y: ((lm78.y + lm80.y) / 2) * height,
  };
  const upperLipBottom = [
    fixedPt,
    ...ptArr(landmarks, ulibIndices, width, height),
  ];
  lines.push({
    id: 'upper-lip-line',
    label: '15. Upper Lip Line',
    color: '#e91e63',
    points: upperLipBottom,
    type: 'curve',
  });

  // ══ Canine Lines (used in profiles 4, 5, 6) ══
  lines.push({
    id: 'canine-line-left',
    label: 'Canine Line',
    color: '#ffc107',
    points: [
      { x: canineL.x, y: canineL.y - mouthWidth * 0.3 },
      { x: canineL.x, y: canineL.y + mouthWidth * 0.3 },
    ],
    type: 'dashed',
  });
  lines.push({
    id: 'canine-line-right',
    label: 'Canine Line',
    color: '#ffc107',
    points: [
      { x: canineR.x, y: canineR.y - mouthWidth * 0.3 },
      { x: canineR.x, y: canineR.y + mouthWidth * 0.3 },
    ],
    type: 'dashed',
  });

  return lines;
}

// ─── Draw Lines on Canvas ─────────────────────────────────────────────────────

export function drawDentalLines(
  ctx: CanvasRenderingContext2D,
  lines: DentalLine[],
) {
  ctx.lineWidth = 2;

  const fontSize = Math.max(12, Math.round(ctx.canvas.width * 0.025));

  // ✅ Track label positions to avoid overlap
  const usedLabelPositions: { x: number; y: number }[] = [];

  for (const line of lines) {
    ctx.strokeStyle = line.color;
    ctx.fillStyle = line.color;

    if (line.type === 'dashed') {
      ctx.setLineDash([8, 6]);
    } else {
      ctx.setLineDash([]);
    }

    if (line.type === 'curve' && line.points.length > 2) {
      ctx.beginPath();
      ctx.moveTo(line.points[0].x, line.points[0].y);
      for (let i = 1; i < line.points.length - 1; i++) {
        const xc = (line.points[i].x + line.points[i + 1].x) / 2;
        const yc = (line.points[i].y + line.points[i + 1].y) / 2;
        ctx.quadraticCurveTo(line.points[i].x, line.points[i].y, xc, yc);
      }
      const last = line.points[line.points.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(line.points[0].x, line.points[0].y);
      for (let i = 1; i < line.points.length; i++) {
        ctx.lineTo(line.points[i].x, line.points[i].y);
      }
      ctx.stroke();
    }

    // ✅ Label with overlap avoidance
    if (line.points.length >= 2) {
      let labelX =
        (line.points[0].x + line.points[line.points.length - 1].x) / 2;
      let labelY =
        (line.points[0].y + line.points[line.points.length - 1].y) / 2 - 8;

      // ✅ Check if this Y is too close to an already used position
      const minGap = fontSize + 4;
      let attempts = 0;
      while (
        usedLabelPositions.some(
          (p) =>
            Math.abs(p.y - labelY) < minGap && Math.abs(p.x - labelX) < 100,
        ) &&
        attempts < 8
      ) {
        labelY -= minGap; // shift up until no overlap
        attempts++;
      }

      // Remember this label's position
      usedLabelPositions.push({ x: labelX, y: labelY });

      ctx.setLineDash([]);
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = line.color;
      ctx.fillText(line.label, labelX, labelY);
    }
  }

  ctx.setLineDash([]);
}
