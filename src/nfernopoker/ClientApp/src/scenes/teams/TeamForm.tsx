import * as React from "react";
import { ChangeEvent } from "react";
import { Typography, Button, Grid, IconButton, TextField, withStyles } from "@material-ui/core";
import { Delete, Add } from "@material-ui/icons";
import { Team, Player } from "../../core/models"

interface IOwnProps {
  team: Team;
  classes: any;
  onFormChange: (field: string, value: string) => void;
  onPlayerAdded: (player: Player) => void;
  onPlayerRemoved: (player: Player) => void;
  onSave: () => void;
}

interface ITempState {
  player: Player
}

type IProps = IOwnProps;

const getModalStyle = () => {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const styles = (theme: any) => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  playerList: {
    height: '200px',
    overflow: 'auto'
  }
});

class TeamFormComponent extends React.Component<IProps, any> {

  public state: ITempState;

  constructor(props: IProps) {
    super(props);
    this.state = {
      player: { name: "", email: "" }
    };
  }

  handleFormChange = (event: ChangeEvent<HTMLInputElement>, name: string) => {
    this.props.onFormChange(name, event.target.value);
  }

  handlePlayerChanged(event: ChangeEvent<HTMLInputElement>, name: string): void {
    let newState = { ...this.state.player };
    newState[name] = event.target.value;
    this.setState({ player: newState });
  }

  handlePlayerAdded(): void {
    this.props.onPlayerAdded(this.state.player);
    let newState = { ...this.state.player };
    newState.name = newState.email = "";
    this.setState({ player: newState });
  }

  handlePlayerRemoved(player: Player): void {
    this.props.onPlayerRemoved(player);
  }

  handleSave() {
    this.props.onSave();
  }

  storePlayerEmail = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ playerEmail: event.target.value });
  }

  render(): JSX.Element {
    let team = this.props.team;
    let classes = this.props.classes;
    let addDisabled = this.state.player.name == "" && this.state.player.email == "";

    return (
      <div style={getModalStyle()} className={classes.paper}>
        <Grid container spacing={24}>
          <Grid item xs={8}>
            <Typography color="textPrimary" variant="subtitle1">
              Enter new team information below.
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Button color="primary" onClick={() => this.handleSave()}>
              Save
            </Button>
          </Grid>

          <TextField
            id="name"
            fullWidth={true}
            value={team.name}
            label="Team Name"
            margin="normal"
            onChange={(e: any) => this.handleFormChange(e, 'name')}
          />

          <Grid item xs={12}>
            <Typography color="textSecondary" variant="h6"> Add Players to Team </Typography>
          </Grid>

          <Grid item xs={5}>
            <TextField
              id="player-name"
              fullWidth={true}
              value={this.state.player.name}
              label="Full Name"
              margin="dense"
              onChange={(event: ChangeEvent<HTMLInputElement>) => this.handlePlayerChanged(event, "name")}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              id="player-email"
              fullWidth={true}
              value={this.state.player.email}
              label="Email"
              margin="dense"
              onChange={(event: ChangeEvent<HTMLInputElement>) => this.handlePlayerChanged(event, "email")}
            />
          </Grid>

          <Grid item xs={2}>
            <IconButton color="secondary" disabled={addDisabled} onClick={() => this.handlePlayerAdded()}>
              <Add />
            </IconButton>
          </Grid>
        </Grid>

        <ul className={classes.playerList}>
          {
            team.players.map(player => {
              return <li key={player.email}>
                {player.name} - {player.email}
                <Button color="primary" onClick={() => this.handlePlayerRemoved(player)}>
                  <Delete />
                </Button>
              </li>
            })
          }
        </ul>
      </div>
    );
  }
}

export const TeamForm = withStyles(styles as any)(TeamFormComponent)
