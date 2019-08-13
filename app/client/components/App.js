import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";

class App extends Component {
  state = { activeItem: null };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    return (
      <BrowserRouter>
        {/* Navbar */}
        <Menu color="violet" borderless inverted attached>
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
        </Menu>
        <Route exact={true} path="/" component={Home} />
        <Route exact={true} path="/login" component={Login} />
        <Route exact={true} path="/register" component={Register} />
      </BrowserRouter>
    );
  }
}

export default App;
