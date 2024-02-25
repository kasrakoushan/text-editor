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
    from {
        font-size: 100vw;
    }
    to {
        font-size: 0;
        top: ${top}px;
        left: ${left}px;
    }
  }
  `;
}

const FONT_SIZE = 14;

const RATIO = 0.8;

function calculatePosition(
  { textAreaTop, textAreaLeft, textAreaWidth }: { textAreaTop: number, textAreaLeft: number, textAreaWidth: number },
  currentText: string): {
    top: number, left: number
  } {
  console.log(`top: ${textAreaTop}, left: ${textAreaLeft}, width: ${textAreaWidth}`);
  const textWidth = currentText.length * FONT_SIZE;
  const numLines = Math.floor(textWidth / textAreaWidth);
  const top = textAreaTop + numLines * FONT_SIZE;
  const left = textAreaLeft + (textWidth % textAreaWidth);

  return { top, left };
}

export function PlainEditor() {
  const [text, setText] = useState('');
  const [animationQueue, setAnimationQueue] = useState<CharAnimation[]>([]);
  const [nextId, setNextId] = useState(0);
  const [spin, setSpin] = useState(false);
  const [curl, setCurl] = useState(false);
  const textAreaRef = useRef(null);

  // text area
  const [textAreaTop, setTextAreaTop] = useState(0);
  const [textAreaLeft, setTextAreaLeft] = useState(0);
  const [textAreaWidth, setTextAreaWidth] = useState(0);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setText(newValue);

    if (newValue.length > text.length) {
      const newChar = newValue.slice(-1);
      const animationName = `animation-${nextId}`;
      const animationStyle = `${animationName} 1s ease forwards`;

      const { top, left } = calculatePosition({ textAreaLeft, textAreaTop, textAreaWidth }, text);

      // add to stylesheet
      addStyleElement(shrinkToPositionKeyframe({ top, left, name: animationName }));

      setAnimationQueue((prevQueue) => [
        ...prevQueue,
        { id: nextId, char: newChar, animationStyle }
      ]);
      setNextId(id => id + 1);
    } else {
    }
  }

  useEffect(() => {
    if (animationQueue.length > 0) {
      const timer = setTimeout(() => {
        // Remove the first character from the queue after its animation completes
        setAnimationQueue((prevQueue) => prevQueue.slice(1));
      }, 1000); // Duration of the animation

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
    <h1 className={styles.header}>crusty the trusty text editor</h1>
    <p>(checkboxes don't do anything atm)</p>
    <label className={styles.checkbox}>
      <input type="checkbox" checked={spin} onChange={() => setSpin(!spin)} />
      spin
    </label>
    <label className={styles.checkbox}>
      <input type="checkbox" checked={curl} onChange={() => setCurl(!curl)} />
      curl
    </label>
    <textarea ref={textAreaRef} className={styles.textArea} onInput={handleChange} />
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