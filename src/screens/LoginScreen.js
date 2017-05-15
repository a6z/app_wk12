import React, { Component } from 'react';
import { View, ActivityIndicator, AsyncStorage, Image, TouchableOpacity, Text } from 'react-native';
import * as firebase from 'firebase';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements';
import { Facebook } from 'expo';

import Confirm from '../components/Confirm';
import FBButton from '../components/fbbutton';

// Make a component
class LoginScreen extends Component {
  state = {
    email: null,
    password: null,
    error: ' ',
    loading: false,
    showModal: false,
  };


  onSignIn = async () => {
    const { email, password } = this.state;
    this.setState({ error: ' ', loading: true });
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      this.props.navigation.navigate('UserStack');
    } catch (err) {
      this.setState({
        email: '',
        password: '',
        error: err.message,
        loading: false,
        showModal: false
      });
      // this.setState({ showModal: true });
    }
  }

  onCreateUser = async () => {
    const { email, password } = this.state;
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      this.setState({ showModal: true });
      //this.props.navigation.navigate('UserStack');
    } catch (err) {
      this.setState({
        error: err.message,
      });
    }
  }

  onOPenModal = () => {
    this.setState({
      email: '',
      password: '',
      error: '',
      loading: false,
      showModal: true
    });
  }

  onCLoseModal = () => {
    this.setState({
      email: '',
      password: '',
      error: '',
      loading: false,
      showModal: false
    });
  }

  goToNewScreen = () => {
    this.setState({
      email: '',
      password: '',
      error: '',
      loading: false,
      showModal: false
    });
    this.props.navigation.navigate('NewStack')
  }

  renderButton() {
    if (this.state.loading) {
      return <ActivityIndicator size='large' style={{ marginTop: 30 }} />;
    }

    return (
      <Button
        title='Sign in'
        backgroundColor='#4AAF4C'
        buttonStyle={{ marginTop:10 }}
        onPress={this.onSignIn}
      />
    );
  }

  render() {
    return (
      <View>
      <View style={styles.imgStyle}>
        <Image source = {require('../img/dog.png')} style={{marginTop: 100}}/>
      </View>
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
            autoCapitalize='none'
            placeholder='password'
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />
          {this.renderButton()}
          <FormValidationMessage>{this.state.error}</FormValidationMessage>
        </View>
        <View style={styles.formStyle}>
          <FBButton navigation={this.props.navigation}/>
          <TouchableOpacity style={styles.textStyle} onPress={this.onOPenModal}>
            <Text style={{ color:'#747474', fontSize:12, textDecorationLine:'underline' }}>New User?...</Text>
          </TouchableOpacity>
        </View>
        <Confirm
          title='Are you sure to create a new user?'
          visible={this.state.showModal}
          onAccept={this.goToNewScreen}
          onDecline={this.onCLoseModal}
        />
      </View>
    );
  }
}

const styles = {
  formStyle: {
    margin: 20,
    marginTop: 30,
  },
  imgStyle: {
    alignItems: 'center'
  },
  textStyle: {
    alignItems: 'center',
    marginTop: 10,
  }
};

export default LoginScreen;
