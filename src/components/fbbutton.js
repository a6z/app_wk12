import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';
import { Facebook } from 'expo';


class FBButton extends Component {
  state = {
    token: null,
    status: 'Not Login...'
  }

  facebookLogin = async () => {
      console.log('Testing token....');
      let token = await AsyncStorage.getItem('fb_token');

      if (token) {
        console.log('Already having a token...');
        this.setState({ token });

        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`);
        this.setState({ status: `Hello ${(await response.json()).name}` });
        console.log(response);

      } else {
        console.log('DO NOT having a token...');
        this.doFacebookLogin();
      }
      };

      doFacebookLogin = async () => {
      let { type, token } = await Facebook.logInWithReadPermissionsAsync(
        '1297181130317345',
        {
          permissions: ['public_profile'],
          behavior: 'web'
        });

      if (type === 'cancel') {
        console.log('Login Fail!!');
        return;
      }

      await AsyncStorage.setItem('fb_token', token);
      this.setState({ token });
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`);
      this.setState({ status: `Hello ${(await response.json()).name}` });
      console.log(response);
      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      // Sign in with credential from the Facebook user.
      try {
        await firebase.auth().signInWithCredential(credential);
        const { currentUser } = await firebase.auth();
        console.log(`currentUser = ${currentUser.uid}`);
        this.props.navigation.navigate('UserStack');
      } catch (err) {

      }
    };

async componentDidMount() {
  await AsyncStorage.removeItem('fb_token');
}

 render () {
   return (
     <Button
       title='Sign in with Facebook'
       backgroundColor='#39579A'
       onPress={this.facebookLogin}
     />
   );
 }

}




export default FBButton;
