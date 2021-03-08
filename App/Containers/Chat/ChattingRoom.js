import React, {
    Component
} from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    KeyboardAvoidingView,
    Image,
    FlatList,
} from "react-native";
import { Icon } from 'react-native-elements';
import Images from '../../Theme/Images'
import { ApplicationStyles, Values } from "../../Theme";
import { getHeightPercent } from './../../Services/RadioService'
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { dateTimeUtil } from "../../Util/DateTimeUtil";
import { connect } from 'react-redux';
import { apiManager } from "../../Network/ApiManager";
import ChatSocket from './ChatSocket'

const TAG = "ChattingRoom: "

const ITEM_MARGIN = getHeightPercent(1.6)

const rewardRequest_0 = "yes"
const rewardRequest_2 = "ask"

const bounceRequest1 = 0
const bounceRequest2 = 1
const bounceRequest3 = 2

const itemWidth = getHeightPercent(26.6)
const itemHeight = getHeightPercent(40.2)

class ChattingRoomScreen extends Component {
    constructor(props) {
        super(props);

        this.isFromRewards = false;
        if (props.navigation.getParam("fromRewards") != null) {
            this.isFromRewards = true
        }

        this.state = {
            rewardRequest: rewardRequest_2,
            bounceRequest: bounceRequest1,
            conversation: this.props.navigation.getParam("conversation"),
            messages: [],
            sendInputText: "",
        }

        this.isFromBounce = false;
        if (props.navigation.getParam("fromBounce") != null) {
            this.isFromBounce = true
        }

        this.isNormal = !this.isFromBounce && !this.isFromRewards

        if (this.isNormal) {
            this.getMessages()
        }
    }

    getMessages() {
        const conversationId = this.state.conversation._id;
        const query = {
            with: ['user', 'reservation.club', 'club'],
            sort: '-created_at',
            limit: 200
        }

        apiManager.getMessages(this.props.userToken.token, conversationId, query).then(res => {
            console.log(TAG, "getMessages res -> ", res)
            this.setState({ messages: res.data.data })

        }).catch(error => {
            console.log(TAG, "getMessages error -> ", error)
        })
    }

    onPressClose() {
        if (this.isFromRewards === true) this.props.navigation.navigate('RewardScreen')
        else if (this.isFromBounce === true) this.props.navigation.navigate('HomeScreen')
        else this.props.navigation.navigate('ChatListScreen')
    }

    onPressSendAudio() {
        this.props.navigation.navigate('VoiceRecordScreen')
    }

    onPressSendMsg() {
        if(this.state.sendInputText === "") return;

        const message = {
            conversation_id: this.state.conversation._id,
            text: this.state.sendInputText,
            type: 'text'
        }

        apiManager.sendMessage(this.props.userToken.token, message).then(res => {
            console.log(TAG, "sendMessage res -> ", res);
            this.setState({sendInputText: ""});
        }).catch(error => {
            console.log(TAG, "sendMessage error -> ", error);
        })
    }

    onReceiveMessage = (message) => {
        console.log(TAG, "received message -> ", message);
        this.setState({messages: [...this.state.messages, message]});
    }

    onPressRewardYes() {
        this.setState({ rewardRequest: rewardRequest_0 })
    }

    onPressRewardNo() {
        this.props.navigation.navigate('RewardScreen')
    }

    onPressBounceYes() {
        this.setState({ bounceRequest: bounceRequest2 })
        setTimeout(() => {
            this.setState({ bounceRequest: bounceRequest3 })
        }, 500)
    }

    onPressBounceNo() {
        this.props.navigation.navigate('HomeScreen')
    }

    _renderChatItem = (message, key) => {
        const isMine = message.user_id == this.props.profile._id
        return (
            <View key={key}>
                {isMine ? (
                    <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', marginBottom: ITEM_MARGIN }}>
                        <View style={{ alignItems: 'flex-end', maxWidth: '80%' }}>
                            <View style={styles.myView}>
                                <Text style={styles.text}>{message.text}</Text>
                            </View>
                            {/* <Text style={styles.seenText}>Seen at 01:45pm</Text> */}
                        </View>
                    </View>
                ) : (
                        <View style={{ marginBottom: ITEM_MARGIN }}>
                            <View style={styles.friendView}>
                                <Text style={styles.text}>{message.text}</Text>
                            </View>
                        </View>
                    )
                }
            </View>
        )
    }

    _renderTyping = () => {
        return (
            <View style={{ marginBottom: ITEM_MARGIN }}>
                <View style={styles.friendTypingView}>
                    <Image source={Images.ic_three_dot} style={{ height: getHeightPercent(1.0) }} resizeMode={"contain"} />
                </View>
            </View>
        )
    }

    _renderAudio = () => {
        return (
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: ITEM_MARGIN }}>
                <View style={styles.audioView}>
                    <Image source={Images.ic_chat_audio} style={{ height: getHeightPercent(4.6) }} resizeMode={"contain"} />
                </View>
            </View>
        )
    }

    _renderRewardItem = () => {
        return (
            <TouchableOpacity style={styles.rewardItem_temp} >
                <Image source={Images.ic_image3} style={styles.rewardItemImageTemp} resizeMode={"contain"} />
            </TouchableOpacity>
        )
    }

    _renderBounceItem = () => {
        const item = this.props.navigation.getParam("bounceItem")
        return (
            <View style={styles.slide}>
                <View style={[styles.slideItemView]}>
                    <View style={styles.slideItemText1Back}>
                        <Text style={styles.slideItemText1}>140</Text>
                        <Text style={styles.slideItemText2}>xp</Text>
                    </View>
                    <Image source={item.image} style={styles.slideItemAvatar} resizeMode={"contain"} />
                    <Text style={styles.slideItemText3}>{item.name}</Text>
                    <Text style={styles.slideItemText4}>{item.text}</Text>
                </View>
            </View>
        )
    }

    _renderRewardAsk = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.rewardAskText}>{"Are you sure it’s\nthe reward you want ?"}</Text>
                <TouchableOpacity style={styles.rewardItemBtn} onPress={() => this.onPressRewardYes()}>
                    <Text style={styles.rewardAskText}>{"Yes"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rewardItemBtn} onPress={() => this.onPressRewardNo()}>
                    <Text style={styles.rewardAskText}>{"No"}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    _renderBounceAsk = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.rewardAskText}>{"Do you confirm the \nbounce ?"}</Text>
                <TouchableOpacity style={styles.rewardItemBtn} onPress={() => this.onPressBounceYes()}>
                    <Text style={styles.rewardAskText}>{"Yes"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rewardItemBtn} onPress={() => this.onPressBounceNo()}>
                    <Text style={styles.rewardAskText}>{"No"}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    _renderBounceAskAgain = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={[styles.rewardItemBtn, { width: getHeightPercent(16.8) }]} >
                    <Text style={styles.rewardAskText}>{"Too many boys"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.rewardItemBtn, { width: getHeightPercent(8.9) }]} >
                    <Text style={styles.rewardAskText}>{"Other"}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <KeyboardAvoidingView style={[styles.container, {}]} behavior="padding">
                <ChatSocket
                    onReceiveMessage={this.onReceiveMessage}
                />
                <View style={styles.titleContainer}>
                    <TouchableOpacity onPress={() => this.onPressClose()}>
                        <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='#FFFFFF' />
                    </TouchableOpacity>
                    {!this.isNormal &&
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={Images.ic_customer_service} style={styles.avatarImg} resizeMode={"contain"} />
                            <Text style={styles.authTitleText}>Customer Service</Text>
                        </View>
                    }
                    {this.isNormal &&
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={Images.ic_customer_service} style={styles.avatarImg} resizeMode={"contain"} />
                            <Text style={styles.authTitleText}>{this.state.conversation.name}</Text>
                        </View>
                    }

                </View>
                {this.isNormal &&
                    <Text style={styles.timeTitle}>{dateTimeUtil.getChatListTime(this.state.conversation.updated_at)}</Text>
                }
                <View style={styles.mainContainer}>
                    <ScrollView style={{ width: '100%', marginTop: getHeightPercent(6.2) }}>
                        {this.isNormal &&
                            <View>
                                {
                                    this.state.messages.map((v, i) => {
                                        return this._renderChatItem(v, i)
                                    })
                                }
                                {/* {this._renderAudio()} */}
                                {/* {this._renderTyping()} */}
                            </View>
                        }
                        {this.isFromRewards &&
                            <View style={{ alignItems: 'flex-end' }}>
                                {this._renderRewardItem()}
                                {this.state.rewardRequest === rewardRequest_2 && this._renderRewardAsk()}
                                {this.state.rewardRequest === rewardRequest_0 &&
                                    <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', marginBottom: ITEM_MARGIN }}>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <View style={styles.myView}>
                                                <Text style={styles.text}>I want this ! 😘</Text>
                                            </View>
                                            <Text style={styles.seenText}>Seen at 01:45pm</Text>
                                        </View>
                                    </View>
                                }
                            </View>
                        }
                        {this.isFromBounce &&
                            <View >
                                <View style={{ alignItems: 'flex-end' }}>
                                    {this._renderBounceItem()}
                                    {this.state.bounceRequest === bounceRequest1 && this._renderBounceAsk()}
                                    {this.state.bounceRequest >= bounceRequest2 &&
                                        <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', marginBottom: ITEM_MARGIN }}>
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <View style={styles.myView}>
                                                    <Text style={styles.text}>Bounced 😔</Text>
                                                </View>
                                                <Text style={styles.seenText}>Seen at 01:45pm</Text>
                                            </View>
                                        </View>
                                    }
                                </View>

                                {this.state.bounceRequest >= bounceRequest3 &&
                                    <View style={{ marginBottom: ITEM_MARGIN }}>
                                        <View style={styles.friendView}>
                                            <Text style={styles.text}>Why?</Text>
                                        </View>
                                    </View>
                                }

                                <View style={{ alignItems: 'flex-end' }}>
                                    {this.state.bounceRequest === bounceRequest3 && this._renderBounceAskAgain()}
                                </View>

                            </View>
                        }
                    </ScrollView>
                    <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
                        <View style={styles.sendView}>
                            <TextInput
                                placeholder={"Say something…"}
                                placeholderTextColor={"#707070"}
                                selectionColor={"gray"}
                                caretHidden={false}
                                style={styles.sendInputText}
                                enablesReturnKeyAutomatically
                                returnKeyType='send' blurOnSubmit={true}
                                onChangeText={(sendInputText) => this.setState({sendInputText})}
                                value={this.state.sendInputText}
                                onSubmitEditing={() => { this.onPressSendMsg() }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.onPressSendAudio()}>
                                <Image source={Images.ic_chat_audio_send} style={[styles.itemBtnImg, { marginLeft: getHeightPercent(1.8) }]} resizeMode={"contain"} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onPressSendMsg()}>
                                <Image source={Images.ic_booking_share} style={[styles.itemBtnImg, { marginLeft: getHeightPercent(1.8) }]} resizeMode={"contain"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        profile: state.user.profile,
        userToken: state.startup.userToken
    }
};

export default connect(mapStateToProps)(ChattingRoomScreen)

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.screen.container,
    },
    titleContainer: {
        ...ApplicationStyles.screen.topContainer
    },
    mainContainer: {
        marginHorizontal: Values.mainPaddingHorizontal,
        flex: 1,
        alignItems: 'flex-end',
        marginBottom: getHeightPercent(4.4)
    },
    authTitleText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(3.2),
        color: "#FFFFFF",
    },
    avatarImg: {
        width: getHeightPercent(4.6),
        height: getHeightPercent(4.6),
        borderRadius: getHeightPercent(0.8),
        marginRight: getHeightPercent(2.0)
    },
    timeTitle: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(1.8),
        marginLeft: getHeightPercent(9.2),
        color: 'white',
        opacity: 0.5
    },

    // Chat Component Style
    friendView: {
        backgroundColor: "#FFFFFF",
        borderRadius: getHeightPercent(1.6),
        maxWidth: '80%',
        alignSelf: 'baseline'
    },
    myView: {
        backgroundColor: "#F8E71C",
        borderRadius: getHeightPercent(1.6),
        alignSelf: 'baseline',
    },
    friendTypingView: {
        backgroundColor: '#1A1A1A',
        borderRadius: getHeightPercent(1.6),
        height: getHeightPercent(5.0),
        width: getHeightPercent(15.2),
        alignItems: 'center',
        justifyContent: 'center'
    },
    audioView: {
        backgroundColor: '#F8E71C',
        borderRadius: getHeightPercent(1.6),
        height: getHeightPercent(5.0),
        width: getHeightPercent(15.2),
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        paddingVertical: getHeightPercent(1.4),
        paddingHorizontal: getHeightPercent(1.6),
        fontSize: getHeightPercent(1.8),
        color: 'black',
    },
    seenText: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        paddingVertical: getHeightPercent(0.6),
        fontSize: getHeightPercent(1.4),
        color: 'white'
    },

    // Send Text Style
    sendView: {
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingHorizontal: getHeightPercent(2.0),
        borderRadius: getHeightPercent(3.2),
        height: getHeightPercent(5.4),
        flex: 1
    },
    sendInputText: {
        ...ApplicationStyles.authScreen.sfProBoldFont,
        fontSize: getHeightPercent(2.0),
        color: 'black'
    },
    itemBtnImg: {
        width: getHeightPercent(5.4),
        height: getHeightPercent(5.4),
        tintColor: 'white'
    },

    // Reward Item Style
    rewardItemImageTemp: { height: '89.8%', width: '100%', marginBottom: getHeightPercent(2.8), borderRadius: 10 },
    rewardItem_temp: {
        height: getHeightPercent(30.2),
        width: getHeightPercent(20.8),
    },
    rewardAskText: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(2.0),
        color: 'white'
    },
    rewardItemBtn: {
        width: getHeightPercent(8.8),
        height: getHeightPercent(4.8),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: getHeightPercent(3.0),
        borderColor: 'white',
        marginStart: getHeightPercent(2.0)
    },

    // Slide Style
    slide: {
        width: itemWidth,
        height: itemHeight,
        justifyContent: 'center',
        alignItems: 'center',

    },
    slideItemView: {
        width: getHeightPercent(26.6),
        height: getHeightPercent(36.8),
        borderRadius: getHeightPercent(1.0),
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    slideItemText1Back: {
        backgroundColor: '#F8E71C',
        borderRadius: getHeightPercent(3.0),
        flexDirection: 'row',
        width: getHeightPercent(8.8),
        height: getHeightPercent(3.6),
        alignItems: 'center',
        justifyContent: 'center'
    },
    slideItemText1: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        color: 'black',
        fontSize: getHeightPercent(1.6),
    },
    slideItemText2: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        color: 'black',
        fontSize: getHeightPercent(1.2),
    },
    slideItemText3: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        color: 'white',
        fontSize: getHeightPercent(2.8),
        marginTop: getHeightPercent(1.6)
    },
    slideItemText4: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        color: 'white',
        fontSize: getHeightPercent(2.0),
        marginTop: getHeightPercent(1.6)
    },
    slideItemAvatar: {
        width: getHeightPercent(9.2),
        height: getHeightPercent(9.2),
        borderRadius: getHeightPercent(2.0),
        marginTop: getHeightPercent(1.4)
    },
})