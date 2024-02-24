import { useState } from "react";
import styles from './PlainEditor.module.css';

export function PlainEditor() {
  const [text, setText] = useState('');
  const [lastChar, setLastChar] = useState('');
  const [showChar, setShowChar] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;

    if (newValue.length > text.length) {
      const newChar = newValue.slice(-1);
      setLastChar(newChar);
      setShowChar(true);

      setTimeout(() => {
        setShowChar(false);
      }, 2000);

    } else {
      setLastChar('');
    }

    setText(newValue);
  }

  console.log(lastChar);

  return <div className={styles.container}>
    <h1 className={styles.header}>crusty the trusty text editor</h1>
    <textarea className={styles.textArea} onInput={handleChange} />
    {showChar && (
      <div className={styles.shrinkingChar}>
        {lastChar}
      </div>
    )}
  </div>;
}