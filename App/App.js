import React, { Component } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootScreen from './Containers/Root/RootScreen';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import createStore from './Stores'
import "react-native-gesture-handler";
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';

const { store, persistor } = createStore();

export default class App extends Component {
    async componentDidMount() {
		this.checkPermission();
		this.createNotificationListeners();
    }

    componentWillUnmount() {
		this.notificationListener();
		this.notificationOpenedListener();
    }
    
    async createNotificationListeners() {

		this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body, data } = notification;
            console.log("onNotification -> ", notification);
			this.showAlert(title, body, data);
		});

		this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
			const { title, body, data } = notificationOpen.notification;
		});

		const notificationOpen = await firebase.notifications().getInitialNotification();
		if (notificationOpen) {
            const { title, body, data } = notificationOpen.notification;
			this.showAlert(title, body, data);
		}
		this.messageListener = firebase.messaging().onMessage((message) => {
			console.log(JSON.stringify(message));
		});
	}

	async showAlert(title, body, data) {

		var S4 = function () {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		};
		const notification = new firebase.notifications.Notification()
			.setNotificationId((S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()))
			.setTitle(title)
			.setBody(body)
			.setData(data);
		notification.ios.setBadge(1);
		firebase.notifications().displayNotification(notification)
	}

	async checkPermission() {
		const enabled = await firebase.messaging().hasPermission();
		if (enabled) {
			this.getToken();
		} else {
			this.requestPermission();
		}
	}

	async getToken() {
		let fcmToken = await AsyncStorage.getItem('fcmToken');
		if (!fcmToken) {
			fcmToken = await firebase.messaging().getToken();
		}
	}

	async requestPermission() {
		try {
			await firebase.messaging().requestPermission();
		} catch (error) {
			console.log('permission rejected');
		}
	}
    
    render() {
        return (
            <SafeAreaProvider>
                <Provider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<RootScreen />
					</PersistGate>
				</Provider>
            </SafeAreaProvider>
        );
    }
};