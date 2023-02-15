import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../store';
import jwt_decode from 'jwt-decode';

const key = 'review';
const MID = store?.getState()?.user?.authInfo?.MID;

const storeReviews = async (data) => {
  try {
    let reviewObject = await AsyncStorage.getItem(key);
    let reviewParsed = JSON.parse(reviewObject);
    if (!reviewParsed) {
      reviewParsed = {};
    }
    let reviews = [];
    if (MID in reviewParsed) {
      reviews = reviewParsed[MID];
    }

    const newReviews = [data, ...reviews].slice(0, 10);
    await AsyncStorage.setItem(
      key,
      JSON.stringify(Object.assign(reviewParsed, { [MID]: newReviews })),
    );
  } catch (error) {
    console.log('error storeReviews', error);
  }
};
const getReviews = async () => {
  try {
    let reviewObject = await AsyncStorage.getItem(key);
    let reviewParsed = JSON.parse(reviewObject);
    if (!reviewParsed) {
      reviewParsed = {};
    }
    let reviews = [];
    if (MID in reviewParsed) {
      reviews = reviewParsed[MID];
    }

    return reviews;
  } catch (error) {
    console.log('error getReviews ', error);
  }
};

const popReview = async (index) => {
  try {
    let reviewObject = await AsyncStorage.getItem(key);
    let reviewParsed = JSON.parse(reviewObject);
    const reviews = reviewParsed[MID];
    if (reviews.length <= index) {
      throw `reviews Array length is less than ${index + 1}`;
    }
    const newReviews = [
      ...reviews.slice(0, index),
      ...reviews.slice(index + 1),
    ];
    await AsyncStorage.setItem(
      key,
      JSON.stringify(Object.assign(reviewParsed, { [MID]: newReviews })),
    );
    return reviews[index];
  } catch (error) {
    console.log('error removeReview ', error);
  }
};

export { storeReviews, getReviews, popReview };
