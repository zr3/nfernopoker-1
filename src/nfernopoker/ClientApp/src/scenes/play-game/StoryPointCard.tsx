import * as React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

interface IOwnProps {
  onCardSelected(cardValue: string): void,
  key: number,
  cardValue: string,
  userSelectedCard: string
}

type IProps = IOwnProps;

const styles = {
  card: {
    position: 'relative',
    height: '2.5cm',
    width: '1.5cm',
    margin: '.5em'
  },
  currentcard: {
    position: 'relative',
    height: '2.5cm',
    width: '1.5cm',
    margin: '.5em',
    borderWidth: 1,
    borderColor: 'red',
    borderStyle: 'solid'
  }
} as any;


const StoryPointCard: React.StatelessComponent<IProps> = (props) => {

  const { key, cardValue, onCardSelected, userSelectedCard } = props;

  let cardStyle = cardValue == userSelectedCard ? styles.currentcard : styles.card;

  return (<Card key={key} style={cardStyle} onClick={() => onCardSelected(cardValue)}>
    <CardContent>
      <Typography gutterBottom={true} >
        {cardValue}
      </Typography>
    </CardContent>
  </Card>)

}

export default withStyles(styles)(StoryPointCard)
