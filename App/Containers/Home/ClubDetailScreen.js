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
    Dimensions
} from "react-native";
import { Icon } from 'react-native-elements';
import Images from '../../Theme/Images'
import LinearGradient from 'react-native-linear-gradient';
import { ApplicationStyles, Values } from "../../Theme";
import { getHeightPercent } from './../../Services/RadioService'
import Carousel from 'react-native-snap-carousel';
import MoneyModal from './../../Components/MoneyModal'
import { apiManager } from "../../Network/ApiManager";
import { connect } from 'react-redux';
import { dialogUtil } from './../../Util/DialogUtil'
import Video from 'react-native-video';
import { dateTimeUtil } from "../../Util/DateTimeUtil";
import MediaFullScreen from "./MediaFullScreen";
import moment from "moment";

const sliderWidth = Dimensions.get('window').width
const sliderHeight = getHeightPercent(40.2)
const itemWidth = getHeightPercent(25.2)
const itemHeight = getHeightPercent(30.8)

const TAG = "ClubDetail: "

class ClubDetailScreen extends Component {
    constructor(props) {
        super(props);

        this.postItem = this.props.navigation.getParam("postItem");
        console.log(TAG, "postItem -> ", this.postItem);

        this.state = {
            entries: this.postItem.media,
            pageIndex: 0,
            modalVisible: false,
            fullscreenVisible: false,
            selectedImage: null,
            selectedVideo: null,
        }

    }

    onClickConfirmReservation(body) {

        if (this.postItem._id == null) {
            dialogUtil.showWarning("Warning", "Cannot find club id, please try with another one again.");
            return
        }

        this.setState({ modalVisible: false })
        body = { ...body, club_id: this.postItem._id }
        console.log("body -> ", body);
        apiManager.makeReservation(this.props.userToken.token, body).then(res => {
            console.log(TAG, "makeReservation result -> ", res);
            dialogUtil.showAlert("Success", "Created successfully");
        }).catch(error => {
            console.log(TAG, "makeReservation error -> ", error);
        })
    }

    onPressClose() {
        this.props.navigation.navigate('HomeScreen')
    }

    onPressItemEdit(item, index) {
        this.setState({ modalVisible: true })
    }

    onPressShare() {
        this.props.navigation.navigate('BookingShareScreen', {
            parent: "ClubDetailScreen",
            postItem: this.postItem
        })
    }

    onPressEdit() {
        this.props.navigation.navigate('EditClubScreen', {
            parent: "ClubDetailScreen",
            postItem: this.postItem
        })
    }

    onPressItem(image, video) {
        this.setState({
            selectedVideo: video,
            selectedImage: image,
            fullscreenVisible: true
        })
    }

    _renderItem = ({ item, index }) => {

        const musicStyles = item.music_styles;
        var musicStyleStr = ""
        if (musicStyles != null) musicStyleStr = musicStyles.join("   ");

        var image = item.image
        if (image != null) {
            if (!image.includes("http")) {
                image = Config.mediaBaseUrl + image
            }
        }

        var video = item.video
        if (video != null) {
            if (!video.includes("http")) {
                video = Config.mediaBaseUrl + video
            }
        }
        var videoPoster = item.video_poster
        if (videoPoster != null) {
            if (!videoPoster.includes("http")) {
                videoPoster = Config.mediaBaseUrl + videoPoster
            }
        }

        return (
            <TouchableOpacity style={styles.slide} onPress={() => this.onPressItem(image, video)}>
                {image != null &&
                    <Image source={{ uri: image }} style={styles.itemImg} resizeMode={"cover"} />
                }
                {video != null &&
                    <Video source={{ uri: video }}
                        ref={(ref) => {
                            this.video = ref
                        }}
                        poster={videoPoster}
                        shouldPlay={false}
                        paused={this.state.pageIndex !== index}
                        repeat={true}
                        resizeMode="cover"
                        onBuffer={this.onBuffer}
                        onError={this.videoError}
                        style={styles.itemImg} />
                }
            </TouchableOpacity>
        );
    }

    _renderSlider = () => {
        return (
            <View style={styles.slider}>
                {
                    this.state.entries.map((v, i) => {
                        return (
                            <View key={i} style={i === this.state.pageIndex ? styles.selSliderItem : styles.unSelSliderItem} />
                        )
                    })
                }
            </View>
        )
    }

    render() {

        var isOpened = false;
        console.log(this.postItem);
        const today = moment(new Date()).day()
        if(this.postItem.open_days != null) {
            isOpened = this.postItem.open_days.includes(today);
        }

        return (
            <Animated.View style={[styles.container, {}]}>
                <LinearGradient colors={['#833031', '#000']} style={{ height: '50%' }}>
                    <View style={styles.titleContainer}>
                        <View style={styles.openContainer}>
                        {isOpened &&
                            <Text style={styles.openText}>Open</Text>
                        }
                        </View>
                        <TouchableOpacity onPress={() => this.onPressClose()}>
                            <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='#FFFFFF' />
                        </TouchableOpacity>
                        <Text style={styles.authTitleText}>{this.postItem.name}</Text>
                    </View>
                    <View style={styles.middleView}>
                        {this._renderSlider()}
                        <Carousel
                            ref={(c) => { this._carousel = c; }}
                            data={this.state.entries}
                            renderItem={this._renderItem}
                            sliderWidth={sliderWidth}
                            itemWidth={itemWidth}
                            onSnapToItem={() => { this.setState({ pageIndex: this._carousel.currentIndex }); }}
                            inactiveSlideScale={0.8}
                        />
                    </View>
                </LinearGradient>
                <View style={styles.middleContainer}>
                    <Text style={styles.middleTitleText}>{dateTimeUtil.getPostDetail(this.state.entries[this.state.pageIndex].updated_at)}</Text>
                    {/* <Text style={[styles.middleText1, styles.middleText1Margin]}>Throwing a little party tonight</Text> */}
                    {/* <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.middleText1, styles.middleText2Margin]}>with </Text>
                        <Text style={[styles.middleText2, styles.middleText2Margin]}>Wiz kid</Text>
                    </View>
                    <Text style={[styles.middleText1, styles.middleText1Margin]}>{"Ready for another Friday\nnight like this ⚡️👠"}</Text>
                    <Text style={[styles.middleText1, styles.middleText1Margin]}>{"Ready for another Friday\nnight like this ⚡️👠"}</Text> */}

                    <View style={{ flex: 1, alignItems: 'flex-end', flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.btnStyle} onPress={() => { this.setState({ modalVisible: true }) }}>
                            <Text style={styles.btnTextStyle}>Make a reservation</Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.onPressEdit()}>
                                <Image source={Images.ic_booking_love} style={[styles.itemBtnImg, { marginLeft: getHeightPercent(1.8) }]} resizeMode={"contain"} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onPressShare()}>
                                <Image source={Images.ic_booking_share} style={[styles.itemBtnImg, { marginLeft: getHeightPercent(1.8) }]} resizeMode={"contain"} />
                            </TouchableOpacity>
                        </View>
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
                        club={this.postItem}
                        onClickOutSide={() => this.setState({ modalVisible: false })}
                        onClickConfirm={(body) => this.onClickConfirmReservation(body)}
                    />
                </Modal>
                {this.state.fullscreenVisible &&
                    <MediaFullScreen
                        image={this.state.selectedImage}
                        video={this.state.selectedVideo}
                        onPressClose={() => this.setState({fullscreenVisible: false})}
                    />
                }

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

export default connect(mapStateToProps)(ClubDetailScreen)

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.screen.container,
    },
    middleContainer: {
        marginHorizontal: getHeightPercent(2.8),
        marginTop: getHeightPercent(6.0),
        marginBottom: getHeightPercent(5.0),
        flex: 1
    },
    titleContainer: {
        ...ApplicationStyles.screen.topContainer
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
    middleTitleText: {
        ...ApplicationStyles.authScreen.sfProBoldFont,
        fontSize: getHeightPercent(3.6),
        color: "#FFFFFF",
    },
    middleText1: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(2.2),
        color: "#FFFFFF",
    },
    middleText2: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(2.3),
        color: "#F8E71C",
    },
    middleText1Margin: {
        marginTop: getHeightPercent(1.8)
    },
    middleText2Margin: {
        marginTop: getHeightPercent(0.4)
    },
    itemBtnImg: {
        width: getHeightPercent(5.4),
        height: getHeightPercent(5.4),
        tintColor: 'white'
    },
    btnStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8E71C',
        borderRadius: getHeightPercent(3.2),
        height: getHeightPercent(5.4),
        flex: 1
    },
    btnTextStyle: {
        ...ApplicationStyles.authScreen.sfProBoldFont,
        fontSize: getHeightPercent(1.8),
        color: 'black'
    },
    middleView: {
        width: '100%',
        height: '100%',
        justifyContent: "center",
        alignItems: 'center',
    },
    slide: {
        width: itemWidth,
        height: itemHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemImg: {
        width: getHeightPercent(21.6),
        height: getHeightPercent(30.8),
        borderRadius: getHeightPercent(0.6)
    },
    slider: {
        marginTop: getHeightPercent(2.0),
        marginBottom: getHeightPercent(2.0),
        alignItems: 'center',
        flexDirection: 'row'
    },
    selSliderItem: {
        width: 30,
        height: getHeightPercent(0.4),
        borderRadius: getHeightPercent(0.2),
        backgroundColor: 'white'
    },
    unSelSliderItem: {
        width: 30,
        height: getHeightPercent(0.2),
        backgroundColor: 'white',
        opacity: 0.5
    }
})