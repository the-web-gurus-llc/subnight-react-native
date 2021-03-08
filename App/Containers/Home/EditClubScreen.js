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
import LinearGradient from 'react-native-linear-gradient';
import { ApplicationStyles, Values } from "../../Theme";
import { getHeightPercent } from './../../Services/RadioService'
import MoneyModal from './../../Components/MoneyModal'
import { apiManager } from "../../Network/ApiManager";
import { connect } from 'react-redux';
import { dialogUtil } from './../../Util/DialogUtil'

import MapView, {
    Marker,
    Callout,
} from 'react-native-maps';
import mapStyle from "./MapStyle"
import CustomCallout from "./CustomCallout"
import { getPlaceDetailWithCoordinates } from "../../Services/HelperService";

const TAG = "EditClubScreen: "

class EditClubScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            giftModalVisible: false,
            peopleModalVisible: false,
            place: {
                name: "aaa",
                formatted_address: "bbb",
                latitude: this.props.startup.latitude,
                longitude: this.props.startup.longitude
            },
            address: ""
        }

    }

    componentDidMount() {
        getPlaceDetailWithCoordinates(this.props.startup.latitude, this.props.startup.longitude, res => {
            console.log(res);
            if(res.length >= 1) this.setState({address: res[0].formatted_address});
        })
    }

    onPressClose() {
        this.props.navigation.navigate(this.props.navigation.getParam("parent"), {
            postItem: this.props.navigation.getParam("postItem")
        })
    }

    onPressGift() {
        this.setState({ giftModalVisible: true })
    }

    onPressPeople() {
        this.setState({ peopleModalVisible: true })
    }

    onClickConfirmReservation(body) {
        const postItem = this.props.navigation.getParam("postItem");
        body = { ...body, club_id: postItem._id }
        console.log("body -> ", body);
        apiManager.makeReservation(this.props.userToken.token, body).then(res => {
            console.log(TAG, "makeReservation result -> ", res);
            dialogUtil.showAlert("Success", "Created successfully");
        }).catch(error => {
            console.log(TAG, "makeReservation error -> ", error);
        })
    }

    render() {
        const { place } = this.state;

        return (
            <Animated.View style={[styles.container, {}]}>
                <View style={styles.bodyContainer}>
                    <MapView
                        initialRegion={{
                            latitude: Number(place.latitude - 0.01),
                            longitude: Number(place.longitude),
                            latitudeDelta: 0.1,
                            longitudeDelta: 0.1,
                        }}
                        style={styles.mapViewStyle}>
                        <Marker
                            coordinate={{ latitude: Number(place.latitude), longitude: Number(place.longitude) }}
                            title={place.name}
                            pinColor={"#F8E71C"}
                            description={place.formatted_address}
                        >
                            <Callout
                                alphaHitTest
                                tooltip
                                style={styles.customView}
                            >
                                <CustomCallout>
                                    <Text style={styles.customViewText}>{this.state.address}</Text>
                                </CustomCallout>
                            </Callout>
                        </Marker>
                    </MapView>
                    <View style={{ width: '100%', height: getHeightPercent(33.4) }} pointerEvents={"box-none"}>

                    </View>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingHorizontal: getHeightPercent(2.0) }}>
                        <TouchableOpacity style={{ marginTop: getHeightPercent(0.0) }} onPress={() => this.onPressPeople()}>
                            <Image source={Images.ic_people_round} style={styles.giftImg} resizeMode={"contain"} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginTop: getHeightPercent(0.0) }} onPress={() => this.onPressGift()}>
                            <Image source={Images.ic_gift} style={styles.giftImg} resizeMode={"contain"} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, marginHorizontal: getHeightPercent(2.0) }}>
                        <MoneyModal
                            isModal={false}
                            club={this.props.navigation.getParam("postItem")}
                            onClickConfirm={(body) => this.onClickConfirmReservation(body)}
                        />
                    </View>

                </View>

                <Modal
                    animationType={"fade"}
                    animationInTiming={500}
                    animationOutTiming={500}
                    visible={this.state.giftModalVisible}
                    transparent={true}
                >
                    <TouchableOpacity style={styles.giftModal} onPress={() => { this.setState({ giftModalVisible: false }) }} activeOpacity={1.0}>
                        <TouchableOpacity style={styles.giftModalContainer}
                            activeOpacity={1.0}
                            onPress={() => { this.setState({ giftModalVisible: false }) }}>
                            <View style={{ marginTop: getHeightPercent(2.0) }}>
                                <View style={{ marginTop: getHeightPercent(0.8), width: '100%', height: '100%', alignItems: 'center' }}>
                                    <Text style={styles.giftModalText1}>Go there and earn 20 XP SubPoints</Text>
                                    <Text style={styles.giftModalText2}>Let’s go there !</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>

                <Modal
                    animationType={"fade"}
                    animationInTiming={500}
                    animationOutTiming={500}
                    visible={this.state.peopleModalVisible}
                    transparent={true}
                >
                    <TouchableOpacity style={styles.giftModal} onPress={() => { this.setState({ peopleModalVisible: false }) }} activeOpacity={1.0}>
                        <TouchableOpacity style={styles.uberModalContainer}
                            activeOpacity={1.0}
                            onPress={() => { this.setState({ peopleModalVisible: false }) }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: getHeightPercent(2.0) }}>
                                <View style={{ marginTop: getHeightPercent(0.6), }}>
                                    <Text style={styles.uberModalText1}>Go there with Uber</Text>
                                    <Text style={styles.uberModalText2}>£15 - £17</Text>
                                </View>
                                <Image source={Images.ic_uber} style={styles.peopleSubImg} resizeMode={"contain"} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.uberModalContainer, styles.kaptenModalContainer]}
                            activeOpacity={1.0}
                            onPress={() => { this.setState({ peopleModalVisible: false }) }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: getHeightPercent(0.6) }}>
                                <View style={{ marginTop: getHeightPercent(0.0), }}>
                                    <View style={styles.recommendedTextBack}>
                                        <Text style={styles.recommendedText}>Recomanded</Text>
                                    </View>
                                    <Text style={[styles.giftModalText1, { marginTop: getHeightPercent(0.4) }]}>Go there with Kapten</Text>
                                    <Text style={styles.giftModalText2}>£15 - £17    -40% with the code : Subnight20</Text>
                                </View>
                                <Image source={Images.ic_k} style={[styles.peopleSubImg, { marginTop: getHeightPercent(0.4) }]} resizeMode={"contain"} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.uberModalContainer, styles.boltModalContainer]}
                            activeOpacity={1.0}
                            onPress={() => { this.setState({ peopleModalVisible: false }) }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: getHeightPercent(1.4) }}>
                                <View style={{ marginTop: getHeightPercent(1.2), }}>
                                    <Text style={styles.giftModalText1}>Go there with Bolt</Text>
                                    <Text style={styles.giftModalText2}>£15 - £17</Text>
                                </View>
                                <Image source={Images.ic_bolt} style={styles.peopleSubImg} resizeMode={"contain"} />
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
                <View style={styles.titleContainer}>
                    <View style={styles.openContainer}>
                        <Text style={styles.openText}>Open</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.onPressClose()}>
                        <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='#FFFFFF' />
                    </TouchableOpacity>
                    <Text style={styles.authTitleText}>Scandal</Text>
                </View>
            </Animated.View>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        profile: state.user.profile,
        userToken: state.startup.userToken,
        startup: state.startup
    }
};

export default connect(mapStateToProps)(EditClubScreen)

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.screen.container,
        backgroundColor: '#2B2D2F'
    },
    titleContainer: {
        ...ApplicationStyles.screen.topContainer
    },
    bodyContainer: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    authTitleText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        ...ApplicationStyles.authScreen.authTitleText
    },
    openContainer: {
        position: 'absolute', justifyContent: 'center', alignItems: 'center',
        top: getHeightPercent(5.0),
        bottom: 0,
        left: 0,
        right: 0
    },
    openText: {
        ...ApplicationStyles.authScreen.sfProBoldFont,
        fontSize: getHeightPercent(1.6),
        color: '#58FF00',
    },
    navContainer: {
        marginTop: getHeightPercent(3.4),
        width: '100%',
        height: getHeightPercent(6.4),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    navItem: {
        height: '100%',
        aspectRatio: 1
    },
    bodyText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        width: '100%',
        textAlign: 'center',
        fontSize: getHeightPercent(1.8),
        color: 'white'
    },
    giftImg: {
        width: getHeightPercent(5.6),
        height: getHeightPercent(5.6),
    },
    peopleSubImg: {
        width: getHeightPercent(7.2),
        height: getHeightPercent(7.2),
    },
    peopleSubView: {
        width: '100%',
        marginTop: getHeightPercent(2.6),
        flexDirection: 'row',
        paddingHorizontal: getHeightPercent(5.6),
        justifyContent: 'space-between'
    },
    peopleSubImg: {
        width: getHeightPercent(7.2),
        height: getHeightPercent(7.2),
    },

    // Gift Modal Style
    giftModal: {
        flex: 1,
        backgroundColor: '#6E707070',
        alignItems: 'center',
    },
    giftModalContainer: {
        width: '92%',
        height: getHeightPercent(9.6),
        marginTop: getHeightPercent(4.8),
        borderRadius: 10,
        backgroundColor: '#FF3D71',
        justifyContent: 'center'
    },
    giftModalText1: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(2.0),
        color: 'white'
    },
    giftModalText2: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(1.6),
        color: 'white',
        marginTop: getHeightPercent(0.6)
    },

    // Uber Modal Style
    uberModalContainer: {
        width: '92%',
        height: getHeightPercent(10.0),
        marginTop: getHeightPercent(4.8),
        borderRadius: 10,
        backgroundColor: 'white',
        paddingLeft: getHeightPercent(2.2),
        paddingRight: getHeightPercent(0.6)
    },
    uberModalText1: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(2.0),
        color: 'black'
    },
    uberModalText2: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(1.6),
        color: 'black',
        marginTop: getHeightPercent(0.6)
    },

    // kaptenModal style
    kaptenModalContainer: {
        marginTop: getHeightPercent(2.0),
        backgroundColor: '#08597F',
        borderColor: 'white',
        borderWidth: 2
    },
    recommendedText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(1.0),
        color: 'white'
    },
    recommendedTextBack: {
        backgroundColor: '#FF3354',
        borderRadius: 30,
        height: getHeightPercent(1.8),
        width: getHeightPercent(7.8),
        justifyContent: 'center',
        alignItems: 'center'
    },

    // bolt Modal Style
    boltModalContainer: {
        marginTop: getHeightPercent(2.0),
        backgroundColor: '#33D085',
    },

    //mapstyle
    mapViewStyle: {
        width: '100%',
        height: '60%',
        position: 'absolute'
    },
    customView: {
        width: getHeightPercent(30.0),
        height: getHeightPercent(5.0)
    },
    customViewText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(1.4),
        color: 'black'
    }
})