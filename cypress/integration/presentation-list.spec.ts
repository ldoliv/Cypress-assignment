/// <reference types="cypress" />

import * as page from '../pages/showroom';



describe('Filter presentation List', () => {

	beforeEach(() => {
		cy.login(Cypress.env('AUTH_USERNAME'), Cypress.env('AUTH_PASSWORD'));
		cy.visit('/CYPRESS/showroom?skip_browser_check=true');
	});

	it('Show presentations from All Users', () => {
		page.showAllPresentations();
	});

	it('Filter all presentations by text "bot"', () => {
		page.showAllPresentations();
		page.filterPresentationsByText('bot')
			.then(response => {
				// console.log(response);
				const total = response.presentations?.total;
				page.assertTotalPresentations(total);
			});
	});

});

