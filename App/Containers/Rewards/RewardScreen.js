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
                }
            ]
        }

    }

    onPressClose() {
        this.props.navigation.navigate('SettingDetailScreen')
    }

    keyExtractor = (item, index) => index.toString();

    renderItem = ({ item, index }) => {
        console.log(item)
        if(index % 2 == 0) {
            return (
                <TouchableOpacity style={styles.item_temp}>
                    <Image source={item.image} style={styles.itemImage} resizeMode={"contain"} />
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity style={styles.item}>
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
                    <Text style={styles.authTitleText}></Text>
                </View>
                <View style={styles.mainContainer}>
                    <View style={{ width: '100%', height: getHeightPercent(36.0), justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={Images.ic_happy} style={{ width: getHeightPercent(5.0), height: getHeightPercent(5.0) }} resizeMode={"contain"} />
                            <Text style={styles.mainBodyText}>{"300"}</Text>
                            <Text style={styles.mainBodyText2}>{"XP"}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <View style={styles.bottomView}>
                        <View style={styles.bottomDivider} />
                        <Text style={styles.mainBodyText3}>Rewards 🏆</Text>
                        <View style={{marginTop: getHeightPercent(6.0)}}>
                            <FlatList
                                data={this.state.rewards}
                                renderItem={this.renderItem}
                                horizontal={true}
                                keyExtractor={this.keyExtractor}
                            />
                        </View>
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
        backgroundColor: '#F8E71C'
    },
    titleContainer: {
        ...ApplicationStyles.screen.topContainer
    },
    mainContainer: {
        marginHorizontal: Values.mainPaddingHorizontal,
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
    bottomView: {
        width: '100%',
        height: getHeightPercent(50.0),
        backgroundColor: 'black',
        borderTopLeftRadius: getHeightPercent(8.0),
        borderTopRightRadius: getHeightPercent(8.0),
        alignItems: 'center',
        paddingHorizontal: getHeightPercent(2.4)
    },
    bottomDivider: {
        width: getHeightPercent(12.4),
        height: getHeightPercent(0.5),
        borderRadius: 10,
        backgroundColor: 'white',
        marginTop: getHeightPercent(2.4)
    },
    mainBodyText3: {
        color: "white",
        ...ApplicationStyles.authScreen.sfProBoldFont,
        fontSize: getHeightPercent(2.4),
        marginTop: getHeightPercent(1.8),
        letterSpacing: 1.8
    },
    item: {
        height: getHeightPercent(35.2),
        width: getHeightPercent(20.4),
        marginRight: getHeightPercent(1.6),
        marginTop: getHeightPercent(0.6),
    },
    itemImage: { height: '80%', width: '100%', marginBottom: getHeightPercent(2.2), borderRadius: 10 },
    item_temp: {
        height: getHeightPercent(36.4),
        width: getHeightPercent(21.4),
    },
})