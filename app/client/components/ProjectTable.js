import React, { Component } from "react";
import { Table, Button, Popup, Dropdown } from "semantic-ui-react";
import ProjectRow from "./ProjectRow";
import BACKEND from "./Backend";

class ProjectTable extends Component {
  constructor(props) {
    super(props);
    console.log("props", props);
    this.state = {
      headers: [],
      tasks: [],
      availableCol: [
        { key: "Date", text: "Date", value: "Date" },
        { key: "People", text: "People", value: "People" },
        { key: "Status", text: "Status", value: "Status" },
        { key: "Priority", text: "Priority", value: "Priority" }
      ],
      addedColumn: "",
      loading: true
    };
  }

  componentDidMount = async () => {
    const response = await fetch(
      BACKEND + "/projects/" + this.props.project._id,
      {
        method: "GET",
        mode: "cors",
        credentials: "include"
      }
    );

    const data = await response.json();

    const { headers, tasks } = data.project;
    console.log("headers", headers, "tasks", tasks);

    let updatedCol = this.state.availableCol;

    headers.map(header => {
      updatedCol = updatedCol.filter(x => x.key !== header);
    });

    this.setState({ availableCol: updatedCol, headers, tasks, loading: false });
  };

  handleChange = (e, { value }) => this.setState({ addedColumn: value });

  editCell = () => {
    console.log("editCell");
  };

  addRow = async () => {
    const projectId = this.props.project._id;

    try {
      const response = await fetch(`${BACKEND}/dashboard/${projectId}/row`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        redirect: "follow"
      });

      const data = await response.json();

      console.log(data);

      if (data.success) {
        this.setState({ tasks: data.project.tasks });
      }
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  addColumn = async () => {
    console.log("addColumn", this.state.addedColumn);
    const { addedColumn } = this.state;
    const projectId = this.props.project._id;

    if (this.state.addedColumn !== "") {
      try {
        const response = await fetch(
          `${BACKEND}/dashboard/${projectId}/column`,
          {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ addedColumn }),
            redirect: "follow"
          }
        );

        const data = await response.json();
        console.log(data);
        if (data.success) {
          const updatedCol = this.state.availableCol.filter(
            x => x.key !== addedColumn
          );
          console.log("added col, setting headers", data.project.headers);
          this.setState({
            headers: data.project.headers,
            availableCol: updatedCol
          });
        }
      } catch (err) {
        console.log(`Error: ${err}`);
      }
    }
  };

  render() {
    const { headers, tasks, availableCol, addedColumn } = this.state;
    console.log("ProjectTable render", tasks, headers);

    // if (this.state.loading) {
    //   return null;
    // }
    return (
      <React.Fragment>
        <Table fixed celled compact size="small">
          <Table.Header>
            <Table.HeaderCell>Task</Table.HeaderCell>
            {headers.map(header => (
              <Table.HeaderCell textAlign="center">{header}</Table.HeaderCell>
            ))}
          </Table.Header>
          <Table.Body>
            {tasks.map(task => (
              <ProjectRow headers={headers} task={task} />
            ))}
          </Table.Body>
        </Table>
        <Popup
          position="top center"
          on="click"
          trigger={<Button>Add Column</Button>}
        >
          <Popup.Content>
            <Dropdown
              onChange={this.handleChange}
              options={availableCol}
              placeholder="Select type of column..."
              selection
              value={addedColumn}
            />
            <Button fluid onClick={this.addColumn}>
              Add Column
            </Button>
          </Popup.Content>
        </Popup>
        <Button onClick={this.addRow}>Add Row</Button>
      </React.Fragment>
    );
  }
}

export default ProjectTable;
