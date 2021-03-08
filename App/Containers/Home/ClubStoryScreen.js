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
        const parent = this.props.navigation.getParam('parent')
        if (parent != null) this.props.navigation.navigate(parent)
        else {
            this.props.navigation.navigate('HomeScreen', {
                isModalVisible: true
            })
        }
    }

    render() {
        return (
            <Animated.View style={[styles.container, {}]}>
                {/* <View style={{width: '100%', height: getHeightPercent(6.4), justifyContent: 'flex-end', paddingBottom: getHeightPercent(1.0)}}>
                    <View style={{height: getHeightPercent(0.25), flexDirection: 'row', marginHorizontal: getHeightPercent(2.4)}}>
                        <View style={{height: '100%', width: '60%', backgroundColor: '#F8E71C'}}/>
                        <View style={{flex: 1, backgroundColor: '#707070'}}/>
                    </View>
                </View> */}
                <View style={{ flex: 1 }}>
                    <Image source={Images.auth_back} style={styles.imageBack} resizeMode={"cover"} />
                    <View style={styles.titleContainer}>
                        <TouchableOpacity onPress={() => this.onPressClose()}>
                            <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='#FFFFFF' />
                        </TouchableOpacity>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Image source={Images.ic_clubstory1} style={[styles.topImage]} resizeMode={"contain"} />
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={styles.topText1}>Scandal</Text>
                                <Text style={styles.topText2}>05:30</Text>
                            </View>
                        </View>
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
        alignItems: "center",
        paddingTop: getHeightPercent(4.5),
        paddingLeft: getHeightPercent(1.4),
        paddingRight: getHeightPercent(1.4),
    },
    topText1: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(2.2),
        color: "#FFFFFF",
    },
    topText2: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(1.6),
        color: "#FFFFFF",
        opacity: 0.5,
        marginTop: getHeightPercent(0.4)
    },
    topImage: {
        width: getHeightPercent(7.8),
        height: getHeightPercent(7.8),
        marginRight: getHeightPercent(1.2)
    },
    imageBack: {
        width: '100%',
        height: '130%',
        position: 'absolute',
        // borderTopLeftRadius: getHeightPercent(5.0), 
        // borderTopRightRadius: getHeightPercent(5.0)
    },
})