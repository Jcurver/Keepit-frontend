import React, { useState, memo, useEffect, useMemo } from 'react';
import { View, Image, Modal } from 'react-native';
import AppText from '../../../common/appText';
import Config from 'react-native-config';
import { styles } from './style';
import MyIcon from '../../../../config/icon-font';
import { colors, toSize } from '../../../../config/globalStyle';
import ImageViewer from 'react-native-image-zoom-viewer';
import AppTouchable from '../../../common/appTouchable';
import writtenDate from '../../../../function/writtenDate';
import Carousel from 'react-native-snap-carousel';
import ImageZoom from 'react-native-image-pan-zoom';

import { WINDOW_HEIGHT, WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import AppImage from '../../../common/appImage';
import {
  image_medium,
  image_original,
  image_small,
} from '../../../../constants/imageSize';
import Skeleton from '../../../common/skeleton';
import RootNavigation from '../../../../RootNavigation';

const MainContent = ({
  groupId,
  dailyDetail = undefined,
  commentLength,
  isImage,
}) => {
  console.log('dailyDetail:: ', dailyDetail);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const isData = dailyDetail !== undefined;
  if (!imageViewerVisible) {
    return (
      <>
        <View style={styles.paddingContent}>
          <View style={styles.title}>
            <AppText
              style={styles.titleText}
              size={18}
              weight={'medium'}
              isData={isData}
            >
              {dailyDetail?.title}
            </AppText>
          </View>
          <AppTouchable
            style={styles.memberContainer}
            onPress={() => {
              RootNavigation.navigate('GroupUserScreen', {
                groupId,
                mid: dailyDetail.mid,
                isRefresh: true,
              });
            }}
          >
            {/* <AppImage
            style={styles.memberImage}
            noImage={dailyDetail?.memberProfileUrl === ''}
            type={'profile'}
            source={{
              uri: `${Config.SERVER_URI}/files/profile/small${dailyDetail?.memberProfileUrl}`,
            }}
          /> */}
            {isImage && !isData && <Skeleton type="imageDetail" />}
            <AppImage
              style={styles.memberImage}
              source={
                dailyDetail?.memberProfileUrl === '' ||
                dailyDetail?.memberProfileUrl === undefined
                  ? require('asset/profile/avatar64.png')
                  : {
                      uri: `${Config.IMAGE_SERVER_URI}/${dailyDetail?.memberProfileUrl}${image_small}`,
                    }
              }
            />
            <AppText color={colors.Color6B6A6A} size={12} isData={isData}>
              {dailyDetail?.memberName}
            </AppText>
          </AppTouchable>
          <AppText
            color={colors.Color6B6A6A}
            size={12}
            isData={isData}
            sWidth={30}
          >
            {writtenDate(dailyDetail?.createDt)}
          </AppText>
        </View>
        <View style={styles.grayLine} />
        <View style={styles.padding16}>
          <AppText
            style={styles.content}
            color={colors.Color2D2F30}
            size={16}
            isData={isData}
          >
            {dailyDetail?.content}
          </AppText>

          {dailyDetail?.imageUrl ? (
            <>
              <AppTouchable onPress={() => setImageViewerVisible(true)}>
                <AppImage
                  style={styles.mainImage}
                  source={{
                    uri: `${Config.IMAGE_SERVER_URI}/${dailyDetail?.imageUrl}${image_medium}`,
                  }}
                />
              </AppTouchable>
            </>
          ) : null}
        </View>
        <View style={styles.commentLengthView}>
          <AppText size={14} color={colors.Color191919}>
            댓글
          </AppText>
          <AppText
            size={14}
            weight="medium"
            color={colors.Color191919}
            style={{ marginLeft: toSize(8) }}
          >
            {commentLength ? commentLength : 0}
          </AppText>
        </View>
      </>
    );
  } else {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        style={styles.modalRelative}
      >
        <AppTouchable
          onPress={() => setImageViewerVisible(false)}
          style={styles.modalClose}
        >
          <MyIcon name="ic_close" size={toSize(14)} color={'white'} />
        </AppTouchable>
        <View style={styles.modalContainer}>
          {/* <ImageZoom
            cropWidth={WINDOW_WIDTH}
            cropHeight={WINDOW_HEIGHT}
            imageWidth={WINDOW_WIDTH}
            imageHeight={WINDOW_HEIGHT}
            maxScale={2}
          > */}
          <AppImage
            source={{
              uri: `${Config.IMAGE_SERVER_URI}/${dailyDetail?.imageUrl}${image_original}`,
            }}
            resizeMode="contain"
            style={{
              width: WINDOW_WIDTH,
              height: WINDOW_HEIGHT,
            }}
          />
          {/* </ImageZoom> */}
        </View>
      </Modal>
    );
  }
};

export default MainContent;
