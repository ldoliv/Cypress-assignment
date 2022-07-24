/// <reference types="cypress" />

// import {getPageFields} from '../_helpers/createPresentPage';
import * as page from '../pages/create-presentation';



// const fields = getPageFields();
// fields.name.cyGet();



describe('Create a new Presentation Page', () => {

	beforeEach(() => {
		cy.login(Cypress.env('AUTH_USERNAME'), Cypress.env('AUTH_PASSWORD'));
		cy.visit('/CYPRESS/showroom?skip_browser_check=true');
		// cy.wait(1000);
		cy.get('[data-testid="createNewPresentation"]').click();
		cy.get('form').should('exist');
	});

	// it('Clicking on "+" button opens the create presentation form', () => {
	// 	cy.get('[data-testid="createNewPresentation"]').click();
	// 	cy.get('form').should('have.length', 1);
	// 	cy.url().should('include', '/presentation/create');
	// });

	it('Form validation - Presentation based on Catalog', () => {
		page.nameField.assert();
		page.presentBasedOnCatalog.fill()
		page.prodsDiviSeason.assert();
		page.customerSearch.assert();
	});

	it('Form validation - Presentation based on Customer', () => {
		page.nameField.assert();
		page.presentBasedOnCustomer.fill()
		page.customerSearch.assert();
		cy.wait(1000);
		page.prodsDiviSeason.assert();
	});

	it('Assert successful presentation creation', () => {
		page.nameField.fill();
		page.presentBasedOnCustomer.fill();
		page.customerSearch.fill();
		cy.wait(1000);
		page.prodsDiviSeason.fill();
		page.createPresentation();
	})

});

