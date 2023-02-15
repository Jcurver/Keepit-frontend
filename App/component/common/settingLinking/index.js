import { Alert } from 'react-native';
import { openSettings } from 'react-native-permissions';
import { memo } from 'react';

const SettingLinking = ({ title }) => {
  Alert.alert(
    '알림',
    `${title} 접근 권한이 꺼져 있습니다.\n설정페이지로 이동하시겠습니까?`,
    [
      {
        text: '취소',
        onPress: () => console.log('cancel'),
        style: 'cancel',
      },
      {
        text: '네',
        onPress: () => {
          openSettings().catch(() => console.log('cannot open settings'));
        },
        style: 'default',
      },
    ],
    {
      cancelable: false,
    },
  );
};

export default memo(SettingLinking);
