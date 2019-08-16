import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Button, Message } from "semantic-ui-react";
import BACKEND from "./Backend";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: false,
      errorMsg: "",
      userId: ""
    };
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleSubmit = async () => {
    const { username, password } = this.state;

    try {
      const response = await fetch(BACKEND + "/login", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password }),
        redirect: "follow"
      });
      const data = await response.json();
      console.log(data);

      if (!data.success) {
        this.setState({ error: true, errorMsg: data.message });
      } else {
        console.log("logged in");
        this.setState({ userId: data.userId });
      }
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  render() {
    const { username, password } = this.state;

    if (this.state.userId) {
      return (
        <Redirect
          to={{ pathname: "/dashboard", state: { userId: this.state.userId } }}
        />
      );
    }

    return (
      <Form onSubmit={this.handleSubmit} error={this.state.error}>
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
        <Message error header="Log In Failed" content={this.state.errorMsg} />
        <Button type="submit" fluid>
          Log In
        </Button>
      </Form>
    );
  }
}

export default Login;
