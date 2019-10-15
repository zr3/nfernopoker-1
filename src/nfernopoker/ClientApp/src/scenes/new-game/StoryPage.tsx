import * as React from "react";
import { connect } from "react-redux";
import { Paper } from "@material-ui/core";
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router";
import { Game, Story } from "../../core/models";
import { gameKeyHoc, IGameKeyHocProps } from "../../core/components/gameKeyHoc";
import StoryForm from "./StoryForm";
import StoryList from "./StoryList";
import TfsStoryImport from "./TfsStoryImport";

interface IOwnProps {
  firebase: any;
  classes: any;
  location: any;
  game: Game;
  story: Story;
}

interface ITempState {
  story: Story
}

type IProps = IOwnProps & IGameKeyHocProps;

const styles: any = (theme: any) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    margin: theme.spacing(1)
  }
});

class StoryPageComponent extends React.Component<IProps, ITempState> {

  constructor(props: any) {
    super(props);
    this.state = {
      story: this.getInitialStoryState()
    };
  }

  getInitialStoryState(): Story {
    return {
      id: "",
      title: "",
      type: "",
      url: "n/a",
      description: "",
      acceptanceCriteria: "",
      storyPoints: "0"
    };
  }

  onStoryChange(name: string, value: string): void {
    let newState = { ...this.state };
    newState.story[name] = value
    this.setState(newState);
  }

  addStory(): void {
    let story = { ...this.state.story };
    story.type = "user-added";
    story.id = story.id ? story.id : Guid.newGuid();
    let stories = this.props.game.stories ? [...this.props.game.stories, story] : [story];
    this.props.firebase.ref(`/games/${this.props.gameKey}`).update({ stories: stories });
    this.setState({ story: this.getInitialStoryState() })
  }

  updateStory(): void {
    let index = this.props.game.stories.indexOf(this.state.story);
    this.props.game.stories[index] = this.state.story;
    let stories = [...this.props.game.stories];
    this.props.firebase.ref(`/games/${this.props.gameKey}`).update({ stories: stories });
    this.setState({ story: this.getInitialStoryState() });
  }

  selectStory(story: Story): void {
    this.setState({ story: story });
  }

  removeStory(story: Story): void {
    let stories = this.props.game.stories.filter((s: Story) => story != s);
    this.props.firebase.ref(`/games/${this.props.gameKey}`).update({ stories: stories })
    if (this.state.story == story) {
      this.setState({ story: this.getInitialStoryState() });
    }
  }

  render(): JSX.Element {
    let classes = this.props.classes;

    if (!isLoaded(this.props.game)) {
      return <p>Loading...</p>
    }

    return (
      <Paper className={classes.container} >
        <TfsStoryImport gameKey={this.props.gameKey}></TfsStoryImport>
        <StoryForm game={this.props.game} story={this.state.story}
          onFormChange={(name: string, value: string) => this.onStoryChange(name, value)}
          onAdd={() => this.addStory()}
          onUpdate={() => this.updateStory()} />
        <StoryList game={this.props.game}
          onItemSelected={(s: Story) => this.selectStory(s)}
          onItemRemove={(s: Story) => this.removeStory(s)} />
      </Paper>
    )
  }
}

class Guid {
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

const currentGame: string = 'currentGame';

const mapStateToProps = (state: any) => ({
  game: state.firebase.data[currentGame]
});

export default compose(
  gameKeyHoc({ debug: true }),
  withStyles(styles),
  withRouter,
  firebaseConnect((props: IProps) => {
    return [
      { path: "/games/" + props.gameKey, storeAs: currentGame }
    ]
  }),
  connect(mapStateToProps)
)(StoryPageComponent) as React.ComponentClass<any>;
