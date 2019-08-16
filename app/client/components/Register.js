import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Button, Message } from "semantic-ui-react";
import BACKEND from "./Backend";
import "../css/login.css";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      username: "",
      password: "",
      repPassword: "",
      error: false,
      errorMsgs: [],
      redirect: false
    };
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleSubmit = async () => {
    const { fname, lname, username, password, repPassword } = this.state;

    try {
      const response = await fetch(BACKEND + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fname, lname, username, password, repPassword }),
        redirect: "follow"
      });

      const data = await response.json();
      if (!data.success) {
        this.setState({ error: true, errorMsgs: data.message });
      } else {
        console.log("here");
        this.setState({ redirect: true });
      }
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  render() {
    const { fname, lname, username, password, repPassword } = this.state;

    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }

    return (
      <Form onSubmit={this.handleSubmit} error={this.state.error}>
        <Form.Group widths="equal">
          <Form.Input
            label="First Name"
            placeholder="First Name"
            name="fname"
            value={fname}
            onChange={this.handleChange}
            required
          />
          <Form.Input
            label="Last Name"
            placeholder="Last Name"
            name="lname"
            value={lname}
            onChange={this.handleChange}
            required
          />
        </Form.Group>
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          value={username}
          onChange={this.handleChange}
          required
        />
        <Form.Input
          label="Password"
          placeholder="Password"
          name="password"
          type="password"
          value={password}
          onChange={this.handleChange}
          required
        />
        <Form.Input
          label="Repeat Password"
          placeholder="Repeat Password"
          name="repPassword"
          type="password"
          value={repPassword}
          onChange={this.handleChange}
          required
        />
        <Message error header="Register Failed" list={this.state.errorMsgs} />
        <Button type="submit" fluid>
          Create New Account
        </Button>
        {/* <div>
          Have an account? <Link to="/login">Sign In</Link>
        </div> */}
      </Form>
    );
  }
}

export default Register;
