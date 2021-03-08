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

class EditClubScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navSelPos: 0,
        }

    }

    onPressClose() {
        this.props.navigation.navigate(this.props.navigation.getParam("parent"))
    }

    onPressShare() {
        this.props.navigation.navigate('BookingShareScreen', {
            parent: "ClubDetailScreen"
        })
    }

    onPressNav(selIndex) {
        this.setState({ navSelPos: selIndex })
    }

    onPressGift() {

    }

    onClickConfirmReservation() {

    }

    render() {
        return (
            <Animated.View style={[styles.container, {}]}>
                <View style={styles.titleContainer}>
                    <View style={styles.openContainer}>
                        <Text style={styles.openText}>Open</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.onPressClose()}>
                        <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='#FFFFFF' />
                    </TouchableOpacity>
                    <Text style={styles.authTitleText}>Scandal</Text>
                </View>
                <View style={styles.bodyContainer}>
                    <View style={styles.navContainer}>
                        <TouchableOpacity onPress={() => this.onPressNav(0)}>{
                            this.state.navSelPos == 0 ? (<Image source={Images.ic_send_money_sel} style={styles.navItem} resizeMode={"contain"} />)
                                : (<Image source={Images.ic_send_money_unsel} style={styles.navItem} resizeMode={"contain"} />)
                        }</TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onPressNav(1)}>{
                            this.state.navSelPos == 1 ? (<Image source={Images.ic_music_sel} style={styles.navItem} resizeMode={"contain"} />)
                                : (<Image source={Images.ic_music_unsel} style={styles.navItem} resizeMode={"contain"} />)
                        }</TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onPressNav(2)}>{
                            this.state.navSelPos == 2 ? (<Image source={Images.ic_mic_sel} style={styles.navItem} resizeMode={"contain"} />)
                                : (<Image source={Images.ic_mic_unsel} style={styles.navItem} resizeMode={"contain"} />)
                        }</TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onPressNav(3)}>{
                            this.state.navSelPos == 3 ? (<Image source={Images.ic_people_sel} style={styles.navItem} resizeMode={"contain"} />)
                                : (<Image source={Images.ic_people_unsel} style={styles.navItem} resizeMode={"contain"} />)
                        }</TouchableOpacity>
                    </View>
                    <View style={styles.subBody}>
                        {
                            this.state.navSelPos != 3 ? (
                                <View style={{ width: '100%', alignItems: 'flex-end' }}>
                                    <Text style={[styles.bodyText, { marginTop: getHeightPercent(5.8) }]}>78 Wells St, Fitzrovia, London W1T 3QL</Text>
                                    <TouchableOpacity style={{ marginTop: getHeightPercent(3.4) }} onPress={() => this.onPressGift()}>
                                        <Image source={Images.ic_gift} style={styles.giftImg} resizeMode={"contain"} />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                    <View style={{ width: '100%', alignItems: 'center' }}>
                                        <Text style={[styles.bodyText, { marginTop: getHeightPercent(5.8) }]}>£15 - £17</Text>
                                        <View style={styles.peopleSubView}>
                                            <Image source={Images.ic_uber} style={styles.peopleSubImg} resizeMode={"contain"} />
                                            <Image source={Images.ic_k} style={styles.peopleSubImg} resizeMode={"contain"} />
                                            <Image source={Images.ic_bolt} style={styles.peopleSubImg} resizeMode={"contain"} />
                                        </View>
                                    </View>
                                )
                        }
                    </View>
                    <View style={{ flex: 1 }}>
                        <MoneyModal
                            isModal={false}
                            onClickConfirm={() => this.onClickConfirmReservation()}
                        />
                    </View>

                </View>
            </Animated.View>
        );
    }
};

export default EditClubScreen;

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.screen.container,
    },
    titleContainer: {
        ...ApplicationStyles.screen.topContainer
    },
    bodyContainer: {
        marginHorizontal: Values.mainPaddingHorizontal,
        flex: 1
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
    subBody: {
        width: '100%',
        height: getHeightPercent(24.0),
        alignItems: 'center'
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
})