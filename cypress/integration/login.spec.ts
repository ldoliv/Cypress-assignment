/// <reference types="cypress" />

describe('Start here', () => {

	beforeEach(() => {
		cy.login(Cypress.env('AUTH_USERNAME'), Cypress.env('AUTH_PASSWORD'));
	});

	it('Go to showroom', () => {
		cy.visit('?skip_browser_check=true');
	});


});
