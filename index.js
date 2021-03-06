import "react-native-gesture-handler";

import {
    AppRegistry,
    YellowBox
} from 'react-native';
import App from './App/App';
import {name as appName} from './app.json';

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
YellowBox.ignoreWarnings(['Remote debugger']);