import React, { memo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import AppText from '../appText';
import AppTouchable from '../appTouchable';
import { colors } from '../../../config/globalStyle';

const AppHeader = ({
  iconStyle,
  leftIcon,
  leftIconPress,
  title,
  titleType = 'center',
  rightIcon,
  rightIconPress,
  rightText,
  rightSecondIcon,
  rightSecondIconPress,
  rightSecondText,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {leftIcon && (
        <AppTouchable
          style={[styles.icon, styles.leftIcon, iconStyle]}
          opacity={1}
          onPress={leftIconPress}
          disabled={!leftIconPress}
        >
          {leftIcon}
        </AppTouchable>
      )}

      {title && (
        <View style={styles.title}>
          <AppText
            size={20}
            // weight={titleType === 'center' ? 'bold' : 'medium'}
            color={colors.black}
            style={[
              titleType === 'center' ? styles.titleCenter : styles.titleLeft,
            ]}
            numberOfLines={1}
            ellipsizeMode={'tail'}
          >
            {title}
          </AppText>
        </View>
      )}
      {(rightSecondIcon || rightSecondText) && (
        <AppTouchable
          style={[styles.icon, styles.rightSecondIcon]}
          opacity={1}
          onPress={rightSecondIconPress}
          disabled={!rightSecondIconPress}
        >
          {rightSecondIcon ? (
            rightSecondIcon
          ) : (
            <AppText letterSpacing={0}>{rightSecondText}</AppText>
          )}
        </AppTouchable>
      )}

      {(rightIcon || rightText) && (
        <AppTouchable
          style={[styles.icon, styles.rightIcon]}
          opacity={1}
          onPress={rightIconPress}
          disabled={!rightIconPress}
        >
          {rightIcon ? (
            rightIcon
          ) : (
            <AppText letterSpacing={0}>{rightText}</AppText>
          )}
        </AppTouchable>
      )}
    </View>
  );
};

export default AppHeader;
