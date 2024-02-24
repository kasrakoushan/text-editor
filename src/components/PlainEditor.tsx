import { useState, useEffect } from "react";
import styles from './PlainEditor.module.css';

interface CharAnimation {
  id: number;
  char: string;
}

export function PlainEditor() {
  const [text, setText] = useState('');
  const [animationQueue, setAnimationQueue] = useState<CharAnimation[]>([]);
  const [nextId, setNextId] = useState(0);
  const [spin, setSpin] = useState(false);
  const [curl, setCurl] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setText(newValue);

    if (newValue.length > text.length) {
      const newChar = newValue.slice(-1);

      setAnimationQueue((prevQueue) => [
        ...prevQueue,
        { id: nextId, char: newChar }
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
      }, 2000); // Duration of the animation

      return () => clearTimeout(timer);
    }
  }, [animationQueue]);

  return <div className={styles.container}>
    <h1 className={styles.header}>crusty the trusty text editor</h1>
    <label className={styles.checkbox}>
      <input type="checkbox" checked={spin} onChange={() => setSpin(!spin)} />
      spin
    </label>
    <label className={styles.checkbox}>
      <input type="checkbox" checked={curl} onChange={() => setCurl(!curl)} />
      curl
    </label>
    <textarea className={styles.textArea} onInput={handleChange} />
    {animationQueue.map((item) => (
      <div key={item.id} className={spin ? styles.shrinkAndSpinChar : (curl ? styles.curlyChar : styles.shrinkingChar)}>
        {item.char}
      </div>
    ))
    }
  </div >;
}