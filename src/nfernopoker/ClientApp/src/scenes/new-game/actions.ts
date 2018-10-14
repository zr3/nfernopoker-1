import { ThunkAction } from "redux-thunk";
import { TfsWorkItemQueryResponse, TfsWorkItem } from "../../core/models";
import { MessageTypes } from "../../core/actions/SnackMessage";
import { Story } from "../../core/models";

// HOW TO ADD COMMENTS:
//https://stackoverflow.com/questions/25895435/how-to-add-a-comment-to-a-work-item-using-visual-studio-team-services-rest-api

export function getWorkItemsByWiql(tfsUrl: string, team: string, id: number, username: string, pat: string, gameId: string): ThunkAction<any, any, any, any> {
  let url = tfsUrl + `/${team}/_apis/wit/wiql?id=${id.toString()}&api-version=2.0`;
  return (dispatch) =>
    fetch(url, {
      method: "GET",
      headers: getHeaders(username, pat)
    }).then(r => {
      r.json().then(results => {
        if (results.value && results.value.Message) {
          errorReceived(results.value.Message);
        }
        let workItems = (<TfsWorkItemQueryResponse>l).workItems;
        let workItemIds = workItems.map(wi => wi.id);

        dispatch(getWorkItemsByIds(tfsUrl, workItemIds, username, pat, gameId));
      })
    }, e => errorReceived(e));
}

function getWorkItemsByIds(tfsUrl: string, ids: Array<number>, username: string, pat: string, gameId: string): ThunkAction<any, any, any, any> {
  let url = tfsUrl + `/_apis/wit/workitems?ids=${ids.toString()}&api-version=2.0`;
  return (dispatch, getState, getFirebase) =>
    fetch(url, {
      method: "GET",
      headers: getHeaders(username, pat)
    }).then(r => {
      r.json().then(results => {
        if (results.message) {
          errorReceived(results.message);
        }
        let stories = mapTfsWorkItemsToStories(results.value);
        getFirebase().ref(`/games/${gameId}`).update({ stories: stories })
          .then(() => {
            dispatch({ type: MessageTypes.ToastMessage, payload: `Added ${stories.length} TFS work items` });
          })
      })
    }, e => errorReceived(e));
}

function mapTfsWorkItemsToStories(workItems: Array<TfsWorkItem>): Array<Story> {
  return workItems.map(wi => {
    return {
      id: wi.id.toString(),
      title: wi.fields["System.Title"] ? wi.fields["System.Title"] : "",
      type: "TFS",
      url: wi.url,
      description: wi.fields["System.Description"] ? wi.fields["System.Description"] : "",
      acceptanceCriteria: wi.fields["Microsoft.VSTS.Common.AcceptanceCriteria"] ? wi.fields["Microsoft.VSTS.Common.AcceptanceCriteria"] : "",
      storyPoints: wi.fields["Microsoft.VSTS.Scheduling.StoryPoints"] ? wi.fields["Microsoft.VSTS.Scheduling.StoryPoints"].toString() : ""
    }
  });
}

function getHeaders(username: string, pat: string): any {
  return {
    "Authorization": "Basic " + btoa(username + ":" + pat)
  };
}

function errorReceived(errorMsg: any) {
  alert(errorMsg.message ? errorMsg.message : errorMsg);
}
