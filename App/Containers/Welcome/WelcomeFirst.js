import React, {
    Component
} from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Image
} from "react-native";
import { ApplicationStyles } from "../../Theme";
import Images from './../../Theme/Images'
import { getHeightPercent } from './../../Services/RadioService'
import TouchID from 'react-native-touch-id'
import { dialogUtil } from "../../Util/DialogUtil";
import { TouchableOpacity } from "react-native-gesture-handler";
import { connect } from 'react-redux';

const optionalConfigObject = {
    title: "Authentication Required", // Android
    color: "#e00606", // Android,
    fallbackLabel: "" // iOS (if empty, then label is hidden)
}

var successCallback = null;
var failedCallback = null;

class WelcomeFirst extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFaceViewVisible: false,
            biometryType: null
        }

        this.slideAnimation = new Animated.Value(0);
        successCallback = this.moveToSecond;
        failedCallback = this.pressHandler;
    }

    componentDidMount() {
        TouchID.isSupported()
            .then(biometryType => {
                this.setState({ biometryType });
            })

        setTimeout(() => {
            Animated.timing(this.slideAnimation, {
                toValue: 1,
                duration: 300
            }).start();
        }, 200);

        setTimeout(() => {
            this.setState({ isFaceViewVisible: true })
        }, 1000)

        setTimeout(() => {
            // this.pressHandler()
            this.moveToSecond()
        }, 2000)
    }

    moveToSecond = () => {
        this.props.navigation.navigate('WelcomeSecond')
    }

    pressHandler() {
        TouchID.isSupported()
            .then(() => {
                TouchID.authenticate('', optionalConfigObject)
                    .then(success => {
                        console.log("Touch Id success", success)
                        successCallback();
                    })
                    .catch(error => {
                        console.log("Touch Id failed error => ", error)
                        dialogUtil.showNotice('Warning', 'Authentication Failed',failedCallback);
                    });
            })
            .catch(error => {
                dialogUtil.showWarning('Warning', 'TouchID not supported');
            });
    }

    render() {
        return (
            <Animated.View style={[styles.container, { opacity: this.slideAnimation }]}>
                {this.state.isFaceViewVisible &&
                    <TouchableOpacity activeOpacity={1}>
                        <Image source={Images.ic_face_id_logo_new} style={styles.faceImg} resizeMode={"contain"} />
                    </TouchableOpacity>
                }
                {!this.state.isFaceViewVisible &&
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.authBodyText1}>Hello</Text>
                        <Text style={styles.authBodyText2}>{` ${this.props.userToken.user.name}`}</Text>
                    </View>
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

export default connect(mapStateToProps)(WelcomeFirst)

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.authScreen.container,
        alignItems: 'center',
        justifyContent: 'center'
    },
    authBodyText1: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        ...ApplicationStyles.authScreen.authBodyText
    },
    authBodyText2: {
        ...ApplicationStyles.authScreen.sfProBoldFont,
        ...ApplicationStyles.authScreen.authBodyText
    },
    faceImg: {
        width: getHeightPercent(8.0),
        height: getHeightPercent(8.0),
    },
})