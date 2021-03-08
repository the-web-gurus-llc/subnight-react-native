import Values from "./Values"
import { getHeightPercent } from './../Services/RadioService'

export default {
    screen: {
        container: {
            flex: 1,
            backgroundColor: "#000000"
        },
        goChatImage: {
            width: getHeightPercent(3.4),
            height: getHeightPercent(3.4)
        },
        listImage: {
            width: getHeightPercent(4.0),
            height: getHeightPercent(4.0)
        },
        topContainer: {
            flexDirection: "row-reverse",
            alignItems: "center",
            paddingTop: getHeightPercent(5.0),
            paddingLeft: getHeightPercent(2.4),
            paddingRight: getHeightPercent(2.4),
        },
        mainContainer: {marginHorizontal: getHeightPercent(2.4), flex: 1},
        mainBodyText: {
            fontSize: getHeightPercent(3.2),
            color: "#FFFFFF",
        },
    },
    homeScreen: {
        homeTopContainer: {
            flexDirection: "row-reverse",
            alignItems: "center",
            paddingTop: getHeightPercent(5.0),
            paddingLeft: getHeightPercent(2.4),
            paddingRight: getHeightPercent(2.4),
        },
        mainBodyText: {
            fontSize: getHeightPercent(3.2),
            color: "#FFFFFF",
        },
        mainContainer: {marginHorizontal: getHeightPercent(2.4), flex: 1},
    },
    settingScreen: {
        
    },
    authScreen: {
        container: {
            flex: 1,
            backgroundColor: "#000000"
        },
        titleContainer: {
            flexDirection: "row-reverse",
            alignItems: "center",
            paddingTop: getHeightPercent(5.2),
            paddingLeft: getHeightPercent(2.8),
            paddingRight: getHeightPercent(2.8),
        },
        sfProSemiBoldFont: {
            fontFamily: "SFProDisplay-Semibold"
        },
        sfProLightFont: {
            fontFamily: "SFProDisplay-Light"
        },
        sfProBoldFont: {
            fontFamily: "SFProDisplay-Bold"
        },
        sfProMediumFont: {
            fontFamily: "SFProDisplay-Medium"
        },
        sfProHeavyFont: {
            fontFamily: "SFProDisplay-Heavy"
        },
        authTitleText: {
            fontSize: getHeightPercent(3.6),
            flex: 1,
            color: "#FFFFFF",
        },
        authPhoneNumberBack: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F8E71C',
            borderRadius: getHeightPercent(3.2),
            width: getHeightPercent(32),
            height: getHeightPercent(5.2),
        },
        authBodyText: {
            fontSize: getHeightPercent(3.6),
            color: "#FFFFFF",
        },
        authConnectionPNText: {
            fontSize: Values.authPhoneCodeTextSize,
            color: '#000',
            borderRadius: getHeightPercent(2.0),
            textAlign: "center"
        },
        authInput: {
            fontSize: Values.authInputTextSize,
            color: '#FFFFFF',
            borderBottomColor: '#FFFFFF',
            borderBottomWidth: 2,
        },
        authAvatar: {
            width: Values.authAvatarSize,
            height: Values.authAvatarSize,
            borderRadius: getHeightPercent(4.0),
        },
    }
}