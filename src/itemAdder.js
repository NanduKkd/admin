import React from 'react';
import {View, Alert, ScrollView, Text, TextInput, TouchableOpacity, AsyncStorage} from 'react-native';

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
	constructor(props){
		super(props);
		this.state = {
			// data:{'Packed food products':['Manjapodi', 'Puttupodi', 'Aatta'], 'Unpacked food products':['Sugar', 'Rice'], 'Fruits':[], 'Vegetables':[]},
			data:{},
			show:{}
		};
		this.load(data => this.setState({data}))
	}
	save = async() => {
		await AsyncStorage.setItem('data',JSON.stringify(this.state.data));
	}
	upload = () => {
		db.ref('structure').set(this.state.data).then(() => alert('uploaded'));
	}
	download = onGet => {
		db.ref('structure').once('value').then(snap => {
			// alert("Got data");
			onGet(snap.val());
		}).catch(error => alert("Couldn't download the database"))
	}
	load = async(onGet) => {
		var data = await AsyncStorage.getItem('data');
		// alert("Got "+data)
		if(data) onGet(JSON.parse(data));
		else this.download(data => onGet(data));
	}
	render() {
		return (
			<ScrollView style={{flex:1}}>
				<View style={{flexDirection:'row', borderBottomWidth:1, borderColor:'#aaa'}}>
					<Text style={{margin:10,flex:1, color:'blue'}} onPress={this.props.back}>{'<-  Back'}</Text>
					<Text style={{margin:10, color:'blue'}} onPress={this.upload}>{'Upload'}</Text>
				</View>
        		{Object.keys(this.state.data).map(item => (
        			<ObjectView k={item} toggleHide={() => this.setState(({show}) => {
        				show[item]= !show[item];
        				return {show}
        			})} hidden={!this.state.show[item]} data={this.state.data[item]} kind="type" add={(name) => {
        				this.setState(({data}) => {
							data[item].push(name);
							return data;
    					});
    					this.save();
        			}} delete={(index) => Alert.alert('Delete', 'Are you sure to delete the item '+this.state.data[item][index], [{text:'no', onPress:() => {}}, {text:'yes',onPress:() => {
        				this.setState(({data}) => {
        					data[item].splice(index,1);
        					return {data};
        				});
    					this.save();
        			}}])} edit={(index,name) => {
        				this.setState(({data}) => {
	        				data[item][index] = name;
	        				return {data};
        				});
    					this.save();
    				}} deleteType={() => Alert.alert('Delete', 'Are you sure to delete the type '+item, [{text:'no', onPress:() => {}}, {text:'yes',onPress:() => {
    					this.setState(({data,show}) => {
	        				delete data[item];
	        				delete show[item];
	        				return {data, show};
        				});
    					this.save();
        			}}])} editType={name => {
    					this.setState(({data, show}) => {
	        				data[name] = data[item];
	        				show[name] = show[item];
	        				delete data[item];
	        				delete show[item];
	        				return {data, show};
        				});
    					this.save();
        			}} />
    			))}
    			<Add kind="type" add={type => {
    				this.setState(({data}) => {
        				data[type] = [];
        				return {data};
        			});
					this.save();
    			}} />
			</ScrollView>
		);
	}
}


class ObjectView extends React.Component{
	state = {edit:false, edited:''};
	render(){
		return (
			<View style={{}}>
	        	{this.state.editing?(
					<View style={{paddingVertical:10, paddingRight:20, borderBottomWidth:1, borderTopWidth:0, alignItems:'center', borderColor:'#eee', flexDirection:'row'}}>
						<View style={{width:30}} />
						<TextInput autoFocus onChangeText={edited => this.setState({edited})} onSubmitEditing={() => this.props.editType?this.props.editType(this.state.edited):this.props.edit(this.state.edited)} style={{flex:1,fontSize:16, marginVertical:0, paddingLeft:0, color:'blue', paddingVertical:1}} placeholder={this.props.k} onBlur={() => this.setState({editing:false})} />
					</View>
				):(
					<TouchableOpacity
		        		style={{paddingVertical:10, paddingRight:20, borderBottomWidth:1, borderTopWidth:0, alignItems:'center', borderColor:'#eee', flexDirection:'row'}}
		        		onPress={() => this.props.toggleHide()}
		          		disabled={!this.props.data}>
		          		{this.props.data?(this.props.hidden?
		            		<View style={{height:30, width:30, alignItems:'center', justifyContent:'center'}}>
								<View style={{transform:[{rotate:'45deg'}], justifyContent:'center', alignItems:'flex-end'}}>
									<View style={{width:1, height:4,backgroundColor:'#000'}} />
									<View style={{width:5, height:1,backgroundColor:'#000'}} />
								</View>
							</View>
						:
							<View style={{height:30, width:30, alignItems:'center', justifyContent:'center'}}>
								<View style={{transform:[{rotate:'45deg'}], justifyContent:'center', alignItems:'flex-start'}}>
									<View style={{width:5, height:1,backgroundColor:'#000'}} />
									<View style={{width:1, height:4,backgroundColor:'#000'}} />
								</View>
							</View>
						):<View style={{height:30, width:30}} />}
		          		<Text style={{flex:1,fontSize:16}}>{this.props.k}</Text>
	        			<TouchableOpacity onPress={() => this.setState({editing:true})} style={{height:30, width:30, alignItems:'center', justifyContent:'center'}}>
	        				<View style={{alignItems:'center', transform:[{rotate:'45deg'}]}}>
	        					<View style={{width:4, height:3,backgroundColor:'#000'}} />
								<View style={{width:4, height:10, marginTop:1,backgroundColor:'#000'}} />
								<View style={{marginTop:1,borderLeftWidth:2,borderRightWidth:2, borderTopWidth:4, borderStyle:'solid', borderLeftColor:'transparent',borderRightColor:'#0000',height:0,width:0, backgroundColor:'#0000'}} />
	        				</View>
	        			</TouchableOpacity>
	        			<TouchableOpacity onPress={this.props.deleteType?this.props.deleteType:this.props.delete} style={{height:30, width:30, alignItems:'center', justifyContent:'center'}}>
	        				<View style={{alignItems:'center', transform:[{rotate:'45deg'}]}}>
	        					<View style={{width:2, height:5,backgroundColor:'#000'}} />
								<View style={{width:12, height:2,backgroundColor:'#000'}} />
								<View style={{width:2, height:5,backgroundColor:'#000'}} />
	        				</View>
	        			</TouchableOpacity>
					</TouchableOpacity>
				)}
				{(!this.props.hidden && this.props.data)?(
					<View style={{marginLeft:25, borderLeftWidth:0, borderColor:'#eee'}}>
						{this.props.kind==='type'?
							<View>
								{this.props.data.map((item, index) => <ObjectView edit={(name) => this.props.edit(index, name)} delete={() => this.props.delete(index)} k={item} kind="item" />)}
								<Add kind="item" add={name => {console.log("Step 2");this.props.add(name)}} />
							</View>
						:null}
					</View>
				):null}
        	</View>
		)
	}
}

class Add extends React.Component{
	state = {name:'', edit:false}
	render() {
		return (
			<View style={{}}>
				{this.state.edit?
					<View
						style={{
							paddingVertical:10,
		        			paddingHorizontal:30,
		        			borderBottomWidth:1,
		        			borderTopWidth:0,
		        			alignItems:'center',
		        			borderColor:'#eee',
		        			flexDirection:'row'
						}}>
						<TextInput blurOnSubmit={false} value={this.state.name} autoFocus onSubmitEditing={() => {
							if(this.state.name.length>0){
								this.props.add(this.state.name);
								this.setState({name:''});
							}else this.setState({name:'',edit:false})
						}} onBlur={() => this.setState({edit:false})} style={{flex:1,fontSize:16, marginVertical:-3, paddingLeft:0, color:'blue', paddingVertical:0}} placeholder={"Add "+this.props.kind} onChangeText={name => this.setState({name})} />
					</View>
				:
					<TouchableOpacity
						onPress={() => this.setState({edit:true})}
		        		style={{
		        			paddingVertical:10,
		        			paddingHorizontal:30,
		        			borderBottomWidth:1,
		        			borderTopWidth:0,
		        			alignItems:'center',
		        			borderColor:'#eee',
		        			flexDirection:'row'
		        		}}>
		          		<Text style={{flex:1,fontSize:16, color:'blue'}}>Add {this.props.kind}</Text>
		        		<View>
							<View style={{alignItems:'center'}}>
								<View style={{width:2, height:4,backgroundColor:'blue'}} />
								<View style={{width:10, height:2,backgroundColor:'blue'}} />
								<View style={{width:2, height:4,backgroundColor:'blue'}} />
							</View>
						</View>
					</TouchableOpacity>
				}
			</View>
		);
	}
}