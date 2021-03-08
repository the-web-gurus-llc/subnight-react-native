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
    Modal,
    FlatList,
} from "react-native";
import { Icon } from 'react-native-elements';
import Images from '../../Theme/Images'
import { ApplicationStyles, Values } from "../../Theme";
import { getHeightPercent } from './../../Services/RadioService'
import { SwipeListView } from 'react-native-swipe-list-view';
import { connect } from 'react-redux';
import { apiManager } from "../../Network/ApiManager";
import { dateTimeUtil } from "../../Util/DateTimeUtil";
import { dialogUtil } from "./../../Util/DialogUtil";

const TAG = "ChatListScreen: "
const hiddenViewWidth = getHeightPercent(7.8)

class ChatListScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chatList: [],
            deleteModalVisible: false
        }

        this.rowTranslateAnimatedValues = {};
        Array(20).fill('').forEach((_, i) => {
            this.rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
        });
    }

    componentDidMount() {
        var chatList = []
        var newChatList = []

        const query = {
            with: ['users', 'club'],
            sort: '-last_sent'
        }

        apiManager.getConversation(this.props.userToken.token, query).then(async res => {
            console.log(TAG, "getConversation success -> ", res);
            chatList = res.data.data;
            for (var i = 0; i < chatList.length; i++) {
                const userRes = await apiManager.getUser(this.props.userToken.token, chatList[i].request_user_id);
                if (userRes.data.status == 200) {
                    newChatList.push({ ...chatList[i], name: userRes.data.data.name, key: (i + 1).toString() })
                }
            }
            console.log(newChatList)
            this.setState({ chatList: newChatList })
        }).catch(error => {
            console.log(TAG, "getConversation error -> ", error)
        })
    }

    onPressClose() {
        this.props.navigation.navigate('Home')
    }

    onPressItem(item) {
        this.props.navigation.navigate('ChattingRoomScreen', {
            conversation: item
        })
    }

    onPressDeleteItem(data) {
        console.log("onPressDelete item -> ", data)
        this.data = data
        this.setState({ deleteModalVisible: true })
    }

    onPressYesDelete() {
        this.setState({ deleteModalVisible: false })
        if (!this.animationIsRunning) {
            this.animationIsRunning = true;
            Animated.timing(this.rowTranslateAnimatedValues[this.data.item.key], { toValue: 0, duration: 200 }).start(() => {
                apiManager.deleteConversation(this.props.userToken.token, this.data.item._id).then(res => {
                    const newData = [...this.state.chatList];
                    newData.splice(this.data.index, 1);
                    this.setState({ chatList: newData });
                    this.animationIsRunning = false;
                }).catch(error => {
                    console.log("delete conversation error -> ", error)
                    dialogUtil.showWarning("Warning", "Failed, please try again later.");
                })
                
            });
        }
    }

    onPressNoDelete() {
        this.setState({ deleteModalVisible: false })
        this.selectedRow.closeRow();
    }

    renderItem = ({ item, index }) => {

        var unread = item.unread_counts[this.props.profile._id]
        if (unread == null) unread = 0;
        const time = dateTimeUtil.getChatListTime(item.updated_at);

        return (

            <Animated.View style={[
                {
                    height: this.rowTranslateAnimatedValues[item.key].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, getHeightPercent(13.6)],
                    })
                }
            ]}>

                <TouchableOpacity style={styles.item} activeOpacity={0.8} onPress={() => { this.onPressItem(item) }}>
                    {
                        unread === 0 ? (
                            <View style={styles.modalContainer}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image source={Images.ic_customer_service} style={styles.modalImg} resizeMode={"contain"} />
                                    <View style={{ flex: 1, marginEnd: getHeightPercent(1.0) }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={styles.modalText1}>{item.name}</Text>
                                            <Text style={styles.timeText}>{time}</Text>
                                        </View>
                                        <Text style={[styles.modalText2, { flex: 1 }]}>{item.last_message}</Text>
                                    </View>
                                </View>
                            </View>
                        ) : (
                                <View>
                                    <View style={styles.modalContainer}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Image source={Images.ic_customer_service} style={styles.modalImg} resizeMode={"contain"} />
                                            <View style={{ flex: 1, marginEnd: getHeightPercent(1.0) }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Text style={styles.modalText1}>{item.name}</Text>
                                                    <Text style={styles.timeText}>{time}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                                                    <Text style={styles.modalText2}>{item.last_message}</Text>
                                                    <View style={styles.badgeView}>
                                                        <Text style={styles.badgeText}>{unread}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.hintModal} />
                                </View>
                            )
                    }

                </TouchableOpacity>

            </Animated.View>

        )
    };

    keyExtractor = (item, index) => index.toString();

    render() {
        return (
            <Animated.View style={[styles.container, {}]}>
                <View style={styles.titleContainer}>
                    <TouchableOpacity onPress={() => this.onPressClose()}>
                        <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='#FFFFFF' />
                    </TouchableOpacity>
                    <Text style={styles.authTitleText}>Chat</Text>
                </View>
                <View style={styles.mainContainer}>
                    <TouchableOpacity style={[styles.item, { height: getHeightPercent(13.4) }]} onPress={() => { }}>
                        <View style={[styles.modalContainerService]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Image source={Images.ic_customer_service} style={styles.modalImgService} resizeMode={"contain"} />
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={[styles.modalText1, { color: 'white' }]}>Customer Service</Text>
                                        <Text style={[styles.timeText, { color: 'white' }]}>01:47</Text>
                                    </View>
                                    <Text style={[styles.modalText2, { color: 'white' }]}>Bien sûr ! C’est à toi de voir… Je te laisse réfléchir 🤔 </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <SwipeListView
                        ref={(swipeListView) => { this.refSwipeListView = swipeListView; }}
                        data={this.state.chatList}
                        extraData={this.state.chatList}
                        showsVerticalScrollIndicator={false}
                        renderItem={this.renderItem}
                        renderHiddenItem={(data, rowMap) => (
                            <View style={styles.rowBack}>
                                <TouchableOpacity onPress={() => { this.onPressDeleteItem(data); this.selectedRow = rowMap[data.item.key]; }}>
                                    <Text style={styles.rowBackText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        rightOpenValue={-hiddenViewWidth}
                    />
                </View>

                <Modal
                    animationType={"fade"}
                    animationInTiming={500}
                    animationOutTiming={500}
                    visible={this.state.deleteModalVisible}
                    transparent={true}
                >
                    <View style={styles.deleteModal} >
                        <View style={styles.deleteModalContainer}>
                            <View style={{ flexDirection: 'row', marginTop: getHeightPercent(0.4) }}>
                                <View style={{ marginTop: getHeightPercent(0.8), width: '100%', height: '100%', alignItems: 'center' }}>
                                    <Text style={styles.deleteModalText1}>Are you sure ?</Text>
                                    <Text style={[styles.deleteModalText2, { marginTop: getHeightPercent(0.8) }]}>Are you sure you want to delete the conversation ?</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: getHeightPercent(1.4) }}>
                                        <TouchableOpacity style={[styles.deleteModalBtnBack, { backgroundColor: 'transparent' }]} onPress={() => this.onPressYesDelete()}>
                                            <Text style={[styles.deleteModalText1, { color: 'black' }]}>Yes</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.deleteModalBtnBack]} onPress={() => this.onPressNoDelete()}>
                                            <Text style={styles.deleteModalText1}>No</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

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

export default connect(mapStateToProps)(ChatListScreen)

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.screen.container,
    },
    titleContainer: {
        ...ApplicationStyles.screen.topContainer
    },
    mainContainer: {
        marginHorizontal: Values.mainPaddingHorizontal,
        marginTop: getHeightPercent(3.4),
        flex: 1
    },
    authTitleText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        ...ApplicationStyles.authScreen.authTitleText
    },
    customerService: {
        width: '100%',
        height: getHeightPercent(16.6),
        backgroundColor: 'red'
    },
    item: {
        width: '100%',
        height: getHeightPercent(13.6),
    },
    modalContainerService: {
        width: '100%',
        height: getHeightPercent(10.4),
        paddingLeft: getHeightPercent(1.8),
        borderRadius: 10,
        borderWidth: 2.5,
        borderColor: '#F8E71C',
        justifyContent: 'center'
    },
    modalContainer: {
        width: '100%',
        height: getHeightPercent(9.6),
        paddingLeft: getHeightPercent(1.8),
        borderRadius: 10,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    hintModal: {
        height: getHeightPercent(9.6),
        width: getHeightPercent(1.0),
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        backgroundColor: "#F8E71C",
        position: 'absolute'
    },
    modalImgService: {
        width: getHeightPercent(5.2),
        height: getHeightPercent(5.2),
        marginRight: getHeightPercent(1.4),
    },
    modalImg: {
        width: getHeightPercent(4.6),
        height: getHeightPercent(4.6),
        marginRight: getHeightPercent(2.0),
        borderRadius: getHeightPercent(1.0),
    },
    modalText1: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(2.0),
        color: 'black',
    },
    modalText2: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(1.44),
        color: 'black',
        marginTop: getHeightPercent(0.2),
    },
    badgeView: {
        width: getHeightPercent(3.0),
        height: getHeightPercent(3.0),
        backgroundColor: "#F8E71C",
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: getHeightPercent(1.6),
        marginRight: getHeightPercent(1.0)
    },
    badgeText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(1.7),
        color: 'black'
    },
    timeText: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(1.2),
        color: 'black',
        marginRight: getHeightPercent(1.0)
    },
    rowBack: {
        alignItems: 'flex-end',
        marginTop: getHeightPercent(4.0),
        marginEnd: getHeightPercent(2.0)
    },
    rowBackText: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(1.4),
        color: '#FF3D71'
    },
    deleteModal: {
        flex: 1,
        backgroundColor: '#6E707070',
        alignItems: 'center',
    },
    deleteModalContainer: {
        width: '90%',
        height: getHeightPercent(14.2),
        paddingLeft: getHeightPercent(2.2),
        marginTop: getHeightPercent(4.2),
        borderRadius: 10,
        backgroundColor: '#FF3D71',
        justifyContent: 'center'
    },
    deleteModalText1: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(2.0),
        color: 'white'
    },
    deleteModalText2: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(1.6),
        color: 'white',
        marginTop: getHeightPercent(0.2)
    },
    deleteModalBtnBack: {
        backgroundColor: 'black',
        width: getHeightPercent(8.0),
        height: getHeightPercent(4.0),
        borderRadius: getHeightPercent(2.0),
        alignItems: 'center',
        justifyContent: 'center'
    }
})