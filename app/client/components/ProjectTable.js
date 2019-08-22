import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import ProjectRow from "./ProjectRow";

class ProjectTable extends Component {
  constructor(props) {
    super(props);
    console.log("props", props);
    this.state = {
      headers: props.project.headers,
      tasks: props.project.tasks
    };
  }

  editCell = () => {
    console.log("editCell");
  };

  addRow = () => {
    console.log("addRow");
  };

  addColumn = () => {
    console.log("addColumn");
  };

  render() {
    const { headers, tasks } = this.state;

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
        <Button onClick={this.addRow}>Add Row</Button>
        <Button onClick={this.addColumn}>Add Column</Button>
      </React.Fragment>
    );
  }
}

export default ProjectTable;
