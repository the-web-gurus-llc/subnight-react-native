import React, {Component} from 'react'
import {View} from 'react-native'
import StartupActions from './../../Stores/Startup/Actions'

import {connect} from 'react-redux'

class SplashScreen extends Component{
	async componentDidMount(){
        setTimeout(() => this.props.startup(), 500);
	}

	render(){
		return( <View style={{backgroundColor: 'black'}}/> )
	}
}

const mapDispatchToProps = dispatch => {
	return {
		startup:() => dispatch(StartupActions.startup()),
	}
};

export default connect(null,mapDispatchToProps)(SplashScreen);
