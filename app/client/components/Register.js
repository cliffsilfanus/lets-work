import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { Form, Button } from "semantic-ui-react";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      username: "",
      password: "",
      repPassword: ""
    };
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  render() {
    const { fname, lname, username, password, repPassword } = this.state;

    return (
      <Form>
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
