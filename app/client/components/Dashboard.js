import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal, Menu, Form, Button } from "semantic-ui-react";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "Mr.",
      lname: "A",
      username: "a",
      boards: []
    };
  }

  /* TODO: Set state to relevant information / load it to page */
  componentDidMount() {
    console.log("current user ID:", this.props.location.state.userId);
  }

  render() {
    return <div>You're logged in!</div>;
  }
}

export default Dashboard;
