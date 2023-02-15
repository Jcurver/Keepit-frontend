import { LogBox } from 'react-native';

const ignoreWarns = [
  'ViewPropTypes will be removed from React Native',
  "exported from 'deprecated-react-native-prop-types'.",
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
  'Non-serializable values were found in the navigation state',
  'Cannot update during an existing state transition',
];

const warn = console.warn;
console.warn = (...arg) => {
  for (const warning of ignoreWarns) {
    if (arg[0].startsWith(warning)) {
      return;
    }
  }
  warn(...arg);
};

LogBox.ignoreLogs(ignoreWarns);
