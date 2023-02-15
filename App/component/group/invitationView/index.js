import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { colors, globalStyle, toSize } from '../../../config/globalStyle';
import AppText from '../../common/appText';
import { styles } from './styles';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import AppTouchable from '../../common/appTouchable';

const InvitationView = ({
  value,
  onChangeText,
  onPress,
  focus,
  warningMessage,
}) => {
  const [type, setType] = useState('아이디로 초대');
  const ref = useRef(null);

  const tabData = [
    {
      title: '아이디로 초대',
      onPress: () => setType('아이디로 초대'),
      active: type === '아이디로 초대',
    },
    {
      title: '연락처로 초대',
      onPress: () => setType('연락처로 초대'),
      active: type === '연락처로 초대',
    },
  ];

  //   useEffect(() => {
  //     if (focus) {
  //       ref.current.focus();
  //     }
  //   }, [focus]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <AppText size={18} weight={'bold'} style={{ alignSelf: 'center' }}>
          멤버 초대
        </AppText>
        <View style={styles.tabSection}>
          {tabData.map((item, index) => {
            return (
              <AppTouchable
                key={`tabinvite_${index}`}
                opacity={1}
                disabled={item.active}
                onPress={item.onPress}
                style={styles.tabButton}
              >
                <AppText size={16}>{item.title}</AppText>
                <View
                  style={[
                    styles.tabIndicator,
                    item.active && styles.indicatorColor,
                  ]}
                />
              </AppTouchable>
            );
          })}
        </View>
        {/* <View
          style={[
            globalStyle.textInputContainer,
            { marginTop: toSize(16) },
            { marginBottom: toSize(4) },
            warningMessage && { borderColor: colors.ColorEC0000 },
          ]}
        >
          <BottomSheetTextInput
            ref={ref}
            value={value}
            placeholder={'6자리 입력'}
            placeholderTextColor={colors.ColorC4C4C4}
            onChangeText={onChangeText}
            style={styles.textInput}
            maxLength={6}
            keyboardType={'number-pad'}
            autoCorrect={false}
            autoCapitalize={'none'}
          />
        </View> */}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InvitationView;
