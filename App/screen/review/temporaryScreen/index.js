import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import AppText from '../../../component/common/appText';
import Screen from '../../Screen';
import AppHeader from '../../../component/common/appHeader';
import { colors, toSize } from '../../../config/globalStyle';
import RootNavigation from '../../../RootNavigation';
import { getReviews, popReview } from '../../../config/reviewStorage';
import { styles } from './style';
import AppTouchable from '../../../component/common/appTouchable';
import Svg from '../../../asset/svg';

const ReviewTemporaryScreen = ({ route: { params } }) => {
  const [reviews, setReviews] = useState([]);
  console.log('reviews:: ', reviews);

  useEffect(() => {
    const getUserReviews = async () => {
      const userReviews = await getReviews();
      const parsedUserReviews = userReviews.map((review) => {
        if (review?.selectedPlace) {
          return {
            ...review,
            selectedPlace: JSON.parse(review.selectedPlace),
          };
        } else {
          return review;
        }
      });

      setReviews(parsedUserReviews);
    };
    getUserReviews();
  }, []);

  return (
    <Screen>
      <AppHeader
        title={`임시저장 ${reviews.length}`}
        leftIcon={Svg('close_thin')}
        iconStyle={{ left: toSize(6) }}
        leftIconPress={() => RootNavigation.goBack()}
        titleType="center"
        rightIcon={<></>}
        style={styles.header}
      />
      <ScrollView style={styles.scrollView}>
        {reviews.map((review, index) => {
          return (
            <>
              <AppTouchable
                key={index}
                style={styles.reviewBox}
                onPress={async () => {
                  const targetReview = await popReview(index);
                  delete targetReview?.reviewId;
                  // delete targetReview?.groupId;
                  console.log('targetReview:: ', targetReview);
                  RootNavigation.navigate(
                    'ReviewPostScreen',
                    Object.assign(targetReview, {
                      nowPage: 'review_post',
                      fromScreen: 'ReviewTemporaryScreen',
                    }),
                  );
                }}
              >
                <AppText size={16} style={styles.reviewPlace}>
                  {review.selectedPlace
                    ? review.selectedPlace.placeName
                    : '장소 없음'}
                </AppText>
                <AppText color={colors.ColorA7A7A7}>{review.date}</AppText>
              </AppTouchable>
              <View style={styles.grayline} />
            </>
          );
        })}
      </ScrollView>
    </Screen>
  );
};

export default ReviewTemporaryScreen;
