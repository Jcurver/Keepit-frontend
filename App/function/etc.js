export const typeTranslation = (type) => {
  if (type === 'RESTAURANT') {
    return '맛집';
  } else if (type === 'HOBBY') {
    return '취미/레저';
  } else if (type === 'REGION') {
    return '지역';
  } else if (type === 'MEETING') {
    return '모임';
  }
};
