import * as React from "react";
import { Typography, Button } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import { Story } from "../../core/models";

interface IOwnProps {
    currentStory: Story,
    isGameOwner: boolean,
    averageScore: string,
    assignStoryPoints(clearPoints?: boolean): void
}

type IProps = IOwnProps;

const styles = {

} as any;


const GameStoryBoard: React.StatelessComponent<IProps> = (props) => {

    const { assignStoryPoints, averageScore, currentStory, isGameOwner } = props;

    if (!currentStory || !currentStory.id) {
        return (<Typography variant="h1" align="center">Select a story </Typography>)
    } else {
        return (<React.Fragment>
            <Typography variant="h6" gutterBottom={true} align="left">
                {currentStory.url != "n/a" && <a href={currentStory.url} target="_blank">
                    {currentStory.title}
                </a>}
                {currentStory.url == "n/a" && <span>{currentStory.title}</span>}
            </Typography>

            <hr />
           
            {isGameOwner &&
                <React.Fragment>
                    <span>
                        <Typography color="secondary" variant="subtitle2" align="left">Average Score: {averageScore}</Typography>
                    </span>
                    <Button variant="outlined" color="primary" size="small" onClick={() => assignStoryPoints()} disabled={currentStory.storyPoints != ""}>
                        Assign Story Points
                    </Button>
                    <Button variant="outlined" color="secondary" size="small" onClick={() => assignStoryPoints(true)} disabled={currentStory.storyPoints == ""}>
                        Clear Points (Replay)
                    </Button>
                    <Button variant="outlined" color="default" size="small">
                        Finish Game
                    </Button>
                </React.Fragment>
            }

            <Typography variant="subtitle2" align="left">DESCRIPTION</Typography>
            <Typography variant="body1" gutterBottom={true} align="left">{currentStory.description}</Typography>

            <Typography variant="subtitle2" align="left">ACCEPTANCE CRITERIA</Typography>
            <pre dangerouslySetInnerHTML={{ __html: currentStory.acceptanceCriteria }}></pre>


        </React.Fragment>)
    }

}

export default withStyles(styles)(GameStoryBoard)
