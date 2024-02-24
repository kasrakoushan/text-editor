import { useState } from "react";

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

  return <div>
    <textarea onChange={handleChange} />
    {showChar && (
      <div className="floating-char" style={{ animation: `floatDown 2s ease forwards` }}>
        {lastChar}
      </div>
    )}
  </div>;
}