// extremely hacky
export function addStyleElement(content: string) {
  const styleEl = document.createElement("style");
  document.head.appendChild(styleEl);
  styleEl.sheet?.insertRule(content, 0);
}

export function shrinkToPositionKeyframe({ top, left, name }: { top: number, left: number, name: string }) {
  return `
  @keyframes ${name} {
    0% {
      top: 50%;
      left: 50%;
      font-size: 100vw;
      transform: translate(-50%, -50%);
      opacity: 0.6;
    }
    100% {
      top: ${top}px;
      left: ${left}px;
      font-size: 0;
      transform: translate(0, 0);
      opacity: 1;
    }
  }
  `;
}

export function popOutKeyframe({ top, left, name }: { top: number, left: number, name: string }) {
  return `
  @keyframes ${name} {
    0% {
      top: ${top}px;
      left: ${left}px;
      font-size: 14px;
      transform: rotate(0deg));
    }
    100% {
      top: 100%;
      left: 100%;
      font-size: 100vw;
      transform: rotate(1800deg);
    }
  }
  `;
}

export function animateProperty(name: string) {
  return `${name} 0.75s ease forwards`;
}

const FONT_WIDTH = 8.5;
const FONT_HEIGHT = 17;
const TEXTAREA_PADDING = 14;


export function calculatePosition({
  textAreaTop,
  textAreaLeft,
  textAreaWidth,
  text,
  position,
}: {
  textAreaTop: number,
  textAreaLeft: number,
  textAreaWidth: number,
  text: string,
  position: number,
}): { top: number, left: number } {
  const availableWidth = textAreaWidth - TEXTAREA_PADDING * 2;
  let numLines = 0;
  let currentLineWidth = 0;

  for (let i = 0; i < position; i++) {
    const char = text[i];
    if (char === '\n' || (currentLineWidth + FONT_WIDTH) > availableWidth) {
      numLines++;
      currentLineWidth = 0;
    }
    if (char !== '\n') {
      currentLineWidth += FONT_WIDTH;
    }
  }

  const top = textAreaTop + TEXTAREA_PADDING + numLines * FONT_HEIGHT;
  const left = textAreaLeft + TEXTAREA_PADDING + currentLineWidth;

  return { top, left };
}