import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';
import AppText from '../../common/appText';
import AppTouchable from '../../common/appTouchable';

const AppModal = ({
  onRequestClose,
  animationType = 'fade',
  visible,
  title,
  content,
  icon,
  leftButtonText,
  rightButtonText,
  onPressLeft,
  onPressRight,
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
          {icon && icon}
          <AppText size={18} weight={'medium'} style={{ textAlign: 'center' }}>
            {title}
          </AppText>
          {content && (
            <AppText style={styles.content} color={colors.Color6B6A6A}>
              {content}
            </AppText>
          )}
          <View style={styles.buttonsView}>
            {leftButtonText && (
              <AppTouchable
                button
                style={styles.modalButtonLeft}
                onPress={onPressLeft}
              >
                <AppText size={16} weight={'bold'} color={colors.primary}>
                  {leftButtonText}
                </AppText>
              </AppTouchable>
            )}
            <AppTouchable
              button
              style={[
                styles.modalButton,
                !leftButtonText && { width: toSize(280) },
              ]}
              onPress={onPressRight}
            >
              <AppText size={16} weight={'bold'} color={colors.white}>
                {rightButtonText}
              </AppText>
            </AppTouchable>
          </View>
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
    width: toSize(312),
    borderRadius: 14,
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: toSize(24),
    paddingBottom: toSize(16),
  },
  content: {
    textAlign: 'center',
    marginTop: toSize(16),
  },
  modalButton: {
    width: toSize(140),
    height: toSize(48),
    backgroundColor: colors.primary,
    // marginHorizontal: toSize(34),/
  },
  modalButtonLeft: {
    backgroundColor: colors.white,
    width: toSize(140),
    height: toSize(48),
  },
  buttonsView: {
    paddingTop: toSize(24),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
