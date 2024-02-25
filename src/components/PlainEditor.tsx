import { useState, useEffect, useRef } from "react";
import styles from './PlainEditor.module.css';

interface CharAnimation {
  id: number;
  char: string;
  animationStyle: string;
}

// extremely hacky
function addStyleElement(content: string) {
  const styleEl = document.createElement("style");
  document.head.appendChild(styleEl);
  styleEl.sheet?.insertRule(content, 0);
}

function shrinkToPositionKeyframe({ top, left, name }: { top: number, left: number, name: string }) {
  return `
  @keyframes ${name} {
    0% {
      top: 50%;
      left: 50%;
      font-size: 100vw;
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

function popOutKeyframe({ top, left, name }: { top: number, left: number, name: string }) {
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

function animateProperty(name: string) {
  return `${name} 0.75s ease forwards`;
}

const FONT_WIDTH = 8.5;
const FONT_HEIGHT = 17;
const TEXTAREA_PADDING = 14;
const ANIMATION_DURATION = 750;

function calculatePosition(
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

export function PlainEditor() {
  const [text, setText] = useState('');
  const [animationQueue, setAnimationQueue] = useState<CharAnimation[]>([]);
  const [nextId, setNextId] = useState(0);
  const textAreaRef = useRef(null);

  // text area
  const [textAreaTop, setTextAreaTop] = useState(0);
  const [textAreaLeft, setTextAreaLeft] = useState(0);
  const [textAreaWidth, setTextAreaWidth] = useState(0);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    const position = event.target.selectionStart - 1;
    setText(newValue);

    if (newValue.length > text.length) {
      const newChar = newValue.slice(position, position + 1);
      const animationName = `animation-${nextId}`;
      const animationStyle = animateProperty(animationName);

      const { top, left } = calculatePosition({ textAreaLeft, textAreaTop, textAreaWidth, position });

      // add to stylesheet
      addStyleElement(shrinkToPositionKeyframe({ top, left, name: animationName }));

      setAnimationQueue((prevQueue) => [
        ...prevQueue,
        { id: nextId, char: newChar, animationStyle }
      ]);
      setNextId(id => id + 1);
    } else if (newValue.length < text.length) {
      const oldChar = newValue.slice(event.target.selectionStart, event.target.selectionEnd);
    }
  }


  useEffect(() => {
    if (animationQueue.length > 0) {
      const timer = setTimeout(() => {
        setAnimationQueue((prevQueue) => prevQueue.slice(1));
      }, ANIMATION_DURATION);

      return () => clearTimeout(timer);
    }
  }, [animationQueue]);

  useEffect(() => {
    if (textAreaRef.current) {
      const { x, y, width } = (textAreaRef.current as any).getBoundingClientRect();
      setTextAreaTop(y);
      setTextAreaLeft(x);
      setTextAreaWidth(width);
    }
  })

  return <div className={styles.container}>
    <h1>crusty the trusty text editor</h1>
    <p>start typing...</p>
    <textarea ref={textAreaRef} className={styles.textArea} onInput={handleInput} />
    {animationQueue.map((item) => (
      <div key={item.id} className={styles.charContainer}>
        <span className={styles.shrinkingChar} style={{ animation: item.animationStyle }}>
          {item.char}
        </span>
      </div>
    ))
    }
  </div >;
}