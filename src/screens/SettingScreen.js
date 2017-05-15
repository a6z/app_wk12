import React, { Component } from 'react';
import { View, Picker, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';

import { FormLabel, FormInput, Button, CheckBox } from 'react-native-elements';

// Make a component
class SettingScreen extends Component {
  state = {
    email: null,
    phone: null,
    username: null,
    password: null,
    gender: 'mail',
    saving: false
  };

  async componentWillMount() {
    const { currentUser } = firebase.auth();
    let dbUserid = firebase.database().ref(`/users/${currentUser.uid}`);
    try {
      let snapshot = await dbUserid.once('value');
      let username = snapshot.val().username;
      let email = snapshot.val().email;
      let password = snapshot.val().password;
      let phone = snapshot.val().phone;
      let gender = snapshot.val().gender;

      this.setState({ username, email, password, phone, gender });
    } catch (err) { }
  }

  onSaveInfo = async () => {
    this.setState({ saving: true });
    const { currentUser } = firebase.auth();
    const { email, phone, username, password, gender } = this.state;
    let dbUserid = firebase.database().ref(`/users/${currentUser.uid}`);
    await dbUserid.set({ email, phone, username, password, gender });
    this.setState({ saving: false });
    this.props.navigation.navigate('UserStack');
  }

  renderButton() {
    if (this.state.saving) {
      return <ActivityIndicator size='large' />;
    }

    return (
      <Button
        style={{ marginTop: 10 }}
        title='Save Setting'
        backgroundColor='#4AAF4C'
        onPress={this.onSaveInfo}
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
          autoCorrect={false}
          placeholder='Password'
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
          keyboardType='phone-pad'
          value={this.state.phone}
          onChangeText={phone => this.setState({ phone })}
        />
        <Picker
          itemStyle={{fontSize: 14, fontWeight: 'bold'}}
          selectedValue={this.state.gender}
          onValueChange={gender => this.setState({ gender })}
        >
        <Picker.Item label="Mail" color="#6ca3e3" value="mail" />
        <Picker.Item label="Femail" color="#ee7a76" value="femail" />
        </Picker>
        {this.renderButton()}
      </View>
    );
  }
}

const styles = {
  formStyle: {
    marginTop: 10
  }
};

export default SettingScreen;
