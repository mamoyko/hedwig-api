const passport = require("passport");
const LdapStrategy = require("passport-ldapauth");

const config = {
  searchBase: "DC=LAUNCHPAD,DC=CORP,DC=VOYAGERINNOVATION,DC=COM",
  searchFilter:
    "(&(|(sAMAccountName={{username}})(userPrincipalName={{username}})(mail={{username}}))(memberOf=cn=hedwig-console-user,ou=paymaya,ou=security groups,ou=groups,dc=launchpad,dc=corp,dc=voyagerinnovation,dc=com))",
  searchFilterList:
    "(memberOf=cn=hedwig-console-user,ou=paymaya,ou=security groups,ou=groups,dc=launchpad,dc=corp,dc=voyagerinnovation,dc=com)",
};

const authenticate = (req, res) => {
  const OPTS = {
    server: {
      url: process.env.LDAP_URL,
      bindDN: process.env.LDAP_BIND_DN,
      bindCredentials: process.env.LDAP_BIND_CREDENTIALS,
      searchBase: config.searchBase,
      searchFilter: config.searchFilter,
      searchFilterList: config.searchFilterList,
      searchAttributes: [
        "mail",
        "displayName",
        "givenName",
        "sn",
        "uSNCreated",
        "userPrincipalName",
      ],
    },
  };

  passport.use(new LdapStrategy(OPTS));
  return new Promise((resolve, reject) => {
    passport.authenticate("ldapauth", { session: true }, (err, result) => {
      if (err) {
        return reject(new Error(err));
      }
      if (!result) {
        return reject(new Error("Not authenticated"));
      }
      return resolve(result);
    })(req, res);
  });
};

module.exports = {
  authenticate,
};
