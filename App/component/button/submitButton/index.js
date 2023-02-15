import React from 'react';
import AppTouchable from '../../common/appTouchable';
import AppText from '../../common/appText';
import { StyleSheet, View } from 'react-native';
import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import { toSize, colors } from '../../../config/globalStyle';

const SubmitButton = ({
  canClick = true,
  children = null,
  onPress,
  fixBottom = true,
  style,
  ...rest
}) => {
  return (
    <AppTouchable
      style={[
        styles.submitButton,
        fixBottom ? styles.fixBottom : styles.marginBottom,
        style,
      ]}
      onPress={onPress && canClick ? onPress : undefined}
      {...rest}
    >
      <View
        style={[
          styles.submitView,
          canClick
            ? { backgroundColor: colors.primary }
            : { backgroundColor: colors.ColorC4C4C4 },
        ]}
      >
        <AppText weight="bold" size={18} color="white">
          {children && children}
        </AppText>
      </View>
    </AppTouchable>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({
  submitButton: {
    width: '100%',
    backgroundColor: 'white',
  },
  fixBottom: {
    position: 'absolute',
    bottom: toSize(0),
  },
  marginBottom: {
    marginBottom: toSize(8),
  },
  submitView: {
    marginHorizontal: toSize(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: toSize(6),
    height: toSize(48),
    width: WINDOW_WIDTH - toSize(32),
  },
});
