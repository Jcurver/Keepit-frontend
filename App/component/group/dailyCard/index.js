import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {
  colors,
  globalStyle,
  images,
  toSize,
} from '../../../config/globalStyle';
import MyIcon from '../../../config/icon-font';
import writtenDate from '../../../function/writtenDate';
import AppImage from '../../common/appImage';
import AppText from '../../common/appText';
import AppTouchable from '../../common/appTouchable';
import { image_small } from '../../../constants/imageSize';
import Config from 'react-native-config';
import RootNavigation from '../../../RootNavigation';
import { useFocusEffect } from '@react-navigation/native';
import Skeleton from '../../common/skeleton';

const GroupDailyCard = ({
  data,
  fromHome,
  groupId,
  fromUser,
  isDelete,
  fromDetail,
  fromMap,
}) => {
  const [commentCount, setCommentCount] = useState();
  const [commentCountShow, setCommentCountShow] = useState(0);
  const isData = data !== undefined;

  useEffect(() => {
    setCommentCount(data?.commentCount);
  }, [data?.commentCount]);

  useFocusEffect(
    useCallback(() => {
      setCommentCountShow(commentCount);
    }, [commentCount]),
  );

  return (
    <AppTouchable
      style={[
        styles.container,
        !isData && { height: toSize(88), alignItems: 'center' },
      ]}
      onPress={() => {
        if (isData) {
          if (fromDetail || fromMap) {
            RootNavigation.push('DailyDetailScreen', {
              ids: {
                groupId,
                dailyId: data.dailyId,
                setCommentCount,
                fromHome,
                fromUser,
                isDelete,
              },
              isImage: data?.image ? true : false,
            });
          } else {
            RootNavigation.navigate('DailyDetailScreen', {
              ids: {
                groupId,
                dailyId: data.dailyId,
                setCommentCount,
                fromHome,
                fromUser,
                isDelete,
              },
              isImage: data?.image ? true : false,
            });
          }
        }
      }}
    >
      {data?.image ? (
        <AppImage
          source={{
            uri: `${Config.IMAGE_SERVER_URI}/${data?.image}${image_small}`,
          }}
          style={styles.profile}
          size={toSize(17)}
        />
      ) : (
        !isData && (
          <Skeleton width={72} height={72} style={{ borderRadius: 4 }} />
        )
      )}
      <View style={styles.infoContainer}>
        <AppText
          size={16}
          style={styles.title}
          numberOfLines={data?.image ? 3 : 2}
          isData={isData}
          viewStyle={{ paddingVertical: toSize(3) }}
          sWidth={259}
          sHeight={24}
        >
          {data?.title}
        </AppText>

        <AppText
          style={styles.date}
          size={12}
          color={colors.Color6B6A6A}
          isData={isData}
          viewStyle={{ paddingVertical: toSize(3) }}
          sWidth={138}
          sHeight={16}
        >
          {data?.name + '  ' + writtenDate(data?.createDt)}
        </AppText>
        <View style={globalStyle.flexRowCenter}>
          {isData && (
            <MyIcon
              style={styles.comment}
              size={toSize(12)}
              name={'ic_message'}
              color={colors.ColorC1C1C1}
            />
          )}
          <AppText
            size={12}
            color={colors.Color6B6A6A}
            isData={isData}
            viewStyle={{ paddingVertical: toSize(3) }}
            sWidth={84}
            sHeight={16}
          >
            {commentCountShow}
          </AppText>
        </View>
      </View>
    </AppTouchable>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    // height: toSize(88),
    paddingVertical: toSize(8),
    marginHorizontal: toSize(16),
    borderBottomWidth: 1,
    borderColor: colors.ColorF4F4F4,
    // alignItems: 'center',
  },
  profile: {
    width: toSize(68),
    height: toSize(72),
    borderRadius: 4,
    margin: toSize(8),
    marginLeft: toSize(0),
  },
  emptyProfile: {
    width: toSize(68),
    height: toSize(72),
    borderRadius: 4,
    backgroundColor: colors.ColorE5E5E5,
    margin: toSize(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    // maxHeight: toSize(36),
  },
  date: {
    marginVertical: toSize(4),
  },
  comment: {
    marginRight: toSize(4),
  },
  infoContainer: {
    flex: 1,
    alignSelf: 'center',
  },
});

export default GroupDailyCard;
