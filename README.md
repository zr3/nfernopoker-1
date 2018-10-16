# NFERNO-POKER an Agile Planning Tool

## About
This project was stared by the Duluth MN, .NET user group as a shared skills building effort.
NFERNO-POKER is agile planning poker, designed so that participants can read, research and point user stories in isolation. This leads to a faster more efficient pointing meeting. Instead of waiting for team members to read and point the story, the scrum master can facilitate meaningful discussion to keep game times down. 

## Getting Started
Navigate to 

> src/nfernopoker/ClientApp

Within the ClientApp folder:

    npm install
    npm run start
    
This will start a dev server and open the application. The main application functionality will work without the .Net Core app being ran. Currently, the .Net Core application only hosts the JIRA API. 

## Primary Tech Stack
- Server Side (.Net Core  https://www.microsoft.com/net/download)
	- SPA Hosting
	- API's for Services such as JIRA communication
- Client Side (ReactJs https://reactjs.org/) 
	- React Redux Firebase http://react-redux-firebase.com/
	* typescript https://www.typescriptlang.org/
	* editorconfig https://editorconfig.org/
	* jest (unit tests) https://jestjs.io/
	* material-ui https://material-ui.com/

## Functionality
- Completed
	* Create reusable Teams of players for games
	* Create Games
		* Add User Stories
		* Import User Stories from TFS
		* Assign a Team
	* Integration with JIRA API
		
- Needed
	- Play a Game
	- Synchronize Comments between user stories and underlying work item tracking system (JIRA, TFS)
	
- Future
	- Track Story Points over time for a team
	- Plugin with Jenkins
	- Integrate with VCS
		* bitbucket
		* github
		* gitlab
	
	* expose REST API


### Contributions

Feel free to file an issue or open a pull request to extend the functionality of this code.

### License

MIT

