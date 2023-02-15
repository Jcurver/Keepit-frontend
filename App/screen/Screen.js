import React, { useRef } from 'react';
import { StatusBar, StyleSheet, View, SafeAreaView } from 'react-native';
// import SafeAreaView from 'react-native-safe-area-context';
import Toast from '../component/toast';

const Screen = ({
  type = 'safe',
  bgColor = 'white',
  children,
  toastMargin,
  bottomSafeAreaColor = 'none',
  topSafeAreaColor = 'none',
  topSafeArea = true,
  bottomSafeArea = true,
  toastText = undefined,
  style,
}) => {
  const Container = type === 'safe' ? SafeAreaView : View;
  const toastRef = useRef(null);
  return (
    <>
      {topSafeArea && (
        <SafeAreaView style={{ backgroundColor: topSafeAreaColor }} />
      )}
      <Container style={[styles.container, style]}>
        <StatusBar barStyle="dark-content" backgroundColor={bgColor} />
        <View style={dstyles(bgColor).ScreenView}>{children}</View>
        <Toast ref={toastRef} toastText={toastText} toastMargin={toastMargin} />
      </Container>
      {bottomSafeArea && bottomSafeAreaColor !== 'none' ? (
        <SafeAreaView style={{ backgroundColor: bottomSafeAreaColor }} />
      ) : (
        <></>
      )}
    </>
  );
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const dstyles = (bgColor) =>
  StyleSheet.create({
    ScreenView: {
      flex: 1,
      backgroundColor: bgColor,
    },
  });
