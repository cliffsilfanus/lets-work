import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "semantic-ui-react";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  render() {
    const { username, password } = this.state;

    return (
      <Form>
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          value={username}
          onChange={this.handleChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password"
          name="password"
          type="password"
          value={password}
          onChange={this.handleChange}
        />
        <Button type="submit" fluid>
          Log In
        </Button>
      </Form>
    );
  }
}

export default Login;
