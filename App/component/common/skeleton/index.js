import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

const Skeleton = ({
  type = 'text',
  width = undefined,
  height = undefined,
  style,
  viewStyle,
  noStyle = false,
}) => {
  if (type === 'text') {
    return (
      <View
        style={[
          {
            paddingVertical: !noStyle && toSize(height) * 0.3,
            paddingRight: !noStyle && toSize(5),
          },
          viewStyle,
        ]}
      >
        <View
          style={[
            {
              width: toSize(width),
              height: toSize(height),
            },
            styles.Skeleton,
            style,
          ]}
        />
      </View>
    );
  } else if (type === 'imageDetail') {
    return (
      <View
        style={[
          {
            width: WINDOW_WIDTH - toSize(32),
            height: ((WINDOW_WIDTH - toSize(32)) / 343) * 229,
          },
          styles.Skeleton,
          style,
        ]}
      />
    );
  }
};

const styles = StyleSheet.create({
  Skeleton: {
    borderRadius: toSize(4),
    backgroundColor: colors.ColorF5F5F5,
  },
});

export default Skeleton;
