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
    Dimensions,
} from "react-native";
import { Icon } from 'react-native-elements';
import Images from '../../Theme/Images'
import { ApplicationStyles, Values } from "../../Theme";
import { getHeightPercent } from './../../Services/RadioService'

const itemWidth = Dimensions.get('window').width / 2 - getHeightPercent(2.0)
const itemHeight = itemWidth * (444/314)

class RewardScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rewards: [
                {
                    image: Images.ic_image3,
                },
                {
                    image: Images.ic_image4,
                },
                {
                    image: Images.ic_image3,
                },
                {
                    image: Images.ic_image4,
                },
                {
                    image: Images.ic_image3,
                },
                {
                    image: Images.ic_image4,
                },
                {
                    image: Images.ic_image3,
                },
                {
                    image: Images.ic_image4,
                }
            ]
        }

    }

    onPressClose() {
        this.props.navigation.navigate('SettingDetailScreen')
    }

    onPressItem() {
        this.props.navigation.navigate('ChattingRoomScreen', {
            fromRewards: true
        })
    }

    keyExtractor = (item, index) => index.toString();

    renderItem = ({ item, index }) => {
        console.log(item)
        if (index % 2 == 0) {
            return (
                <TouchableOpacity style={styles.item} onPress={() => {this.onPressItem()}}>
                    <Image source={item.image} style={styles.itemImageTemp} resizeMode={"contain"} />
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity style={styles.item} onPress={() => {this.onPressItem()}}>
                    <Image source={item.image} style={styles.itemImage} resizeMode={"contain"} />
                </TouchableOpacity>
            )
        }
    };

    render() {
        return (
            <Animated.View style={[styles.container, {}]}>
                <View style={styles.titleContainer}>
                    <TouchableOpacity onPress={() => this.onPressClose()}>
                        <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='#FFFFFF' />
                    </TouchableOpacity>
                    <Text style={styles.authTitleText}>Membership</Text>
                </View>
                <View style={styles.mainContainer}>
                    <View style={styles.moneyContainer} onPress={() => this.onPressMoney()}>
                        <Image source={Images.ic_money} style={{ width: getHeightPercent(7.0), height: getHeightPercent(6.0) }} resizeMode={"contain"} />
                        <View style={{ flex: 1, flexDirection: 'row-reverse', alignItems: 'center' }}>
                            <Text style={styles.moneyText1}>{"140"}</Text>
                            <Text style={styles.moneyText2}>{"xp"}</Text>
                        </View>
                    </View>
                    <Text style={styles.mainBodyText3}>Membership Rewards</Text>
                    <View style={{ marginTop: getHeightPercent(2.2), flex: 1 }}>
                        <FlatList
                            data={this.state.rewards}
                            numColumns={2}
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

export default RewardScreen;

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
    },
    authTitleText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        ...ApplicationStyles.authScreen.authTitleText
    },
    mainBodyText: {
        color: "black",
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontWeight: '400',
        fontSize: getHeightPercent(10.0),
        marginTop: getHeightPercent(3.4)
    },
    mainBodyText2: {
        color: "black",
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontWeight: '400',
        fontSize: getHeightPercent(5.0),
        marginTop: getHeightPercent(1.2)
    },
    mainBodyText3: {
        color: "white",
        ...ApplicationStyles.authScreen.sfProBoldFont,
        fontSize: getHeightPercent(2.4),
        marginTop: getHeightPercent(2.2),
        letterSpacing: 1.8
    },
    item: {
        // height: getHeightPercent(30.2),
        // width: getHeightPercent(20.8),
        height: itemHeight,
        width: itemWidth,
    },
    itemImage: { height: '90%', width: '100%', marginBottom: getHeightPercent(2.8), borderRadius: 10},
    itemImageTemp: { height: '89.8%', width: '100%', marginBottom: getHeightPercent(2.8), borderRadius: 10},
    // item_temp: {
    //     // height: getHeightPercent(30.2),
    //     // width: getHeightPercent(20.8),
    //     height: Dimensions.get('window').width,
    //     width: Dimensions.get('window').width,
    // },
    moneyContainer: {
        backgroundColor: '#F8E71C',
        borderRadius: 8,
        flexDirection: 'row',
        height: getHeightPercent(8.8),
        alignItems: 'center',
        paddingLeft: getHeightPercent(1.6),
        paddingRight: getHeightPercent(1.6),
        marginTop: getHeightPercent(2.2)
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
})