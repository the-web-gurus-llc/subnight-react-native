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
    Modal
} from "react-native";
import { Icon } from 'react-native-elements';
import Images from '../../Theme/Images'
import { ApplicationStyles, Values } from "../../Theme";
import { getHeightPercent } from './../../Services/RadioService'
import MoneyModal from './../../Components/MoneyModal'
import { connect } from 'react-redux';
import { apiManager } from "../../Network/ApiManager";
import { dateTimeUtil } from './../../Util/DateTimeUtil'
import { dialogUtil } from './../../Util/DialogUtil'

const DUBAI_FILTER = "Dubai"
const PARIS_FILTER = "Paris"
const LONDON_FILTER = "London"

const TAG = "BookingScreen: "

class BookingScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            countryFilter: LONDON_FILTER,

            bookingList: []
        }

    }

    componentDidMount() {
        this.loadBookingData();
    }

    loadBookingData() {
        var bookingList = []
        var newBookingList = []

        apiManager.getReservationList(this.props.userToken.token, "").then(async res => {
            console.log(TAG, "getReservationList success -> ", res);
            bookingList = res.data.data;
            bookingList = bookingList.sort((a, b) => dateTimeUtil.compareTwoClubTime(a.date, b.date))
            for (var i = 0; i < bookingList.length; i++) {
                const clubRes = await apiManager.getClub(this.props.userToken.token, bookingList[i].club_id);
                if (clubRes.data.status == 200) {
                    if (bookingList[i].status != "hidden") {
                        var content = `${bookingList[i].ladies != null ? bookingList[i].ladies : 0} girls / ${bookingList[i].gentlemen != null ? bookingList[i].gentlemen : 0} boys`
                        if (bookingList[i].price != 0) content = `£${bookingList[i].price} - ${content}`
                        newBookingList.push({
                            ...clubRes.data.data,
                            ...bookingList[i], 
                            clubName: clubRes.data.data.name, 
                            content: content, 
                        })
                    }
                }
            }
            this.setState({ bookingList: newBookingList })
        }).catch(error => {
            console.log(TAG, "getReservationList error -> ", error)
        })
    }

    onPressClose() {
        this.props.navigation.navigate('Setting')
    }

    onPressItemEdit(item, index) {
        this.selectedItem = item;
        this.setState({ modalVisible: true })
    }

    onPressItemCancel(item, index) {
        apiManager.deleteReservation(this.props.userToken.token, item._id).then(res => {
            console.log(TAG, "delete reservation success ->", res);
            this.loadBookingData();
        }).catch(error => {
            console.log(TAG, "delete reservation error ->", error);
            dialogUtil.showWarning("Warning", "Failed, please try again later.");
        })
    }

    onPressShare() {
        this.props.navigation.navigate('BookingShareScreen', {
            parent: "BookingScreen"
        })
    }

    onPressEdit() {
        this.props.navigation.navigate('EditClubScreen', {
            parent: "BookingScreen"
        })
    }

    onClickConfirmReservation(body) {
        this.setState({ modalVisible: false });
        apiManager.updateReservation(this.props.userToken.token, this.selectedItem._id, body).then(res => {
            console.log(TAG, "update reservation success ->", res);
            this.loadBookingData();
        }).catch(error => {
            console.log(TAG, "update reservation error ->", error);
            dialogUtil.showWarning("Warning", "Failed, please try again later.");
        })
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={styles.item}>
                <Text style={styles.dateText}>{dateTimeUtil.getPostDetail(item.date)}</Text>
                <View style={styles.itemBody}>
                    {/* <Image source={Images.ic_detail_unsel} style={styles.itemImg} resizeMode={"cover"} /> */}
                    <Image source={{uri: item.logo}} style={styles.itemImg} resizeMode={"contain"} />
                    <View style={[styles.subView, index == -1 && { opacity: 0.6 }]}>
                        <Text style={styles.subViewText1}>{`${item.clubName} - ${item.reservation_type}`}</Text>
                        <Text style={styles.subViewText2}>{item.content}</Text>
                    </View>
                    {
                        index == -1 &&
                        <View style={{ flexDirection: 'row-reverse' }}>
                            <TouchableOpacity onPress={() => this.onPressShare()}>
                                <Image source={Images.ic_booking_share} style={styles.itemBtnImg} resizeMode={"contain"} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onPressEdit()}>
                                <Image source={Images.ic_booking_love} style={[styles.itemBtnImg, { marginRight: getHeightPercent(1.8) }]} resizeMode={"contain"} />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                {

                    <View style={styles.itemBottom}>
                        <TouchableOpacity onPress={() => this.onPressItemCancel(item, index)}>
                            <Text style={styles.btnText}>{"Cancel"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onPressItemEdit(item, index)}>
                            <Text style={styles.btnText}>{"Edit"}</Text>
                        </TouchableOpacity>
                    </View>
                }

            </View>
        )
    };

    keyExtractor = (item, index) => index.toString();

    render() {

        const bookingList = this.state.bookingList.filter(v => v.city === this.state.countryFilter);

        return (
            <Animated.View style={[styles.container, {}]}>
                <View style={styles.titleContainer}>
                    <TouchableOpacity onPress={() => this.onPressClose()}>
                        <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='#FFFFFF' />
                    </TouchableOpacity>
                    <Text style={styles.authTitleText}>My booking(s)</Text>
                </View>
                <View style={styles.mainContainer}>
                    <View style={styles.flagView}>
                        <TouchableOpacity onPress={() => { this.setState({ countryFilter: DUBAI_FILTER }) }}>
                            <Text style={[styles.flagText, this.state.countryFilter !== DUBAI_FILTER && { opacity: 0.6 }]}>Dubai 🇦🇪</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.setState({ countryFilter: PARIS_FILTER }) }}>
                            <Text style={[styles.flagText, this.state.countryFilter !== PARIS_FILTER && { opacity: 0.6 }]}>Paris 🇫🇷</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.setState({ countryFilter: LONDON_FILTER }) }}>
                            <Text style={[styles.flagText, this.state.countryFilter !== LONDON_FILTER && { opacity: 0.6 }]}>London 🇬🇧</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: getHeightPercent(2.6), flex: 1 }}>
                        <FlatList
                            data={bookingList}
                            renderItem={this.renderItem}
                            showsVerticalScrollIndicator={false}
                            horizontal={false}
                            keyExtractor={this.keyExtractor}
                        />
                    </View>
                </View>
                <Modal
                    animationType={"fade"}
                    animationInTiming={500}
                    animationOutTiming={500}
                    visible={this.state.modalVisible}
                    transparent={true}
                >
                    <MoneyModal
                        isModal={true}
                        confirmReservationText={"Update"}
                        club={this.selectedItem}
                        onClickOutSide={() => this.setState({ modalVisible: false })}
                        onClickConfirm={(body) => this.onClickConfirmReservation(body)}
                    />
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

export default connect(mapStateToProps)(BookingScreen)

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.screen.container,
    },
    titleContainer: {
        ...ApplicationStyles.screen.topContainer
    },
    mainContainer: {
        marginHorizontal: Values.mainPaddingHorizontal,
        flex: 1
    },
    authTitleText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        ...ApplicationStyles.authScreen.authTitleText
    },
    flagView: {
        height: getHeightPercent(8),
        flexDirection: 'row',
        alignItems: 'center'
    },
    flagText: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(2.0),
        color: '#FFFFFF',
        marginRight: getHeightPercent(3.0),
    },
    item: {
        height: getHeightPercent(22),
        width: '100%'
    },
    dateText: {
        ...ApplicationStyles.authScreen.sfProBoldFont,
        fontSize: getHeightPercent(1.8),
        color: '#FFFFFF'
    },
    itemBody: {
        height: getHeightPercent(9.6),
        width: '100%',
        marginTop: getHeightPercent(3.4),
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        paddingHorizontal: getHeightPercent(1.6),
        alignItems: 'center'
    },
    itemBottom: {
        marginTop: getHeightPercent(1.6),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    btnText: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(1.2),
        color: '#FFFFFF'
    },
    itemImg: {
        width: getHeightPercent(6.2),
        height: getHeightPercent(6.2),
        borderRadius: 16,
        backgroundColor: 'black'
    },
    subView: {
        marginLeft: getHeightPercent(1.4),
        marginRight: getHeightPercent(1.4),
        flex: 1,
    },
    subViewText1: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(2.0),
        color: 'black'
    },
    subViewText2: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(1.5),
        color: 'black',
        marginTop: getHeightPercent(0.8)
    },
    itemBtnImg: {
        width: getHeightPercent(4.4),
        height: getHeightPercent(4.4),
    },
})