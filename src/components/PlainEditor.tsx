import { useState, useEffect } from "react";
import styles from './PlainEditor.module.css';

interface UserKeyPress {
  id: number;
  char: string;
  selectionStart: number;
}

const LINE_WIDTH = 92;
const ANIMATION_DURATION = 1000;

function useKeyPressAndPosition(callback: (keyPressed: string, cursorPosition: number) => void) {
  const [keyPressed, setKeyPressed] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [keyProcessed, setKeyProcessed] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setKeyPressed(event.key);
    setKeyProcessed(false);
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!keyProcessed) {
      setCursorPosition(event.target.selectionStart);
      setKeyProcessed(true);
    }
  };

  useEffect(() => {
    if (keyPressed && keyProcessed) {
      // Execute the callback function
      callback(keyPressed, cursorPosition);

      // Reset the state if needed
      setKeyPressed('');
      setCursorPosition(0);
      setKeyProcessed(false);
    }
  }, [keyPressed, keyProcessed, cursorPosition, callback]);

  return { handleKeyDown, handleInput };
}

export function PlainEditor() {
  const [spin, setSpin] = useState(false);
  const [curl, setCurl] = useState(false);

  const [text, setText] = useState('');
  const [animationQueue, setAnimationQueue] = useState<UserKeyPress[]>([]);
  const [nextId, setNextId] = useState(0);

  const { handleInput, handleKeyDown } = useKeyPressAndPosition((keyPressed, cursorPosition) => {
    if (keyPressed.length === 1) {
      const curId = nextId;
      setAnimationQueue((prevQueue) => [
        ...prevQueue,
        {
          id: nextId,
          char: keyPressed,
          selectionStart: cursorPosition
        }
      ]);
      setNextId(nextId + 1);
    } else {
      // handle backspace and so on
    }
  });

  useEffect(() => {
    // TODO: clean the timeout
    const timer = setTimeout(() => {
      if (animationQueue.length > 0) {
        const update = animationQueue[0];
        setText(
          text.slice(0, update.selectionStart) +
          update.char +
          text.slice(update.selectionStart)
        );
        setAnimationQueue(animationQueue.slice(1));
      }
    }, ANIMATION_DURATION - 500);

    return () => clearTimeout(timer);
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
    <textarea
      className={styles.textArea}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      value={text}
    />
    {animationQueue.map((item) => (
      <div key={item.id} className={
        spin ? styles.shrinkAndSpinChar :
          (curl ? styles.curlyChar : styles.shrinkingChar)}>
        {item.char}
      </div>
    ))
    }
  </div >;
}