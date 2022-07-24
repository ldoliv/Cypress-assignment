import 'cypress-localstorage-commands';
import { decode } from 'jsonwebtoken';

const clientId = Cypress.env('AUTH_CLIENT_ID');
const scope = Cypress.env('LOCAL_STORAGE_KEY_SCOPE');
const audience = Cypress.env('LOCAL_STORAGE_KEY_AUDIENCE');
const localStorageKey = `@@auth0spajs@@::${clientId}::${audience}::${scope}`;

Cypress.Commands.add('login', (username: string, password: string) => {
  Cypress.log({
    name: 'Login Via Auth0',
  });

  // Do not re-login if there's already a token fetched
  // Do reset it in localStorage in case some test removed it from there
  if (Cypress.env('auth0Key') && Cypress.env('auth0Value') && Cypress.env('auth0IDToken')) {
    cy.setLocalStorage(Cypress.env('auth0Key'), Cypress.env('auth0Value'));
    cy.setLocalStorage('auth0IDToken', Cypress.env('auth0IDToken'));
    cy.setLocalStorage('loggedIn', '1');

    cy.getLocalStorage(localStorageKey)
      .should('not.be.null')
      .then((localStorageValue) => {
        assert(localStorageValue.length > 0);
        cy.removeLocalStorage('userName').then(() => {
          cy.setLocalStorage(
            'userName',
            JSON.parse(localStorageValue).body.decodedToken.user['http://auth0.are.amazing/user']
              .name
          );
        });
      });
    return;
  }

  const tokenType = 'Bearer';

  const options = {
    method: 'POST',
    url: Cypress.env('AUTH_URL'),
    body: {
      client_id: clientId,
      audience: '',
      scope,
      grant_type: 'password',
      username: username,
      password: password,
    },
  };

  cy.request(options).then(({ body }) => {
    const { access_token, expires_in, id_token } = body;
    const [header, payload, signature] = id_token.split('.');
    const tokenData = decode(id_token);

    const localStorageValue = JSON.stringify({
      body: {
        access_token,
        id_token,
        scope,
        expires_in,
        token_type: tokenType,
        decodedToken: {
          encoded: { header, payload, signature },
          header: {
            alg: 'RS256',
            typ: 'JWT',
          },
          claims: {
            __raw: id_token,
            ...(tokenData as object),
          },
          user: tokenData,
        },
        audience,
        client_id: clientId,
      },
      expiresAt: Math.floor(Date.now() / 1000) + expires_in,
    });

    Cypress.env('auth0Key', localStorageKey);
    Cypress.env('auth0Value', localStorageValue);
    Cypress.env('auth0IDToken', id_token);
    cy.setLocalStorage(localStorageKey, localStorageValue);
    cy.setLocalStorage('loggedIn', '1');
    cy.setLocalStorage('auth0IDToken', id_token);
    cy.removeLocalStorage('userName').then(() => {
      cy.setLocalStorage('userName', tokenData['http://auth0.are.amazing/user'].name);
    });
  });
});

Cypress.Commands.add('logout', () => {
  Cypress.log({
    name: 'logout',
  });
  Cypress.env('auth0Key', null);
  Cypress.env('auth0Value', null);
  Cypress.env('auth0IDToken', null);
  cy.clearLocalStorage();
  cy.visit('/logout?skip_browser_check=true');
});
