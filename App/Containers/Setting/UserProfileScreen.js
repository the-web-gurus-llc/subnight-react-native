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

const DUBAI_FILTER = "Dubai"
const PARIS_FILTER = "Paris"
const LONDON_FILTER = "London"

class UserProfileScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            countryFilter: LONDON_FILTER,

            bookingList: [
                {
                    date: "Saturday 30.08",
                    name: "Libertine - GuestList",
                    boys: "3 girls / 3 boys",
                },
                {
                    date: "Friday 29.08",
                    name: "Libertine - Table",
                    boys: "£3000 - 3 girls / 3 boys",
                },
                {
                    date: "Thursday 28.08",
                    name: "Libertine - Table",
                    boys: "£3000 - 3 girls / 3 boys",
                },
                {
                    date: "Wednesday 27.08",
                    name: "Libertine - Table",
                    boys: "£3000 - 3 girls / 3 boys",
                },
            ]
        }

    }

    onPressClose() {
        this.props.navigation.navigate('Home')
    }

    onPressAvatar() {
        this.props.navigation.navigate('UserProfileDetailScreen')
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={styles.item}>
                <Text style={styles.dateText}>{item.date}</Text>
                <View style={styles.itemBody}>
                    <Image source={Images.ic_detail_unsel} style={styles.itemImg} resizeMode={"cover"} />
                    <View style={[styles.subView, index != 0 && { opacity: 0.6 }]}>
                        <Text style={styles.subViewText1}>{item.name}</Text>
                        <Text style={styles.subViewText2}>{item.boys}</Text>
                    </View>
                </View>

            </View>
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
                    <Text style={styles.authTitleText}>User</Text>
                </View>
                <View style={styles.mainContainer}>
                    <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'row', height: getHeightPercent(17) }} onPress={() => {this.onPressAvatar()}}>
                        <Image source={Images.ic_avatar_three} style={{ width: Values.settingAvatarSize, height: Values.settingAvatarSize }} resizeMode={"contain"} />
                        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', marginLeft: getHeightPercent(1.6) }}>
                            <Text style={[styles.mainBodyText, { marginBottom: getHeightPercent(0.8) }]}>{"Mehdi Bcl"}</Text>
                            <Text style={[styles.mainBodyText, { fontSize: getHeightPercent(2.2) }]}>{"London 🇬🇧"}</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Tags */}
                    <View style={{ flexDirection: 'row', marginBottom: getHeightPercent(3.2) }}>
                        <View style={[styles.tagItemView, { width: getHeightPercent(6.4) }]}>
                            <Text style={styles.tagItemText}>{"VIP"}</Text>
                        </View>
                        <View style={[styles.tagItemView, { width: getHeightPercent(14.4) }]}>
                            <Text style={styles.tagItemText}>{"Dom Perignon"}</Text>
                        </View>
                        <View style={[styles.tagItemView, { width: getHeightPercent(10.4) }]}>
                            <Text style={styles.tagItemText}>{"Corporate"}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.avatarContainer} activeOpacity={1.0}>
                        <Image source={Images.ic_money} style={{ width: getHeightPercent(7.0), height: getHeightPercent(6.0) }} resizeMode={"contain"} />
                        <View style={{ flex: 1, flexDirection: 'row-reverse', alignItems: 'center' }}>
                            <Text style={styles.moneyText1}>{"140"}</Text>
                            <Text style={styles.moneyText2}>{"xp"}</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{marginTop: getHeightPercent(3.6)}}>
                        <Text style={[styles.mainBodyText, { fontSize: getHeightPercent(2.2) }]}>{"Latest booking"}</Text>
                    </View>

                    {/* booking list */}
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
                    <View style={{ marginTop: getHeightPercent(0.0), flex: 1 }}>
                        <FlatList
                            data={this.state.bookingList}
                            renderItem={this.renderItem}
                            horizontal={false}
                            keyExtractor={this.keyExtractor}
                        />
                    </View>

                </View>
            </Animated.View>
        );
    }
};

export default UserProfileScreen;

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
    tagItemView: {
        backgroundColor: '#F8E71C',
        borderRadius: getHeightPercent(3.0),
        flexDirection: 'row',
        width: getHeightPercent(8.8),
        height: getHeightPercent(3.6),
        marginEnd: getHeightPercent(1.2),
        alignItems: 'center',
        justifyContent: 'center'
    },
    tagItemText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        color: 'black',
        fontSize: getHeightPercent(1.6),
    },

    // booking list style
    flagView: {
        height: getHeightPercent(11.4),
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
        width: '100%',
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
    itemImg: {
        width: getHeightPercent(6.2),
        height: getHeightPercent(6.2),
        borderRadius: 6
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
})