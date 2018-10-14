export interface TfsWorkItemsResponse {
  count: number;
  value: Array<TfsWorkItem>;
}

export interface TfsWorkItem {
  id: number;
  rev: number;
  fields: TfsWorkItemFields;
  url: string;
}

export interface TfsWorkItemFields {
  "System.AreaPath": string;
  "System.TeamProject": string;
  "System.IterationPath": string;
  "System.WorkItemType": string;
  "System.State": string;
  "System.Reason": string;
  "System.AssignedTo": string;
  "System.CreatedDate": string;
  "System.CreatedBy": string;
  "System.ChangedDate": string;
  "System.ChangedBy": string;
  "System.Title": string;
  "System.BoardColumn": string;
  "System.BoardColumnDone": boolean;
  "Microsoft.VSTS.Common.StateChangeDate": string;
  "Microsoft.VSTS.Common.Priority": number;
  "Microsoft.VSTS.Common.StackRank": number;
  "Microsoft.VSTS.Common.ValueArea": string;
  "Microsoft.VSTS.Scheduling.StoryPoints": number;
  "WEF_5003494E9BE24689AB984D529FB0835C_Kanban.Column": string;
  "WEF_3D8E007D6A8B412581BD57F2D5595B8A_Kanban.Column": string;
  "WEF_3D8E007D6A8B412581BD57F2D5595B8A_Kanban.Column.Done": boolean;
  "System.Description": string;
  "Microsoft.VSTS.Common.AcceptanceCriteria": string;
  "System.Tags": string;
}

export interface TfsWorkItemQueryResponse {
    queryType: string;
    queryResultType : string;
    asOf: string;
    workItems : Array<{id: number, url:string}>
}