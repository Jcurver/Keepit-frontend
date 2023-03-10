import React, { useCallback, useEffect, useState } from 'react';
import { Linking, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Svg from '../../../asset/svg';
import { colors, toSize } from '../../../config/globalStyle';
import { setTerms } from '../../../store/feature/userSlice';
import AppText from '../../common/appText';
import AppTouchable from '../../common/appTouchable';
import TermCheck from '../termCheck';
import { styles } from './styles';

const TermView = ({ onPress, onPressClose }) => {
  const [totalEnabled, setTotalEnabled] = useState(false);
  const [service, setService] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [location, setLocation] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const dispatch = useDispatch();

  const totalTermPress = () => {
    setTotalEnabled(!totalEnabled);
    if (totalEnabled) {
      setService(false);
      setPrivacy(false);
      setLocation(false);
      setMarketing(false);
    } else {
      setService(true);
      setPrivacy(true);
      setLocation(true);
      setMarketing(true);
    }
  };

  const serviceTermPress = () => {
    setService(!service);
    if (service && privacy && location && marketing) {
      setTotalEnabled(false);
    }
    if (!service && privacy && location && marketing) {
      setTotalEnabled(true);
    }
  };

  const privacyTermPress = () => {
    setPrivacy(!privacy);
    if (service && privacy && location && marketing) {
      setTotalEnabled(false);
    }
    if (service && !privacy && location && marketing) {
      setTotalEnabled(true);
    }
  };

  const locationTermPress = () => {
    setLocation(!location);
    if (service && privacy && location && marketing) {
      setTotalEnabled(false);
    }
    if (service && privacy && !location && marketing) {
      setTotalEnabled(true);
    }
  };

  const marketingTermPress = () => {
    setMarketing(!marketing);
    if (service && privacy && location && setMarketing) {
      setTotalEnabled(false);
    }
    if (service && privacy && location && !marketing) {
      setTotalEnabled(true);
    }
  };

  const handleReadService = useCallback(() => {
    Linking.openURL(
      'https://geode-grapple-e1f.notion.site/Keep-it-f6b10aa0850346b1a5f0ddeaf7ebcb0a',
    );
  }, []);

  const handleReadPrivacy = useCallback(() => {
    Linking.openURL(
      'https://geode-grapple-e1f.notion.site/Keep-it-4251210c2d9f49e890b10a651e85fedd',
    );
  }, []);

  const handleReadMarketing = useCallback(() => {
    Linking.openURL(
      'https://geode-grapple-e1f.notion.site/73025a3d2f094160bad39c4c5e243471',
    );
  }, []);

  const handleReadLocation = useCallback(() => {
    Linking.openURL(
      'https://geode-grapple-e1f.notion.site/Keep-it-4ff1c31306a941dab1d0e0f117bca26b',
    );
  }, []);

  return (
    <View style={styles.container}>
      <AppTouchable style={styles.close} onPress={onPressClose}>
        {Svg('close_thin')}
      </AppTouchable>

      <AppText size={24} weight={'bold'} style={styles.title}>
        ????????? ??????????????? ??????
      </AppText>

      <TermCheck
        total
        essential
        title={'????????? ?????? ???????????????.'}
        value={totalEnabled}
        onValueChange={totalTermPress}
      />

      <View style={styles.seperator} />

      <TermCheck
        essential
        title={'??????????????? ?????? ?????????. (??????)'}
        value={service}
        onValueChange={serviceTermPress}
        linking={handleReadService}
      />

      <TermCheck
        essential
        value={privacy}
        title={'???????????? ??????????????? ???????????????. (??????)'}
        onValueChange={privacyTermPress}
        linking={handleReadPrivacy}
      />

      <TermCheck
        essential
        value={location}
        title={'???????????? ????????? ????????? ???????????????. (??????)'}
        onValueChange={locationTermPress}
        linking={handleReadLocation}
      />

      <TermCheck
        value={marketing}
        title={'????????? ?????? ????????? ???????????????. (??????)'}
        onValueChange={marketingTermPress}
        linking={handleReadMarketing}
      />

      <AppTouchable
        button
        style={[
          styles.confirmButton,
          (totalEnabled || (service && privacy && location)) && {
            backgroundColor: colors.primary,
          },
        ]}
        disabled={!(totalEnabled || (service && privacy && location))}
        onPress={() => {
          dispatch(
            setTerms({
              terms: service,
              collect: privacy,
              gps: location,
              marketing: marketing,
            }),
          );
          onPress();
        }}
      >
        <AppText weight={'bold'} size={18} color={colors.white}>
          ??????
        </AppText>
      </AppTouchable>
    </View>
  );
};

export default TermView;
