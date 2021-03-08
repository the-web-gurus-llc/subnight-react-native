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
} from "react-native";
import { Icon } from 'react-native-elements';
import Images from '../../Theme/Images'
import { ApplicationStyles, Values } from "../../Theme";
import { getHeightPercent } from './../../Services/RadioService'
import { connect } from 'react-redux';
import ActionSheet from 'react-native-actionsheet'
import DynamicCropper from "react-native-dynamic-cropper";
import ImagePicker from 'react-native-image-crop-picker';
import { uploadUserAvatar } from "../../Services/HelperService";
import UserActions from './../../Stores/User/Actions'
import { apiManager } from "../../Network/ApiManager";
const RNFS = require('react-native-fs');

class SettingScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                isHost: false
            },
            details: [
                { isSel: false, badgeCount: 0 },
                { isSel: false, badgeCount: 0 },
                { isSel: false, badgeCount: 0 },
                { isSel: false, badgeCount: 0 },
                { isSel: false, badgeCount: 0 },
                { isSel: false, badgeCount: 0 },
                { isSel: false, badgeCount: 0 },
                { isSel: false, badgeCount: 0 },
            ],
        }

    }

    onPressClose() {
        this.props.navigation.navigate('Home')
    }

    onPressBooking() {
        this.props.navigation.navigate('Booking')
    }

    onPressSetting() {
        this.props.navigation.navigate('SettingDetailScreen')
    }

    onPressMoney() {
        this.props.navigation.navigate('RewardScreen')
    }

    onPressVideoTutorial() {
        this.props.navigation.navigate('VideoTutorialScreen')
    }

    onPressWifiSetting() {
        this.props.navigation.navigate('WifiSetting')
    }

    onPressModifyPassword() {
        this.props.navigation.navigate('ModifyPasswordScreen', {
            parent: "SettingScreen"
        })
    }

    onPressClubStoryItem() {
        this.props.navigation.navigate('ClubStoryScreen', {
            parent: "SettingScreen"
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

                    // this.setState({
                    //     // profile_image: { uri: newlyCroppedImagePath },
                    //     profile_image: newlyCroppedImagePath,
                    //     profile_image_b64: "data:image/jpeg;base64," + response
                    // });
                    uploadUserAvatar(this.props.userToken.token, newlyCroppedImagePath).then(res => {
                        console.log("update user avatar on setting res => ", res);
                        apiManager.accountGetProfile(this.props.userToken.token).then(res => {
                            this.props.updateProfileSetting({profile: res.data.data});
                        })
                    }).catch(error => {
                        console.log("update user avatar on setting error => ", error)
                    })
                }
            });
        } else {
            this.setState({
                //profile_image: { uri: response.uri },
                profile_image: path
            });
        }
    }

    renderDetailItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.itemDetail} onPress={() => { this.onPressClubStoryItem() }}>
                {
                    item.isSel ? (
                        <Image source={Images.ic_detail_sel} style={styles.itemDetailImage} resizeMode={"contain"} />
                    ) : (
                            <Image source={Images.ic_detail_unsel} style={styles.itemDetailImage} resizeMode={"contain"} />
                        )
                }
                {item.badgeCount !== 0 &&
                    <View style={styles.badgeView}>
                        <Text style={styles.badgeText}>{item.badgeCount}</Text>
                    </View>
                }
            </TouchableOpacity>
        )
    };

    keyExtractor = (item, index) => index.toString();

    render() {
        const user = this.state.user
        const avatarUrl = this.props.profile.avatar;

        return (
            <Animated.View style={[styles.container, {}]}>
                <View style={styles.titleContainer}>
                    <TouchableOpacity onPress={() => this.onPressClose()}>
                        <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='#FFFFFF' />
                    </TouchableOpacity>
                    <Text style={styles.authTitleText}>{user.isHost ? "My Profile" : "Settings"}</Text>
                </View>

                {/* not hosted */}
                {!user.isHost &&
                    <View style={{ flex: 1 }}>
                        <View style={styles.mainContainer}>
                            <View style={{ alignItems: 'center', flexDirection: 'row', height: getHeightPercent(17) }}>
                                <TouchableOpacity onPress={() => { this.handleCamera() }}>
                                {avatarUrl == null &&
                                    <Image source={Images.user_avatar} style={styles.avatarStyle} resizeMode={"contain"} />
                                }
                                {avatarUrl != null &&
                                    <Image source={{uri: avatarUrl}} style={styles.avatarStyle} resizeMode={"contain"} />
                                }
                                </TouchableOpacity>
                                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', marginLeft: getHeightPercent(1.6) }}>
                                    <Text style={styles.mainBodyText}>{this.props.profile.name}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.avatarContainer} onPress={() => this.onPressMoney()}>
                                <Image source={Images.ic_money} style={{ width: getHeightPercent(7.0), height: getHeightPercent(6.0) }} resizeMode={"contain"} />
                                <View style={{ flex: 1, flexDirection: 'row-reverse', alignItems: 'center' }}>
                                    <Text style={styles.moneyText1}>{"140"}</Text>
                                    <Text style={styles.moneyText2}>{"xp"}</Text>
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.actionText}>Actions</Text>
                            <View style={styles.actionView1}>
                                <TouchableOpacity style={[styles.actionSubView, { marginRight: getHeightPercent(1.2) }]} onPress={() => this.onPressBooking()}>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <Image source={Images.ic_setting_booking} style={styles.settingIcon} resizeMode={"contain"} />
                                        <Text style={styles.settingText}>My booking(s)</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.actionSubView, { marginLeft: getHeightPercent(1.2) }]} onPress={() => this.onPressSetting()}>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <Image source={Images.ic_setting} style={styles.settingIcon} resizeMode={"contain"} />
                                        <Text style={styles.settingText}>Settings</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.actionView2}>
                                <TouchableOpacity style={styles.actionSubView} onPress={() => this.onPressVideoTutorial()}>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <Image source={Images.ic_video_tutorials} style={styles.settingIcon} resizeMode={"contain"} />
                                        <Text style={styles.settingText}>Video Tutorials</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.bottomView}>
                            <Image source={Images.ic_setting_back} style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.53 }} resizeMode={"cover"} />
                            <View style={{ height: getHeightPercent(0.3), flexDirection: 'row' }}>
                                <View style={{ width: getHeightPercent(14.0), height: '100%', backgroundColor: '#F8E71C' }} />
                                <View style={{ backgroundColor: '#707070', flex: 1, opacity: 0.12 }} />
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <View style={styles.bottomSubView}>
                                    <View>
                                        <Image source={Images.ic_setting_bottom} style={{ width: getHeightPercent(3.0), height: getHeightPercent(3.0) }} resizeMode={"contain"} />
                                        <Text style={styles.bottomText}>{"Scandal London"}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => this.onPressWifiSetting()}>
                                        <Image source={Images.ic_setting_box} style={{ width: getHeightPercent(4.4), height: getHeightPercent(4.4) }} resizeMode={"contain"} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                }

                {/* hosted */}
                {user.isHost &&
                    <View style={{ flex: 1 }}>
                        <View style={styles.mainContainer}>
                            <View style={{ alignItems: 'center', flexDirection: 'row', height: getHeightPercent(17) }}>
                                <Image source={Images.ic_avatar_one} style={{ width: Values.settingAvatarSize, height: Values.settingAvatarSize }} resizeMode={"contain"} />
                                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', marginLeft: getHeightPercent(1.6) }}>
                                    <Text style={styles.mainBodyText}>{"Mehdi Bcl"}</Text>
                                    <Text style={styles.mainBodySubText}>{"Host"}</Text>
                                </View>
                                <Image source={Images.ic_customer_service} style={{ width: getHeightPercent(5.2), height: getHeightPercent(5.2) }} resizeMode={"contain"} />
                            </View>
                            <TouchableOpacity style={[styles.avatarContainer, { backgroundColor: 'white' }]} onPress={() => this.onPressVideoTutorial()}>
                                <Image source={Images.ic_video_tutorial_spe} style={{ width: getHeightPercent(7.0), height: getHeightPercent(6.0) }} resizeMode={"contain"} />
                                <View style={{ flex: 1, flexDirection: 'row-reverse', alignItems: 'center' }}>
                                    <Text style={styles.videoTutorialSpeText}>{"Video Tutorials"}</Text>
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.clubsText}>Clubs</Text>
                            <View style={{ width: '100%', height: getHeightPercent(6.4) }}>
                                <FlatList
                                    data={this.state.details}
                                    renderItem={this.renderDetailItem}
                                    horizontal={true}
                                    keyExtractor={this.keyExtractor}
                                />
                            </View>
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
                                <TouchableOpacity>
                                    <Text style={styles.settingBottomText}>Terms of use</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.actionBottomView, { marginBottom: getHeightPercent(3.0) }]}>
                                <TouchableOpacity>
                                    <Text style={[styles.settingBottomText, { color: 'red' }]}>Logout</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Which one do you like ?'}
                    options={['Pick from Camera', 'Pick from Gallery', 'Cancel']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={1}
                    onPress={(index) => { this.openImagePicker(index) }}
                />
            </Animated.View>
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
        updateProfileSetting: (data) => dispatch(UserActions.fetchUserSuccess(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen)

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
        flexDirection: 'row',
        height: getHeightPercent(8.8),
        width: '100%',
        alignItems: 'center',
        paddingLeft: getHeightPercent(1.6),
        paddingRight: getHeightPercent(1.6)
    },
    authTitleText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        ...ApplicationStyles.authScreen.authTitleText
    },
    mainBodyText: {
        ...ApplicationStyles.screen.mainBodyText,
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
    },
    mainBodySubText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(2.0),
        color: '#F8E71C',
        marginTop: getHeightPercent(0.6)
    },
    moneyText1: {
        ...ApplicationStyles.screen.mainBodyText,
        fontSize: getHeightPercent(4.0),
        color: 'black',
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
    },
    moneyText2: {
        ...ApplicationStyles.screen.mainBodyText,
        fontSize: getHeightPercent(2.0),
        color: 'black',
        ...ApplicationStyles.authScreen.sfProMediumFont,
        marginRight: getHeightPercent(2.8)
    },
    videoTutorialSpeText: {
        fontSize: getHeightPercent(1.6),
        color: 'black',
        ...ApplicationStyles.authScreen.sfProMediumFont,
    },
    actionText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(2.1),
        color: '#FFFFFF',
        marginVertical: getHeightPercent(2.8)
    },
    clubsText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(2.1),
        color: '#FFFFFF',
        marginTop: getHeightPercent(3.4),
        marginBottom: getHeightPercent(2.8)
    },
    actionView1: {
        height: getHeightPercent(17),
        width: '100%',
        flexDirection: 'row'
    },
    actionView2: {
        height: getHeightPercent(17),
        width: '100%',
        marginTop: getHeightPercent(2.4)
    },
    actionSubView: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomView: {
        flex: 1,
        marginTop: getHeightPercent(6.0)
    },
    bottomSubView: {
        marginHorizontal: Values.mainPaddingHorizontal,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bottomText: {
        color: '#FFFFFF',
        fontSize: getHeightPercent(2.0),
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        marginTop: getHeightPercent(0.6)
    },
    settingIcon: {
        width: getHeightPercent(6.8),
        height: getHeightPercent(6.8),
    },
    settingText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        marginTop: getHeightPercent(1.6),
        color: 'black',
        fontSize: getHeightPercent(1.6),
    },

    actionBottomView: {
        height: getHeightPercent(6.4),
        width: '100%',
        justifyContent: 'center',
        padding: getHeightPercent(2.0),
    },
    settingBottomText: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontWeight: "400",
        color: '#FFFFFF',
        fontSize: getHeightPercent(1.8),
    },

    // Detail list style
    itemDetail: {
        width: getHeightPercent(7),
        justifyContent: 'center',
        alignSelf: 'center'
    },
    itemDetailImage: { height: getHeightPercent(5.2), width: getHeightPercent(5.2) },

    // Badge Style
    badgeView: {
        width: getHeightPercent(2.2),
        height: getHeightPercent(2.2),
        borderRadius: getHeightPercent(2.0),
        backgroundColor: '#F8E71C',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: getHeightPercent(1.1),
        top: -getHeightPercent(0.5)
    },
    badgeText: {
        fontSize: getHeightPercent(1.4),
        color: 'black'
    },
    avatarStyle: { 
        ...ApplicationStyles.authScreen.authAvatar,
    }
})