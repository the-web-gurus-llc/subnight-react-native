import "react-native-gesture-handler";

import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import SplashScreen from "./../Containers/splash/SplashScreen";
import Intro from "./../Containers/Auth/Intro";
import Verification from "./../Containers/Auth/Verification";
import Login from "./../Containers/Auth/Login";
import Register from "./../Containers/Auth/Register";
import RegisterLast from "./../Containers/Auth/RegisterLast";
import WelcomeFirst from "../Containers/Welcome/WelcomeFirst";
import WelcomeSecond from "../Containers/Welcome/WelcomeSecond";
import HomeScreen from "../Containers/Home/HomeScreen"
import ClubDetailScreen from "../Containers/Home/ClubDetailScreen"
import ClubStoryScreen from "../Containers/Home/ClubStoryScreen"
import EditClubScreen from "../Containers/Home/EditClubScreen"
import SettingScreen from "../Containers/Setting/SettingScreen"
import SettingDetailScreen from "../Containers/Setting/SettingDetailScreen"
import UserProfileScreen from "../Containers/Setting/UserProfileScreen"
import UserProfileDetailScreen from "../Containers/Setting/UserProfileDetailScreen"
import ModifyPasswordScreen from "../Containers/Setting/ModifyPasswordScreen"
import VideoTutorialScreen from "../Containers/Setting/VideoTutorialScreen"
import BookingScreen from "../Containers/Booking/BookingScreen"
import BookingShareScreen from "../Containers/Booking/BookingShareScreen"
import RewardScreen from "../Containers/Rewards/NewRewardScreen"
import AllClubScreen from "../Containers/Home/AllClubScreen"
import ChatListScreen from "../Containers/Chat/ChatListScreen"
import ChattingRoomScreen from "../Containers/Chat/ChattingRoom"
import VoiceRecordScreen from "../Containers/Chat/VoiceRecordScreen"
import WifiSettingScreen from "../Containers/WifiSetting/WifiSettingScreen"

const Auth = createSwitchNavigator({
  Intro: {
    screen: Intro,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  Verify: {
    screen: Verification,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  Login: {
    screen: Login,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  Register: {
    screen: Register,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  RegisterLast: {
    screen: RegisterLast,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  WelcomeFirst: {
    screen: WelcomeFirst,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  WelcomeSecond: {
    screen: WelcomeSecond,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
},
  {
    initialRouteName: "Intro"
  }
);

const Home = createSwitchNavigator({
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  ClubDetailScreen: {
    screen: ClubDetailScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  ClubStoryScreen: {
    screen: ClubStoryScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  EditClubScreen: {
    screen: EditClubScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  AllClubScreen: {
    screen: AllClubScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  }
},
  {
    initialRouteName: "HomeScreen"
  }
);

const WifiSetting = createSwitchNavigator({
  WifiSettingScreen: {
    screen: WifiSettingScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
},
  {
    initialRouteName: "WifiSettingScreen"
  }
);

const Setting = createSwitchNavigator({
  SettingScreen: {
    screen: SettingScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  SettingDetailScreen: {
    screen: SettingDetailScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  ModifyPasswordScreen: {
    screen: ModifyPasswordScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  RewardScreen: {
    screen: RewardScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  VideoTutorialScreen: {
    screen: VideoTutorialScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  WifiSetting: {
    screen: WifiSetting,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  UserProfileScreen: {
    screen: UserProfileScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  UserProfileDetailScreen: {
    screen: UserProfileDetailScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  }
},
  {
    initialRouteName: "SettingScreen"
  }
);

const Booking = createSwitchNavigator({
  BookingScreen: {
    screen: BookingScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  BookingShareScreen: {
    screen: BookingShareScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  }
},
  {
    initialRouteName: "BookingScreen"
  }
);

const Chat = createSwitchNavigator({
  ChatListScreen: {
    screen: ChatListScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  ChattingRoomScreen: {
    screen: ChattingRoomScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  VoiceRecordScreen: {
    screen: VoiceRecordScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  }
},
  {
    initialRouteName: "ChatListScreen"
  }
);

const MainNavigation = createSwitchNavigator({
  SplashScreen: {
    screen: SplashScreen,
    navigationOptions: {
      gesturesEnabled: false,
    }
  },
  Auth: {
    screen: Auth,
    navigationOptions: {
      gesturesEnabled: false,
    }
  },
  Home: {
    screen: Home,
    navigationOptions: {
      gesturesEnabled: false,
    }
  },
  Setting: {
    screen: Setting,
    navigationOptions: {
      gesturesEnabled: false,
    }
  },
  Booking: {
    screen: Booking,
    navigationOptions: {
      gesturesEnabled: false,
    }
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      gesturesEnabled: false,
    }
  },
},
  {
    initialRouteName: "SplashScreen",
    header: null
  }
);

export default createAppContainer(MainNavigation);