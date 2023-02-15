import { useEffect, useRef, useState } from 'react';

const updateSameText = (text1, text2) => {
  if (text1 === text2) {
    if (text1 === undefined) {
      return undefined;
    }
    return ' ' + text1 + ' ';
  } else {
    return text1;
  }
};

function useToast(data = undefined) {
  const oldToastText = useRef(data);
  // const [oldToastText, setOldToastText] = useState();
  const setToastText = (toastText) => {
    if (toastText) {
      oldToastText.current = updateSameText(toastText, oldToastText.current);
    }
  };

  return [oldToastText.current, setToastText];
}

export default useToast;
