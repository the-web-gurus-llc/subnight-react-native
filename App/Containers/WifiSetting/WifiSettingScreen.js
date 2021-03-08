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
    Modal,
} from "react-native";
import { Icon } from 'react-native-elements';
import Images from '../../Theme/Images'
import { ApplicationStyles, Values } from "../../Theme";
import { getHeightPercent } from './../../Services/RadioService'

class WifiSettingScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalWifiPasswordVisible: false,
            isModalOpenVisible: false
        }

    }

    onPressClose() {
        this.props.navigation.navigate('SettingScreen')
    }

    onPressOpen() {
        this.setState({ isModalOpenVisible: true })
    }

    onPressAvatar() {
        this.props.navigation.navigate('ChattingRoomScreen')
    }

    onPressWifi() {
        this.setState({ isModalWifiPasswordVisible: true })
    }

    onPressMenu() {
        this.props.navigation.navigate('EditClubScreen', {
            parent: "WifiSettingScreen"
        })
    }

    render() {
        return (
            <Animated.View style={[styles.container, {}]}>
                <View style={styles.titleContainer}>
                    <TouchableOpacity onPress={() => this.onPressClose()}>
                        <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='#FFFFFF' />
                    </TouchableOpacity>
                    <Text style={styles.titleText}>Ashley,</Text>
                </View>
                <View style={styles.mainContainer}>
                    <Text style={styles.authTitleText}>Welcome in Scandal</Text>
                    <TouchableOpacity onPress={() => { this.onPressOpen() }}>
                        <Text style={styles.openText}>Open</Text>
                    </TouchableOpacity>
                    <View style={[styles.mainSubContainer, { paddingRight: getHeightPercent(2.2) }]}>
                        <View style={{ flexDirection: 'row', marginTop: getHeightPercent(5.6), justifyContent: 'space-between' }}>
                            <Image source={Images.ic_weldone} style={styles.modal2Img} resizeMode={"contain"} />
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.modalText1}>20 XP SubPoints</Text>
                                <Text style={[styles.modalText2, { marginTop: getHeightPercent(0.6) }]}>Well Done babe !</Text>
                            </View>
                            <Image source={Images.ic_weldone} style={styles.modal2Img} resizeMode={"contain"} />
                        </View>
                    </View>
                    <View style={styles.body}>
                        <View style={{alignItems: "center"}}>
                            <Text style={styles.subBodyText1}>Your Subnight host :</Text>
                            <TouchableOpacity onPress={() => this.onPressAvatar()}>
                                <Image source={Images.ic_avatar_one} style={styles.subBodyImg} resizeMode={"contain"} />
                            </TouchableOpacity>
                            <Text style={styles.subBodyText2}>Sam Sam</Text>
                        </View>
                    </View>
                    <View style={styles.actionView1}>
                        <TouchableOpacity style={[styles.actionSubView, { marginRight: getHeightPercent(1.2) }]} onPress={() => this.onPressWifi()}>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Image source={Images.ic_wifi} style={styles.settingIcon} resizeMode={"contain"} />
                                <Text style={styles.settingText}>WiFi</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionSubView, { marginLeft: getHeightPercent(1.2) }]} onPress={() => this.onPressMenu()}>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Image source={Images.ic_menu_wifi_setting} style={styles.settingIcon} resizeMode={"contain"} />
                                <Text style={styles.settingText}>Menu</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal
                    animationType={"fade"}
                    animationInTiming={500}
                    animationOutTiming={500}
                    visible={this.state.isModalWifiPasswordVisible}
                    transparent={true}
                >
                    <TouchableOpacity style={styles.modal} activeOpacity={1.0} onPress={() => { this.setState({ isModalWifiPasswordVisible: false }) }}>
                        <View style={[styles.modalContainer, { paddingRight: getHeightPercent(2.2) }]}>
                            <View style={{ marginTop: getHeightPercent(4.2), width: '100%', height: '100%', alignItems: 'center' }}>
                                <Text style={styles.modalText1}>Wifi password pasted to your clipboard</Text>
                                <Text style={[styles.modalText2, { marginTop: getHeightPercent(0.8) }]}>Scandal2019ERTDSSSX</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
                <Modal
                    animationType={"fade"}
                    animationInTiming={500}
                    animationOutTiming={500}
                    visible={this.state.isModalOpenVisible}
                    transparent={true}
                >
                    <TouchableOpacity style={styles.modal} activeOpacity={1.0} onPress={() => { this.setState({ isModalOpenVisible: false }) }}>
                        <View style={[styles.modalContainer, { paddingRight: getHeightPercent(2.2) }]}>
                            <View style={{ marginTop: getHeightPercent(4.2), width: '100%', height: '100%', alignItems: 'center' }}>
                                <Text style={styles.modalText1}>Scandal</Text>
                                <Text style={[styles.modalText2, { marginTop: getHeightPercent(0.8) }]}>The club closes at 03:00am</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </Animated.View>
        );
    }
};

export default WifiSettingScreen;

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.screen.container,
    },
    titleContainer: {
        ...ApplicationStyles.screen.topContainer
    },
    mainContainer: {
        marginHorizontal: Values.mainPaddingHorizontal,
        paddingBottom: getHeightPercent(4.2),
        flex: 1
    },
    titleText: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        ...ApplicationStyles.authScreen.authTitleText
    },
    authTitleText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(3.6),
        color: "#FFFFFF",
    },
    openText: {
        ...ApplicationStyles.authScreen.sfProBoldFont,
        marginTop: getHeightPercent(3.2),
        fontSize: getHeightPercent(1.6),
        color: '#58FF00',
    },
    modal2Img: {
        width: getHeightPercent(3.6),
        height: getHeightPercent(3.6),
    },
    modalText1: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(2.0),
        color: 'black'
    },
    modalText2: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(1.44),
        color: 'black',
        marginTop: getHeightPercent(0.2)
    },
    mainSubContainer: {
        width: '100%',
        height: getHeightPercent(9.6),
        paddingLeft: getHeightPercent(2.2),
        marginTop: '10%',
        borderRadius: 10,
        backgroundColor: '#F8E71C',
        justifyContent: 'center',
        paddingBottom: getHeightPercent(0.2)
    },
    modalContainer: {
        width: '90%',
        height: getHeightPercent(9.6),
        paddingLeft: getHeightPercent(2.2),
        marginTop: '10%',
        borderRadius: 10,
        backgroundColor: '#F8E71C',
        justifyContent: 'center',
        paddingBottom: getHeightPercent(0.2)
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
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: getHeightPercent(8.8)
    },
    subBodyText1: {
        ...ApplicationStyles.authScreen.sfProLightFont,
        fontSize: getHeightPercent(2.2),
        color: 'white'
    },
    subBodyText2: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(4.0),
        color: 'white',
        marginTop: getHeightPercent(4.2)
    },
    subBodyImg: {
        marginTop: getHeightPercent(3.6),
        width: getHeightPercent(8.6),
        height: getHeightPercent(8.6),
    },
    modal: {
        flex: 1,
        backgroundColor: '#6E707070',
        alignItems: 'center',
    },
})