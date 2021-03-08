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

class VideoTutorialScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tutorials: [
                {
                    image: Images.ic_image6,
                    text1: "Book a Guestlist",
                    text2: "Learn how to book a guest list …"
                },
                {
                    image: Images.ic_image6,
                    text1: "Book a Guestlist",
                    text2: "Learn how to book a guest list …"
                },
                {
                    image: Images.ic_image6,
                    text1: "Book a Guestlist",
                    text2: "Learn how to book a guest list …"
                },
                {
                    image: Images.ic_image6,
                    text1: "Book a Guestlist",
                    text2: "Learn how to book a guest list …"
                },
                {
                    image: Images.ic_image6,
                    text1: "Book a Guestlist",
                    text2: "Learn how to book a guest list …"
                },
                {
                    image: Images.ic_image6,
                    text1: "Book a Guestlist",
                    text2: "Learn how to book a guest list …"
                },
                {
                    image: Images.ic_image6,
                    text1: "Book a Guestlist",
                    text2: "Learn how to book a guest list …"
                },
                {
                    image: Images.ic_image6,
                    text1: "Book a Guestlist",
                    text2: "Learn how to book a guest list …"
                }
            ]
        }

    }

    onPressClose() {
        this.props.navigation.navigate('SettingScreen')
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={styles.item}>
                <Image source={item.image} style={styles.itemImage} resizeMode={"cover"} />
                <View style={styles.itemView}>
                    <Text style={styles.itemText1}>{item.text1}</Text>
                    <Text style={styles.itemText2}>{item.text2}</Text>
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
                    <Text style={styles.authTitleText}>Tutorials</Text>
                </View>
                <View style={styles.mainContainer}>
                    <FlatList
                        data={this.state.tutorials}
                        renderItem={this.renderItem}
                        horizontal={false}
                        keyExtractor={this.keyExtractor}
                    />
                </View>
            </Animated.View>
        );
    }
};

export default VideoTutorialScreen;

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.screen.container,
    },
    titleContainer: {
        ...ApplicationStyles.screen.topContainer
    },
    mainContainer: {
        marginHorizontal: Values.mainPaddingHorizontal,
        marginTop: getHeightPercent(3.2)
    },
    authTitleText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        ...ApplicationStyles.authScreen.authTitleText
    },
    item: {
        height: getHeightPercent(15.1),
        width: '100%',
        flexDirection: 'row'
    },
    itemImage: {
        height: getHeightPercent(11.9),
        width: getHeightPercent(18.8),
        borderRadius: getHeightPercent(0.5)
    },
    itemText1: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(1.8),
        color: 'white'
    },
    itemText2: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(1.4),
        color: 'white',
    },
    itemView: {
        marginLeft: getHeightPercent(1.6), 
        justifyContent: 'space-between', 
        flex: 1,
        paddingTop: getHeightPercent(3.4),
        paddingBottom: getHeightPercent(6.5)
    }
})