using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using nfernopoker.Config;
using nfernopoker.Domain.Apis;
using SmallOauth1;
using SmallOauth1.Utilities;

namespace nfernopoker.Controllers
{
  [Route("api/[controller]")]
  public class JiraController : Controller
  {
    private readonly IJiraApi _jiraApi;
    private readonly ISmallOauth _smallOauth;
    private static AccessTokenInfo _accessToken;
    private readonly AuthenticationConfig _config;
    private readonly JiraConfig _jiraConfig;

    public JiraController(IJiraApi jiraApi, ISmallOauth tinyOAuth, AuthenticationConfig config, JiraConfig jiraConfig)
    {
      _jiraApi = jiraApi ?? throw new ArgumentNullException(nameof(jiraApi));
      _smallOauth = tinyOAuth ?? throw new ArgumentNullException(nameof(tinyOAuth));
      _config = config;
      _jiraConfig = jiraConfig;
    }

    [HttpGet]
    public IActionResult Get()
    {
      var requestTokenInfo = _smallOauth.GetRequestTokenAsync().Result;

      var authorizationUrl = _smallOauth.GetAuthorizationUrl(requestTokenInfo.RequestToken);

      return Redirect(authorizationUrl);
    }

    [HttpGet("callback")]
    public async Task<IActionResult> CallbackHandler(string oauth_token, string oauth_verifier)
    {
      _accessToken = await _smallOauth.GetAccessTokenAsync(oauth_token, _config.SmallOauthConfig.ConsumerSecret, oauth_verifier);

      return Redirect(_config.RedirectUri);
    }

    [HttpGet("issue/{id}")]
    public async Task<JsonResult> GetIssueById(string id)
    {
      var httpClient = new HttpClient(new SmallOauthMessageHandler(_config.SmallOauthConfig, _accessToken.AccessToken, _accessToken.AccessTokenSecret));

      var resp = await httpClient.GetAsync($"{_jiraConfig.BaseUrl}/issue/{id}.json");
      return Json(await resp.Content.ReadAsStringAsync());
    }

    [HttpGet("issues")]
    public async Task<JsonResult> GetIssues(string projectKey)
    {
      var httpClient = new HttpClient(new SmallOauthMessageHandler(_config.SmallOauthConfig, _accessToken.AccessToken, _accessToken.AccessTokenSecret));

      string url = $"{_jiraConfig.BaseUrl}/search?jql=project%3D{Uri.EscapeUriString(projectKey)}&maxResults%3D-1";
      var resp = await httpClient.GetAsync(url);
      return Json(await resp.Content.ReadAsStringAsync());
    }
  }
}
