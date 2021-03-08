import React, {
    Component
} from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions
} from "react-native";
import { ApplicationStyles } from "../../Theme";
import UserActions from './../../Stores/User/Actions'
import { connect } from "react-redux";
import DeviceInfo from 'react-native-device-info'
import { apiManager } from "../../Network/ApiManager";

const { width, height } = Dimensions.get('window')

class WelcomeSecond extends Component {
    constructor(props) {
        super(props);

        this.slideAnimation = new Animated.Value(width);
    }

    componentDidMount() {
        setTimeout(() => {
            Animated.timing(this.slideAnimation, {
                toValue: 0,
                duration: 300
            }).start();
        }, 200);

        setTimeout(() => {
            this.loadData()
            // this.props.navigation.navigate('Home')
        }, 1000)

    }

    async registerDevice() {
        const uniqueId = await DeviceInfo.getUniqueId();
        const fcmToken = this.props.startup.fcmtoken;

        const data = {
            device_type: Platform.OS,
            token: fcmToken,
            device_id: uniqueId
        }

        console.log("device uniqueId -> ", uniqueId);
        apiManager.registerDevice(this.props.startup.userToken.token, data).then(res => {
            console.log("register Device success => ", res);
        }).catch(error => {
            console.log("register Device error =? ", error);
        })
    }

    loadData() {
        const access_token = this.props.startup.userToken.token;
        this.props.fetchAllInformation(access_token);
        this.registerDevice();
    }

    render() {
        return (
            <Animated.View style={[styles.container, { transform: [{ translateX: this.slideAnimation }] }]}>
                <Text style={styles.authBodyText}>Experience the night</Text>
            </Animated.View>
        );
    }
};

const mapStateToProps = state => {
    return {
        user: state.user,
        startup: state.startup,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllInformation: (access_token) => dispatch(UserActions.fetchAllInformation(access_token)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WelcomeSecond);

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.authScreen.container,
        alignItems: 'center',
        justifyContent: 'center'
    },
    authBodyText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        ...ApplicationStyles.authScreen.authBodyText
    },
})