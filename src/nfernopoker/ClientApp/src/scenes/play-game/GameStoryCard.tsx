import * as React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import { Story } from "../../core/models";

interface IOwnProps {
  story: Story,
  currentStoryId: string,
  key: number,
  onStorySelected(story: Story): void
}

type IProps = IOwnProps;

const styles = {
  currentstorycard: {
    minHeight: 125,
    margin: '.5em',
    background: 'lightgray'
  },
  storycard: {
    minHeight: 125,
    margin: '.5em'
  },
  storytitle: {
    display: '-webkit-box',
    maxWidth: '400px',
    height: '$font-size*$line-height*$lines-to-show', /* Fallback for non-webkit */
    margin: '0 auto',
    fontSize: '$font-size',
    lineHeight: '$line-height',
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  
} as any;


const GameStoryCard: React.StatelessComponent<IProps> = (props) => {

  const { currentStoryId, key, story, onStorySelected } = props;

  if (!story) {
    return null;
  }

  let cardStyle = story.id == currentStoryId ? styles.currentstorycard : styles.storycard;

  return (<Card style={cardStyle} key={key} onClick={() => onStorySelected(story)} >
    <CardContent>
      <Typography variant="h6">
        {story.id}
      </Typography>
      <Typography style={styles.storytitle} variant="body2">
        {story.title}
      </Typography>
    </CardContent>
  </Card>);
}

export default withStyles(styles)(GameStoryCard)
