'use client'

import { useState, useEffect, useRef } from "react";
import styles from './PlainEditor.module.css';
import { useCharAnimationQueue } from "./hooks/useCharAnimationQueue";
import { usePeriodAnimationQueue } from "./hooks/usePeriodAnimationQueue";

export function PlainEditor() {
  const [text, setText] = useState('');
  const textAreaRef = useRef(null);
  const [spinning, setSpinning] = useState(false);


  const { animationQueue, handleInput } = useCharAnimationQueue({ text, setText, textAreaRef });

  useEffect(() => {
    if (spinning) {
      const id = setTimeout(() => {
        setSpinning(false);
      }, 500);

      return () => clearTimeout(id);
    }
  }, [spinning]);

  const { addPeriod, periodQueue } = usePeriodAnimationQueue();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setSpinning(true);
    } else if (event.key === '.') {
      addPeriod();
    }
  }

  return <div className={styles.container}>
    <h1>silly text editor</h1>
    <p>start typing...</p>
    <br></br>
    {periodQueue.map((id) =>
      <div key={id} className={styles.periodContainer}>
        <div className={styles.period}>PERIODT</div>
      </div>)
    }
    <textarea ref={textAreaRef} className={`${styles.textArea} ${spinning ? styles.spinOnce : ""}`} onInput={handleInput} onKeyDown={handleKeyDown} />
    {animationQueue.map((item) => (
      <div key={item.id} className={styles.charContainer}>
        <span className={styles.shrinkingChar} style={{ animation: item.animationStyle }}>
          {item.char}
        </span>
      </div>))
    }
  </div >;
}