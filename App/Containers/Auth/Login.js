import React, {
    Component
} from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    Animated
} from "react-native";
import { Icon } from 'react-native-elements';
import Images from './../../Theme/Images'
import { ApplicationStyles, Values } from "./../../Theme";
import { getHeightPercent } from './../../Services/RadioService';
import { apiManager } from './../../Network/ApiManager'
import { dialogUtil } from "../../Util/DialogUtil";
import { _storeData } from "../../Services/HelperService";
import { connect } from "react-redux";

import StartupActions from './../../Stores/Startup/Actions'
import NavigationService from "../../Services/NavigationService";

const TAG = "Login";

class Login extends Component {
    constructor(props) {
        super(props);
        this.slideAnimation = new Animated.Value(0.5);

        this.uid = this.props.navigation.getParam("phone");
    }

    componentDidMount() {
        setTimeout(() => {
            Animated.timing(this.slideAnimation, {
                toValue: 1,
                duration: 300
            }).start();
        }, 200);
    }

    slideDownAnimation = (duration1, duration2) => {
        setTimeout(() => {
            Animated.timing(this.slideAnimation, {
                toValue: 0,
                duration: duration2
            }).start();
        }, duration1);
    }

    navigateWithAnimation(screen) {
        const duration1 = 100
        const duration2 = 300
        this.slideDownAnimation(duration1, duration2)
        
        setTimeout(() => {
            this.props.navigation.navigate(screen)
        }, duration1 + duration2);
    }

    onPressClose() {
        this.navigateWithAnimation('Verify')
    }

    onPressConnectionPhoneNumber() {
        this.navigateWithAnimation('Intro')
    }

    onClickNext(passwordStr) {
        const params = {
            uid: this.uid,
            password: passwordStr
        }
        console.log(TAG, "login params -> ", params);

        apiManager.login(params).then( res => { 
            console.log(TAG, "log in success ->", res)
            _storeData(res.data.data.token);
            this.props.setUserToken(res.data.data);
            NavigationService.navigate("WelcomeFirst");
        }).catch(error => {
            console.log(TAG, "log in error ->", error)
            dialogUtil.showWarning("LOGIN_FAILED", "Invalid phone or password");
        })
    }

    render() {
        return (
            <Animated.View style={[styles.container, { opacity: this.slideAnimation }]}>
                <View style={{ height: '41%' }}>
                    <View style={styles.titleContainer}>
                        <TouchableOpacity onPress={() => this.onPressClose()}>
                            <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='#FFFFFF' />
                        </TouchableOpacity>
                        <Text style={styles.authTitleText}>Log in</Text>
                    </View>
                    <View style={{ height: '50%', justifyContent: 'center', alignSelf: 'center' }}>
                        <Image source={Images.user_avatar} style={{ width: Values.authAvatarSize, height: Values.authAvatarSize }} resizeMode={"contain"} />
                    </View>
                </View>
                <View style={styles.mainContainer}>
                    <TouchableOpacity
                        style={styles.phoneNumberBack}
                        onPress={() => { this.onPressConnectionPhoneNumber() }}>
                        <Text style={styles.authConnectionPNText}>Connexion with phone number</Text>
                    </TouchableOpacity>
                    <View style={styles.body}>
                        <Text style={styles.authBodyText}>Enter your password</Text>
                        <View style={{ width: Values.authInputTextBorderWidth }}>
                            <TextInput
                                selectionColor={"gray"}
                                caretHidden={false}
                                maxLength={10}
                                style={styles.passwordInput}
                                returnKeyType='done'
                                secureTextEntry={true}
                                keyboardType={"numbers-and-punctuation"}
                                enablesReturnKeyAutomatically={true}
                                onSubmitEditing={(event) => { this.onClickNext(event.nativeEvent.text) }}
                            />
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.authForgotText}>Forgot your password?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        );
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setUserToken: data => dispatch(StartupActions.updateUserToken(data)),
        clearToken: () => dispatch(StartupActions.updateUserToken(null))
    };
};

export default connect(null, mapDispatchToProps)(Login)

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.authScreen.container
    },
    titleContainer: {
        ...ApplicationStyles.authScreen.titleContainer
    },
    mainContainer: { 
        flex: 1, 
        flexDirection: 'column-reverse', 
        paddingLeft: Values.authPaddingLeft,
        paddingRight: Values.authPaddingRight
    },
    body: {
        flex: 1
    },
    authTitleText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        ...ApplicationStyles.authScreen.authTitleText
    },
    authBodyText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        ...ApplicationStyles.authScreen.authBodyText
    },
    authForgotText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: 11,
        color: "#808080",
        marginTop: getHeightPercent(5.2)
    },
    passwordInput: {
        ...ApplicationStyles.authScreen.authInput,
        marginTop: 16
    },
    authConnectionPNText: {
        ...ApplicationStyles.authScreen.sfProBoldFont,
        ...ApplicationStyles.authScreen.authConnectionPNText
    },
    phoneNumberBack: {
        ...ApplicationStyles.authScreen.authPhoneNumberBack,
        marginBottom: Values.authPaddingBottom,
    },
})