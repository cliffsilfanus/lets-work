import React, { Component } from "react";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  updateUsername = e => {
    this.setState({ username: e.target.value });
  };

  updatePassword = e => {
    this.setState({ password: e.target.value });
  };

  render() {
    return <p>Login Page</p>;
  }
}
