import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {
  colors,
  globalStyle,
  images,
  toSize,
} from '../../../config/globalStyle';
import AppImage from '../../common/appImage';
import Svg from '../../../asset/svg';
import AppText from '../../common/appText';
import AppTouchable from '../../common/appTouchable';
import MyIcon from '../../../config/icon-font';
import { typeTranslation } from '../../../function/etc';
import RootNavigation from '../../../RootNavigation';
import AppModal from '../../common/appModal';

const ProfileGroupCard = ({ data, type, onPress }) => {
  const [groupDeleteVisible, setGroupDeleteVisible] = useState(false);

  return (
    <View style={styles.container}>
      <AppTouchable
        style={styles.infoContainer}
        onPress={() => {
          console.log(data);
          if (type !== '탈퇴그룹') {
            RootNavigation.navigate('GroupHomeScreen', {
              groupId: data.groupId,
            });
          }
        }}
      >
        <AppText style={styles.date} size={12} color={colors.Color6B6A6A}>
          {typeTranslation(data.category)}
        </AppText>
        <AppText size={16} style={styles.title} numberOfLines={2}>
          {data.groupName}
        </AppText>
      </AppTouchable>

      <AppTouchable
        style={[
          styles.btnContainer,
          {
            backgroundColor:
              type === '참여그룹'
                ? colors.ColorF0FFF9
                : type === '내 그룹'
                ? colors.ColorE5E5E5
                : colors.ColorF0FFF9,
          },
        ]}
        onPress={onPress}
      >
        <AppText
          size={14}
          weight={'medium'}
          color={
            type === '참여그룹'
              ? colors.primary
              : type === '내 그룹'
              ? colors.Color6B6A6A
              : colors.primary
          }
          style={styles.button}
        >
          {type === '참여그룹'
            ? '나가기'
            : type === '내 그룹'
            ? data.deleteDt
              ? '삭제예정'
              : '그룹삭제'
            : '글 지우기'}
        </AppText>
      </AppTouchable>

      <AppModal
        visible={groupDeleteVisible}
        title={'그룹 삭제 안내'}
        content={`이 그룹은 ${data.deleteDt}에 영구 삭제돼요.\n유지기간 동안은 작성글과 지도를 보는\n활동만 할 수 있어요.`}
        rightButtonText={'확인'}
        onPressRight={() => {
          setGroupDeleteVisible(false);
        }}
      />
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: toSize(12),
    // marginHorizontal: toSize(16),
    borderBottomWidth: 1,
    borderColor: colors.ColorE5E5E5,
    alignItems: 'center',
  },
  title: {
    maxHeight: toSize(50),
    lineHeight: toSize(24),
  },
  date: {
    marginVertical: toSize(4),
  },

  infoContainer: {
    flex: 1,
    marginRight: toSize(14),
  },
  btnContainer: {
    borderRadius: 6,
    backgroundColor: colors.ColorF0FFF9,
  },
  button: {
    marginVertical: toSize(8),
    marginHorizontal: toSize(12),
  },
});

export default ProfileGroupCard;
