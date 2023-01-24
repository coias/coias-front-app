import Keycloak from 'keycloak-js';

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = Keycloak({
  url: process.env.KEYCLOAK_URI,
  realm: 'coias',
  clientId: 'coias-client',
});

export default keycloak;
