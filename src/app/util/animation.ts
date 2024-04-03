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
      font-size: 30vw;
      transform: translate(-50%, -50%);
    }
    100% {
      top: ${top}px;
      left: ${left}px;
      font-size: 0;
      transform: translate(0, 0);
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
      font-size: 0;
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
const ANIMATION_DURATION = 750;


export function calculatePosition(
  { textAreaTop,
    textAreaLeft,
    textAreaWidth,
    position
  }: {
    textAreaTop: number,
    textAreaLeft: number,
    textAreaWidth: number,
    position: number
  }): {
    top: number, left: number
  } {
  console.log(`top: ${textAreaTop}, left: ${textAreaLeft}, width: ${textAreaWidth}`);
  const textWidth = position * FONT_WIDTH;
  const availableWidth = textAreaWidth - TEXTAREA_PADDING * 2;
  const numLines = Math.floor(textWidth / availableWidth);
  const top = textAreaTop + TEXTAREA_PADDING + numLines * FONT_HEIGHT;
  const left = textAreaLeft + TEXTAREA_PADDING + (textWidth % availableWidth);

  console.log(`going to land at: top ${top}, left ${left}`);
  return { top, left };
}