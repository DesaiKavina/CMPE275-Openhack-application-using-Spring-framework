import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  Form, Icon, Input, Button, Checkbox,
} from 'antd';
import '../../css/LoginMain.css';
import axios from 'axios';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import firebase from "firebase"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebaseui from 'firebaseui';
import Navbar from '../Navbar/Navbar';
import firebase_con from '../../Config/firebase';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'

var swal = require('sweetalert');

// firebase.initializeApp({
//   apiKey: "AIzaSyC7hSxpbLOvl140m_g-bzRfhJcj6WZIFFs",
//   authDomain: "my-project-sayalee.firebaseapp.com"
// })


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,
      userId: '',
      userName: '',
      verified: '',
    }
    this.verifyUser = this.verifyUser.bind(this);
  }
  // uiConfig = {
  //   signInFlow: "popup",
  //   signInSuccessUrl: '/home',
  //   signInOptions: [
  //     firebase.auth.GoogleAuthProvider.PROVIDER_ID
  //     // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  //     //firebase.auth.EmailAuthProvider.PROVIDER_ID
  //   ],
  //   callbacks: {
  //     signInSuccess: () => false
  //   },
  //   //Start it here 
  //   credentialHelper: firebaseui.auth.CredentialHelper.NONE
  //   //End it here 
  // }
  // handleSignInWithGoogle = () => {
  //   var values = {}
  //   firebase.auth().onAuthStateChanged(user => {
  //     this.setState({ isSignedIn: !!user })
  //     //console.log("user", user)
  //     //console.log("user.email ", user.email)
  //     if (user != null) {
  //       axios.defaults.withCredentials = true;
  //       axios.get(`http://localhost:8080/getuser/${user.email}`)
  //         .then(response => {
  //           if (response.status == 200 && response.data.email !== user.email) {
  //             values.name = user.displayName.substr(0, user.displayName.indexOf(" "))
  //             values.lastname = user.displayName.substr(user.displayName.indexOf(" "))
  //             values.imageurl = user.photoURL
  //             values.screenName = user.displayName
  //             values.email = user.email
  //             if (user.email.includes("@sjsu.edu")) {
  //               values.usertype = "admin";
  //             }
  //             else {
  //               values.usertype = "user";
  //             }
  //             if (user.emailVerified) {
  //               values.verified = "Y"
  //             }
  //             else {
  //               values.verified = "N"
  //             };
  //             console.log("Send Axios ");
  //             axios.defaults.withCredentials = true;
  //             axios.post('http://localhost:8080/adduser', values)
  //               .then(response => {
  //                 console.log("Status Code : ", response.status);
  //                 console.log("Here Google SignIN", JSON.stringify(response));
  //                 if (response.status === 200) {
  //                   localStorage.setItem("userId", response.data.id);
  //                   localStorage.setItem("userName", response.data.screenName);
  //                   localStorage.setItem("userType", response.data.usertype);
  //                   this.props.history.push("/home");
  //                 }
  //                 // else {
  //                 //     swal("Kindly Register again with correct data", "", "error");
  //                 // }
  //               });
  //           }
  //           else {
  //             localStorage.setItem("userId", response.data.id);
  //             localStorage.setItem("userName", response.data.screenName);
  //             localStorage.setItem("userType", response.data.usertype);
  //             this.props.history.push("/home");
  //           }
  //         })
  //     }
  //   });


  // }

  async verifyUser(email) {
    console.log("user Verified");
    //values.verified = "Y";
    axios.defaults.withCredentials = true;
    let response = await axios.get(`http://localhost:8080/getuser/${email}`)

    // .then(response => {
    if (response.status === 200) {
      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("userName", response.data.screenName);
      localStorage.setItem("userType", response.data.usertype);

      if (response.data.verified === "N") {
        localStorage.setItem("verified", response.data.verified);
        var data = {
          verified: "Y"
        }
        axios.defaults.withCredentials = true;
        const response1 = await axios.put(`http://localhost:8080/updateuser/${response.data.id}`, data)
        // .then(response1 => {
        console.log("Status Code : ", response1.status);
        if (response1.status === 200) {
          console.log("User updated ");
          localStorage.removeItem("verified");
        }
        // });
        this.props.history.push("/home");
      }

    }
    return await response;
    // });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Swal.fire({
          title: 'Logging In...',
          showConfirmButton: false
        })
        firebase_con.auth().signInWithEmailAndPassword(values.email, values.password).then(async (user) => {
          if (!user) {
            Swal.close(); // Close the Swal when reponse has been fetched
            swal("Account not Registered! Please Register", "", "error");
          }
          else if (user.user.emailVerified) {
            await this.verifyUser(values.email);
            console.log("this.state.verified" + localStorage.getItem("verified"));
            Swal.close(); // Close the Swal when reponse has been fetched
            if (localStorage.getItem("verified")) {
              console.log("Not verified first verification");
            }
            else {
              console.log("User is verified before");
              this.props.history.push("/home");
            }
          }
          else {
            Swal.close(); // Close the Swal when reponse has been fetched
            swal("Please verify your Email before Logging In", "", "error");
          }
        }).catch((error) => {
          console.log("Login Error " + error.message);
          Swal.close(); // Close the Swal when reponse has been fetched
          if (error.message === "There is no user record corresponding to this identifier. The user may have been deleted.") {
            swal("Account not Registered! Please Register", "", "error");
          }
          if (error.message === "The password is invalid or the user does not have a password.") {
            swal("Password is Invalid! Please Try Again", "", "error");
          }
        })


        // axios.defaults.withCredentials = true;
        // axios.post('http://localhost:8080/login', values)
        //     .then(response => {
        //         console.log("Status Code : ", response.status);
        //         console.log("Here", JSON.stringify(response));
        //         if (response.status === 200) {
        //         }
        //     });
      }
    });
    // window.location.reload();


  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let redirect = null
    if (localStorage.getItem("userId")) {
      redirect = <Redirect to="/home" />
    }
    return (<div>
      {redirect}
      <Navbar />
      <div className='login-center'>
        {/* {this.state.isSignedIn ? (
          <span>
            <div>Signed In!</div>
            <button onClick={() => firebase.auth().signOut()}>Sign out!</button>
            <h1>Welcome {firebase.auth().currentUser.displayName}</h1>
            <img
              alt="profile picture"
              src={firebase.auth().currentUser.photoURL}
            />
          </span>
        ) : (
            <StyledFirebaseAuth
              uiConfig={this.uiConfig}
              firebaseAuth={firebase.auth()}
            />
          )} */}
         {/* <StyledFirebaseAuth
          uiConfig={this.uiConfig}
          firebaseAuth={firebase.auth()}
        // uiCallback={this.handleSignInWithGoogle.bind(this)}
        /> */}
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please input your Email!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            )}
          </Form.Item>
          <Form.Item>
            {/* {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>Remember me</Checkbox>
            )}
            <a className="login-form-forgot" href="">Forgot password</a> */}
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            Or <a href="/signup">register now!</a>
          </Form.Item>
        </Form>
      </div>
    </div>
    );
  }
}

export default Form.create()(Login);