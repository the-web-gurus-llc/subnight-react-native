import React, {
    Component
} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import { Icon } from 'react-native-elements';
import { ApplicationStyles, Values } from "../../Theme";
import { getHeightPercent } from './../../Services/RadioService'
import { connect } from 'react-redux';
import Video from 'react-native-video';

const TAG = "MediaFullScreen: "

class MediaFullScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            image: this.props.image,
            video: this.props.video
        }

    }

    onPressClose() {
        this.props.onPressClose();
    }

    render() {
        const { image, video } = this.state;
        return (
            <View style={[styles.container, {}]}>
                <View style={styles.container}>
                    {image != null &&
                        <Image source={{ uri: image }} style={styles.itemImg} resizeMode={"cover"} />
                    }
                    {video != null &&
                        <Video source={{ uri: video }}
                            ref={(ref) => {
                                this.video = ref
                            }}
                            // poster={videoPoster}
                            shouldPlay={true}
                            repeat={true}
                            resizeMode="cover"
                            onBuffer={this.onBuffer}
                            onError={this.videoError}
                            style={styles.itemImg} />
                    }
                </View>
                <View style={styles.titleContainer}>
                    <TouchableOpacity onPress={() => this.onPressClose()}>
                        <Icon name='closecircle' type='antdesign' size={Values.authCloseSize} color='red' />
                    </TouchableOpacity>
                    <Text style={styles.authTitleText}></Text>
                </View>

            </View>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        profile: state.user.profile,
        userToken: state.startup.userToken
    }
};

export default connect(mapStateToProps)(MediaFullScreen)

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: 'black'
    },
    titleContainer: {
        ...ApplicationStyles.screen.topContainer
    },
    authTitleText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        ...ApplicationStyles.authScreen.authTitleText
    },

    itemImg: {
        width: '100%',
        height: '100%',
        borderRadius: getHeightPercent(0.6)
    },
})