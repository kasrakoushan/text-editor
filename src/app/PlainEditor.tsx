'use client'

import { useState, useEffect, useRef } from "react";
import styles from './PlainEditor.module.css';
import { useCharAnimationQueue } from "./hooks/useCharAnimationQueue";

export function PlainEditor() {
  const [text, setText] = useState('');
  const textAreaRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [period, setPeriod] = useState(false);


  const { animationQueue, handleInput } = useCharAnimationQueue({ text, setText, textAreaRef });

  useEffect(() => {
    if (spinning) {
      const id = setTimeout(() => {
        setSpinning(false);
      }, 500);

      return () => clearTimeout(id);
    }
  }, [spinning]);

  useEffect(() => {
    if (period) {
      const id = setTimeout(() => {
        setPeriod(false);
      }, 500);

      return () => clearTimeout(id);
    }
  }, [period]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setSpinning(true);
    } else if (event.key === '.') {
      setPeriod(true);
    }
  }

  return <div className={styles.container}>
    <h1>silly text editor</h1>
    <p>start typing...</p>
    <br></br>
    {period && <div className={styles.periodContainer}><div className={styles.period}>PERIODT</div></div>}
    <textarea ref={textAreaRef} className={`${styles.textArea} ${spinning ? styles.spinOnce : ""}`} onInput={handleInput} onKeyDown={handleKeyDown} />
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