import { useState, useEffect } from "react";
import styles from './PlainEditor.module.css';

interface CharAnimation {
  id: number;
  char: string;
}

export function PlainEditor() {
  const [text, setText] = useState('');
  const [animationQueue, setAnimationQueue] = useState<CharAnimation[]>([]);
  const [nextId, setNextId] = useState<number>(0);

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
    <textarea className={styles.textArea} onInput={handleChange} />
    {animationQueue.map((item) => (
      <div key={item.id} className={styles.shrinkingChar}>
        {item.char}
      </div>
    ))}
  </div>;
}