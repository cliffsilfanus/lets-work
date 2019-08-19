import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal, List, Label, Form, Button, Icon } from "semantic-ui-react";
import BACKEND from "./Backend";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      username: "",
      boards: [],
      boardModal: false,
      newBoardName: "",
      newBoardNameError: false,
      newUser: "",
      newUserError: "",
      invitedUsers: [],
      invitedUsersId: []
    };
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  openBoardModal = () => {
    this.setState({ boardModal: true });
  };

  closeBoardModal = () => {
    this.setState({ boardModal: false });
  };

  addUser = async e => {
    e.preventDefault();
    const { newUser, invitedUsers, username } = this.state;

    // Checks if user has already been invited
    if (invitedUsers.indexOf(newUser) === -1) {
      if (newUser === username) {
        this.setState({ newUserError: "You don't need to invite yourself." });
      } else {
        // Checks if user exists in database
        const response = await fetch(BACKEND + `/user/${newUser}`, {
          method: "GET",
          credentials: "include"
        });

        const data = await response.json();

        if (!data.success) {
          this.setState({ newUserError: "User does not exist." });
        } else {
          this.setState({
            newUserError: "",
            newUser: "",
            invitedUsers: [...this.state.invitedUsers, this.state.newUser],
            invitedUsersId: [...this.state.invitedUsersId, data.userId]
          });
        }
      }
    } else {
      this.setState({ newUserError: "User has already been invited." });
    }
  };

  deleteUser = (e, user) => {
    const { invitedUsers, invitedUsersId } = this.state;
    const index = invitedUsers.indexOf(user);
    this.setState({
      invitedUsers: [
        ...invitedUsers.slice(0, index),
        ...invitedUsers.slice(index + 1)
      ],
      invitedUsersId: [
        ...invitedUsersId.slice(0, index),
        ...invitedUsersId.slice(index + 1)
      ]
    });
  };

  createBoard = async () => {
    console.log("createBoard");
    const { newBoardName, invitedUsersId } = this.state;
    this.setState({ newBoardNameError: newBoardName.length === 0 });

    if (newBoardName.length !== 0) {
      // do owner in backend
      const response = await fetch(BACKEND + "/dashboard", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: newBoardName, users: invitedUsersId }),
        redirect: "follow"
      });

      const data = await response.json();

      console.log(data);

      this.closeBoardModal();
    }
  };

  /* TODO: Set state to relevant information / load it to page */
  componentDidMount = async () => {
    try {
      const response = await fetch(BACKEND + "/me", {
        method: "GET",
        credentials: "include"
      });
      const data = await response.json();
      console.log(data);
      const { fname, lname, username } = data;
      if (data.success) {
        this.setState({ fname, lname, username });
      } else {
        /* NO SESSION EXISTS */
      }
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  render() {
    const {
      newBoardName,
      newUser,
      invitedUsers,
      newUserError,
      newBoardNameError
    } = this.state;

    return (
      <div>
        <button onClick={this.openBoardModal}>Create Board</button>

        <Modal
          open={this.state.boardModal}
          onClose={this.closeBoardModal}
          dimmer="inverted"
        >
          <Modal.Header>Create a New Board</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.createBoard}>
              <Form.Input
                label="Board Name"
                placeholder="Board Name"
                name="newBoardName"
                value={newBoardName}
                onChange={this.handleChange}
                error={newBoardNameError}
              />
              <Form.Input
                label="Invite to Board"
                action={{
                  color: "violet",
                  icon: "plus",
                  onClick: this.addUser
                }}
                placeholder="Enter usernames here..."
                name="newUser"
                value={newUser}
                onChange={this.handleChange}
                error={
                  newUserError !== "" && {
                    content: newUserError
                  }
                }
              />
              <List horizontal>
                {invitedUsers.map(user => (
                  <List.Item key={user}>
                    <Label>
                      @{user}
                      <Icon
                        name="delete"
                        onClick={e => this.deleteUser(e, user)}
                      />
                    </Label>
                  </List.Item>
                ))}
              </List>
              <Button type="submit" color="violet" fluid>
                Create New Board
              </Button>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default Dashboard;
