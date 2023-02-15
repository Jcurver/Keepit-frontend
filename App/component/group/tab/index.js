import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import AppText from '../../common/appText';
import AppTouchable from '../../common/appTouchable';
import { colors, toSize } from '../../../config/globalStyle';

const GroupTab = ({ info, tabData, reviewCount, dailyCount, memberCount }) => {
  return (
    <View style={styles.tabContainer}>
      {tabData.map((item, index) => {
        return (
          <AppTouchable
            key={`tab_${index}`}
            opacity={1}
            disabled={item.active}
            onPress={item.onPress}
            style={styles.tabButton}
          >
            {info ? (
              <>
                <AppText
                  color={item.active ? colors.black : colors.ColorA7A7A7}
                  style={{ marginTop: toSize(6) }}
                >
                  {item.title}
                </AppText>
                <AppText
                  color={item.active ? colors.black : colors.ColorA7A7A7}
                  style={{ marginBottom: toSize(6) }}
                  size={16}
                  weight={'bold'}
                >
                  {item.title === '멤버' ? memberCount : reviewCount}
                </AppText>
              </>
            ) : (
              <>
                <AppText
                  color={item.active ? colors.black : colors.ColorA7A7A7}
                  style={{ marginTop: toSize(6) }}
                  size={14}
                >
                  {item.title}
                </AppText>
                <AppText
                  color={item.active ? colors.black : colors.ColorA7A7A7}
                  weight={'bold'}
                  size={16}
                  style={{ marginBottom: toSize(6) }}
                >
                  {item.title === '리뷰' ? reviewCount : dailyCount}
                </AppText>
              </>
            )}

            {/* <View
                style={[
                  styles.tabIndicator,
                  item.active && styles.indicatorColor,
                ]}
              /> */}
            <View style={styles.grayline}>
              <View style={item.active && styles.blackline} />
            </View>
          </AppTouchable>
        );
      })}
    </View>
  );
};

export default GroupTab;
