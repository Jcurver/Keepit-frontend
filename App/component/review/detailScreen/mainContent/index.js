import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Modal } from 'react-native';
import AppText from '../../../common/appText';
import Config from 'react-native-config';
import { styles } from './style';
import MyIcon from '../../../../config/icon-font';
import { colors, toSize } from '../../../../config/globalStyle';
import AppTouchable from '../../../common/appTouchable';
import writtenDate from '../../../../function/writtenDate';
import Carousel from 'react-native-snap-carousel';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import AppImage from '../../../common/appImage';
import RootNavigation from '../../../../RootNavigation';
import Svg from '../../../../asset/svg';
import { image_small } from '../../../../constants/imageSize';
import Skeleton from '../../../common/skeleton';
import Comment from '../Comment';

const MainContent = ({
  groupId,
  reviewsDetail = undefined,
  images,
  modalImages,
  keepCountChange,
  isImage,
}) => {
  console.log('reviewsDetail:: ', reviewsDetail);
  const isData = reviewsDetail !== undefined;
  const [imageIndex, setImageIndex] = useState(0);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const mapNavParams = {
    groupId,
    targetPlaceId: reviewsDetail?.placeId,
  };
  console.log('images:: ', images);
  console.log('modalImages:: ', modalImages);
  if (!imageViewerVisible) {
    return (
      <>
        <View style={styles.paddingContent}>
          <AppTouchable
            style={styles.memberContainer}
            onPress={() => {
              RootNavigation.navigate('GroupUserScreen', {
                groupId,
                mid: reviewsDetail.memberMid,
                fromDetail: true,
              });
            }}
          >
            <AppImage
              style={styles.memberImage}
              source={
                reviewsDetail?.memberProfileUrl === '' ||
                reviewsDetail?.memberProfileUrl === undefined
                  ? require('asset/profile/avatar64.png')
                  : {
                      uri: `${Config.IMAGE_SERVER_URI}/${reviewsDetail?.memberProfileUrl}${image_small}`,
                    }
              }
            />

            <AppText size={12} isData={isData}>
              {reviewsDetail?.memberName}
            </AppText>
          </AppTouchable>
          {images?.length === 1 && images[0]?.url && (
            <AppTouchable
              opacity={1}
              onPress={() => setImageViewerVisible(true)}
            >
              <AppImage
                source={{
                  uri: images[0].url,
                }}
                style={styles.mainImage}
              />
            </AppTouchable>
          )}
          {isImage && !isData && <Skeleton type="imageDetail" />}
          {images?.length > 1 && (
            <View style={{ position: 'relative' }}>
              {images?.length > 1 && (
                <View style={styles.footerBackground}>
                  <AppText size={12} color="black" isData={isData}>
                    {imageIndex + 1}/{reviewsDetail?.reviewImagesUrl.length}
                  </AppText>
                </View>
              )}
              <Carousel
                data={images}
                layout="default"
                sliderWidth={WINDOW_WIDTH - 32}
                itemWidth={WINDOW_WIDTH - 32}
                firstItem={imageIndex}
                onSnapToItem={(index) => setImageIndex(index)}
                inactiveSlideOpacity={1}
                renderItem={({ item, index }) => {
                  return (
                    <AppTouchable
                      opacity={1}
                      onPress={() => setImageViewerVisible(true)}
                    >
                      <AppImage
                        source={{ uri: item.url }}
                        style={styles.mainImage}
                      />
                    </AppTouchable>
                  );
                }}
              />
            </View>
          )}
          <AppTouchable
            style={styles.title}
            onPress={() => {
              RootNavigation.navigate('ReviewMapScreen', mapNavParams);
            }}
          >
            {Svg('mapPin')}
            <AppText
              style={styles.titleText}
              numberOfLines={1}
              size={18}
              weight="bold"
              isData={isData}
            >
              {reviewsDetail?.placeName}
            </AppText>
          </AppTouchable>
          <AppTouchable
            style={[styles.title, { marginTop: 0 }]}
            onPress={() => {
              RootNavigation.navigate('ReviewMapScreen', mapNavParams);
            }}
          >
            <AppText color={colors.ColorC4C4C4} size={12} isData={isData}>
              {reviewsDetail?.placeAddress}
            </AppText>
          </AppTouchable>
          <View style={styles.dateCommentBookmark}>
            <AppText
              size={12}
              color={colors.Color6B6A6A}
              style={styles.marginRight8}
              isData={isData}
              sWidth={30}
            >
              {writtenDate(reviewsDetail?.reviewCreateDt)}
            </AppText>
            <MyIcon
              name="bookmark_on"
              color={colors.ColorC1C1C1}
              style={styles.marginRight4}
            />

            <AppText
              size={12}
              color={colors.ColorC1C1C1}
              isData={isData}
              sWidth={12}
            >
              {typeof reviewsDetail?.keepCount === 'number' &&
              typeof keepCountChange === 'number'
                ? reviewsDetail?.keepCount + keepCountChange
                : 0}
            </AppText>
          </View>
          <AppText style={styles.content} size={16} isData={isData}>
            {reviewsDetail?.reviewContent}
          </AppText>
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
            {reviewsDetail?.commentCount}
          </AppText>
        </View>
        {!isData && (
          <>
            <Comment isData={false} />
            <Comment isData={false} />
            <Comment isData={false} />
            <Comment isData={false} />
            <Comment isData={false} />
          </>
        )}
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
          {modalImages.length > 1 ? (
            <>
              <Carousel
                data={modalImages}
                sliderWidth={WINDOW_WIDTH}
                itemWidth={WINDOW_WIDTH}
                firstItem={imageIndex}
                onSnapToItem={(index) => setImageIndex(index)}
                renderItem={({ item }) => {
                  return (
                    <View style={styles.imageContainer}>
                      <AppImage
                        source={{ uri: item.url }}
                        resizeMode="contain"
                        style={{
                          width: WINDOW_WIDTH,
                          height: WINDOW_HEIGHT,
                        }}
                      />
                    </View>
                  );
                }}
              />
              <View style={styles.bottomIndicator}>
                <AppText
                  style={styles.footerText}
                  size={16}
                  color={colors.ColorC1C1C1}
                  isData={isData}
                >
                  {imageIndex + 1}/{reviewsDetail?.reviewImagesUrl.length}
                </AppText>
              </View>
            </>
          ) : (
            <View style={styles.imageContainer}>
              <AppImage
                source={{ uri: modalImages[0].url }}
                resizeMode="contain"
                style={{
                  width: WINDOW_WIDTH,
                  height: WINDOW_HEIGHT,
                }}
              />
            </View>
          )}
        </View>
      </Modal>
    );
  }
};

export default MainContent;
