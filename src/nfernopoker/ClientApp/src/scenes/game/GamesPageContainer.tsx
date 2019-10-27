import * as React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase";
import { withRouter } from "react-router";
import GamesPage from "./components/GamesPageComponent";

interface IInjectedProps {
  firebase: any;
  games: Array<any>;
  history: any;
  classes: any;
}

type IProps = IInjectedProps;

class GamesPageContainer extends React.Component<IProps, any> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedForDelete: null
    }
  }

  selectGame(key: string) {
    this.setState({
      selectedForDelete: key
    })
  }
  tryToRemoveItem(confirmed: boolean, key: string) {
    if (confirmed) {
      this.props.firebase.remove(`/games/${key}`);
    }
    this.setState({
      selectedForDelete: null
    })
  }

  render() {
    return (
      <GamesPage
        isModalOpen={!!this.state.selectedForDelete}
        onDeleteClicked={(k: string) => this.selectGame(k)}
        onRemovalConfirmed={(confirmed: boolean) => this.tryToRemoveItem(confirmed, this.state.selectedForDelete)}
        {...this.props} />
    )
  }
}

export default compose(
  withRouter,
  firebaseConnect((props: IProps) => [
    'games'
  ]),
  connect((state: any) => ({
    games: state.firebase.data.games
  })
  ))(GamesPageContainer)
