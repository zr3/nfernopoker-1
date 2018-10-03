using SmallOauth1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace nfernopoker.Config
{
  public class AuthenticationConfig
  {
    public SmallOauthConfig SmallOauthConfig { get; set; }
    public string RedirectUri { get; set; }
  }
}
