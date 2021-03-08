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

class ClubStoryScreen extends Component {
    constructor(props) {
        super(props);

    }

    onPressClose() {
        this.props.navigation.navigate('UserProfileScreen')
    }

    render() {
        return (
            <Animated.View style={[styles.container, {}]}>
                <View style={{ flex: 1 }}>
                    <Image source={Images.ic_user_back_temp} style={styles.imageBack} resizeMode={"cover"} />
                    <LinearGradient colors={['#FFF', '#000']} style={{ height: '100%', width: '100%', opacity: 0.63, position: 'absolute' }}>
                    </LinearGradient>
                    <View style={styles.titleContainer}>
                        <TouchableOpacity onPress={() => this.onPressClose()}>
                            <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='#FFFFFF' />
                        </TouchableOpacity>
                        <View style={styles.topText1Back}>
                            <Text style={styles.topText1}>140 </Text>
                            <Text style={styles.topText2}>xp</Text>
                        </View>
                    </View>
                    <View style={styles.mainContainer}>
                        <Text style={styles.bottomText1}>{"London 🇬🇧"}</Text>
                        <Text style={styles.bottomText2}>{"Mehdi Bcl"}</Text>
                    </View>
                </View>
            </Animated.View>
        );
    }
};

export default ClubStoryScreen;

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.screen.container,
    },
    titleContainer: {
        flexDirection: "row-reverse",
        justifyContent: 'space-between',
        alignItems: "center",
        paddingTop: getHeightPercent(5.0),
        paddingLeft: getHeightPercent(2.4),
        paddingRight: getHeightPercent(2.4),
    },
    mainContainer: {
        flex: 1, 
        flexDirection: "column-reverse",
        marginBottom: getHeightPercent(4.6),
        paddingLeft: getHeightPercent(2.4),
    },
    bottomText1: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(2.2),
        color: 'white',
        marginTop: getHeightPercent(0.6)
    },
    bottomText2: {
        ...ApplicationStyles.authScreen.sfProBoldFont,
        fontSize: getHeightPercent(2.6),
        color: 'white',
    },
    imageBack: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    topText1Back: {
        backgroundColor: '#F8E71C',
        borderRadius: getHeightPercent(3.0),
        flexDirection: 'row',
        width: getHeightPercent(6.8),
        height: getHeightPercent(3.2),
        alignItems: 'center',
        justifyContent: 'center'
    },
    topText1: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        color: 'black',
        fontSize: getHeightPercent(1.4),
    },
    topText2: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        color: 'black',
        fontSize: getHeightPercent(1.0),
    },
})