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
    Animated,
    Dimensions
} from "react-native";
import { Icon } from 'react-native-elements';
import Images from './../../Theme/Images'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ApplicationStyles, Values } from "./../../Theme";
import { withNavigation } from 'react-navigation';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from "react-native-modal-datetime-picker";
import { getHeightPercent } from './../../Services/RadioService';
import { apiManager } from './../../Network/ApiManager'
import { dialogUtil } from "../../Util/DialogUtil";
import { _storeData, generateRandomEmail } from "../../Services/HelperService";
import { connect } from "react-redux";
import StartupActions from './../../Stores/Startup/Actions'

const TAG = "RegisterLast: "

const { width, height } = Dimensions.get('window')
const genderData = [{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }, { label: "Other", value: "Other" }];

class RegisterLast extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profile_image_b64: this.props.navigation.getParam("avatarUri"),
            gender: "",
            isDateTimePickerVisible: false,
            birthday: "",
            birthYear: ""
        }

        this.slideAnimation = new Animated.Value(0);
        this.bodyAnimation = new Animated.Value(getHeightPercent(18.0));
        this.titleAnimation = new Animated.Value(height * 0.8);
    }

    componentDidMount() {
        setTimeout(() => {
            Animated.timing(this.slideAnimation, {
                toValue: 1,
                duration: 300
            }).start();
            Animated.timing(this.titleAnimation, {
                toValue: 80,
                duration: 300
            }).start();
            Animated.timing(this.bodyAnimation, {
                toValue: 150,
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
        this.navigateWithAnimation('Register')
    }

    onPressConnectionPhoneNumber() {
        this.navigateWithAnimation('Intro')
    }

    onClickNext() {

        if(this.state.birthYear == "") {
            setTimeout(() => {
                dialogUtil.showWarning("Warning", "Dob field required")
            }, 500)
            return
        }

        if(this.state.gender == "") {
            setTimeout(() => {
                dialogUtil.showWarning("Warning", "Gender field required")
            }, 500)
            return
        }

        const body = {
            phone: this.props.navigation.getParam("phone"),
            password: this.props.navigation.getParam("password"),
            confirmPassword: this.props.navigation.getParam("confirmPassword"),
            name: this.props.navigation.getParam("name"),
            gender: this.state.gender,
            birth_year: this.state.birthYear,
            email: generateRandomEmail() + "@aaa.com"
        }

        console.log("body -> ", body)

        apiManager.register(body).then( res => {
            console.log(TAG, "register success ->", res)
            _storeData(res.data.data.token);
            this.props.setUserToken(res.data.data);
            this.navigateWithAnimation('WelcomeFirst')
        }).catch(error => {
            console.log(TAG, "register error ->", error)
            dialogUtil.showWarning("REGISTER_FAILED", "Please input correct data.");
        })
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        console.log("A date has been picked: ", date);
        let birthdayVal = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        this.setState({ birthday: birthdayVal, birthYear: date.getFullYear() });
        this.hideDateTimePicker();
    };

    render() {
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView>
                    <Animated.View style={[styles.titleContainer, {
                        position: 'absolute',
                        width: '100%',
                        height: this.titleAnimation
                    }]}>
                        <Text style={styles.authTitleText}>{`Last Step ${this.props.navigation.getParam("name")}`}</Text>
                    </Animated.View>
                    <View style={styles.titleContainer}>
                        <TouchableOpacity onPress={() => this.onPressClose()}>
                            <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='#FFFFFF' />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: getHeightPercent(26.0), alignSelf: 'center', justifyContent: 'center', paddingBottom: getHeightPercent(1.6) }}>
                        {
                            this.state.profile_image_b64 == null ? (
                                <Image source={Images.user_avatar} style={styles.avatar} resizeMode={"contain"} />
                            ) : (
                                    <Image source={{ uri: this.state.profile_image_b64 }} style={styles.avatar} resizeMode={"contain"} />
                                )
                        }
                    </View>
                    {/* <Animated.View style={[styles.body, { opacity: this.slideAnimation, height: this.bodyAnimation }]}>
                        <Text style={styles.authBodyText}>Enter your age</Text>
                        <View style={styles.bodySubContainer}>
                            <TextInput
                                selectionColor={"gray"}
                                maxLength={3}
                                caretHidden={false}
                                style={styles.passwordInput}
                                returnKeyType='done'
                            />
                        </View>
                    </Animated.View> */}
                    <Animated.View style={[styles.body, { opacity: this.slideAnimation }]}>
                        <Text style={[styles.authBodyText]}>Choose your dob</Text>
                        <View style={styles.bodySubContainer}>
                            <TouchableOpacity onPress={this.showDateTimePicker}>
                                <TextInput
                                    style={styles.passwordInput}
                                    editable={false} pointerEvents="none"
                                    value={this.state.birthday}
                                />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                    <Animated.View style={[styles.body, {marginBottom: 70, opacity: this.slideAnimation }]}>
                        <Text style={[styles.authBodyText]}>Choose your gender</Text>
                        <View style={styles.bodySubContainer}>
                            {/* <TextInput
                                selectionColor={"gray"}
                                caretHidden={false}
                                style={styles.passwordInput}
                                returnKeyType='next' blurOnSubmit={true}
                                onSubmitEditing={() => { this.onClickNext() }}
                            /> */}
                            <RNPickerSelect
                                onValueChange={(value) => this.setState({ gender: value })}
                                onDonePress={() => { this.onClickNext() }}
                                style={pickerStyle}
                                placeholder={{
                                    label: '',
                                    value: '',
                                }}
                                items={genderData}
                            />
                        </View>
                    </Animated.View>
                </KeyboardAwareScrollView>
                <View style={{ flex: 1, flexDirection: 'column-reverse' }}>
                    <TouchableOpacity
                        style={styles.phoneNumberBack}
                        onPress={() => { this.onPressConnectionPhoneNumber() }}>
                        <Text style={styles.authConnectionPNText}>Connexion with phone number</Text>
                    </TouchableOpacity>
                </View>

                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    isDarkModeEnabled={true}
                    datePickerModeAndroid={'spinner'}
                    onCancel={this.hideDateTimePicker}
                />

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

export default connect(null, mapDispatchToProps)(RegisterLast)

const pickerStyle = {
    inputIOS: {
        paddingBottom: 2,
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        ...ApplicationStyles.authScreen.authInput,
        marginBottom: 10,
    },
    inputAndroid: {
        paddingBottom: 2,
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        ...ApplicationStyles.authScreen.authInput,
        marginBottom: 10,
    },
    placeholderColor: 'white',
    underline: {
    }
};

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.authScreen.container
    },
    titleContainer: {
        ...ApplicationStyles.authScreen.titleContainer
    },
    body: {
        padding: Values.authPaddingLeft
    },
    bodySubContainer: {
        width: Values.authInputTextBorderWidth,
        marginTop: 8
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
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        ...ApplicationStyles.authScreen.authInput,
        marginBottom: 10
    },
    authConnectionPNText: {
        ...ApplicationStyles.authScreen.sfProBoldFont,
        ...ApplicationStyles.authScreen.authConnectionPNText
    },
    phoneNumberBack: {
        ...ApplicationStyles.authScreen.authPhoneNumberBack,
        marginBottom: getHeightPercent(3.8),
        marginLeft: Values.authPaddingLeft,
        marginRight: Values.authPaddingRight
    },
    avatar: {
        ...ApplicationStyles.authScreen.authAvatar,
    }
})