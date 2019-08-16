import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Modal, Menu, Form, Button } from "semantic-ui-react";
import BACKEND from "./Backend";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: null,
      userId: ""
    };
  }

  async componentDidMount() {
    try {
      const getSession = await fetch(BACKEND + "/login", {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await getSession.json();
      console.log(data);
      if (data.session) {
        this.setState({ userId: data.userId });
      }
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  }
  // componentDidMount() {
  //   fetch(BACKEND + "/login", {
  //     method: "GET",
  //     mode: "cors",
  //     credentials: "include",
  //     headers: {
  //       "Content-Type": "application/json"
  //     }
  //   })
  //     .then(response => response.json())
  //     .then(responseJson => {
  //       console.log(responseJson);
  //     });
  // }

  render() {
    if (this.state.userId) {
      console.log("got here");
      return (
        <Redirect
          to={{ pathname: "/dashboard", state: { userId: this.state.userId } }}
        />
      );
    }

    return (
      <div>
        test
        {/* <Menu color="violet" borderless inverted attached>
          <Menu.Item>LetsWork</Menu.Item>
          <Menu.Menu position="right">
            <Link to="/login">
              <Menu.Item
                name="log in"
                active={this.state.activeItem === "log in"}
                onClick={this.handleItemClick}
              />
            </Link>
            <Link to="/register">
              <Menu.Item
                name="register"
                active={this.state.activeItem === "register"}
                onClick={this.handleItemClick}
              />
            </Link>
          </Menu.Menu>
        </Menu> */}
      </div>
    );
  }
}

export default Home;
