import React, { Component } from 'react';
import * as firebase from 'firebase';
import { LoginStack } from './Router';

class App extends Component {

  componentWillMount(){
    var config = {
        apiKey: "AIzaSyD9HnfaAONE04JQDUzHbQ57JDdIKDoSj-s",
        authDomain: "fir-app-93eac.firebaseapp.com",
        databaseURL: "https://fir-app-93eac.firebaseio.com",
        projectId: "fir-app-93eac",
        storageBucket: "fir-app-93eac.appspot.com",
        messagingSenderId: "471639974350"
      };
      firebase.initializeApp(config);
  }

  render() {
    return(
      <LoginStack />
    );
  }
}

export default App;
