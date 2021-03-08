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
    Keyboard,
    FlatList
} from "react-native";
import { ApplicationStyles, Values } from "../Theme";
import Images from '../Theme/Images'
import { getHeightPercent } from './../Services/RadioService'

class SelectCountryModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            details: Values.supposedCityList
        }
    }

    componentDidMount() {

    }

    onChangeSearchText(text) {
        this.setState({details: Values.supposedCityList.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()))})
    }

    onPressItem(item) {
        this.props.onSelectedCity(item);
    }

    renderItem = ({ item, index }) => {
        const city = item.flag + " " + item.name
        return (
            <TouchableOpacity style={styles.item} onPress={() => { this.onPressItem(item) }}>
                <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.itemText1, { opacity: item.opacity }]}>{city}</Text>
                    <Text style={styles.itemText2}>{item.text}</Text>
                </View>
                <View style={{width: '100%', height: 0.6, backgroundColor: '#707070', opacity: 0.5}}>

                </View>
            </TouchableOpacity>
        )
    };

    keyExtractor = (item, index) => index.toString();

    render() {
        if (!this.props.visible) return null;
        return (
            <TouchableOpacity style={styles.modalView} onPress={this.props.onClose}>
                <View style={styles.modalContainer}>
                    <View style={styles.search}>
                        <TouchableOpacity style={{ height: '100%', justifyContent: 'center' }} onPress={this.props.onClose}>
                            <Image source={Images.ic_close_search} style={styles.closeBtn} resizeMode={"contain"} />
                        </TouchableOpacity>
                        <View style={styles.searchBack}>
                            <TextInput
                                placeholder={"Search for a city"}
                                placeholderTextColor={"black"}
                                maxLength={10}
                                selectionColor={"gray"}
                                style={styles.searchText}
                                enablesReturnKeyAutomatically
                                returnKeyType='search' blurOnSubmit={true}
                                onChangeText={(str) => this.onChangeSearchText(str)}
                            />
                        </View>
                    </View>
                    <FlatList
                        data={this.state.details}
                        extraData={this.state.details}
                        renderItem={this.renderItem}
                        keyExtractor={this.keyExtractor}
                    />
                </View>
            </TouchableOpacity>
        )
    }
}

export default SelectCountryModal;

const styles = StyleSheet.create({
    modalView: {
        width: '100%',
        height: '100%',
        backgroundColor: Values.modalBackGroundColor,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContainer: {
        height: getHeightPercent(66.2),
        marginHorizontal: getHeightPercent(2.4),
        paddingHorizontal: getHeightPercent(2.4),
        paddingBottom: getHeightPercent(2.4),
        paddingTop: getHeightPercent(2.2),
        borderRadius: 30,
        backgroundColor: '#F8E71C'
    },
    closeBtn: {
        width: getHeightPercent(1.8), height: getHeightPercent(1.8),
        marginHorizontal: getHeightPercent(0.4),
    },
    search: {
        width: '100%',
        height: getHeightPercent(4.4),
        flexDirection: 'row-reverse',
    },
    searchBack: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: getHeightPercent(1.2),
        marginLeft: getHeightPercent(0.2),
        marginRight: getHeightPercent(1.2),
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(1.8),
        color: 'black'
    },
    item: {
        width: '100%',
        height: getHeightPercent(7.2),
    },
    itemText1: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(2.4),
        color: 'black'
    },
    itemText2: {
        ...ApplicationStyles.authScreen.sfProBoldFont,
        fontSize: getHeightPercent(2.4),
        color: 'black'
    }
})