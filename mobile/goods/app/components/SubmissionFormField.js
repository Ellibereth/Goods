import React, {Component} from 'react';
import {
  StyleSheet, View, TextInput, Text
} from 'react-native';
export default class SubmissionFormField extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
        <View style = {{height : 60}}>
                <Text style={styles.label}> {this.props.label}</Text>
                  <TextInput value ={this.props.value} onChangeText = {this.props.onChange}
                          style = {styles.input}/>
                <View style = {{flex : 0.2}}/>
        </View>
    );
  }
}
const styles = StyleSheet.create({
  input : {flex : 1, width : 220, fontSize : 14, justifyContent : 'flex-start', paddingBottom: 0, 
  borderRadius : 5,
  borderWidth: 1,
  padding : 5
  },
  label : {flex : 0, fontSize : 12, fontWeight : 'bold', color : '#696969'},
});