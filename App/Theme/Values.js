import { getHeightPercent } from './../Services/RadioService'

export default {
  authPaddingTop: getHeightPercent(5.4),
  authPaddingBottom: getHeightPercent(5.4),
  authPaddingLeft: getHeightPercent(2.8),
  authPaddingRight: getHeightPercent(2.8),

  authTitleTextSize: getHeightPercent(3.6),
  authPhoneCodeTextSize: getHeightPercent(2.0),
  authInputTextSize: getHeightPercent(3.6),
  authCloseSize: getHeightPercent(4.2),

  authInputTextBorderWidth: getHeightPercent(25),
  authAvatarSize: getHeightPercent(12),
  homeAvatarSize: getHeightPercent(5.4),
  settingAvatarSize: getHeightPercent(10.0),

  mainPaddingHorizontal: getHeightPercent(2.4),

  modalBackGroundColor: '#6E707070',

  supposedCityList: [
    { flag: "π«π·", name: "Cannes", text: "This summer", opacity: 0.6 },
    { flag: "π¦πͺ", name: "Dubai", text: "", opacity: 1.0 },
    { flag: "π¬π§", name: "London", text: "", opacity: 1.0 },
    { flag: "π²π¨", name: "Monaco", text: "Coming Soon", opacity: 0.6 },
    { flag: "π¬π·", name: "Mykonos", text: "This summer", opacity: 0.6 },
    { flag: "πΊπΈ", name: "NYC", text: "Coming Soon", opacity: 0.6 },
    { flag: "π«π·", name: "Paris", text: "", opacity: 1.0 },
    { flag: "π«π·", name: "St Tropez", text: "Coming Soon", opacity: 0.6 },
  ],
}