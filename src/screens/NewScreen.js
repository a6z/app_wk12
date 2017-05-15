import React, { Component } from 'react';
import { View, Picker, ActivityIndicator, Text } from 'react-native';
import * as firebase from 'firebase';
import { FormLabel, FormInput, FormValidationMessage, Button, CheckBox } from 'react-native-elements';
import FBButton from '../components/fbbutton';

class NewScreen extends Component {
  state = {
    email: null,
    password: null,
    username: null,
    phone: null,
    gender: 'mail',
    saving: false,
    error: ' ',
    loading: false
  };


  onCreateUser = async () => {
    const { email, password } = this.state;
    this.setState({ loading: true });
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      await firebase.auth().signInWithEmailAndPassword(email, password);
      this.onSaveInfo();
      this.props.navigation.navigate('UserStack');
    } catch (err) {
      this.setState({
        error: err.message,
        loading: false,
      });
    }
  }

  onSaveInfo = async () => {
    this.setState({ saving: true });
    const { currentUser } = firebase.auth();
    const { email, phone, username, password, gender } = this.state;
    let dbUserid = firebase.database().ref(`/users/${currentUser.uid}`);
    await dbUserid.set({ email, phone, username, password, gender });
    this.setState({ saving: false });
  }

  renderButton() {
    if (this.state.loading) {
      return <ActivityIndicator size='large' style={{ marginTop: 30 }} />;
    }

    return (
      <Button
        style={{ margin: 10 }}
        backgroundColor='#f59128'
        title='Sign up'
        onPress={this.onCreateUser}
      />
    );
  }

  render() {
    console.log(this.state);
    return (
      <View style={styles.formStyle}>
        <FormLabel>Email</FormLabel>
        <FormInput
          placeholder='user@email.com'
          autoCorrect={false}
          autoCapitalize='none'
          keyboardType='email-address'
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        />
        <FormLabel>Password</FormLabel>
        <FormInput
          secureTextEntry
          autoCorrect={false}
          placeholder='at least 6 words.'
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
        />
        <FormLabel>Username</FormLabel>
        <FormInput
          autoCorrect={false}
          placeholder='John Doe'
          value={this.state.username}
          onChangeText={username => this.setState({ username })}
        />
        <FormLabel>Phone</FormLabel>
        <FormInput
          autoCorrect={false}
          placeholder='555-555-5555'
          value={this.state.phone}
          keyboardType='phone-pad'
          onChangeText={phone => this.setState({ phone })}
        />
        <Picker
          style={styles.picker}
          itemStyle={{fontSize: 14, fontWeight: 'bold'}}
          selectedValue={this.state.gender}
          onValueChange={gender => this.setState({ gender })}
        >
          <Picker.Item label="Mail" color="#6ca3e3" value="mail" />
          <Picker.Item label="Femail" color="#ee7a76" value="femail" />
        </Picker>
        <FormValidationMessage style={{marginTop:20}}>{this.state.error}</FormValidationMessage>
        {this.renderButton()}
        <FBButton navigation={this.props.navigation}/>
      </View>
    );
  }
}

const styles = {
  formStyle: {
    flex: 1,
    margin: 20,
    marginTop: 10,
  },
  picker: {
    zIndex: -1,
    height: 100,
    marginTop: -50,
    marginBottom: 50
  }
};

export default NewScreen;
