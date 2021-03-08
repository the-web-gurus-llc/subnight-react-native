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

class BookingShareScreen extends Component {
    constructor(props) {
        super(props);

    }

    onPressClose() {
        this.props.navigation.navigate(this.props.navigation.getParam("parent"), {
            postItem: this.props.navigation.getParam("postItem")
        })
    }

    onPressItemEdit(item, index) {
        this.setState({ modalVisible: true })
    }

    render() {
        return (
            <Animated.View style={[styles.container, {}]}>
                <LinearGradient colors={['#E9A2E9', '#000']} style={{ height: '50%' }}>
                    <View style={{flexDirection: 'column-reverse', flex: 1}}>
                        <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: getHeightPercent(2.0)}}>
                            <Text style={styles.topText1}>Scandal</Text>
                            <Text style={styles.topText2}>Saturday 30.08</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, marginTop: getHeightPercent(1.0)}}>
                            <Image source={Images.ic_image5} style={styles.topImg} resizeMode={"cover"} />
                        </View>
                    </View>
                </LinearGradient>
                <View style={styles.middleContainer}>
                    <Text style={styles.partText}>Partager</Text>
                    <View style={styles.itemContainer}>
                        <Image source={Images.ic_instagram} style={styles.itemImg} resizeMode={"contain"} />
                        <Text style={styles.itemText}>Instagram Stories</Text>
                    </View>
                    <View style={styles.itemContainer}>
                        <Image source={Images.ic_facebook} style={styles.itemImg} resizeMode={"contain"} />
                        <Text style={styles.itemText}>Facebook Stories</Text>
                    </View>
                    <View style={styles.itemContainer}>
                        <Image source={Images.ic_copier} style={styles.itemImg} resizeMode={"contain"} />
                        <Text style={styles.itemText}>Share the link</Text>
                    </View>
                    <View style={styles.itemContainer}>
                        <Image source={Images.ic_more} style={styles.itemImg} resizeMode={"contain"} />
                        <Text style={styles.itemText}>More</Text>
                    </View>
                    <TouchableOpacity style={{width: '100%', alignItems: 'center', marginTop: getHeightPercent(1.8)}}
                        onPress={() => this.onPressClose()}>
                        <Text style={styles.topText2}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    }
};

export default BookingShareScreen;

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.screen.container,
    },
    topText1: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(1.4),
        color: '#FFFFFF',
        opacity: 0.7,
        marginBottom: getHeightPercent(0.7)
    },
    topText2: {
        ...ApplicationStyles.authScreen.sfProBoldFont,
        fontSize: getHeightPercent(1.8),
        color: '#FFFFFF',
    },
    middleContainer: {
        marginHorizontal: getHeightPercent(2.8),
        marginVertical: getHeightPercent(3.5),
        flex: 1
    },
    partText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(1.4),
        color: '#FFFFFF',
    },
    itemContainer: {
        marginTop: getHeightPercent(4.0),
        flexDirection: 'row',
        alignItems: 'center'
    },
    topImg: {
        width: getHeightPercent(21.2),
        height: getHeightPercent(30.8),
        borderRadius: getHeightPercent(0.6)
    },
    itemImg: {
        width: getHeightPercent(4.8),
        height: getHeightPercent(4.8),
        marginRight: getHeightPercent(3.4)
    },
    itemText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(2.0),
        color: '#FFFFFF',
        opacity: 0.7
    }
})