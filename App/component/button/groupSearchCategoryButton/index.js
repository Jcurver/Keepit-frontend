import React from 'react';
import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';
import AppText from '../../common/appText';
import AppTouchable from '../../common/appTouchable';

const GroupSearchCategoryButton = ({
  style,
  title,
  onPress,
  active,
  light,
  disabled,
}) => {
  return (
    <AppTouchable
      style={[
        styles.container,
        active && !light && styles.active,
        style,
        active && light && styles.lightActive,
        disabled && !active && { backgroundColor: colors.ColorF4F4F4 },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <AppText
        weight={light ? null : active ? 'bold' : null}
        size={16}
        color={
          disabled
            ? active
              ? colors.primary
              : colors.ColorC4C4C4
            : light
            ? active
              ? colors.primary
              : colors.Color2D2F30
            : active
            ? colors.white
            : colors.Color6B6A6A
        }
      >
        {title}
      </AppText>
    </AppTouchable>
  );
};

export const styles = StyleSheet.create({
  container: {
    height: toSize(36),
    paddingHorizontal: toSize(18),
    marginRight: toSize(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.ColorF4F4F4,
    borderRadius: 999,
  },
  active: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  lightActive: {
    backgroundColor: colors.ColorF0FFF9,
    borderColor: colors.primary,
  },
});

export default GroupSearchCategoryButton;
