import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { colors, images, toSize } from '../../../config/globalStyle';
import MyIcon from '../../../config/icon-font';
import { deleteSearchWordList } from '../../../store/feature/groupSlice';
import AppText from '../../common/appText';
import AppTouchable from '../../common/appTouchable';

const GroupRecentSearchWord = ({ data, onClickSearch, sub }) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <AppTouchable onPress={onClickSearch} style={styles.word}>
        <AppText>{data}</AppText>
      </AppTouchable>
      <AppTouchable
        onPress={() => {
          dispatch(deleteSearchWordList([data, sub]));
        }}
      >
        <MyIcon
          name={'ic_close'}
          size={toSize(10)}
          color={colors.ColorE5E5E5}
        />
      </AppTouchable>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    height: toSize(48),
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: toSize(16),
    borderBottomWidth: 1,
    borderColor: colors.ColorF4F4F4,
  },
  word: {
    flex: 1,
  },
});

export default GroupRecentSearchWord;
