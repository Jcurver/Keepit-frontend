const updateSameText = (text1, text2, multiline = false) => {
  if (text1 === text2) {
    if (text1 === undefined) {
      return undefined;
    }
    if (multiline) {
      return text1 + ' ';
    } else {
      return ' ' + text1 + ' ';
    }
  } else {
    return text1;
  }
};
export default updateSameText;
