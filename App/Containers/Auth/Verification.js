import React, {
    Component
} from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Animated
} from "react-native";
import { Icon } from 'react-native-elements';
import Images from './../../Theme/Images'
import { ApplicationStyles, Values } from "./../../Theme";
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { getHeightPercent } from './../../Services/RadioService';
import { connect } from "react-redux";
import { apiManager } from './../../Network/ApiManager'
import { dialogUtil } from "../../Util/DialogUtil";

const { width, height } = Dimensions.get("window");
const TAG = "Verification: ";

class Verification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phone: this.props.navigation.getParam("phone"),
            confirmResult: this.props.navigation.getParam("confirmResult"),
            smsCode: '',
        }

        this.slideAnimation = new Animated.Value(0.5);
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

    navigateWithAnimation(screen, params) {
        const duration1 = 100
        const duration2 = 300
        this.slideDownAnimation(duration1, duration2)

        setTimeout(() => {
            this.props.navigation.navigate(screen, params)
        }, duration1 + duration2);
    }

    onPressClose() {
        this.navigateWithAnimation('Intro')
    }

    onPressNext(code) {
        this.state.confirmResult
            .confirm(code)
            .then(user => {
                console.log("FireBase UID:", user.uid);
                this.navigateWithAnimation('Login', {
                    phone: this.state.phone
                })
                // this.navigateWithAnimation('Register', {
                //     phone: this.state.phone
                // })
            })
            .catch(error => {
                console.log("firebase confirmResult err -> ", error);
                dialogUtil.showWarning("Warning", "Please input correct code.")
            });
    }

    onLogin() {
        const params = {
            uid: this.state.phone,
            password: "password"
        }

        apiManager.login(params).then(res => {
            console.log(TAG, "log in success ->", res);

        }).catch(error => {
            console.log(TAG, "log in error ->", error)
        })
    }



    render() {
        return (
            <View style={styles.container}>
                <Animated.View
                    style={[
                        styles.container,
                        {
                            opacity: this.slideAnimation
                        }
                    ]}
                >
                    <View style={styles.mainContainer}>
                        <View style={styles.body}>
                            <Text style={styles.authBodyText}>Enter the code</Text>
                            <View style={{ width: 220, marginTop: getHeightPercent(1.0) }}>
                                <OTPInputView
                                    style={{ width: '100%', height: getHeightPercent(5) }}
                                    pinCount={6}
                                    code={this.state.smsCode}
                                    onCodeChanged={code => { this.setState({ smsCode: code }) }}
                                    autoFocusOnLoad
                                    codeInputFieldStyle={styles.underlineStyleBase}
                                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                                    onCodeFilled={(code => { this.onPressNext(code); })}
                                />
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.phoneNumberBack}
                            onPress={() => { this.onPressClose() }}>
                            <Text style={styles.authConnectionPNText}>Connexion with phone number</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleContainer}>
                        <TouchableOpacity onPress={() => this.onPressClose()}>
                            <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='#FFFFFF' />
                        </TouchableOpacity>
                        <Text style={styles.authTitleText}>Verification</Text>
                    </View>
                </Animated.View>
            </View>
        );
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setUserToken: data => dispatch(StartupActions.updateUserToken(data)),
        clearToken: () => dispatch(StartupActions.updateUserToken(null))
    };
};

export default connect(null, mapDispatchToProps)(Verification)

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.authScreen.container,
    },
    titleContainer: {
        ...ApplicationStyles.authScreen.titleContainer,
    },
    mainContainer: {
        width: '100%',
        height: '100%',
        flexDirection: 'column-reverse',
        position: 'absolute',
        paddingLeft: Values.authPaddingLeft, paddingRight: Values.authPaddingRight,
        paddingBottom: Values.authPaddingBottom
    },
    body: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        position: 'absolute',
        paddingBottom: 24,
        paddingLeft: Values.authPaddingLeft, paddingRight: Values.authPaddingRight,
    },
    phoneNumberBack: {
        ...ApplicationStyles.authScreen.authPhoneNumberBack
    },
    authTitleText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        ...ApplicationStyles.authScreen.authTitleText
    },
    authBodyText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        ...ApplicationStyles.authScreen.authBodyText
    },
    passwordInput: {
        fontSize: Values.authInputTextSize,
        color: '#FFF',
        borderBottomColor: '#FFF',
        borderBottomWidth: 1,
    },
    authConnectionPNText: {
        ...ApplicationStyles.authScreen.sfProBoldFont,
        ...ApplicationStyles.authScreen.authConnectionPNText
    },
    underlineStyleBase: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        width: 30,
        height: 45,
        fontSize: getHeightPercent(3.6),
        color: '#FFF',
        borderWidth: 0,
        borderBottomWidth: 3,
    },
    underlineStyleHighLighted: {
        borderColor: "#FFF",
    },
})