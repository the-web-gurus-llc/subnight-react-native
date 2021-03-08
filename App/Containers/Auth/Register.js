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
    Animated
} from "react-native";
import { Icon } from 'react-native-elements';
import Images from './../../Theme/Images'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ApplicationStyles, Values } from "./../../Theme";
import ActionSheet from 'react-native-actionsheet'
import DynamicCropper from "react-native-dynamic-cropper";
import ImagePicker from 'react-native-image-crop-picker';
import { getHeightPercent } from './../../Services/RadioService';
import { DarkModeProvider } from 'react-native-dark-mode'
import { dialogUtil } from "../../Util/DialogUtil";

const RNFS = require('react-native-fs');

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profile_image: null,
            profile_image_b64: null,

            nameStr: "",
            passwordStr: "",
            confirmStr: ""
        }

        this.fontAnimation = new Animated.Value(30)
        this.slideAnimation = new Animated.Value(0.5);
    }

    componentDidMount() {
        setTimeout(() => {
            Animated.timing(this.slideAnimation, {
                toValue: 1,
                duration: 300
            }).start();
            Animated.timing(this.fontAnimation, {
                toValue: getHeightPercent(2.4),
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
        this.navigateWithAnimation('Verify')
    }

    onPressConnectionPhoneNumber() {
        this.navigateWithAnimation('Intro')
    }

    onClickNext() {

        if(this.state.nameStr == "") {
            dialogUtil.showWarning("Warning", "Name field required") 
            return
        }

        if(this.state.passwordStr == "") {
            dialogUtil.showWarning("Warning", "Password field required")
            return
        }

        if(this.state.confirmStr == "" || this.state.passwordStr != this.state.confirmStr) {
            dialogUtil.showWarning("Warning", "Password doesn't match")
            return
        }

        this.navigateWithAnimation('RegisterLast', {
            avatarUri: this.state.profile_image_b64,
            name: this.state.nameStr,
            password: this.state.passwordStr,
            confirmPassword: this.state.confirmStr,
            phone: this.props.navigation.getParam("phone")
        })
    }

    handleCamera = () => {
        this.ActionSheet.show()
    };

    openImagePicker(index) {
        if (index == 0) {
            ImagePicker.openCamera({ width: 600, height: 600, cropping: false })
                .then(response => {
                    this.continuePhoto(response.path)
                }).catch(err => {
                    console.log('PickingCameraErr', err)
                })
        } else if (index == 1) {
            ImagePicker.openPicker({ width: 600, height: 600, cropping: false, mediaType: "photo" })
                .then(response => {
                    this.continuePhoto(response.path)
                }).catch(err => {
                    console.log('PickingGalleryErr', err)
                })
        }
    }

    continuePhoto(path) {

        if (Platform.OS === "ios") {
            DynamicCropper.cropImage(path, {}).then(async newlyCroppedImagePath => {
                console.log(newlyCroppedImagePath);
                if (newlyCroppedImagePath != null && newlyCroppedImagePath != '') {
                    // this.setPhotoImage(newlyCroppedImagePath)

                    let response = await RNFS.readFile(newlyCroppedImagePath, 'base64');
                    console.log(response);

                    this.setState({
                        // profile_image: { uri: newlyCroppedImagePath },
                        profile_image: newlyCroppedImagePath,
                        profile_image_b64: "data:image/jpeg;base64," + response
                    });
                }
            });
        } else {
            this.setState({
                //profile_image: { uri: response.uri },
                profile_image: path
            });
        }
    }

    render() {
        return (
            // <DarkModeProvider mode="dark">
            <Animated.View style={[styles.container, { opacity: this.slideAnimation }]}>
                <KeyboardAwareScrollView>
                    <View style={styles.titleContainer}>
                        <TouchableOpacity onPress={() => this.onPressClose()}>
                            <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='#FFFFFF' />
                        </TouchableOpacity>
                        <Text style={styles.authTitleText}>Register</Text>
                    </View>
                    <TouchableOpacity style={{ alignSelf: 'center', marginTop: getHeightPercent(5.4) }} onPress={() => { this.handleCamera() }}> 
                        {
                            this.state.profile_image == null ? (
                                <Image source={Images.user_avatar} style={styles.avatar} resizeMode={"contain"} />
                            ) : (
                                    <Image source={{ uri: this.state.profile_image_b64 }} style={styles.avatar} resizeMode={"contain"} />
                                )
                        }
                    </TouchableOpacity>
                    <View style={styles.body}>
                        <Text style={styles.authBodyText}>Choose a name</Text>
                        <View style={styles.bodySubContainer}>
                            <TextInput
                                selectionColor={"gray"}
                                caretHidden={false}
                                maxLength={10}
                                style={styles.passwordInput}
                                onChangeText={(nameStr) => this.setState({ nameStr })}
                                returnKeyType='done'
                            />
                        </View>
                    </View>
                    <View style={styles.body}>
                        <Animated.Text style={[styles.authBodyText, { height: getHeightPercent(4.4), fontSize: this.fontAnimation }]}>Choose a password</Animated.Text>
                        <View style={styles.bodySubContainer}>
                            <TextInput
                                selectionColor={"gray"}
                                caretHidden={false}
                                maxLength={10}
                                style={styles.passwordInput}
                                returnKeyType='done'
                                onChangeText={(passwordStr) => this.setState({ passwordStr })}
                                secureTextEntry={true}
                            />
                        </View>
                    </View>
                    <View style={[styles.body, { marginBottom: getHeightPercent(7.0) }]}>
                        <Text style={[styles.authBodyText, { fontSize: getHeightPercent(2.4) }]}>Confirm your password</Text>
                        <View style={styles.bodySubContainer}>
                            <TextInput
                                selectionColor={"gray"}
                                caretHidden={false}
                                maxLength={10}
                                style={styles.passwordInput}
                                returnKeyType='next' blurOnSubmit={true}
                                onChangeText={(confirmStr) => this.setState({ confirmStr })}
                                onSubmitEditing={() => { this.onClickNext() }}
                                secureTextEntry={true}
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <View style={{ flex: 1, flexDirection: 'column-reverse' }}>
                    <TouchableOpacity
                        style={styles.phoneNumberBack}
                        onPress={() => { this.onPressConnectionPhoneNumber() }}>
                        <Text style={styles.authConnectionPNText}>Connexion with phone number</Text>
                    </TouchableOpacity>
                </View>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Which one do you like ?'}
                    options={['Pick from Camera', 'Pick from Gallery', 'Cancel']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={1}
                    onPress={(index) => { this.openImagePicker(index) }}
                />
            </Animated.View>
            // </DarkModeProvider>

        );
    }
};

export default Register;

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
        marginBottom: Values.authPaddingBottom,
        marginLeft: Values.authPaddingLeft,
        marginRight: Values.authPaddingRight
    },
    avatar: {
        ...ApplicationStyles.authScreen.authAvatar,
    }
})