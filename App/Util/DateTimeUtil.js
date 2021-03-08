import moment from "moment"

const FORMAT_CLUB = "dddd DD.MM YYYY"
const FORMAT_POST_DETAIL = "dddd DD/MM"
const FORMAT_CHAT_LIST = "HH:MM"

function convertUTCtoClub(time) {
    return moment(time).format(FORMAT_CLUB);
}

function getPostDetail(time) {
    return moment(time).format(FORMAT_POST_DETAIL);
}

function getChatListTime(time) {
    return moment(time).format(FORMAT_CHAT_LIST);
}

function compareServerAndClub(time1, time2) {
    return convertUTCtoClub(time1) === time2
}

function isTodayPost(time1) {
    const moment1 = moment(time1)
    return moment1.isSame(moment(), "day")
}

function compareTwoClubTime(time1, time2) {
    return moment(time2) - moment(time1)
}

export const dateTimeUtil = {
    convertUTCtoClub,
    getPostDetail,
    compareServerAndClub,
    compareTwoClubTime,
    isTodayPost,
    getChatListTime,
}