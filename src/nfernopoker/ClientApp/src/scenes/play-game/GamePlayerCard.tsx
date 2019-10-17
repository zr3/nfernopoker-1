import * as React from "react";
import { Card, CardContent, Typography, CardMedia } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import { Story, Player } from "../../core/models";
import { width } from "@material-ui/system";

interface IOwnProps {
  currentStory: Story,
  player: Player,
  key: number
}

type IProps = IOwnProps;

const styles = {
  card: {
    position:'relative',
    height: '3.5cm',
    width: '2.5cm',
    margin: '.5em'
  },
  image: {
    border: '1px solid #ddd', /* Gray border */
    borderRadius: '2px',  /* Rounded border */
    padding: '1px', /* Some padding */
    width: '100%',
    height: '100%'/* Set a small width */
  },
  initials: {
    position:'absolute',
    top: '1.25cm',
    width: '100%'
  }
} as any;


const GamePlayerCard: React.StatelessComponent<IProps> = (props) => {

  const { currentStory, player, key } = props;

  let playerPoint: { player: string, point: string } = { player: "", point: "" };
  if (currentStory && currentStory.playerPoints) {
    let points = currentStory.playerPoints.find(pp => pp.player == player.email);
    playerPoint = points ? points : { player: "", point: "" };
  }

  function playerInitials(fullName: string) {
    return fullName.split(" ").map((n) => n[0]).join("");
  }

  return (
    <Card key={key} style={styles.card}>
      {playerPoint && <span>{playerPoint.point}</span>}
      <CardMedia
        style={styles.image}
        image="/public/img/playing_card.png"
      >
        <Typography style={styles.initials} variant="h3" align="center">
          {playerInitials(player.name)}
        </Typography>

      </CardMedia>
    </Card >
  )

}

export default withStyles(styles)(GamePlayerCard)
