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
    TextInput,
} from "react-native";
import { Icon } from 'react-native-elements';
import Images from '../../Theme/Images'
import { ApplicationStyles, Values } from "../../Theme";
import { getHeightPercent } from './../../Services/RadioService'
import { connect } from 'react-redux';
import moment from "moment";
import { dateTimeUtil } from './../../Util/DateTimeUtil'
import { containedString } from "../../Services/HelperService";

const DATE_FILTER = 'date'
const MUSIC_FILTER = 'music'
const OPEN_FILTER = 'open'

class AllClubScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filterBy: DATE_FILTER,
            clubs: [ ]
        }

        this.searchStr = ""
    }

    componentDidMount() {
        this.filterClubs()
    }

    onChangeSearchText(str) {
        this.searchStr = str
        this.filterClubs()
    }

    filterClubs() {
        const { filterBy } = this.state
        const originClubs = this.props.clubs.filter((item) => containedString(item.name, this.searchStr))
        var clubs = []
        if (filterBy === DATE_FILTER) {
            originClubs.map((item, index) => {
                const newDate = dateTimeUtil.convertUTCtoClub(item.updated_at)
                if (clubs.find(element => element.date === newDate) == null) {
                    const newList = originClubs.filter((item) => dateTimeUtil.compareServerAndClub(item.updated_at, newDate))
                    clubs = [...clubs, { date: newDate, items: newList }]
                }
            })
        } else if (filterBy === MUSIC_FILTER) {
            originClubs.map((item, index) => {
                if (item.music_styles != null && item.music_styles[0] != null) {
                    var newMusic = item.music_styles[0].toUpperCase()
                    if(clubs.find(element => element.music === newMusic) == null) {
                        const newList = originClubs.filter((item) => item.music_styles != null && item.music_styles[0] != null && item.music_styles[0].toUpperCase() === newMusic)
                        clubs = [...clubs, { music: newMusic, items: newList }]
                    }
                }
            })
        } else {
            const today = moment(new Date()).day()
            originClubs.map((item, index) => {
                const newDate = dateTimeUtil.convertUTCtoClub(item.updated_at)
                if (clubs.find(element => element.date === newDate) == null) {
                    const newList = originClubs.filter((item) => dateTimeUtil.compareServerAndClub(item.updated_at, newDate) && item.open_days.includes(today))
                    if(newList.length > 0) clubs = [...clubs, { date: newDate, items: newList }]
                }
            })
        }

        this.setState({ clubs: clubs.sort((a,b) => dateTimeUtil.compareTwoClubTime(a.items[0].updated_at,b.items[0].updated_at)) })
    }

    onPressClose() {
        this.props.navigation.navigate('HomeScreen')
    }

    onPressFilterBy(filterBy) {
        this.setState({ filterBy }, () => this.filterClubs());
    }

    renderItem = ({ item }) => {
        return (
            <View style={styles.itemView}>
                <Image source={{ uri: item.logo }} style={styles.itemImage} resizeMode={"cover"} />
                <Text style={styles.itemText}>{item.name}</Text>
            </View>
        )
    }

    renderFilterItem = ({ item }) => {
        return (
            <View style={styles.itemFilter}>
                <Text style={styles.filterItemText}>{this.state.filterBy !== MUSIC_FILTER ? item.date : item.music}</Text>
                <View style={styles.filterItemView}>
                    <FlatList
                        data={item.items}
                        renderItem={this.renderItem}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={this.keyExtractor}
                    />
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
                        <Text style={styles.closeText}>Cancel</Text>
                    </TouchableOpacity>
                    <View style={styles.searchContainer}>
                        <TextInput
                            returnKeyType='search'
                            style={styles.searchText}
                            placeholderTextColor={'black'}
                            blurOnSubmit={true}
                            onChangeText={(str) => this.onChangeSearchText(str)}
                            placeholder="Search for a nightclub …" />
                    </View>
                </View>
                <View style={styles.mainContainer}>
                    {/* Filter By  */}
                    <View style={{ marginTop: getHeightPercent(3.6) }}>
                        <Text style={styles.filterText}>Filter by</Text>
                        <View style={{ flexDirection: 'row', marginTop: getHeightPercent(2.0) }}>
                            <TouchableOpacity style={{ width: getHeightPercent(9.0) }} onPress={() => this.onPressFilterBy(DATE_FILTER)}>
                                <Text style={this.state.filterBy === DATE_FILTER ? styles.selFilterText : styles.unSelFilterText}>Date</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: getHeightPercent(9.0) }} onPress={() => this.onPressFilterBy(MUSIC_FILTER)}>
                                <Text style={this.state.filterBy === MUSIC_FILTER ? styles.selFilterText : styles.unSelFilterText}>Music</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: getHeightPercent(9.0) }} onPress={() => this.onPressFilterBy(OPEN_FILTER)}>
                                <Text style={this.state.filterBy === OPEN_FILTER ? styles.selFilterText : styles.unSelFilterText}>Open</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/* Club List */}
                <View style={styles.clubList}>
                    <FlatList
                        data={this.state.clubs}
                        extraData={this.state.filterBy}
                        renderItem={this.renderFilterItem}
                        keyExtractor={this.keyExtractor}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </Animated.View>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        clubs: state.user.clubs,
    }
};

export default connect(mapStateToProps)(AllClubScreen)

const styles = StyleSheet.create({
    container: {
        ...ApplicationStyles.screen.container,
    },
    titleContainer: {
        ...ApplicationStyles.screen.topContainer,
        width: '100%',
    },
    searchContainer: {
        height: getHeightPercent(4.8),
        flex: 1,
        backgroundColor: 'white',
        borderRadius: getHeightPercent(1.0),
        justifyContent: 'center',
    },
    mainContainer: {
        marginHorizontal: Values.mainPaddingHorizontal,
    },
    clubList: {
        flex: 1,
        marginLeft: Values.mainPaddingHorizontal,
        marginTop: getHeightPercent(4.0)
    },
    closeText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(2.0),
        color: 'white',
        marginLeft: getHeightPercent(2.0)
    },
    searchText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        color: 'black',
        marginHorizontal: getHeightPercent(1.4),
        fontSize: getHeightPercent(2.0)
    },
    filterText: {
        ...ApplicationStyles.authScreen.sfProLightFont,
        fontSize: getHeightPercent(3.2),
        color: 'white'
    },
    selFilterText: {
        ...ApplicationStyles.authScreen.sfProSemiBoldFont,
        fontSize: getHeightPercent(2.0),
        color: 'white',
    },
    unSelFilterText: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(2.0),
        color: 'white',
        opacity: 0.6,
    },
    itemFilter: {
        height: getHeightPercent(31.8),
        width: '100%',
    },
    filterItemText: {
        ...ApplicationStyles.authScreen.sfProHeavyFont,
        fontSize: getHeightPercent(2.0),
        color: 'white',
    },
    filterItemView: {
        marginTop: getHeightPercent(2.4),
        flex: 1,
    },
    itemView: {
        width: getHeightPercent(17.6),
        flexDirection: 'column',
    },
    itemImage: {
        width: getHeightPercent(14.4),
        height: getHeightPercent(20.2),
        borderRadius: getHeightPercent(0.6)
    },
    itemText: {
        ...ApplicationStyles.authScreen.sfProMediumFont,
        fontSize: getHeightPercent(1.8),
        color: 'white',
        marginTop: getHeightPercent(1.4)
    }
})