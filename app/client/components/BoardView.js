import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Input, Table, List, Label, Modal, Tab } from "semantic-ui-react";
import BACKEND from "./Backend";
import ProjectTable from "./ProjectTable";

class BoardView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newProject: "",
      projects: [
        {
          name: "Project 1",
          headers: ["Priority", "Status"],
          tasks: [
            {
              _id: 10,
              name: "P1 Task 1",
              priority: "High",
              status: "Done"
            },
            {
              _id: 11,
              name: "P1 Task 2",
              priority: "Low",
              status: "In Progress"
            }
          ]
        },
        {
          name: "Project 2",
          headers: ["People", "Priority", "Status"],
          tasks: [
            {
              _id: 20,
              name: "P2 Task 1",
              people: ["cliffsilfanus", "x", "a"],
              priority: "Medium",
              status: "Stuck"
            }
          ]
        }
      ],
      currentlyEditingTask: null
    };
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  addProject = () => {};

  edit(task) {
    this.setState({ currentlyEditingTask: tasks });
  }

  editCell = () => {
    console.log("editCell");
  };

  render() {
    // console.log("board id:", this.props.match.params.boardId);
    const { currentlyEditingTask, newProject, projects } = this.state;

    return (
      <div>
        {/* {modal} */}
        <div>Board Id: {this.props.match.params.boardId} </div>
        <Input
          action={{
            color: "violet",
            icon: "plus",
            onClick: this.addProject
          }}
          placeholder="Add a new project..."
          name="newProject"
          value={newProject}
          onChange={this.handleChange}
        />
        {projects.map(project => (
          <div>
            {project.name}
            <ProjectTable project={project} />
            {/* <Table fixed celled compact size="small">
              <Table.Header>
                <Table.HeaderCell>Task</Table.HeaderCell>
                {project.headers.map(header => (
                  <Table.HeaderCell textAlign="center">
                    {header}
                  </Table.HeaderCell>
                ))}
              </Table.Header>

              <Table.Body>
                {project.tasks.map(task => (
                  <Table.Row>
                    <Table.Cell selectable>
                      <a href="#" onClick={this.editCell}>
                        {task.name}
                      </a>
                    </Table.Cell>


                    {task.components.map(col => {
                      let type = Object.keys(col)[0];
                      let data = Object.values(col)[0];

                      if (type === "date") {
                      } else if (type === "users") {
                        return (
                          <Table.Cell selectable>
                            <a href="#">
                              <List horizontal>
                                {data.map(user => (
                                  <List.Item key={user}>
                                    <Label>@{user}</Label>
                                  </List.Item>
                                ))}
                              </List>
                            </a>
                          </Table.Cell>
                        );
                      } else {
                        return (
                          <Table.Cell selectable textAlign="center">
                            <a href="#">{data}</a>
                          </Table.Cell>
                        );
                      }
                    })}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table> */}
          </div>
        ))}
      </div>
    );
  }
}

export default BoardView;

// fetch("muendponit", {
//   data: {
//     _id: 1243141,
//     updateVals: {
//       priority: "high"
//     }
//   }
// });

// fetch("muendponit", {
//   data: {
//     _id: 1243141,
//     status: "in progress",
//     priority: "high"
//   }
// });

// // /tasks/update
// app.post("myendpoint", (req, res) => {
//   const task = await Task.findById({ id: req.body._id });
//   for (let taskName in req.body) {
//     if (taskName !== "_id") {
//       task[taskName] = req.body[taskName];
//     }
//   }

//   await task.save();
// })
