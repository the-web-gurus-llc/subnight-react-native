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
    KeyboardAvoidingView,
    Keyboard,
    Animated,
    Dimensions
} from "react-native";
import Images from './../../Theme/Images'
import LinearGradient from 'react-native-linear-gradient';
import { ApplicationStyles, Values } from "./../../Theme";
import CountryPicker from 'react-native-country-picker-modal';
import { getHeightPercent } from './../../Services/RadioService'; 
import firebase from "react-native-firebase";
import { dialogUtil } from "../../Util/DialogUtil";
import Swiper from 'react-native-swiper'
import { sha256 } from 'react-native-sha256';
import appleAuth, {
    AppleButton,
    AppleAuthRequestOperation,
    AppleAuthRequestScope,
    AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';

const { width, height } = Dimensions.get('window')

class Intro extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cca2: 'GB',
            countryCode: "44",
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

    onClickNext(phone_number) {
        console.log("next -> ", this.state.countryCode)

        firebase
            .auth()
            .signInWithPhoneNumber("+" + this.state.countryCode + phone_number)
            .then(confirmResult => {

                console.log("confirmResult from firebase -> ", confirmResult);

                Animated.timing(this.slideAnimation, {
                    toValue: 0,
                    duration: 500
                }).start();

                setTimeout(() => {
                    this.props.navigation.navigate('Verify', {
                        phone: " " + this.state.countryCode + phone_number,
                        confirmResult: confirmResult,
                    })
                }, 500);
            })
            .catch(error => {
                dialogUtil.showWarning("Warning", "Can't sign in with phone number.")
            });
    }

    appleSignIn = async () => {

        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: AppleAuthRequestOperation.LOGIN,
            requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
        });

        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

        console.log("appleAuthRequestResponse -> ", appleAuthRequestResponse);

        if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
            this.continueToAppleSignIn(appleAuthRequestResponse.identityToken, appleAuthRequestResponse.nonce);
        } else {
            alert("Apple Sign In Failed.");
        }
    };

    async continueToAppleSignIn(IDToken, userNonce) {
        const nonce = this.getRandomString(32);
        let nonceSHA256 = '';
        try {
            nonceSHA256 = await sha256(nonce);
        } catch (e) {
            console.log('UserStore::appleSignin - unable to get nonceSHA256', e);
        }

        console.log('UserTest::appleSignIn - nonce is: ' + nonce);
        console.log('UserTest::appleSignIn nonceSHA256 ' + nonceSHA256);
        console.log('UserTest::appleSignIn IDToken ' + IDToken);


        const credential = firebase.auth.AppleAuthProvider.credential(
            IDToken,
            userNonce,
        );

        console.log("firebaseUserCredential1 -> ", credential);

        let firebaseUserCredential;
        try {
            firebaseUserCredential = await firebase.auth().signInWithCredential(credential);

            console.log("firebaseUserCredential2 -> ", firebaseUserCredential);

            // this.onLogInWithApple(
            //     firebaseUserCredential.user._user.uid,
            //     "",
            //     "",
            //     ""
            // );

        } catch (e) {
            alert("Apple Sign In Failed.");
        }

    }

    getRandomString(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={() => { Keyboard.dismiss() }} activeOpacity={1.0}>
                <Animated.View
                    style={[
                        styles.container,
                        {
                            opacity: this.slideAnimation
                        }
                    ]}
                >

                    <Image source={Images.auth_back} style={styles.imageBack} resizeMode={"cover"} />
                    <View style={styles.imageBack}>
                        <LinearGradient colors={['#FABDB8', '#000']} style={{ height: '50%', opacity: 0.63 }}>
                        </LinearGradient>
                        <View style={{ backgroundColor: '#000', height: '50%', opacity: 0.63 }} />
                    </View>

                    <View style={styles.mainContent}>
                        <Swiper
                            style={styles.swiperStyle}
                            autoplay={true} loop={true}>
                            <View >
                                <Text style={styles.authBodyText}>Experience the night</Text>
                                <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    <Text style={styles.authBodyText}>In </Text>
                                    <Text style={[styles.authBodyText, { color: "#F8E71C" }]}>London</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.authBodyText}>Experience the night</Text>
                                <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    <Text style={styles.authBodyText}>In </Text>
                                    <Text style={[styles.authBodyText, { color: "#F8E71C" }]}>Paris</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.authBodyText}>Experience the night</Text>
                                <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    <Text style={styles.authBodyText}>In </Text>
                                    <Text style={[styles.authBodyText, { color: "#F8E71C" }]}>Dubai</Text>
                                </View>
                            </View>
                        </Swiper>
                    </View>

                    <View style={styles.subContainer}>
                        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={10}>
                            <View style={{ flexDirection: "row-reverse", height: getHeightPercent(5.4) }}>
                                <TouchableOpacity>
                                    <Image source={Images.ic_apple} style={{ width: getHeightPercent(5.4), height: getHeightPercent(5.4) }} resizeMode={"contain"} />
                                    {
                                        < AppleButton
                                            style={styles.appleBtn}
                                            buttonStyle={AppleButton.Style.BLACK}
                                            buttonType={AppleButton.Type.SIGN_IN}
                                            onPress={() => this.appleSignIn()}
                                        />
                                    }
                                </TouchableOpacity>
                                <View style={styles.phoneNumberBack}>
                                    <Text style={styles.codeText}>
                                        +{this.state.countryCode}
                                    </Text>
                                    <CountryPicker
                                        onChange={(value) => { console.log(value); this.setState({ countryCode: value.callingCode, cca2: value.cca2 }) }}
                                        onClose={() => { console.log("close"); }}
                                        cca2={this.state.cca2}
                                        showCallingCode={true}
                                        filterPlaceholderTextColor={'black'}
                                        filterable={true}
                                        animationType={"fade"}
                                        hideAlphabetFilter={true}
                                        closeable={true}
                                        styles={countryPicker}
                                        translation='eng'
                                    />
                                    <View
                                        style={{
                                            width: 1,
                                            height: 20,
                                            backgroundColor: '#000000',
                                            marginBottom: 2,
                                            marginLeft: 10,
                                            marginRight: 10
                                        }}
                                    />
                                    <TextInput
                                        placeholder={"762873848"}
                                        placeholderTextColor={"#707070"}
                                        selectionColor={"gray"}
                                        caretHidden={false}
                                        maxLength={15}
                                        style={styles.phoneInput}
                                        keyboardType={"numbers-and-punctuation"}
                                        enablesReturnKeyAutomatically
                                        returnKeyType='next' blurOnSubmit={true}
                                        onSubmitEditing={(event) => { this.onClickNext(event.nativeEvent.text) }}
                                    />
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>

                </Animated.View>

            </TouchableOpacity>
        );
    }
};

export default Intro;

const countryPicker = StyleSheet.create({
    container: {
        marginTop: getHeightPercent(1.4),
        marginRight: 0,
        paddingTop: getHeightPercent(0.5),
        position: 'absolute'
    },
    touchFlag: {
        width: getHeightPercent(6),
        marginLeft: getHeightPercent(2.2),
        alignItems: 'flex-start',
    },
    emojiFlag: {
        fontSize: getHeightPercent(2.2)
    },
    modalContainer: {
        backgroundColor: '#F8E71C',
        borderTopLeftRadius: getHeightPercent(2.2),
        borderTopRightRadius: getHeightPercent(2.2),
        marginTop: getHeightPercent(10),
        marginLeft: getHeightPercent(2.2),
        marginRight: getHeightPercent(2.2)
    },
    contentContainer: {
        width: width - getHeightPercent(4.4),
        height: height - getHeightPercent(32),
        flexDirection: 'row',
        borderBottomLeftRadius: getHeightPercent(2.0),
        borderBottomRightRadius: getHeightPercent(2.0),
        paddingLeft: getHeightPercent(2.2),
        paddingRight: getHeightPercent(2.2),
        paddingBottom: getHeightPercent(2.2),
        backgroundColor: '#F8E71C'
    },
    countryCode: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(2.4)
    },
    countryName: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(2.4)
    },
    input: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont
    }
})

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.authScreen.container,
    },
    phoneNumberBack: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
        paddingLeft: 0, paddingRight: getHeightPercent(1.6),
        backgroundColor: '#F8E71C',
        borderRadius: getHeightPercent(3.4),
        marginRight: getHeightPercent(2.4)
    },
    imageBack: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    subContainer: {
        flex: 1,
        paddingTop: Values.authPaddingTop, paddingBottom: Values.authPaddingBottom,
        paddingLeft: Values.authPaddingLeft, paddingRight: Values.authPaddingRight,
        flexDirection: "column-reverse"
    },
    mainContent: {
        width: '100%', height: '100%',
        justifyContent: 'center', position: 'absolute', alignItems: 'center',
        paddingTop: Values.authPaddingTop, paddingBottom: Values.authPaddingBottom,
    },
    authBodyText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: Values.authTitleTextSize,
        color: "#FFFFFF",
    },
    codeText: {
        ...ApplicationStyles.authScreen.sfProBoldFont,
        fontSize: getHeightPercent(1.8),
        marginLeft: getHeightPercent(4.0),
        color: "#000",
    },
    phoneInput: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: Values.authPhoneCodeTextSize,
        flex: 1,
        color: '#000'
    },
    swiperStyle: {
        marginTop: getHeightPercent(40.0),
        paddingLeft: Values.authPaddingLeft,
        paddingRight: Values.authPaddingRight
    },

    // Apple Btn
    appleBtn: {
        position: 'absolute',
        opacity: 0.02,
        height: getHeightPercent(5.4),
        width: getHeightPercent(5.4)
    }
})