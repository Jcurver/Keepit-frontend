import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../store';

const key = 'searchPlace';
const MID = store?.getState()?.user?.authInfo?.MID;

const storeSearchPlace = async (data) => {
  try {
    let searchPlaceObject = await AsyncStorage.getItem(key);
    let searchPlaceParsed = JSON.parse(searchPlaceObject);
    if (!searchPlaceParsed) {
      searchPlaceParsed = {};
    }
    let searchPlaces = [];
    if (MID in searchPlaceParsed) {
      searchPlaces = searchPlaceParsed[MID];
    }
    for (let i = 0; i < searchPlaces.length; i++) {
      if (
        searchPlaces[i].placeName === data.placeName &&
        searchPlaces[i].type === data.type
      ) {
        searchPlaces = [
          ...searchPlaces.slice(0, i),
          ...searchPlaces.slice(i + 1),
        ];
      }
    }

    const newSearchPlaces = [data, ...searchPlaces].slice(0, 20);
    await AsyncStorage.setItem(
      key,
      JSON.stringify(
        Object.assign(searchPlaceParsed, { [MID]: newSearchPlaces }),
      ),
    );
  } catch (error) {
    console.log('error storeReviews', error);
  }
};

const getSearchPlace = async () => {
  try {
    let searchPlaceObject = await AsyncStorage.getItem(key);
    let searchPlaceParsed = JSON.parse(searchPlaceObject);
    if (!searchPlaceParsed) {
      searchPlaceParsed = {};
    }
    let searchPlaces = [];
    if (MID in searchPlaceParsed) {
      searchPlaces = searchPlaceParsed[MID];
    }

    return searchPlaces;
  } catch (error) {
    console.log('error getReviews ', error);
  }
};

const popAndResetSearchPlace = async (id) => {
  try {
    let searchPlaceObject = await AsyncStorage.getItem(key);
    let searchPlaceParsed = JSON.parse(searchPlaceObject);
    const searchPlaces = searchPlaceParsed[MID];
    const index = searchPlaces.findIndex(({ placeId }) => placeId === id);

    if (searchPlaces.length <= index) {
      throw `searchPlaces Array length is less than ${index + 1}`;
    }
    const newSearchPlaces = [
      ...searchPlaces.slice(0, index),
      ...searchPlaces.slice(index + 1),
    ];
    await AsyncStorage.setItem(
      key,
      JSON.stringify(
        Object.assign(searchPlaceParsed, { [MID]: newSearchPlaces }),
      ),
    );
    return await getSearchPlace();
  } catch (error) {
    console.log('error removeReview ', error);
  }
};

const storeClearSearchPlace = async () => {
  let searchPlaceObject = await AsyncStorage.getItem(key);
  let searchPlaceParsed = JSON.parse(searchPlaceObject);
  await AsyncStorage.setItem(
    key,
    JSON.stringify(Object.assign(searchPlaceParsed, { [MID]: [] })),
  );
};

export {
  storeSearchPlace,
  getSearchPlace,
  popAndResetSearchPlace,
  storeClearSearchPlace,
};
