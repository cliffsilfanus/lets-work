import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal, Menu, Form, Button } from "semantic-ui-react";

class Home extends Component {
  state = { activeItem: null, modal: false };

  handleItemClick = (e, { name }) =>
    this.setState({ activeItem: name, modal: true });

  //   onModalClose = () => this.setState({ modal: false });

  render() {
    return (
      <div>
        {" "}
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
        {/* <Modal
          open={this.state.activeItem === "register" && this.state.modal}
          onClose={this.onModalClose}
        >
          <Modal.Header>Create your LetsWork Account</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Group widths="equal">
                <Form.Field required>
                  <label>First Name</label>
                  <input placeholder="First Name" />
                </Form.Field>
                <Form.Field required>
                  <label>Last Name</label>
                  <input placeholder="Last Name" />
                </Form.Field>
              </Form.Group>
              <Form.Field required>
                <label>Username</label>
                <input placeholder="Username" />
              </Form.Field>
              <Form.Field required>
                <label>Password</label>
                <input type="password" placeholder="Password" />
              </Form.Field>
              Have an account? <Link to="/asdf">Sign In</Link>
              <Button type="submit" fluid>
                Create New Account
              </Button>
            </Form>
          </Modal.Content>
        </Modal>
        <Modal
          open={this.state.activeItem === "log in" && this.state.modal}
          onClose={this.onModalClose}
        >
          <Modal.Header>Log In to LetsWork</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <label>Username</label>
                <input placeholder="Username" />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <input type="password" placeholder="Password" />
              </Form.Field>
              <Button type="submit">Log In</Button>
            </Form>
          </Modal.Content>
        </Modal> */}
      </div>
    );
  }
}

export default Home;
