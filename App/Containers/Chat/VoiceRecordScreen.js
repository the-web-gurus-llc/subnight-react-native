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
    TextInput,
    Dimensions
} from "react-native";
import { Icon } from 'react-native-elements';
import Images from '../../Theme/Images'
import LinearGradient from 'react-native-linear-gradient';
import { ApplicationStyles, Values } from "../../Theme";
import { getHeightPercent } from './../../Services/RadioService'

const sliderWidth = Dimensions.get('window').width
const sliderHeight = getHeightPercent(40.2)
const itemWidth = getHeightPercent(25.2)
const itemHeight = getHeightPercent(30.8)

class VoiceRecordScreen extends Component {
    constructor(props) {
        super(props);

    }

    onPressClose() {
        this.props.navigation.navigate('ChattingRoomScreen')
    }

    render() {
        return (
            <Animated.View style={[styles.container, {}]}>
                <LinearGradient colors={['#FABDB8', '#000']} style={{ height: '46%' }}>
                    <View style={styles.titleContainer}>
                        <TouchableOpacity onPress={() => this.onPressClose()}>
                            <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='#FFFFFF' />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.topContainer}>
                        <Image source={Images.ic_avatar_one} style={styles.topImage} resizeMode={"cover"} />
                        <Text style={styles.topText1}>Recording a voice note to</Text>
                        <Text style={styles.topText2}>Sam Sam</Text>
                    </View>
                </LinearGradient>
                <View style={styles.mainContainer}>
                    <View style={{ flex: 1 }}>
                        <Image source={Images.ic_sound_waves} style={styles.bodyImage} resizeMode={"contain"} />
                    </View>
                    <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
                        <View style={styles.sendView}>
                            <TextInput
                                placeholder={"01:23"}
                                placeholderTextColor={"#707070"}
                                selectionColor={"gray"}
                                caretHidden={false}
                                editable={false}
                                style={styles.sendInputText}
                                enablesReturnKeyAutomatically
                                returnKeyType='send' blurOnSubmit={true}
                                onSubmitEditing={() => { this.onPressSendMsg() }}
                            />
                            <TouchableOpacity >
                                <Image source={Images.ic_record_btn} style={[styles.itemRecordBtn]} resizeMode={"contain"} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity >
                                <Image source={Images.ic_booking_share} style={[styles.itemBtnImg, { marginLeft: getHeightPercent(1.8) }]} resizeMode={"contain"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    }
};

export default VoiceRecordScreen;

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.screen.container,
    },
    titleContainer: {
        ...ApplicationStyles.screen.topContainer
    },
    authTitleText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        ...ApplicationStyles.authScreen.authTitleText
    },
    topContainer: {
        marginHorizontal: Values.mainPaddingHorizontal,
        marginTop: getHeightPercent(5.2)
    },
    topImage: {
        width: getHeightPercent(11.8),
        height: getHeightPercent(11.8),
    },
    topText1: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(3.2),
        marginTop: getHeightPercent(2.2),
        color: '#FFFFFF',
    },
    topText2: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(3.4),
        marginTop: getHeightPercent(0.6),
        color: '#FFFFFF',
    },
    mainContainer: {
        flex: 1,
        paddingHorizontal: Values.mainPaddingHorizontal,
        marginBottom: getHeightPercent(4.4)
    },
    itemBtnImg: {
        width: getHeightPercent(5.4),
        height: getHeightPercent(5.4),
        tintColor: 'white'
    },
    itemRecordBtn: {
        width: getHeightPercent(2.8),
        height: getHeightPercent(2.8),
    },
    bodyImage: {
        height: getHeightPercent(16.8),
    },
    sendView: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#F8E71C',
        paddingHorizontal: getHeightPercent(2.0),
        borderRadius: getHeightPercent(3.2),
        height: getHeightPercent(5.4),
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sendInputText: {
        ...ApplicationStyles.authScreen.sfProBoldFont,
        fontSize: getHeightPercent(2.0),
        color: 'black'
    },
})