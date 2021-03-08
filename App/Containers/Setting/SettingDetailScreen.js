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
import { isIphoneX } from 'react-native-iphone-x-helper'
import { Icon } from 'react-native-elements';
import Images from '../../Theme/Images'
import { SwitchActions } from 'react-navigation'
import { ApplicationStyles, Values } from "../../Theme";
import { getHeightPercent } from './../../Services/RadioService'
import { connect } from 'react-redux';
import { userGender, userPhoneNumber } from "../../Services/HelperService";
import StartupActions from './../../Stores/Startup/Actions'
import PDFView from 'react-native-view-pdf'
import Config from './../../Config/Config'
import { dialogUtil } from "../../Util/DialogUtil";
import { apiManager } from "../../Network/ApiManager";
import UserActions from './../../Stores/User/Actions'
import RNPickerSelect from 'react-native-picker-select';

const closeTermsBtnSize = getHeightPercent(3.6);
const genderData = [{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }, { label: "Other", value: "Other" }];

class SettingDetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            termsVisible: false,
            isChanged: false,
            name: this.props.profile.name,
            bio: this.props.profile.bio != null ? this.props.profile.bio : "",
            gender: this.props.profile.gender,
            phone: this.props.profile.phone,
        }

    }

    onPressClose() {
        this.props.navigation.navigate('SettingScreen')
    }

    onPressMoney() {
        this.props.navigation.navigate('RewardScreen')
    }

    onPressModifyPassword() {
        this.props.navigation.navigate('ModifyPasswordScreen')
    }

    onPressLogout() {
        this.props.clearToken();
        this.props.navigation.dispatch(SwitchActions.jumpTo({ routeName: 'Auth' }))
    }

    onPressCloseTerms() {
        this.setState({ termsVisible: false });
    }

    onPressSave() {
        // if (!this.state.isChanged) return;

        const body = {
            _id: this.props.profile._id,
            name: this.state.name,
            gender: this.state.gender,
            bio: this.state.bio
        }

        console.log("changed profile -> ", body);
        apiManager.updateProfile(this.props.userToken.token, body).then(res => {
            console.log("changed profile success -> ", res);

            this.props.updateProfileSetting({ profile: res.data.data });
            setTimeout(() => {
                dialogUtil.showAlert("Success", "Changed profile successfully.");
            }, 500)
        }).catch(error => {
            console.log("changed profile error -> ", error);
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={[styles.container, {}]}>
                    <View style={styles.titleContainer}>
                        <TouchableOpacity onPress={() => this.onPressClose()}>
                            <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='#FFFFFF' />
                        </TouchableOpacity>
                        {false &&
                            <TouchableOpacity onPress={() => this.onPressSave()} activeOpacity={this.state.isChanged ? 0.0 : 1.0}>
                                <Image source={Images.ic_setting_confirm} style={styles.confirmSetting} opacity={this.state.isChanged ? 1.0 : 0.5} />
                            </TouchableOpacity>
                        }

                        <Text style={styles.authTitleText}>Settings</Text>
                    </View>
                    <View style={styles.mainContainer}>
                        <TouchableOpacity style={styles.avatarContainer} onPress={() => this.onPressMoney()}>
                            <View style={{ width: getHeightPercent(7.0), height: getHeightPercent(7.0) }}>
                                <View style={{ position: 'absolute', flex: 1, backgroundColor: '#FFFFFF', opacity: 0.6 }} />
                                <Image source={Images.ic_money} style={{}} resizeMode={"contain"} />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'column-reverse' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <Text style={styles.nameText}>{this.state.name}</Text>
                                    <Text style={styles.moneyText2}>{"xp"}</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                    <Text style={styles.moneyText1}>{"198"}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionView, { marginTop: getHeightPercent(3.8) }]}>
                            <View style={styles.actionSubView}>
                                <Text style={styles.settingText1}>Name</Text>
                                {/* <Text style={styles.settingText2}>{this.state.profile.name}</Text> */}
                                <TextInput
                                    selectionColor={"gray"}
                                    maxLength={10}
                                    style={styles.settingText2}
                                    value={this.state.name}
                                    onChangeText={(name) => { this.setState({ name, isChanged: true }); }}
                                    returnKeyType='done'
                                />
                            </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.actionView}>
                            <View style={styles.actionSubView}>
                                <Text style={styles.settingText1}>Name</Text>
                                <Text style={styles.settingText2}>{this.state.profile.name}</Text>
                            </View>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={[styles.actionView, { height: getHeightPercent(15.6) }]}>
                            <View style={[styles.actionSubView, { marginBottom: getHeightPercent(0.0) }]}>
                                <Text style={styles.settingText1}>Bio</Text>
                                {/* <Text style={styles.settingText2}>{"Enter your bio here\n150 characters max"}</Text> */}
                                <TextInput
                                    selectionColor={"gray"}
                                    maxLength={150}
                                    placeholder={"Enter your bio here\n150 characters max"}
                                    placeholderTextColor={"black"}
                                    multiline={true}
                                    style={[styles.settingText2, { height: getHeightPercent(10.8) }]}
                                    value={this.state.bio}
                                    onChangeText={(bio) => { this.setState({ bio, isChanged: true }); }}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionView}>
                            <View style={styles.actionSubView}>
                                <Text style={styles.settingText1}>Gender</Text>
                                {/* <Text style={styles.settingText2}>{userGender(this.state.gender)}</Text> */}
                                <RNPickerSelect
                                    onValueChange={(value) => this.setState({ gender: value, isChanged: true })}
                                    value={userGender(this.state.gender)}
                                    style={pickerStyle}
                                    placeholder={{
                                        label: '',
                                        value: '',
                                    }}
                                    items={genderData}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionView}>
                            <View style={styles.actionSubView}>
                                <Text style={styles.settingText1}>Phone</Text>
                                <Text style={styles.settingText2}>{userPhoneNumber(this.state.phone)}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={[styles.actionBottomView, { padding: 0 }]}>
                            <TouchableOpacity>
                                <Text style={styles.settingBottomText}>My accounts</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.actionBottomView}>
                            <TouchableOpacity onPress={() => this.onPressModifyPassword()}>
                                <Text style={styles.settingBottomText}>Modify my password</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.actionBottomView}>
                            <TouchableOpacity>
                                <Text style={styles.settingBottomText}>Notifications</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.actionBottomView}>
                            <TouchableOpacity onPress={() => this.setState({ termsVisible: true })}>
                                <Text style={styles.settingBottomText}>Terms of use</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.actionBottomView, { marginBottom: getHeightPercent(10.0) }]}>
                            <TouchableOpacity onPress={() => this.onPressLogout()}>
                                <Text style={[styles.settingBottomText, { color: 'red' }]}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                {this.state.termsVisible &&
                    <View style={{ width: '100%', height: '100%', position: 'absolute', flexDirection: 'row-reverse' }}>
                        <PDFView
                            fadeInDuration={250.0}
                            style={{ flex: 1, backgroundColor: '#fff', width: '100%', height: '100%', position: 'absolute' }}
                            resource={`${Config.BaseUrl}privacy.pdf`}
                            resourceType={'url'}
                            // onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
                            onError={(error) => { console.log("pdf load error => ", error); dialogUtil.showWarning("Warning", "Cannot render PDF") }}
                        />
                        <TouchableOpacity onPress={() => this.onPressCloseTerms()} style={{ right: -getHeightPercent(1.8), top: getHeightPercent(isIphoneX() ? 6.4 : 4.6), width: closeTermsBtnSize, height: closeTermsBtnSize }}>
                            <Icon name='closecircle' type='antdesign' size={closeTermsBtnSize} color='#000' />
                        </TouchableOpacity>
                    </View>
                }
                {
                    <View style={styles.btnBack}>
                        <TouchableOpacity style={styles.selBtn} onPress={() => this.onPressSave()}>
                            <Text style={styles.modalBtnText}>Confirm the changes</Text>
                        </TouchableOpacity>
                    </View>
                }
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

const mapDispatchToProps = dispatch => {
    return {
        clearToken: () => dispatch(StartupActions.updateUserToken(null)),
        updateProfileSetting: (data) => dispatch(UserActions.fetchUserSuccess(data)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingDetailScreen)

const pickerStyle = {
    inputIOS: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontWeight: "400",
        color: 'black',
        fontSize: getHeightPercent(1.6),
        width: getHeightPercent(20.0),
        textAlign: 'right'
    },
    inputAndroid: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontWeight: "400",
        color: 'black',
        fontSize: getHeightPercent(1.6),
        width: getHeightPercent(20.0),
        textAlign: 'right'
    },
    placeholderColor: 'black',
    underline: {
    }
};

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.screen.container,
    },
    titleContainer: {
        ...ApplicationStyles.screen.topContainer
    },
    mainContainer: {
        marginHorizontal: Values.mainPaddingHorizontal,
    },
    avatarContainer: {
        backgroundColor: '#F8E71C',
        borderRadius: 8,
        height: getHeightPercent(27.2),
        width: '100%',
        marginTop: getHeightPercent(6.4),
        paddingLeft: getHeightPercent(2.4),
        paddingRight: getHeightPercent(2.4),
        paddingTop: getHeightPercent(2.4),
        paddingBottom: getHeightPercent(2.4)
    },
    authTitleText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        ...ApplicationStyles.authScreen.authTitleText
    },
    mainBodyText: {
        ...ApplicationStyles.screen.mainBodyText,
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
    },
    moneyText1: {
        ...ApplicationStyles.screen.mainBodyText,
        fontSize: getHeightPercent(5.0),
        color: 'black',
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
    },
    moneyText2: {
        fontSize: getHeightPercent(1.8),
        color: 'black',
        ...ApplicationStyles.authScreen.sfProLightFont,
    },
    nameText: {
        fontSize: getHeightPercent(1.8),
        color: 'black',
        ...ApplicationStyles.authScreen.sfProMediumFont,
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
        color: 'black',
        fontSize: getHeightPercent(1.6),
        width: getHeightPercent(20.0),
        textAlign: 'right'
    },
    actionBottomView: {
        height: getHeightPercent(7.4),
        width: '100%',
        justifyContent: 'center',
        padding: getHeightPercent(2.4),
    },
    settingBottomText: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontWeight: "400",
        color: '#FFFFFF',
        fontSize: getHeightPercent(1.8),
    },
    confirmSetting: {
        width: getHeightPercent(4.8),
        height: getHeightPercent(4.8),
        marginRight: getHeightPercent(0.6),
        tintColor: 'white'
    },

    // confirm change btn
    btnBack: {
        width: '90%',
        height: getHeightPercent(5.2),
        marginTop: getHeightPercent(88.6),
        marginLeft: '5%',
        position: 'absolute'
    },
    selBtn: {
        flex: 1,
        borderRadius: getHeightPercent(2.5),
        backgroundColor: '#F8E71C',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBtnText: {
        color: 'black',
        fontSize: getHeightPercent(2.0),
        ...ApplicationStyles.authScreen.sfProBoldFont,
    },
})