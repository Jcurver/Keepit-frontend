import React, { useCallback, useEffect } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';
import AppText from '../../common/appText';
import AppTouchable from '../../common/appTouchable';
import { PickerIOS } from '@react-native-picker/picker';
import { useState } from 'react';
import { parseInt } from 'lodash';
import { useFocusEffect } from '@react-navigation/native';

const GroupPickerModal = ({
  onRequestClose,
  animationType = 'fade',
  visible,
  selectedPeople,
  setVisible,
  setSelectedPeople,
  inMembers = null,
}) => {
  const [selected, setSelected] = useState();
  const [modifiedList, setModifiedList] = useState([]);

  var list = [
    '10',
    '20',
    '30',
    '40',
    '50',
    '60',
    '70',
    '80',
    '90',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    '1000',
    '1100',
    '1200',
    '1300',
    '1400',
    '1500',
  ];

  useFocusEffect(
    useCallback(() => {
      setSelected(selectedPeople.toString());
    }, [selectedPeople]),
  );

  useEffect(() => {
    setSelected(selectedPeople.toString());
    if (inMembers) {
      var check = false;
      list.forEach((e, i) => {
        if (parseInt(e) >= inMembers && !check) {
          setModifiedList(list.slice(i, 24));
          check = true;
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <AppText
              style={{
                marginTop: toSize(24),
                marginBottom: toSize(16),
                alignSelf: 'center',
              }}
              weight={'medium'}
              size={18}
            >
              최대 인원 수
            </AppText>
            <PickerIOS
              itemStyle={styles.itemStyle}
              selectedValue={selected}
              onValueChange={(itemValue, itemIndex) => {
                setSelected(itemValue);
              }}
            >
              {(inMembers ? modifiedList : list).map((item, index) => {
                return (
                  <PickerIOS.Item
                    key={`picker${index}`}
                    label={item}
                    value={item}
                  />
                );
              })}
            </PickerIOS>
          </View>
          <View style={styles.modalView}>
            <AppTouchable
              style={[styles.modalButton, { backgroundColor: colors.white }]}
              onPress={() => setVisible(false)}
            >
              <AppText weight={'bold'} size={16} color={colors.primary}>
                취소
              </AppText>
            </AppTouchable>
            <AppTouchable
              style={styles.modalButton}
              onPress={() => {
                setSelectedPeople(selected);
                setVisible(false);
              }}
            >
              <AppText weight={'bold'} size={16} color={colors.white}>
                적용하기
              </AppText>
            </AppTouchable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GroupPickerModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black60,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.white,
    height: toSize(301),
    width: toSize(312),
    borderRadius: 8,
  },
  content: {
    // height: toSize(146),
  },
  modalView: {
    flexDirection: 'row',
    marginHorizontal: toSize(16),
    justifyContent: 'space-between',
    marginTop: toSize(13),
  },
  modalButton: {
    width: toSize(140),
    height: toSize(48),
    marginTop: toSize(11),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  itemStyle: {
    alignSelf: 'center',
    fontSize: toSize(16),
    height: toSize(146),
    width: toSize(304),
  },
});
