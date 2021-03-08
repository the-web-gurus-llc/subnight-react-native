import React, {
    Component
} from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Image,
    FlatList,
    ScrollView,
    TextInput
} from "react-native";
import { Icon } from 'react-native-elements';
import Images from '../../Theme/Images'
import { ApplicationStyles, Values } from "../../Theme";
import { getHeightPercent } from './../../Services/RadioService'
import { connect } from 'react-redux';
import { apiManager } from "../../Network/ApiManager";
import { dialogUtil } from "../../Util/DialogUtil";

const TAG = "ModifyPassword: "

class ModifyPasswordScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            oldPasswordStr: "",
            passwordStr: "",
            confirmStr: "",
            errorMsgVisible: false,
        }

    }

    onPressClose() {
        const parent = this.props.navigation.getParam("parent")
        if (parent != null) this.props.navigation.navigate(parent)
        else this.props.navigation.navigate('SettingDetailScreen')
    }

    onPressConfirm() {

        if (this.state.oldPasswordStr === "") return
        if (this.state.confirmStr === "" || this.state.passwordStr === "") return

        if (this.state.passwordStr !== this.state.confirmStr) {
            this.setState({ errorMsgVisible: true })
            setTimeout(() => {
                this.setState({ errorMsgVisible: false })
            }, 2000);
            return
        }

        const params = {
            password: this.state.oldPasswordStr,
            newPassword: this.state.passwordStr
        }

        apiManager.changePassword(this.props.userToken.token, params).then(res => {
            dialogUtil.showAlert("Success", "Changed Password!")
        }).catch(err => {
            dialogUtil.showWarning("Error", "Password does not match")
        })

        // this.props.navigation.navigate('SettingDetailScreen')
    }

    render() {

        const isConfirmBtnEnable = this.state.passwordStr !== "" && this.state.confirmStr !== "" && this.state.oldPasswordStr !== ""

        return (
            <View style={[styles.container, {}]}>
                <View style={styles.titleContainer}>
                    <TouchableOpacity onPress={() => this.onPressClose()}>
                        <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='#FFFFFF' />
                    </TouchableOpacity>
                    <Text style={styles.authTitleText}>Settings</Text>
                </View>
                <View style={styles.mainContainer}>
                    <View>
                        <View style={[styles.actionView, { marginTop: getHeightPercent(5.8) }]}>
                            <View style={styles.actionSubView}>
                                <Text style={styles.settingText1}>Input old password</Text>
                                <TextInput
                                    placeholder={"************"}
                                    placeholderTextColor={"#707070"}
                                    selectionColor={"gray"}
                                    caretHidden={false}
                                    maxLength={10}
                                    style={styles.settingText2}
                                    returnKeyType='done'
                                    secureTextEntry={true}
                                    onChangeText={(oldPasswordStr) => this.setState({ oldPasswordStr })}
                                    value={this.state.oldPasswordStr}
                                />
                            </View>
                        </View>
                        <View style={[styles.actionView, { marginTop: getHeightPercent(1.4) }]}>
                            <View style={styles.actionSubView}>
                                <Text style={styles.settingText1}>Modify my password</Text>
                                <TextInput
                                    placeholder={"************"}
                                    placeholderTextColor={"#707070"}
                                    selectionColor={"gray"}
                                    caretHidden={false}
                                    maxLength={10}
                                    style={styles.settingText2}
                                    returnKeyType='done'
                                    secureTextEntry={true}
                                    onChangeText={(passwordStr) => this.setState({ passwordStr })}
                                    value={this.state.passwordStr}
                                />
                            </View>
                        </View>
                        <View style={[styles.actionView, { marginTop: getHeightPercent(1.4) }]}>
                            <View style={styles.actionSubView}>
                                <Text style={styles.settingText1}>Confirm my password</Text>
                                <TextInput
                                    placeholder={"************"}
                                    placeholderTextColor={"#707070"}
                                    selectionColor={"gray"}
                                    caretHidden={false}
                                    maxLength={10}
                                    style={styles.settingText2}
                                    returnKeyType='done'
                                    secureTextEntry={true}
                                    onChangeText={(confirmStr) => this.setState({ confirmStr })}
                                    value={this.state.confirmStr}
                                />
                            </View>
                        </View>
                        {this.state.errorMsgVisible &&
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.errorMsgText}>Both doesn’t match !</Text>
                            </View>
                        }
                    </View>

                    <View>
                        <TouchableOpacity style={isConfirmBtnEnable ? styles.confirmTextEnableBack : styles.confirmTextDisableBack} onPress={() => this.onPressConfirm()}>
                            <Text style={isConfirmBtnEnable ? styles.confirmBtnEnableText : styles.confirmBtnDisableText}>Confirm the changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        profile: state.user.profile,
        userToken: state.startup.userToken
    }
};

export default connect(mapStateToProps)(ModifyPasswordScreen)

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.screen.container,
    },
    titleContainer: {
        ...ApplicationStyles.screen.topContainer
    },
    mainContainer: {
        marginHorizontal: Values.mainPaddingHorizontal,
        marginBottom: getHeightPercent(4.2),
        flex: 1,
        justifyContent: 'space-between'
    },
    authTitleText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        ...ApplicationStyles.authScreen.authTitleText
    },
    actionView: {
        height: getHeightPercent(8.4),
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 8,
        justifyContent: 'center',
        marginTop: getHeightPercent(1.2),
        padding: getHeightPercent(2.4),
    },
    actionSubView: {
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    settingText1: {
        ...ApplicationStyles.authScreen.sfProHeavyFont,
        fontWeight: "400",
        color: 'black',
        fontSize: getHeightPercent(1.6),
    },
    settingText2: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontWeight: "400",
        width: getHeightPercent(10.2),
        color: 'black',
        fontSize: getHeightPercent(1.6),
    },
    errorMsgText: {
        ...ApplicationStyles.authScreen.sfProHeavyFont,
        fontWeight: "400",
        color: '#FF5252',
        fontSize: getHeightPercent(1.8),
        marginTop: getHeightPercent(2.2)
    },

    // Confirm Change Style

    confirmBtnEnableText: {
        ...ApplicationStyles.authScreen.sfProBoldFont,
        fontSize: getHeightPercent(2.0),
        color: 'black',
    },
    confirmBtnDisableText: {
        ...ApplicationStyles.authScreen.sfProBoldFont,
        fontSize: getHeightPercent(2.0),
        color: 'white',
    },
    confirmTextEnableBack: {
        width: '100%',
        height: getHeightPercent(5.4),
        backgroundColor: '#F8E71C',
        borderRadius: getHeightPercent(4.2),
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirmTextDisableBack: {
        width: '100%',
        height: getHeightPercent(5.4),
        borderRadius: getHeightPercent(4.2),
        borderWidth: 1,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
})