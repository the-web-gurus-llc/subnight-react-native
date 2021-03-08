import { Alert } from "react-native"

function showWarning(title, msg) {
    Alert.alert(title, msg);
}

function showAlert(title, msg) {
    Alert.alert(title, msg);
}

function showNotice(title, msg, handler) {
    Alert.alert(
        title,
        msg,
        [
            {
                text: 'OK', onPress: () => {
                    handler();
                }
            },
        ],
    )
}

export const dialogUtil = {
    showWarning,
    showAlert,
    showNotice
}