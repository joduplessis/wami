import { AppRegistry } from 'react-native';
import App from './App';

if (__DEV__) {
    global.XMLHttpRequest = global.originalXMLHttpRequest ?
        global.originalXMLHttpRequest :
        global.XMLHttpRequest;
    global.FormData = global.originalFormData ?
        global.originalFormData :
        global.FormData;
    global.Blob = global.originalBlob ?
        global.originalBlob :
        global.Blob;
    global.FileReader = global.originalFileReader ?
        global.originalFileReader :
        global.FileReader;
}

AppRegistry.registerComponent('mobile', () => App);
