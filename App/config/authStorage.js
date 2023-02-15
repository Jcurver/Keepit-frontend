import AsyncStorage from '@react-native-async-storage/async-storage';

const key = 'authInfo';

/**
 * @param {*} authInfo { accessToken, refreshToken}
 */
const storeUser = async (authInfo) => {
  const newAuthInfo = Object.assign({}, authInfo);

  try {
    await AsyncStorage.setItem(key, JSON.stringify(newAuthInfo));
  } catch (error) {
    console.log('error storing user session', error);
  }
};

const retrieveUser = async () => {
  const authInfo = await AsyncStorage.getItem(key);
  const data = Object.assign({}, JSON.parse(authInfo));
  return data;
};

const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('error deleting the session', error);
  }
};

const getAccessToken = async () => {
  try {
    const authInfo = await AsyncStorage.getItem(key);
    if (authInfo) {
      return await JSON.parse(authInfo).accessToken;
    }
    return;
  } catch (error) {
    console.log('error deleting the session', error);
  }
};

export default { storeUser, retrieveUser, removeUser, getAccessToken };
