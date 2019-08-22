import React, { Component } from "react";
import {
  Popup,
  Table,
  List,
  Label,
  Input,
  Grid,
  Button
} from "semantic-ui-react";

class ProjectRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headers: props.headers,
      task: props.task
    };
  }

  editCell = () => {
    console.log("editCell ProjectRow");
  };

  render() {
    const { headers, task } = this.state;

    return (
      <Table.Row>
        <Popup
          position="bottom center"
          on="click"
          trigger={
            <Table.Cell selectable>
              <a>{task.name}</a>
            </Table.Cell>
          }
        >
          <Popup.Content>
            {/* <input defaultValue={task.name} /> */}
            <Input
              defaultValue={task.name}
              placeholder="Task Name"
              action={{ color: "violet", icon: "plus", onClick: this.editCell }}
            />
          </Popup.Content>
        </Popup>
        {headers.map(header => {
          let type = header.toLowerCase();

          if (type === "date") {
            /* return date (from and to) content */
          } else if (type === "people") {
            return (
              <Popup
                position="bottom center"
                on="click"
                trigger={
                  <Table.Cell selectable>
                    <a>
                      <List horizontal>
                        {task.people.map(user => (
                          <List.Item key={user}>
                            <Label>@{user}</Label>
                          </List.Item>
                        ))}
                      </List>
                    </a>
                  </Table.Cell>
                }
              >
                <Popup.Content>
                  <Input
                    placeholder="Add users..."
                    action={{
                      color: "violet",
                      icon: "plus" /* onClick: this.editCell */
                    }}
                  />
                  <List horizontal>
                    <List.Item />
                  </List>
                </Popup.Content>
              </Popup>
            );
          } else {
            let content;
            if (type === "status") {
              content = ["Done", "In Progress", "Stuck"];
            } else {
              content = ["Low", "Medium", "High"];
            }

            return (
              <Popup
                position="bottom center"
                on="click"
                trigger={
                  <Table.Cell selectable textAlign="center">
                    <a>{task[type]}</a>
                  </Table.Cell>
                }
                flowing
              >
                <Grid centered columns={3}>
                  <Grid.Column stretched>
                    {content[0] === "Done" ? (
                      <Button fluid positive>
                        {content[0]}
                      </Button>
                    ) : (
                      <Button fluid>{content[0]}</Button>
                    )}
                  </Grid.Column>
                  <Grid.Column stretched>
                    <Button
                      style={{
                        display: "flex",
                        justifyContent: "center"
                      }}
                      fluid
                      color="yellow"
                    >
                      {content[1]}
                    </Button>
                  </Grid.Column>
                  <Grid.Column stretched>
                    <Button fluid negative>
                      {content[2]}
                    </Button>
                  </Grid.Column>
                </Grid>
              </Popup>
            );
          }
        })}
      </Table.Row>
    );
  }
}

export default ProjectRow;
