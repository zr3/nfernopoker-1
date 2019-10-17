import * as React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Card, CardContent, Typography, withStyles } from "@material-ui/core";
import { gameKeyHoc, IGameKeyHocProps } from "../../core/components/gameKeyHoc";
import { firebaseConnect } from "react-redux-firebase";
import { Game, Story } from "../../core/models";
import GameStoryCard from "./GameStoryCard";
import GamePlayerCard from "./GamePlayerCard";

interface IOwnProps {
  firebase: any;
  game: Game;
  history: any;
  classes: any;
  profile: any;
}

interface ITempState {
  currentStory?: Story,
  isInGame: boolean
}

type IProps = IOwnProps & IGameKeyHocProps;

// https://gridbyexample.com/examples/
const styles = {
  layout: {
    display: 'grid',
    grid: `
            "cards       cards    cards"
            "storyList   story    story"
            "storyList   players  players"
            / 1fr 1fr 1fr
        `,
    gridColumnGap: 10,
    gridRowGap: 10,
    width: '100%',
    height: 'calc(100vh - 200px)'
  },
  storylistcontainer: {
    gridArea: 'storyList',
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  storylist: {
    overflowY: 'scroll',
    height: 'calc(100vh - 135px)'
  },
  storycontainer: {
    gridArea: 'story',
    minHeight: 'calc(100vh - 250px)'
  },
  playercontainer: {
    gridArea: 'players',
    display: 'flex'
  },
  cardcontainer: {
    gridArea: 'cards',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  cardflexbox: {
    display: 'flex',
    alignSelf: 'stretch',
    justifyContent: 'space-around'
  }
} as any;


class PlayGameComponent extends React.Component<IProps, ITempState> {

  constructor(props: any) {
    super(props)
    this.state = {
      currentStory: {} as any,
      isInGame: false
    };
  }

  onCardSelected(cardValue: string): void {
    console.log(cardValue);
    let currentStoryState = { ...this.state.currentStory };
    if (!currentStoryState.playerPoints) {
      currentStoryState.playerPoints = [];
    }
    currentStoryState.playerPoints = [...currentStoryState.playerPoints, { player: this.props.profile.email, point: cardValue }];

    let storyUpdates = this.props.game.stories.map(s => s.id == currentStoryState.id ? currentStoryState : s);

    this.props.firebase.ref(`/games/${this.props.gameKey}`).update({ stories: storyUpdates });
  }

  onStorySelected(story: Story): void {
    this.setState({
      currentStory: story,
      isInGame: this.props.game.team.players.some(p => p.email == this.props.profile.email)
    });
  }

  storyAverageScore(story: Story) {
    let sumPoints: number = 0;
    if (story.playerPoints) {
      let filteredNumbers = story.playerPoints.filter(z => z.point != "?");
      filteredNumbers.forEach(pp => {
        sumPoints += parseInt(pp.point);
      });
      return sumPoints / filteredNumbers.length;
    }
    return sumPoints;
  }

  render() {

    let { game } = this.props;
    let { currentStory } = this.state;

    let { cards } = game || {
      cards: { name: "", value: [] }
    };

    if (!game) {
      return null;
    }

    let isGameOwner = (game.team.ownerEmail == this.props.profile.email);

    const cardList = cards && cards.value.map((p, i) => (
      <Card key={i} style={styles.card} onClick={() => this.onCardSelected(p)}>
        <CardContent>
          <Typography gutterBottom={true} component="p">
            {p}
          </Typography>
        </CardContent>
      </Card>
    ));

    const players = game && game.team.players.map((p, i) => 
      <GamePlayerCard currentStory={currentStory} key={i} player={p} />
    );

    const storyList = game && game.stories.map((s: Story, i) => (
      <GameStoryCard currentStoryId={currentStory.id} story={s} key={i} onStorySelected={(s: Story) => this.onStorySelected(s)} />
    ));

    return (
      <div style={styles.layout}>

        <section style={styles.storylistcontainer}>
          <Typography variant="h4"> User Stories </Typography>
          <div style={styles.storylist}>
            {storyList}
          </div>
        </section>

        <section style={styles.storycontainer}>
          {currentStory && !currentStory.id &&
            <Typography variant="h1" align="center">Select a story </Typography>
          }
          {currentStory && currentStory.id &&
            <React.Fragment>
              <Typography variant="h6" gutterBottom={true} align="left">
                {currentStory.url != "n/a" && <a href={currentStory.url} target="_blank">
                  {currentStory.title}
                </a>}
                {currentStory.url == "n/a" && <span>{currentStory.title}</span>}
              </Typography>

              <hr />
              <Typography variant="subtitle2" align="left">DESCRIPTION</Typography>
              <Typography variant="body1" gutterBottom={true} align="left">{currentStory.description}</Typography>

              <Typography variant="subtitle2" align="left">ACCEPTANCE CRITERIA</Typography>
              <pre dangerouslySetInnerHTML={{ __html: currentStory.acceptanceCriteria }}>
              </pre>

              <div> {currentStory.storyPoints}</div>

              {this.state.isInGame && <div style={styles.cardflexbox}>
                {cardList}
              </div>}

              {isGameOwner && <h1> AVERAGE SCORE IS: {this.storyAverageScore(currentStory)}</h1>}

            </React.Fragment>
          }
        </section>


        {currentStory && currentStory.id &&
          <section style={styles.playercontainer} >
            {players}
          </section>
        }

      </div>
    )

  }
}

const currentGame: string = 'currentGame';

export const PlayGame: React.ComponentClass<any> = compose<React.ComponentClass<any>>(
  gameKeyHoc({ debug: true }),
  withStyles(styles),
  withRouter,
  firebaseConnect((props: IProps) => [
    { path: "/games/" + props.gameKey, storeAs: currentGame }
  ]),
  connect((state: any) => ({
    game: state.firebase.data[currentGame],
    profile: state.firebase.profile
  })
  )
)(PlayGameComponent);

