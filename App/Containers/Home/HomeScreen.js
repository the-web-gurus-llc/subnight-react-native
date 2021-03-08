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
import Images from '../../Theme/Images'
import { Icon } from 'react-native-elements';
import { ApplicationStyles, Values } from "../../Theme";
import Config from './../../Config/Config';
import { getHeightPercent } from './../../Services/RadioService'
import Carousel from 'react-native-snap-carousel';
import MoneyModal from './../../Components/MoneyModal'
import SelectCountryModal from './../../Components/SelectCountryModal'

import { RNCamera } from "react-native-camera";
import Video from 'react-native-video';
import { apiManager } from "../../Network/ApiManager";
import { connect } from 'react-redux';
import { dateTimeUtil } from "../../Util/DateTimeUtil";

const { width, height } = Dimensions.get('window')

const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
};

const sliderWidth = Dimensions.get('window').width - getHeightPercent(4.8)
const itemWidth = getHeightPercent(29.4)
const itemHeight = getHeightPercent(37.2)

const sliderWidthPosts = Dimensions.get('window').width
const itemWidthPosts = Dimensions.get('window').width * 0.76

const countryFilterInitValue = 2;

const TAG = "HomeScreen: "

class Item extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isPause: this.props.index === this.props.pageIndexPosts
        }
    }

    componentWillUnmount() {
        if (this.video) {
            // this.video.unloadAsync();
        }
    }

    async play() {
        if (this.video) {
            this.setState({ isPause: false })
        }
        // const status = await this.video.getStatusAsync();
        // if (status.isPlaying) {
        //     return;
        // }
        // return this.video.playAsync();
    }

    pause() {
        if (this.video) {
            // this.video.pauseAsync();
            this.setState({ isPause: true })
        }
    }

    render() {
        const item = this.props.item;

        const musicStyles = item.music_styles;
        var musicStyleStr = ""
        if (musicStyles != null) musicStyleStr = musicStyles.join("   ");

        var image = item.media[0].image
        if (image != null) {
            if (!image.includes("http")) {
                image = Config.mediaBaseUrl + image
            }
        }

        var video = item.media[0].video
        if (video != null) {
            if (!video.includes("http")) {
                video = Config.mediaBaseUrl + video
            }
        }
        var videoPoster = item.media[0].video_poster
        if (videoPoster != null) {
            if (!videoPoster.includes("http")) {
                videoPoster = Config.mediaBaseUrl + videoPoster
            }
        }

        // video = "uploads/3fca37f0740011e9ac7589a35e01472e_video.mp4";
        // video = Config.mediaBaseUrl + video
        // console.log(video)

        return (
            <TouchableOpacity style={[styles.item]} onPress={() => this.props.onPressClubItem(item)}>
                <View style={{ flex: 1, flexDirection: 'column-reverse', paddingRight: getHeightPercent(3.6) }}>
                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        {
                            item.logo != null ? (
                                <Image source={{ uri: item.logo }} style={{ width: getHeightPercent(6.4), height: getHeightPercent(6.4), borderRadius: getHeightPercent(2.0) }} resizeMode={"contain"} />
                            ) : (
                                    <Image source={Images.ic_post_item_sub} style={{ width: getHeightPercent(6.4), height: getHeightPercent(6.4), borderRadius: getHeightPercent(2.0) }} resizeMode={"contain"} />
                                )
                        }
                        <View style={{ flex: 1, marginLeft: getHeightPercent(2.0), justifyContent: 'space-between', paddingVertical: getHeightPercent(1.2) }}>
                            <Text style={styles.itemText1}>{item.name}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.itemText2}>{musicStyleStr}</Text>
                            </View>
                        </View>
                    </View>
                    {image != null &&
                        <Image source={{ uri: image }} style={styles.itemImage} resizeMode={"cover"} />
                    }
                    {video != null &&
                        <Video source={{ uri: video }}
                            ref={(ref) => {
                                this.video = ref
                            }}
                            poster={videoPoster}
                            shouldPlay={false}
                            paused={this.state.isPause}
                            repeat={true}
                            resizeMode="cover"
                            onBuffer={this.onBuffer}
                            onError={this.videoError}
                            style={styles.itemImage} />
                    }
                </View>
            </TouchableOpacity>
        )
    }
}

class HomeScreen extends Component {
    constructor(props) {
        super(props);

        this.cellRefs = {};

        this.state = {
            pageNumber: 1,
            totalPageNumber: 1,
            isLoadingPosts: false,

            entries: [
                { image: Images.ic_avatar_two, name: 'Mehdi Bcl', text: '3 girls / 3 boys', isSel: false },
                { image: Images.ic_avatar_three, name: 'Mehdi Bcl', text: '£3000 - 3 girls / 3 boys', isSel: false },
                { image: Images.ic_avatar_two, name: 'Mehdi Bcl', text: '3 girls / 3 boys', isSel: false },
            ],
            // posts: [
            //     {
            //         image: Images.ic_image1
            //     },
            //     {
            //         image: Images.ic_image2
            //     }
            // ],
            posts: [],
            details: [
                { isSel: true, badgeCount: 7 },
                { isSel: false, badgeCount: 0 },
                { isSel: false, badgeCount: 0 },
                { isSel: false, badgeCount: 0 },
                { isSel: false, badgeCount: 0 },
                { isSel: false, badgeCount: 0 },
                { isSel: false, badgeCount: 0 },
                { isSel: false, badgeCount: 0 },
            ],
            isModal1Visible: false,
            isModal2Visible: false,

            pageIndex: 0,
            checkingStatus: 0,
            firstModalVisible: false,
            secondModalVisible: false,
            finalModalVisible: false,

            //Camera
            cameraVisible: false,
            billPic: "",

            flash: 'off',
            zoom: 0,
            autoFocus: 'on',
            autoFocusPoint: {
                normalized: { x: 0.5, y: 0.5 }, // normalized values required for autoFocusPointOfInterest
                drawRectPosition: {
                    x: Dimensions.get('window').width * 0.5 - 32,
                    y: Dimensions.get('window').height * 0.5 - 32,
                },
            },
            depth: 0,
            type: 'back',
            whiteBalance: 'auto',
            ratio: '16:9',

            // Select City
            selectCountryModalVisible: false,
            cityName: Values.supposedCityList[countryFilterInitValue].name + " " + Values.supposedCityList[countryFilterInitValue].flag,
            filterCityValue: Values.supposedCityList[countryFilterInitValue].name,

            //
            pageIndexPosts: 0
        }

        this.isHosted = false;
        this.slideAnimation = new Animated.Value(0);
    }

    componentDidMount() {

        this.loadPosts()

        setTimeout(() => {
            Animated.timing(this.slideAnimation, {
                toValue: 1,
                duration: 300
            }).start();
        }, 200);

        if (this.props.navigation.getParam("isModalVisible") != null) {
            this.setState({ isModal1Visible: true })
        }
    }

    loadPosts() {

        if (this.state.pageNumber > this.state.totalPageNumber) return;

        // this.setState({ isLoadingPosts: true });

        // apiManager.getPostsToday(this.props.userToken.token, this.state.pageNumber).then(res => {
        //     console.log(TAG, "getPosts success -> ", res);

        //     this.setState({
        //         totalPageNumber: res.data.lastPage,
        //         posts: [...this.state.posts, ...res.data.data],
        //     })
        // }).catch(error => {
        //     console.log(TAG, "getPosts error -> ", error)
        // })

        apiManager.getClubsWithPosts(this.props.userToken.token).then(res => {
            console.log(TAG, "getPosts success -> ", res);

            this.setState({
                posts: res.data.data,
            })
        }).catch(error => {
            console.log(TAG, "getPosts error -> ", error)
        })
    }

    // handleLoadMorePosts = () => {
    //     this.setState({
    //         pageNumber: this.state.pageNumber + 1
    //     }, () => {
    //         this.loadPosts();
    //     });
    // }

    onPressAvatar() {
        this.props.navigation.navigate('Setting')
    }

    onPressClubItem(item) {
        this.props.navigation.navigate('ClubDetailScreen', {
            postItem: item
        })
    }

    onPressClubStoryItem() {
        this.props.navigation.navigate('ClubStoryScreen')
    }

    onPressAllClub() {
        this.props.navigation.navigate('AllClubScreen')
    }

    onPressGoChat() {
        this.props.navigation.navigate('Chat')
    }

    onPressCheckingListItem() {
        this.props.navigation.navigate('UserProfileScreen')
    }

    onPressChecking() {
        if (this.state.checkingStatus === 0) {
            this.setState({ firstModalVisible: true })
        } else if (this.state.checkingStatus === 1) {
            this.setState({ secondModalVisible: true })
        } else {
            this.setState({ finalModalVisible: true })
        }
    }

    onClickConfirmFirstCheck() {
        const newList = this.state.entries;
        newList[this.state.pageIndex].isSel = true;
        this.setState({ firstModalVisible: false, checkingStatus: 1, entries: newList })
    }

    onClickConfirmSecondCheck() {
        this.setState({ secondModalVisible: false, checkingStatus: 2 })
    }

    onClickConfirmFinalCheck() {
        const newList = this.state.entries;
        newList[this.state.pageIndex].isSel = false;
        this.setState({ finalModalVisible: false, checkingStatus: 0, entries: newList, cameraVisible: true })
    }

    onPressCloseBill() {
        this.setState({ billPic: "" })
    }

    onPressBillChecking() {
        this.setState({ billPic: "", cameraVisible: false })
    }

    onPressBounce() {
        this.props.navigation.navigate('ChattingRoomScreen', {
            fromBounce: true,
            bounceItem: this.state.entries[this.state.pageIndex]
        })
    }

    onSelectedCity(item) {
        this.setState({
            selectCountryModalVisible: false,
            cityName: item.name + " " + item.flag,
            filterCityValue: item.name
        })
    }

    onCloseSelectCountryModal() {
        this.setState({
            selectCountryModalVisible: false,
        })
    }

    takePicture = async function () {

        const options = { fixOrientation: true, forceUpOrientation: true, quality: 1.0 };
        const data = await this.camera.takePictureAsync(options);
        console.log("take picture -> ", data.uri)
        this.setState({ billPic: data.uri })
    }

    _onViewableItemsChanged = props => {
        const changed = props.changed;
        changed.forEach(item => {
            const cell = this.cellRefs[item.key];
            if (cell) {
                if (item.isViewable) {
                    cell.play();
                } else {
                    cell.pause();
                }
            }
        });
    };

    renderItem = ({ item, index }) => {
        // return (
        //     <Item
        //         ref={ref => {
        //             this.cellRefs[index] = ref;
        //         }}
        //         item={item}
        //         pageIndexPosts={this.state.pageIndexPosts}
        //         index = {index}
        //         onPressClubItem={(item) => this.onPressClubItem(item)}
        //     />
        // )

        const musicStyles = item.music_styles;
        var musicStyleStr = ""
        if (musicStyles != null) musicStyleStr = musicStyles.join("   ");

        var image = item.media[0].image
        if (image != null) {
            if (!image.includes("http")) {
                image = Config.mediaBaseUrl + image
            }
        }

        var video = item.media[0].video
        if (video != null) {
            if (!video.includes("http")) {
                video = Config.mediaBaseUrl + video
            }
        }
        var videoPoster = item.media[0].video_poster
        if (videoPoster != null) {
            if (!videoPoster.includes("http")) {
                videoPoster = Config.mediaBaseUrl + videoPoster
            }
        }

        // video = "uploads/3fca37f0740011e9ac7589a35e01472e_video.mp4";
        // video = Config.mediaBaseUrl + video
        // console.log(video)

        return (
            <TouchableOpacity style={[styles.item]} onPress={() => this.onPressClubItem(item)}>
                <View style={{ flex: 1, flexDirection: 'column-reverse', paddingRight: getHeightPercent(3.6) }}>
                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        {
                            item.logo != null ? (
                                <Image source={{ uri: item.logo }} style={{ width: getHeightPercent(6.4), height: getHeightPercent(6.4), borderRadius: getHeightPercent(2.0) }} resizeMode={"contain"} />
                            ) : (
                                    <Image source={Images.ic_post_item_sub} style={{ width: getHeightPercent(6.4), height: getHeightPercent(6.4), borderRadius: getHeightPercent(2.0) }} resizeMode={"contain"} />
                                )
                        }
                        <View style={{ flex: 1, marginLeft: getHeightPercent(2.0), justifyContent: 'space-between', paddingVertical: getHeightPercent(1.2) }}>
                            <Text style={styles.itemText1}>{item.name}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.itemText2}>{musicStyleStr}</Text>
                            </View>
                        </View>
                    </View>
                    {image != null &&
                        <Image source={{ uri: image }} style={styles.itemImage} resizeMode={"cover"} />
                    }
                    {video != null &&
                        <Video source={{ uri: video }}
                            ref={(ref) => {
                                this.video = ref
                            }}
                            poster={videoPoster}
                            shouldPlay={false}
                            paused={this.state.pageIndexPosts !== index}
                            repeat={true}
                            resizeMode="cover"
                            onBuffer={this.onBuffer}
                            onError={this.videoError}
                            style={styles.itemImage} />
                    }
                </View>
            </TouchableOpacity>
        )
    };

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

    _renderItem = ({ item, index }) => {
        return (
            <View style={styles.slide}>
                <TouchableOpacity style={[styles.slideItemView, item.isSel ? { borderColor: '#F8E71C' } : { borderColor: 'white' }]}
                    onPress={() => { this.onPressCheckingListItem() }}>
                    <View style={styles.slideItemText1Back}>
                        <Text style={styles.slideItemText1}>140</Text>
                        <Text style={styles.slideItemText2}>xp</Text>
                    </View>
                    <Image source={item.image} style={styles.slideItemAvatar} resizeMode={"contain"} />
                    <Text style={styles.slideItemText3}>{item.name}</Text>
                    <Text style={styles.slideItemText4}>{item.text}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    _renderBillPic() {
        if (this.state.billPic == "") {
            return (null)
        } else {
            return (
                <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
                    <Image source={{ uri: this.state.billPic }} style={{ width: '100%', height: '100%', position: 'absolute' }} resizeMode={"contain"} />
                    <View style={[styles.container, { backgroundColor: 'transparent', justifyContent: 'space-between' }]}>
                        <View style={styles.topContainer}>
                            <TouchableOpacity onPress={() => this.onPressCloseBill()}>
                                <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='#FFFFFF' />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.finalBtnBack, { marginBottom: getHeightPercent(8.4) }]}>
                            <TouchableOpacity style={styles.finalBtn} onPress={() => this.onPressBillChecking()}>
                                <Text style={styles.finalBtnText}>{"Confirm check-in"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        }
    }

    _renderCamera() {
        if (this.state.cameraVisible === true) {
            return (
                <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
                    <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={{
                            justifyContent: 'space-between',
                            height: '100%'
                        }}
                        type={this.state.type}
                        flashMode={this.state.flash}
                        captureAudio={false}
                        autoFocus={this.state.autoFocus}
                        autoFocusPointOfInterest={this.state.autoFocusPoint.normalized}
                        whiteBalance={this.state.whiteBalance}
                        ratio={this.state.ratio}
                        focusDepth={this.state.depth}
                    // androidCameraPermissionOptions={{
                    //     title: 'Permission to use camera',
                    //     message: 'We need your permission to use your camera',
                    //     buttonPositive: 'Ok',
                    //     buttonNegative: 'Cancel',
                    // }}
                    >
                    </RNCamera>

                    <Text style={[styles.bodyText2, { fontSize: getHeightPercent(3.6), position: 'absolute', marginTop: getHeightPercent(5.2), marginHorizontal: getHeightPercent(2.4) }]}>
                        {"Please take a picture of the bill"}
                    </Text>

                    <View style={styles.takePictureBtnBack}>
                        <TouchableOpacity
                            style={styles.takePictureBtn}
                            onPress={this.takePicture.bind(this)}>
                            <Image source={Images.ic_take_picture_button} style={{ width: '100%', height: '100%' }} resizeMode={"contain"} />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else {
            return (
                null
            )
        }
    }

    keyExtractor = (item, index) => index.toString();

    render() {
        const avatarUrl = this.props.profile.avatar;

        const posts = this.state.posts.filter(v => v.city == this.state.filterCityValue);

        return (
            <Animated.View style={[styles.container, { opacity: this.slideAnimation }]}>
                <View style={styles.topContainer}>
                    <TouchableOpacity onPress={() => this.onPressAvatar()}>
                        {avatarUrl == null &&
                            <Image source={Images.user_avatar} style={styles.avatarStyle} resizeMode={"contain"} />
                        }
                        {avatarUrl != null &&
                            <Image source={{ uri: avatarUrl }} style={styles.avatarStyle} resizeMode={"contain"} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={this.state.selectCountryModalVisible ? styles.countryNameBackSel : styles.countryNameBackUnSel}
                        onPress={() => { this.setState({ selectCountryModalVisible: true }) }}>
                        <Text style={this.state.selectCountryModalVisible ? styles.countryNameTextSel : styles.countryNameTextUnSel}>
                            {this.state.cityName}
                        </Text>
                    </TouchableOpacity>

                    <View style={{}}>
                        <TouchableOpacity onPress={() => this.onPressGoChat()}>
                            <Image source={Images.ic_go_chat} style={{ ...ApplicationStyles.screen.goChatImage }} resizeMode={"contain"} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={ApplicationStyles.homeScreen.mainContainer}>
                    <View style={{ width: '100%', height: getHeightPercent(14) }}>
                        <FlatList
                            data={this.state.details}
                            renderItem={this.renderDetailItem}
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            keyExtractor={this.keyExtractor}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={styles.middleContainer}>
                            {this.isHosted &&
                                <View>
                                    <Text style={styles.bodyText1}>{"Jean Serge, you have"}</Text>
                                    <Text style={styles.bodyText2}>{"34 booking(s) today "}</Text>
                                </View>
                            }
                            {!this.isHosted &&
                                <View>
                                    <Text style={styles.bodyText1}>{`For you ${this.props.profile.name},`}</Text>
                                    <Text style={styles.bodyText2}>{"Today"}</Text>
                                </View>
                            }
                            {!this.isHosted &&
                                <TouchableOpacity onPress={() => this.onPressAllClub()}>
                                    <Image source={Images.ic_list} style={{ ...ApplicationStyles.screen.listImage }} resizeMode={"contain"} />
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={{ flex: 1, marginBottom: getHeightPercent(5.0) }}>
                         {/* <FlatList
                                    data={this.state.posts}
                                    renderItem={this.renderItem}
                                    onViewableItemsChanged={this._onViewableItemsChanged}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal={true}
                                    keyExtractor={this.keyExtractor}
                                    // onEndReached={this.handleLoadMorePosts}
                                    // onEndThreshold={0}
                                    // removeClippedSubviews={true}
                                    // initialNumToRender={3}
                                    // maxToRenderPerBatch={3}
                                    viewabilityConfig={viewabilityConfig}
                                // windowSize={5}
                                /> */}
                            {!this.isHosted &&
                               
                                <Carousel
                                    ref={(c) => { this._carousel_posts = c; }}
                                    data={posts}
                                    renderItem={this.renderItem}
                                    sliderWidth={sliderWidthPosts}
                                    itemWidth={itemWidthPosts}
                                    onSnapToItem={() => { this.setState({ pageIndexPosts: this._carousel_posts.currentIndex }); }}
                                    inactiveSlideScale={1.0}
                                />
                                }
                            {this.isHosted &&
                                <View style={{}}>
                                    <View style={{ marginBottom: getHeightPercent(5.4) }}>
                                        <Carousel
                                            ref={(c) => { this._carousel = c; }}
                                            data={this.state.entries}
                                            renderItem={this._renderItem}
                                            sliderWidth={sliderWidth}
                                            itemWidth={itemWidth}
                                            onSnapToItem={() => { this.setState({ pageIndex: this._carousel.currentIndex }); }}
                                            inactiveSlideScale={1.0}
                                        />
                                    </View>
                                    {this.state.checkingStatus === 2 &&
                                        <View style={[styles.finalBtnBack, { marginTop: getHeightPercent(3.4) }]}>
                                            <TouchableOpacity style={styles.finalBtn} onPress={() => this.onPressChecking()}>
                                                <Text style={styles.finalBtnText}>{"Final Check-in"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                    {this.state.checkingStatus !== 2 &&
                                        <View style={styles.actionView1}>
                                            <TouchableOpacity style={[
                                                styles.actionSubView,
                                                { marginRight: getHeightPercent(1.2) },
                                                this.state.checkingStatus === 1 ? { backgroundColor: '#F8E71C' } : { backgroundColor: 'white' }
                                            ]} onPress={() => this.onPressChecking()}>
                                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                    <Image source={Images.ic_checking_home} style={styles.actionIcon} resizeMode={"contain"} />
                                                    <Text style={styles.actionText}>Check-in</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.actionSubView, { marginHorizontal: getHeightPercent(1.2) }]} onPress={() => { this.onPressBounce() }}>
                                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                    <Image source={Images.ic_bounce} style={styles.actionIcon} resizeMode={"contain"} />
                                                    <Text style={styles.actionText}>Bounce</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.actionSubView, { marginLeft: getHeightPercent(1.2) }]} >
                                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                    <Image source={Images.ic_no_show} style={styles.actionIcon} resizeMode={"contain"} />
                                                    <Text style={styles.actionText}>No Show</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </View>
                            }
                        </View>
                    </View>
                </View>
                <Modal
                    animationType={"fade"}
                    animationInTiming={500}
                    animationOutTiming={500}
                    visible={this.state.isModal1Visible}
                    transparent={true}
                >
                    <TouchableOpacity style={styles.modal} activeOpacity={1.0} onPress={() => { this.setState({ isModal1Visible: false, isModal2Visible: true }) }}>
                        <View style={styles.modalContainer}>
                            <View style={{ flexDirection: 'row', marginTop: getHeightPercent(5.6) }}>
                                <Image source={Images.ic_avatar_one} style={styles.modalImg} resizeMode={"contain"} />
                                <View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={styles.modalText1}>Sam Sam</Text>
                                        <Text style={styles.timeText}>01:47</Text>
                                    </View>
                                    <Text style={styles.modalText2}>Bien sûr ! C’est à toi de voir… Je te laisse réfléchir 🤔 </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
                <Modal
                    animationType={"fade"}
                    animationInTiming={500}
                    animationOutTiming={500}
                    visible={this.state.isModal2Visible}
                    transparent={true}
                >
                    <TouchableOpacity style={styles.modal} activeOpacity={1.0} onPress={() => { this.setState({ isModal2Visible: false }) }}>
                        <View style={[styles.modalContainer, { paddingRight: getHeightPercent(2.2) }]}>
                            <View style={{ flexDirection: 'row', marginTop: getHeightPercent(5.6), justifyContent: 'space-between' }}>
                                <Image source={Images.ic_weldone} style={styles.modal2Img} resizeMode={"contain"} />
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={styles.modalText1}>20 XP SubPoints</Text>
                                    <Text style={[styles.modalText2, { marginTop: getHeightPercent(0.6) }]}>Well Done babe !</Text>
                                </View>
                                <Image source={Images.ic_weldone} style={styles.modal2Img} resizeMode={"contain"} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
                <Modal
                    animationType={"fade"}
                    animationInTiming={500}
                    animationOutTiming={500}
                    visible={this.state.firstModalVisible}
                    transparent={true}
                >
                    <MoneyModal
                        isModal={true}
                        checkingOption={"host"}
                        onClickOutSide={() => this.setState({ firstModalVisible: false })}
                        confirmReservationText={"Confirm check-in"}
                        onClickConfirm={() => this.onClickConfirmFirstCheck()}
                    />
                </Modal>
                <Modal
                    animationType={"fade"}
                    animationInTiming={500}
                    animationOutTiming={500}
                    visible={this.state.secondModalVisible}
                    transparent={true}
                >
                    <MoneyModal
                        isModal={true}
                        checkingOption={"waiter"}
                        confirmReservationText={"Confirm check-in"}
                        onClickConfirm={() => this.onClickConfirmSecondCheck()}
                    />
                </Modal>
                <Modal
                    animationType={"fade"}
                    animationInTiming={500}
                    animationOutTiming={500}
                    visible={this.state.finalModalVisible}
                    transparent={true}
                >
                    <MoneyModal
                        isModal={true}
                        checkingOption={"final"}
                        confirmReservationText={"Confirm check-in"}
                        onClickConfirm={() => this.onClickConfirmFinalCheck()}
                    />
                </Modal>
                <SelectCountryModal
                    visible={this.state.selectCountryModalVisible}
                    onSelectedCity={(item) => this.onSelectedCity(item)}
                    onClose={() => this.onCloseSelectCountryModal()}
                />
                {
                    this._renderCamera()
                }
                {
                    this._renderBillPic()
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

export default connect(mapStateToProps)(HomeScreen)

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.screen.container,
    },
    bodyText1: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        ...ApplicationStyles.homeScreen.mainBodyText
    },
    bodyText2: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        ...ApplicationStyles.homeScreen.mainBodyText
    },
    topContainer: {
        ...ApplicationStyles.homeScreen.homeTopContainer,
        justifyContent: 'space-between'
    },
    middleContainer: { width: '100%', flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' },
    item: {
        height: '100%',
        // aspectRatio: 0.64,
        width: '100%'
    },
    itemText1: {
        ...ApplicationStyles.authScreen.sfProBoldFont,
        fontSize: getHeightPercent(1.9),
        color: "#FFFFFF",
    },
    itemText2: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(1.2),
        color: "#999999",
        marginRight: getHeightPercent(1.2)
    },
    itemImage: { height: '80%', width: '100%', marginBottom: getHeightPercent(2.2), borderRadius: 10 },
    itemDetail: {
        width: getHeightPercent(7),
        justifyContent: 'center',
        alignSelf: 'center'
    },
    itemDetailImage: { height: getHeightPercent(5.2), width: getHeightPercent(5.2) },
    modal: {
        flex: 1,
        backgroundColor: '#6E707070',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        height: getHeightPercent(9.6),
        paddingLeft: getHeightPercent(2.2),
        marginTop: '10%',
        borderRadius: 10,
        backgroundColor: '#F8E71C',
        justifyContent: 'center'
    },
    modalImg: {
        width: getHeightPercent(4.6),
        height: getHeightPercent(4.6),
        marginRight: getHeightPercent(2.0),
        borderRadius: getHeightPercent(1.0),
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
    timeText: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(1.2),
        color: 'black',
    },

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

    //Action Style
    actionView1: {
        height: getHeightPercent(12),
        width: '100%',
        flexDirection: 'row'
    },
    actionSubView: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionIcon: {
        width: getHeightPercent(6.0),
        height: getHeightPercent(6.0),
    },
    actionText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        marginTop: getHeightPercent(1.2),
        color: 'black',
        fontSize: getHeightPercent(1.4),
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

    // Final Checking
    finalBtnBack: {
        width: '100%',
        height: getHeightPercent(5.2),
        marginTop: getHeightPercent(2.6),
        alignItems: 'center'
    },
    finalBtn: {
        height: '100%',
        width: getHeightPercent(30.2),
        borderRadius: getHeightPercent(2.5),
        backgroundColor: '#F8E71C',
        justifyContent: 'center',
        alignItems: 'center'
    },
    finalBtnText: {
        color: 'black',
        fontSize: getHeightPercent(2.4),
        ...ApplicationStyles.authScreen.sfProBoldFont,
    },

    //Camera
    takePictureBtn: {
        width: getHeightPercent(10.0),
        height: getHeightPercent(10.0)
    },
    takePictureBtnBack: {
        position: 'absolute',
        width: '100%',
        alignItems: "center",
        bottom: getHeightPercent(8.0)
    },

    // Country Picker
    countryNameTextSel: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(1.6),
        color: 'black',
    },
    countryNameBackSel: {
        marginLeft: getHeightPercent(3.6),
        height: getHeightPercent(3.6),
        flexDirection: "row",
        alignItems: 'center',
        paddingLeft: getHeightPercent(1.6), paddingRight: getHeightPercent(1.6),
        backgroundColor: '#F8E71C',
        borderRadius: getHeightPercent(3.4),
        marginRight: getHeightPercent(2.4)
    },
    countryNameTextUnSel: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(1.6),
        color: 'white',
    },
    countryNameBackUnSel: {
        marginLeft: getHeightPercent(3.6),
        height: getHeightPercent(3.6),
        flexDirection: "row",
        alignItems: 'center',
        paddingLeft: getHeightPercent(1.6), paddingRight: getHeightPercent(1.6),
        borderWidth: 0.5,
        borderColor: 'white',
        borderRadius: getHeightPercent(3.4),
        marginRight: getHeightPercent(2.4)
    },

    //Avatar style
    avatarStyle: {
        width: Values.homeAvatarSize,
        height: Values.homeAvatarSize,
        borderRadius: getHeightPercent(2.0),
    }
})