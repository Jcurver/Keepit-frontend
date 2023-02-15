import React from 'react';
import AppText from '../component/common/appText';
import { colors } from '../config/globalStyle';

const includeWordToGreen = (placeInput, placeResult) => {
  const inputWordArr = placeInput.split(' ');
  const placeResultArr = placeResult.split('');
  let includesArr = [];
  for (const inputWord of inputWordArr) {
    const ILen = inputWord.length;
    const RLen = placeResult.length;

    for (let i = 0; i < RLen - ILen + 1; i++) {
      let pointer = i;
      let pointerArr = [];
      let testWordArr = [];
      while (testWordArr.length !== ILen) {
        pointerArr.push(pointer);
        if (placeResultArr[pointer] !== ' ') {
          testWordArr.push(placeResultArr[pointer]);
        }
        pointer++;
      }
      if (
        testWordArr.join('').length === inputWord.length &&
        testWordArr.join('') === inputWord
      ) {
        includesArr = [...includesArr, ...pointerArr];
        i += pointerArr.length - 1;
      }
    }
  }

  return (
    <>
      {placeResultArr.map((text, index) => (
        <AppText
          key={index}
          size={16}
          color={
            includesArr.includes(index)
              ? colors.Color04BF7B
              : colors.Color191919
          }
        >
          {text}
        </AppText>
      ))}
    </>
  );
};

export default includeWordToGreen;
