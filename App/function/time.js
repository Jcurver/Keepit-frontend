import BackgroundTimer from 'react-native-background-timer';

/**
 * 백그라운드 타이머
 * @param {*} setTimer  0 ~ 300초
 */
export const startTimer = (setTimer) => {
  BackgroundTimer.runBackgroundTimer(() => {
    setTimer((secs) => {
      return secs + 1;
    });
  }, 1000);
};
