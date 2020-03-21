import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native';

import firebase from 'firebase';
// if(!firebase.app.length) 
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
const showList = (k) => {
  var abc = [];
  for(var i in k){
    abc.push({...k, key:i});
  }
  return abc;
}
export default class App extends React.Component{
  constructor(props){
    super(props);
    this.check();
    this.state = {unverified:{}}
  }
  check = () => {
    this.setState({unverified:{}});
    // db.ref('shops').orderByChild('verified').equalTo(true).once('child_added').then(snap => {
    db.ref('shops').on('child_added', snap => {
      this.setState(({unverified}) => {
        unverified[snap.key] = snap.val();
        return {unverified};
      })
    })
  }
  render() {
    return (
      <View style={{flex:1}}>
        <Text style={{margin:10, color:'blue'}} onPress={this.props.back}>{'<-  Back'}</Text>
        <ScrollView style={{flex:1}}>
          {Object.keys(this.state.unverified).map((item, index) => (
            <ObjectView data={this.state.unverified[item]} username={item} />
          ))}
        </ScrollView>
        <TouchableOpacity style={{paddingVertical:15, borderWidth:1, margin:5}} onPress={this.check}>
          <Text style={{color:'black', textAlign:'center'}}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class ObjectView extends React.Component{
  constructor(props){
    super(props);
    var x = [];
    var a = this.props.data;
    var edits = a.edit;
    // console.log(a);
    x.push({key:'shop name',val:a.shop.name});
    x.push({key:'shop address',val:a.shop.address});
    x.push({key:'shop phone',val:a.shop.phone});
    x.push({key:'shop location',val:a.shop.location.latitude+', '+a.shop.location.longitude});
    x.push({key:'owner name',val:a.owner.name});
    x.push({key:'owner address',val:a.owner.address});
    x.push({key:'owner phone',val:a.owner.phone});
    if(!edits){
      x.push({key:'edits',val:0});
      edits = {};
    }
    this.state = {hide:true, x, edits}
  }
  verify = () => {
    Alert.alert('Verify', 'Are you sure to verify '+this.props.username+'?', [{text:'No', onPress:() => {}}, {text:'Yes', onPress:() => {
      db.ref('shops').child(this.props.username).child('verified').set(true);
    }}])
  }
  saveEdits = () => {
    var toSave = [];
    Object.keys(this.state.edits).forEach(item => {
      if(!this.state.edits[item].unselect) toSave.push({...this.state.edits[item], eid:item});
    })
    Alert.alert('Save Edits', 'Are you sure to save '+toSave.length+'/'+Object.keys(this.state.edits).length+' edits', [{text:'No', onPress:() => {}}, {text:'Yes', onPress:() => {
      toSave.forEach((a, item) => {
        db.ref('shops').child(this.props.username).child(toSave[item].key).set(toSave[item].value).then(() => {
          db.ref('shops').child(this.props.username).child('edit').child(toSave[item].eid).remove();
        })
      })
    }}]);
  }
  removeEdits = () => {
    var toSave = [];
    Object.keys(this.state.edits).forEach(item => {
      if(!this.state.edits[item].unselect) toSave.push({...this.state.edits[item], eid:item});
    })
    Alert.alert('Save Edits', 'Are you sure to remove '+toSave.length+'/'+Object.keys(this.state.edits).length+' edits', [{text:'No', onPress:() => {}}, {text:'Yes', onPress:() => {
      toSave.forEach((a, item) => {
        // db.ref('shops').child(this.props.username).child(toSave[item].key).set(toSave[item].value).then(() => {
          db.ref('shops').child(this.props.username).child('edit').child(toSave[item].eid).remove();
        // })
      })
    }}]);
  }
  render() {
    return (
      <View style={{}}>
        <TouchableOpacity
          style={{paddingVertical:15, paddingHorizontal:25, borderWidth:1, alignItems:'center', borderColor:'#eee', flexDirection:'row'}}
          onPress={() => {
            this.setState(({hide}) => {
              console.log({hide})
              return {hide:!hide};
            })
          }}>
          <Text style={{flex:1,fontSize:18}}>{this.props.username}</Text>
          {this.props.data.verified?<Text style={{marginHorizontal:25, fontSize:11, paddingVertical:3, paddingHorizontal:15, borderWidth:1, borderColor:'#999', color:'#999'}}>Verified</Text>:null}
          {this.state.hide?
            <View>
              <View style={{transform:[{rotate:'45deg'}], justifyContent:'center', alignItems:'flex-end'}}>
                <View style={{width:2, height:8,backgroundColor:'#000'}} />
                <View style={{width:9, height:2,backgroundColor:'#000'}} />
              </View>
            </View>
          :
            <View>
              <View style={{transform:[{rotate:'45deg'}], justifyContent:'center', alignItems:'flex-start'}}>
                <View style={{width:9, height:2,backgroundColor:'#000'}} />
                <View style={{width:2, height:8,backgroundColor:'#000'}} />
              </View>
            </View>
          }
        </TouchableOpacity>
        {!this.state.hide?(
          <View style={{borderBottomWidth:1}}>
            {this.state.x.map(item => (
              <View style={{flexDirection:'row', borderBottomWidth:1, borderColor:'#eee', padding:10}}>
                <Text style={{width:'25%', textAlignVertical:'center'}}>{item.key}</Text>
                <Text style={{paddingHorizontal:5, textAlignVertical:'center'}}>:</Text>
                <Text style={{flex:1, textAlign:'right', textAlignVertical:'center'}}>{item.val}</Text>
              </View>
            ))}
            {Object.keys(this.state.edits).length>0?
              <View style={{borderTopWidth:0}}>
                <Text style={{textAlign:'center', fontWeight:'bold',marginTop:5, paddingBottom:5, borderBottomWidth:1, borderColor:'#eee'}}>Edits</Text>
                {Object.keys(this.state.edits).map(item => (
                  <TouchableOpacity onPress={() => this.setState(({edits}) => {
                    if(edits[item].unselect) edits[item].unselect = false;
                    else edits[item].unselect = true;
                    return {edits};
                  })} style={{flexDirection:'row', borderBottomWidth:1, alignItems:'center', borderColor:'#eee', padding:10}}>
                    <View style={{borderRadius:5, width:10, height:10, borderColor:'#000', borderWidth:1, marginRight:10}}>
                      {this.state.edits[item].unselect?null:
                        <View style={{backgroundColor:'#000', margin:1, width:6, height:6, borderRadius:4}} />
                      }
                    </View>
                    <Text style={{width:'25%', textAlignVertical:'center'}}>{this.state.edits[item].key}</Text>
                    <Text style={{paddingHorizontal:5, textAlignVertical:'center'}}>:</Text>
                    <Text style={{flex:1, textAlign:'right', textAlignVertical:'center'}}>{this.state.edits[item].value}</Text>
                  </TouchableOpacity>
                ))}
                <View style={{flexDirection:'row', height:50}}>
                  <TouchableOpacity onPress={this.saveEdits} style={{flex:1, backgroundColor:'#000', margin:5, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{color:'#fff'}}>Save Edits</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.removeEdits} style={{flex:1, backgroundColor:'#000', margin:5, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{color:'#fff'}}>Remove Edits</Text>
                  </TouchableOpacity>
                </View>
              </View>
            :null}
            {this.props.data.verified?null:
              <TouchableOpacity style={{paddingVertical:15, backgroundColor:Object.keys(this.state.edits).length===0?'#000':'#aaa', margin:5}} onPress={this.verify}>
                <Text style={{textAlign:'center', color:'#fff'}}>Verify</Text>
              </TouchableOpacity>
            }
          </View>
        ):null}
      </View>
    );
  }
}