import * as React from "react";
import { Card, Typography, CardMedia } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import { Story, Player } from "../../core/models";

interface IOwnProps {
  currentStory: Story,
  player: Player,
  key: number,
  playerPointFunc(currentStory: Story, userEmail: string): { player: string, point: string }
}

type IProps = IOwnProps;

const styles = {
  card: {
    position: 'relative',
    height: '3.5cm',
    width: '2.5cm',
    marginLeft: '.5em'
  },
  image: {
    border: '1px solid #ddd', /* Gray border */
    borderRadius: '2px',  /* Rounded border */
    padding: '1px', /* Some padding */
    width: '100%',
    height: '100%'/* Set a small width */
  },
  initials: {
    position: 'absolute',
    top: '1.25cm',
    width: '100%'
  },
  playerPoint: {
    textShadow: '2px 2px 4px white'
  }
} as any;


const GamePlayerCard: React.StatelessComponent<IProps> = (props) => {

  const { currentStory, playerPointFunc, player, key } = props;
  let playerPoint = playerPointFunc(currentStory, player.email)
  function playerInitials(fullName: string) {
    return fullName.split(" ").map((n) => n[0]).join("");
  }

  return (
    <Card key={key} style={styles.card}>
      <CardMedia
        style={styles.image}
        image="/public/img/playing_card.png"
      >
        {playerPoint &&
          <Typography style={styles.playerPoint} variant="h4" align="center">
            {playerPoint.point}
          </Typography>
        }

        <Typography style={styles.initials} variant="h3" align="center">
          {playerInitials(player.name)}
        </Typography>

      </CardMedia>
    </Card >
  )

}

export default withStyles(styles)(GamePlayerCard)
