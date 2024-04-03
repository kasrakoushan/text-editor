import { useState, useEffect } from 'react';
import { animateProperty, addStyleElement, shrinkToPositionKeyframe, popOutKeyframe, calculatePosition } from '../util/animation';

const ANIMATION_DURATION = 750;

interface CharAnimation {
  id: number;
  char: string;
  animationStyle: string;
}

export function useAnimationQueue(
  { text, setText, textAreaRef}: 
  { text: string, setText: (text: string) => void, textAreaRef: React.RefObject<HTMLTextAreaElement>}
) {
  // animation queue
  const [animationQueue, setAnimationQueue] = useState<CharAnimation[]>([]);
  const [nextId, setNextId] = useState(0);

  // text area coordinates
  const [textAreaTop, setTextAreaTop] = useState(0);
  const [textAreaLeft, setTextAreaLeft] = useState(0);
  const [textAreaWidth, setTextAreaWidth] = useState(0);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    const position = event.target.selectionStart - 1;
    setText(newValue);

    if (newValue.length > text.length) {
      // character insertion
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
      // character deletion
      const oldChar = text.slice(event.target.selectionStart, event.target.selectionEnd + 1);
      const animationName = `animation-${nextId}`;
      const animationStyle = animateProperty(animationName);

      const { top, left } = calculatePosition({ textAreaLeft, textAreaTop, textAreaWidth, position });

      // add to stylesheet
      addStyleElement(popOutKeyframe({ top, left, name: animationName }));

      setAnimationQueue((prevQueue) => [
        ...prevQueue,
        { id: nextId, char: oldChar, animationStyle }
      ]);
      setNextId(id => id + 1);
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

  return { animationQueue, handleInput };
}