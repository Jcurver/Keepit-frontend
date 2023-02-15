import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';
import AppText from '../../common/appText';
import AppTouchable from '../../common/appTouchable';

const AppModal = ({
  onRequestClose,
  animationType = 'fade',
  visible,
  content,
  buttonText,
  onPress,
}) => {
  return (
    <Modal
      transparent
      animationType={animationType}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <View style={styles.content}>
            <AppText size={16}>{content}</AppText>
          </View>

          <AppTouchable button style={styles.modalButton} onPress={onPress}>
            <AppText size={16} weight={'bold'} color={colors.white}>
              {buttonText}
            </AppText>
          </AppTouchable>
        </View>
      </View>
    </Modal>
  );
};

export default AppModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black60,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.white,
    height: toSize(195),
    width: toSize(288),
    borderRadius: 6,
  },
  content: {
    width: toSize(240),
    height: toSize(116),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButton: {
    backgroundColor: colors.primary,
    marginHorizontal: toSize(34),
  },
});
