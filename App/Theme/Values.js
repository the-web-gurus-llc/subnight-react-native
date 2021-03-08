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
    { flag: "🇫🇷", name: "Cannes", text: "This summer", opacity: 0.6 },
    { flag: "🇦🇪", name: "Dubai", text: "", opacity: 1.0 },
    { flag: "🇬🇧", name: "London", text: "", opacity: 1.0 },
    { flag: "🇲🇨", name: "Monaco", text: "Coming Soon", opacity: 0.6 },
    { flag: "🇬🇷", name: "Mykonos", text: "This summer", opacity: 0.6 },
    { flag: "🇺🇸", name: "NYC", text: "Coming Soon", opacity: 0.6 },
    { flag: "🇫🇷", name: "Paris", text: "", opacity: 1.0 },
    { flag: "🇫🇷", name: "St Tropez", text: "Coming Soon", opacity: 0.6 },
  ],
}