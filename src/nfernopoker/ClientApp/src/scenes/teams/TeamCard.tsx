import * as React from "react";
import { compose } from "redux";
import { Button, Card, CardContent, Grid, Typography, withStyles } from "@material-ui/core";
import { Team } from "../../core/models";
import { People, Delete } from '@material-ui/icons';

interface IOwnProps {
  team: Team;
  gameKey: string;
  classes: any;
  onEditTeam: (key: string) => void;
  onRemoveTeam: (key: string) => void;
}

type IProps = IOwnProps;

const styles: any = (theme: any) => ({
  card: {
    width: 300,
    height: 225,
    margin: '24px'
  }
});

class TeamCardComponent extends React.Component<IProps> {

  constructor(props: IProps) {
    super(props);
  }

  render() {
    let team = this.props.team;
    let classes = this.props.classes;
    let playerCount = team.players ? team.players.length : 0;

    return (<Card key={team.name} className={classes.card}>
      <CardContent>
        <People fontSize="large" />
        <Typography gutterBottom noWrap variant="h3">
          {team.name}
        </Typography>
        <Typography variant="subtitle1">
          {playerCount} team members
        </Typography>
        <Grid container
          direction="row"
          justify="space-between"
          alignItems="center">
          <Button color="primary" title="Edit Team" onClick={() => this.props.onEditTeam(this.props.gameKey)}>
            Edit
          </Button>
          <Button color="secondary" title="Delete Team" onClick={() => this.props.onRemoveTeam(this.props.gameKey)}>
            <Delete />
          </Button>
        </Grid>
      </CardContent>
    </Card>)
  }

}

export const TeamCard = compose(
  withStyles(styles as any)
)(TeamCardComponent)
