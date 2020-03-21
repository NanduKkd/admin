import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import Online from './src/online';
import ItemAdder from './src/itemAdder';

import firebase from 'firebase';
if(!firebase.app.length) 
  firebase.initializeApp({
    apiKey: "AIzaSyDCfZ3XBpebv6q5RmqAonpFZW5MzPILrlk",
    authDomain: "nvrevrgivup.firebaseapp.com",
    databaseURL: "https://nvrevrgivup.firebaseio.com",
    projectId: "nvrevrgivup",
    storageBucket: "nvrevrgivup.appspot.com",
    messagingSenderId: "71204086293",
    appId: "1:71204086293:web:e5ab55f23cfe6e1ff6a41c",
    measurementId: "G-5SW08FD8W8"
  })
const db = firebase.database();
export default class App extends React.Component{
	state = {state:0}
	render() {
		switch(this.state.state){
			case 0:
				return (
					<View style={{flex:1}}>
						<TouchableOpacity onPress={() => this.setState({state:1})} style={{margin:2, paddingVertical:15, alignItems:'center', borderWidth:1}}>
							<Text style={{}}>Add items</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.setState({state:2})} style={{margin:2, paddingVertical:15, alignItems:'center', borderWidth:1}}>
							<Text style={{}}>Check online</Text>
						</TouchableOpacity>
					</View>
				);
			case 1:
				return <ItemAdder back={() => this.setState({state:0})} />
			case 2:
				return <Online back={() => this.setState({state:0})} />
		}
	}
}