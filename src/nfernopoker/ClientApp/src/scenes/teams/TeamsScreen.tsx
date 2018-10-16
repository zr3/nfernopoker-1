import * as React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Button, Grid, Modal, Typography, withStyles } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";
import { Team, Player } from "../../core/models";
import { TeamForm } from "./TeamForm";
import { TeamCard } from "./TeamCard";

interface IOwnProps {
  firebase: any;
  profile: any;
  teams: Array<Team>;
  classes: any;
}

interface ITempState {
  teamRef: any;
  modalOpen: boolean;
  team: Team;
}

type IProps = IOwnProps;

const styles: any = (theme: any) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    margin: theme.spacing.unit
  }
});

class TeamsScreenComponent extends React.Component<IProps, ITempState> {

  public state: ITempState;

  constructor(props: IProps) {
    super(props);
    this.state = {
      modalOpen: false,
      teamRef: null,
      team: this.getInitialTeamState()
    };
  }

  handleTeamChanged(name: string, value: string): void {
    let newState = { ...this.state.team };
    newState[name] = value;
    this.setState({ team: newState });
  }

  handlePlayerAdded(player: Player): void {
    let newState = { ...this.state.team };
    newState.players.push(player);
    this.setState({ team: newState });
  }

  handlePlayerRemoved(player: Player): void {
    let newState = { ...this.state.team };
    newState.players = newState.players.filter(p => p.email !== player.email);
    this.setState({ team: newState });
  }

  handleModalOpen() {
    this.setState({ modalOpen: true, teamRef: null });
  }

  handleModalClose() {
    this.setState({ modalOpen: false });
  }

  handleEditTeam(key: string) {
    this.setState({ modalOpen: true, team: this.props.teams[key], teamRef: this.props.firebase.ref(`/teams/${key}`) });
  }

  handleDeleteTeam(key: string) {
    this.props.firebase.remove(`/teams/${key}`)
  }

  saveTeam(): void {
    if (this.state.teamRef) {
      this.state.teamRef.update(this.state.team);
    } else {
      let newTeam = { ...this.state.team };
      newTeam.owner = `${this.props.profile.firstName} ${this.props.profile.lastName}`;
      newTeam.ownerEmail = this.props.profile.email;
      this.props.firebase.push('teams', newTeam);
    }
    this.setState({
      team: this.getInitialTeamState(),
      modalOpen: false
    });
  }

  private getInitialTeamState(): Team {
    return {
      owner: "",
      ownerEmail: "",
      name: "",
      players: []
    };
  }

  render() {
    let classes = this.props.classes;

    if (!isLoaded(this.props.teams)) {
      return <p>Loading... </p>
    }

    let cards = new Array<any>();
    if (!isEmpty(this.props.teams) && isLoaded(this.props.teams)) {
      cards = Object.keys(this.props.teams).map((key, index) => {
        let team = this.props.teams[key];
        return <TeamCard key={key} gameKey={key} team={team}
          onEditTeam={(key: string) => this.handleEditTeam(key)}
          onRemoveTeam={(key: string) => this.handleDeleteTeam(key)} />
      });
    }

    return (
      <div>
        <Grid container
          direction="row"
          justify="space-between"
          alignItems="center">
          <Typography variant="h1">My Teams</Typography>
          <Button variant="fab" color="primary" aria-label="Add" className={classes.button} title="Add New Team"
            onClick={() => this.handleModalOpen()}>
            <Add />
          </Button>
        </Grid>

        <Grid container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          className={classes.root} spacing={24}>

          {cards}

          <Modal
            open={this.state.modalOpen}
            onClose={() => this.handleModalClose()}
          >
            <TeamForm
              team={this.state.team}
              onSave={() => this.saveTeam()}
              onFormChange={(name: string, value: string) => this.handleTeamChanged(name, value)}
              onPlayerAdded={(player: Player) => this.handlePlayerAdded(player)}
              onPlayerRemoved={(player: Player) => this.handlePlayerRemoved(player)}
            />
          </Modal>

        </Grid>
      </div>
    )

  }
}

export const TeamsScreen = compose<React.ComponentClass<ITempState>>(
  withStyles(styles as any),
  firebaseConnect((props: IProps) => [
    'teams',
  ]),
  connect((state: any) => ({
    teams: state.firebase.data.teams,
    profile: state.firebase.profile
  })
  ))(TeamsScreenComponent);
