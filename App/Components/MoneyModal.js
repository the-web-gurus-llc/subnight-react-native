import React, {
    Component
} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    KeyboardAvoidingView,
    TextInput,
    Keyboard
} from "react-native";
import { ApplicationStyles, Values } from "../Theme";
import Images from '../Theme/Images'
import { getHeightPercent } from './../Services/RadioService'
import MultiSlider from 'react-native-easy-slider';
import { thousands_separators } from './../Services/HelperService'
import Config from './../Config/Config'
import { dateTimeUtil } from "../Util/DateTimeUtil";
import moment from "moment";

// const multiSliderWidth = getHeightPercent(27.6)
const width = Dimensions.get('window').width;
const multiSliderWidth = width * 0.9 - getHeightPercent(12.8)

const Check_Option_Normal = "normal"
const Check_Option_Host = "host"
const Check_Option_Waiter = "waiter"
const Check_Option_Final = "final"

class MoneyModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isGuestList: true,
            ladiesCount: 0,
            gentlemenCount: 0,
            minSpend: 0,
            confirmReservationText: "Confirm reservation",
            checkingOption: Check_Option_Normal,
            date: dateTimeUtil.getPostDetail(moment()),

            minSpendValue: 0,
            maxSpendValue: 6000,
            vipSpendValue: 0,
        }
    }

    componentDidMount() {
        if (this.props.confirmReservationText != null) {
            this.setState({ confirmReservationText: this.props.confirmReservationText })
        }
        if (this.props.checkingOption != null) {
            if (this.props.checkingOption === Check_Option_Waiter) {
                this.setState({ checkingOption: this.props.checkingOption, isGuestList: false })
            } else {
                this.setState({ checkingOption: this.props.checkingOption })
            }
        }

        console.log(this.props.club);

        if (this.props.club != null) {
            const club = this.props.club
            this.setState({
                isGuestList: club.reservation_type != "table",
                ladiesCount: club.ladies != null ? club.ladies : 0,
                gentlemenCount: club.gentlemen != null ? club.gentlemen : 0,
                minSpend: club.price != null ? club.price : 0,
                date: club.date != null ? dateTimeUtil.getPostDetail(club.date) : dateTimeUtil.getPostDetail(moment()),

                minSpendValue: club.min_spend != null ? club.min_spend : 0,
                maxSpendValue: club.max_spend != null ? club.max_spend : 0,
                vipSpendValue: club.vip_spend != null ? club.vip_spend : 0,
            })
        }
    }

    getMinSpendText() {
        const minSpend = this.state.minSpend
        if (minSpend === 0) {
            if (this.state.checkingOption === Check_Option_Waiter) return "Please select the total spend"
            else return "Please select your min spend!"
        }
        return "£" + thousands_separators(minSpend) + " (vip)"
    }

    onPressLadiesPlus() {
        this.setState({ ladiesCount: this.state.ladiesCount + 1 })
    }

    onPressLadiesMinus() {
        var ladiesCount = this.state.ladiesCount
        ladiesCount--
        if (ladiesCount < 0) ladiesCount = 0
        this.setState({ ladiesCount })
    }

    onPressGentlemenPlus() {
        this.setState({ gentlemenCount: this.state.gentlemenCount + 1 })
    }

    onPressGentlemenMinus() {
        var gentlemenCount = this.state.gentlemenCount
        gentlemenCount--
        if (gentlemenCount < 0) gentlemenCount = 0
        this.setState({ gentlemenCount })
    }

    onPressGuestList() {
        this.setState({ isGuestList: true })
    }

    onPressTable() {
        this.setState({ isGuestList: false })
    }

    onClickOutSide() {
        if (this.props.onClickOutSide != null) {
            this.props.onClickOutSide();
        }
    }

    onConfirmClick() {
        var date = new Date()
        if(this.props.club != null && this.props.club.date != null) {
            date = moment(this.props.club.date).toDate()
        }

        const body = {
            date: date.toISOString(),
            ladies: this.state.ladiesCount,
            gentlemen: this.state.gentlemenCount,
            price: this.state.minSpend,
            reservation_type: this.state.isGuestList? Config.GUEST_LIST: Config.TABLE
        }
        
        this.props.onClickConfirm(body);
    }

    render() {

        var name = "";
        if(this.props.club != null) {
            name = this.props.club.name;
            if(name == "" || name == null) name = this.props.club.clubName;
        }

        var vipLeft = (this.state.vipSpendValue - this.state.minSpendValue) * 1.0 / (this.state.maxSpendValue - this.state.minSpendValue) * 100;

        return (
            <TouchableOpacity onPress={() => { this.onClickOutSide() }} style={this.props.isModal ? styles.modalModal : styles.viewModal} activeOpacity={1.0}>
                <KeyboardAvoidingView style={this.props.isModal ? styles.modalModal : styles.viewModal} behavior={"padding"} keyboardVerticalOffset={-getHeightPercent(16.0)}>
                    <TouchableOpacity style={[styles.modalContainer, this.props.isModal ? { width: '90%' } : { width: '98%' }]} activeOpacity={1.0} onPress={Keyboard.dismiss}>
                        {this.state.checkingOption === Check_Option_Normal &&
                            <View style={[styles.btnBack, { flexDirection: 'row' }]}>
                                <TouchableOpacity style={this.state.isGuestList ? styles.selBtn : styles.unSelBtn} onPress={() => this.onPressGuestList()}>
                                    <Text style={[styles.modalBtnText, this.state.isGuestList ? { color: 'white' } : { color: 'black' }]}>{"Guest List"}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={!this.state.isGuestList ? styles.selBtn : styles.unSelBtn} onPress={() => this.onPressTable()}>
                                    <Text style={[styles.modalBtnText, !this.state.isGuestList ? { color: 'white' } : { color: 'black' }]}>{"Table"}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        {this.state.checkingOption === Check_Option_Host &&
                            <View style={{ width: '100%', alignItems: 'center' }}>
                                <Image source={Images.ic_avatar_two} style={styles.modalAvatarImg} resizeMode={"contain"} />
                                <Text style={[styles.modalText2, { marginTop: getHeightPercent(1.8) }]}>Mehdi Bcl</Text>
                                <Text style={[styles.modalText1, { marginTop: getHeightPercent(3.6) }]}>3 girls / 3 boys</Text>
                                <Text style={[styles.modalText2, { marginTop: getHeightPercent(3.6) }]}>Check-in the guest list</Text>
                            </View>
                        }
                        {(this.state.checkingOption === Check_Option_Waiter || this.state.checkingOption === Check_Option_Final) &&
                            <View style={{ width: '100%', alignItems: 'center' }}>
                                <Image source={Images.ic_avatar_two} style={styles.modalAvatarImg} resizeMode={"contain"} />
                                <Text style={[styles.modalText2, { marginTop: getHeightPercent(1.4) }]}>Mehdi Bcl</Text>
                                <Text style={[styles.modalText1, { marginTop: getHeightPercent(1.6) }]}>
                                    {this.state.checkingOption === Check_Option_Waiter ? "3 girls / 3 boys" : "£3000 - 3 girls / 3 boys"}
                                </Text>
                                <Text style={[styles.modalText2, { marginTop: getHeightPercent(1.6) }]}>Check-in the guest list</Text>
                            </View>
                        }
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <View style={{ flexDirection: 'row', marginTop: getHeightPercent(2.8) }}>
                                <Text style={styles.modalText1}>At </Text>
                                <Text style={styles.modalText2}>{name} </Text>
                                <Text style={styles.modalText1}>on </Text>
                                <Text style={styles.modalText2}>{this.state.date}</Text>
                            </View>
                        </View>
                        {this.state.checkingOption !== Check_Option_Final &&
                            <View>
                                <View style={styles.modalBodyView}>

                                    {!this.state.isGuestList &&
                                        <View style={{ width: '100%', alignItems: 'center' }}>
                                            <Text style={this.state.minSpend === 0 ? styles.modalText1 : styles.modalSpeText}>{this.getMinSpendText()}</Text>
                                            <View style={styles.thumbSub}>
                                                <Text style={styles.thumbText}>£{this.state.minSpendValue}</Text>
                                                <View style={[styles.thumbDividerContainer, {marginLeft: `${vipLeft}%`}]}>
                                                    <Text style={styles.vipText}>VIP</Text>
                                                    <View style={styles.thumbDivider} />
                                                </View>
                                                <Text style={styles.thumbText}>£{this.state.maxSpendValue}</Text>
                                            </View>
                                            <View style={styles.selectMinContainer}>
                                                <MultiSlider
                                                    onValuesChangeStart={this.disableScroll}
                                                    onValuesChangeFinish={this.enableScroll}
                                                    sliderLength={multiSliderWidth}
                                                    containerStyle={{ alignSelf: 'center' }}
                                                    values={[this.state.minSpend]}
                                                    trackStyle={{ height: 6, borderRadius: 6, backgroundColor: 'black' }}
                                                    selectedStyle={{ backgroundColor: 'white' }}
                                                    min={this.state.minSpendValue} max={this.state.maxSpendValue}
                                                    onValuesChangeFinish={(values) => { this.setState({ minSpend: values[0] }) }}
                                                    onValuesChange={(values) => { this.setState({ minSpend: values[0] }) }}
                                                    customMarker={(e) => { return (<Image style={styles.thumbImg} source={Images.ic_thumb} resizeMode={"contain"} />) }}
                                                />
                                            </View>
                                        </View>
                                    }

                                    <Text style={styles.modalText1}>How many Ladies?</Text>
                                    <View style={styles.modalSubView}>
                                        <TouchableOpacity style={styles.modalCircleBtn} onPress={() => this.onPressLadiesMinus()}>
                                            <Text style={styles.modalText1}>-</Text>
                                        </TouchableOpacity>
                                        <View style={[styles.modalCircleBtn, { backgroundColor: 'black' }]}>
                                            <Text style={[styles.modalText2, { color: 'white' }]}>{this.state.ladiesCount}</Text>
                                        </View>
                                        <TouchableOpacity style={styles.modalCircleBtn} onPress={() => this.onPressLadiesPlus()}>
                                            <Text style={styles.modalText1}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.modalBodyView}>
                                    <Text style={styles.modalText1}>How many Gentlemen?</Text>
                                    <View style={styles.modalSubView}>
                                        <TouchableOpacity style={styles.modalCircleBtn} onPress={() => this.onPressGentlemenMinus()}>
                                            <Text style={styles.modalText1}>-</Text>
                                        </TouchableOpacity>
                                        <View style={[styles.modalCircleBtn, { backgroundColor: 'black' }]}>
                                            <Text style={[styles.modalText2, { color: 'white' }]}>{this.state.gentlemenCount}</Text>
                                        </View>
                                        <TouchableOpacity style={styles.modalCircleBtn} onPress={() => this.onPressGentlemenPlus()}>
                                            <Text style={styles.modalText1}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        }

                        {this.state.checkingOption === Check_Option_Final &&
                            <View>
                                <View style={styles.finalTextBack}>
                                    <View style={styles.finalTextBack_Sub} >
                                        <TextInput
                                            placeholder={"Total spend"}
                                            placeholderTextColor={"white"}
                                            selectionColor={"gray"}
                                            maxLength={10}
                                            style={[styles.finalModalText, { height: '100%' }]}
                                            keyboardType={"numbers-and-punctuation"}
                                            enablesReturnKeyAutomatically
                                            returnKeyType='next' blurOnSubmit={true}
                                            onSubmitEditing={() => { this._paidInput.focus(); }}
                                        />
                                    </View>
                                </View>
                                <View style={styles.finalTextBack}>
                                    <View style={styles.finalTextBack_Sub} >
                                        <TextInput
                                            ref={(ti) => { this._paidInput = ti }}
                                            placeholder={"Paid by tips"}
                                            placeholderTextColor={"white"}
                                            selectionColor={"gray"}
                                            maxLength={10}
                                            style={[styles.finalModalText, { height: '100%' }]}
                                            keyboardType={"default"}
                                            enablesReturnKeyAutomatically
                                            returnKeyType='next' blurOnSubmit={true}
                                            onSubmitEditing={() => { this._numberInput.focus(); }}
                                        />
                                    </View>
                                </View>
                                <View style={styles.finalTextBack}>
                                    <View style={styles.finalTextBack_Sub} >
                                        <TextInput
                                            ref={(ti) => { this._numberInput = ti }}
                                            placeholder={"Number of bottles"}
                                            placeholderTextColor={"white"}
                                            selectionColor={"gray"}
                                            maxLength={10}
                                            style={[styles.finalModalText, { height: '100%' }]}
                                            keyboardType={"numbers-and-punctuation"}
                                            enablesReturnKeyAutomatically
                                            returnKeyType='next' blurOnSubmit={true}
                                            onSubmitEditing={() => { this._tableNumberInput.focus(); }}
                                        />
                                    </View>
                                </View>
                                <View style={styles.finalTextBack}>
                                    <View style={styles.finalTextBack_Sub} >
                                        <TextInput
                                            ref={(ti) => { this._tableNumberInput = ti }}
                                            placeholder={"Table number"}
                                            placeholderTextColor={"white"}
                                            selectionColor={"gray"}
                                            maxLength={10}
                                            style={[styles.finalModalText, { height: '100%' }]}
                                            keyboardType={"numbers-and-punctuation"}
                                            enablesReturnKeyAutomatically
                                            returnKeyType='next' blurOnSubmit={true}
                                            onSubmitEditing={() => { this._commentsInput.focus(); }}
                                        />
                                    </View>
                                </View>
                                <View style={[styles.finalTextBack, { height: getHeightPercent(16.2) }]}>
                                    <View style={[styles.finalTextBack_Sub, { justifyContent: 'flex-start' }]} >
                                        <TextInput
                                            ref={(ti) => { this._commentsInput = ti }}
                                            placeholder={"Comments"}
                                            placeholderTextColor={"white"}
                                            selectionColor={"gray"}
                                            style={[styles.finalModalText, { height: '100%' }]}
                                            keyboardType={"default"}
                                            multiline={true}
                                            enablesReturnKeyAutomatically
                                            returnKeyType='done' blurOnSubmit={true}
                                            onSubmitEditing={() => { }}
                                        />
                                    </View>
                                </View>
                            </View>
                        }

                        <View style={[styles.btnBack, { marginTop: getHeightPercent(3.4) }]}>
                            <TouchableOpacity style={styles.selBtn} onPress={() => this.onConfirmClick()}>
                                <Text style={styles.modalBtnText}>{this.state.confirmReservationText}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </TouchableOpacity>
        )
    }
}

export default MoneyModal;

const styles = StyleSheet.create({
    modalModal: {
        width: '100%',
        height: '100%',
        backgroundColor: Values.modalBackGroundColor,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    viewModal: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        width: '100%',
        marginBottom: getHeightPercent(3.6),
        paddingHorizontal: getHeightPercent(5.4),
        paddingBottom: getHeightPercent(4.4),
        paddingTop: getHeightPercent(1.8),
        borderRadius: 30,
        backgroundColor: '#F8E71C'
    },
    selBtn: {
        flex: 1,
        borderRadius: getHeightPercent(2.5),
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    unSelBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnBack: {
        width: '100%',
        height: getHeightPercent(5.2),
        marginTop: getHeightPercent(2.6)
    },
    modalBtnText: {
        color: '#FFFFFF',
        fontSize: getHeightPercent(2.4),
        ...ApplicationStyles.authScreen.sfProBoldFont,
    },
    modalText1: {
        color: 'black',
        fontSize: getHeightPercent(2.2),
        ...ApplicationStyles.authScreen.sfProMediumFont,
    },
    modalSpeText: {
        color: 'black',
        fontSize: getHeightPercent(2.2),
        ...ApplicationStyles.authScreen.sfProBoldFont,
    },
    modalText2: {
        color: 'black',
        fontSize: getHeightPercent(2.2),
        ...ApplicationStyles.authScreen.sfProBoldFont,
    },
    modalBodyView: {
        marginTop: getHeightPercent(3.6),
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalSubView: {
        width: '100%',
        marginTop: getHeightPercent(2.4),
        height: getHeightPercent(5.4),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modalCircleBtn: {
        height: '100%',
        aspectRatio: 1,
        borderRadius: 100,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectMinContainer: {
        height: getHeightPercent(9.2),
        paddingTop: getHeightPercent(1.2)
    },
    thumbDividerContainer: {
        flexDirection: 'column',
        position: 'absolute',
        marginLeft: '20%',
        
    },
    thumbDivider: {
        width: 1,
        height: getHeightPercent(4.44),
        backgroundColor: 'black',
        marginLeft: getHeightPercent(0.8),
    },
    thumbImg: {
        width: getHeightPercent(3.0),
        height: getHeightPercent(3.0),
        marginTop: 3
    },
    thumbText: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(1.4),
        color: 'black',
        opacity: 0.6
    },
    vipText: {
        ...ApplicationStyles.authScreen.sfProBoldFont,
        fontSize: getHeightPercent(1.4),
        color: 'black',
    },
    thumbSub: { marginTop: getHeightPercent(3.4), flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    modalAvatarImg: {
        width: getHeightPercent(9.2),
        height: getHeightPercent(9.2),
        borderRadius: getHeightPercent(2.0),
    },

    // Final Style

    finalTextBack: {
        width: '100%',
        height: getHeightPercent(5.2),
        marginTop: getHeightPercent(2.2)
    },
    finalTextBack_Sub: {
        flex: 1,
        borderRadius: getHeightPercent(2.5),
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        padding: getHeightPercent(0.8)
    },
    finalModalText: {
        width: '90%',
        color: '#FFFFFF',
        fontSize: getHeightPercent(2.2),
        ...ApplicationStyles.authScreen.sfProMediumFont,
        textAlign: 'center',
    },

})