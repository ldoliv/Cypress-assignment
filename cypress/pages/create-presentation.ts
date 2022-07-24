import {errorMsgs} from '../constants';


// "Presentation Name" field
export const nameField = (() => {

	const fieldId = 'presentationName';
	const fieldSel = `#${fieldId}`;
	const fieldErrSel = `[for="${fieldId}"] > p`;
	const failText = 'ab';
	const passText = 'A93L0HA';

	const assert = () => {
		// Assert error message
		cy.log('Assert for "Required" error message');
		cy.get(fieldSel).clear();
		cy.get('form').submit();
		cy.get(fieldErrSel).should('have.text', errorMsgs.default);

		// Assert error message
		cy.log('Assert for mimimum length error message');
		cy.get(fieldSel).type(failText);
		cy.get('form').submit();
		cy.get(fieldErrSel).should('have.text', errorMsgs.minLength);

		fill();
	}

	const fill = () => {
		// Input correct value
		cy.get(fieldSel).clear();
		cy.get(fieldSel).type(passText);
	}

	return {
		assert,
		fill
	}
})();

// Presentation based on "Catalog" field
export const presentBasedOnCatalog = (() => {
	// return new Promise<void>((resolve) => {
	// 	cy.get('form').submit();
	// 	cy.get(`[for="based-on-catalog"]`).click().then(() => resolve());
	// });

	const fill = () => {
		cy.get('form').submit();
		cy.get(`[for="based-on-catalog"]`).click();
	}

	return {
		fill
	}
})();

// Presentation based on "Customer" field
export const presentBasedOnCustomer = (() => {
	// return new Promise<void>((resolve) => {
	// 	cy.get('form').submit();
	// 	cy.get(`[for="based-on-customer"]`).click().then(() => resolve());
	// });

	const fill = () => {
		cy.get('form').submit();
		cy.get(`[for="based-on-customer"]`).click();
	}

	return {
		fill
	}
})();

/*
	Assert Products, Division, Season dropdowns

	- Grabs the 3 required dropdowns based on a predefined list of words or based on "optional" word (commented out)
	- For each:
		- If no option has been selected:
			- Assert that the "Required" the error message is shown
			- Click and select the first item
			- Assert that the dom element of the error message no longer exists
		- Else
			- Check that no "Required" error message is shown
	*/
export const prodsDiviSeason = (() => {

	const dropdowns = '[data-testid="dropdown-menu"]';
	const dropdownList = '[data-testid="dropdown-list"]';

	const requiredFields = ['brand', 'division', 'season'];

	const run = (doAssert: boolean) => {

		cy.get('form').submit();

		cy.get(dropdowns).then($els => {
			$els.each((index, el) => {

				const $el = Cypress.$(el);
				const text = $el.find('> div > button > div:first-child p').text();
				const words = text.toLowerCase().split(' ').map(word => word.trim());

				// Check required by a predefined list
				const isRequired = !!requiredFields.find(reqWord => words.includes(reqWord));

				// Check required by the word "optional" being in the label text
				// const isRequired = !$el.find('button > :first-child').text().toLowerCase().includes('optional');

				// console.log('is required: %o', isRequired);

				if (isRequired) {
					const $errEl = $el.next('p');
					const cyEl = cy.wrap($el);

					const selectedOption = $el.find('> div > button > div:last-child p').text().trim();

					if (!selectedOption) {

						console.log(`Field "${text}" has no selected option`);

						if (doAssert) {
							expect($errEl, `"${text}"`).to.have.text(errorMsgs.default);
						}

						// click open dropdown and click the first option
						cyEl.click().then(() => {
							cyEl.find(`${dropdownList}:first`).click().then(() => {
								if (doAssert) {
									expect($errEl, `"${text}" error message`).not.exist;
								}
							})
						})
					} else {
						if (doAssert) {
							expect($errEl, `"${text}" error message`).not.exist;
						}
					}

				}
			})
		});
	}

	const assert = () => {
		run(true);
	}

	const fill = () => {
		run(false);
	}

	return {
		assert,
		fill
	}
})();

/*
	- Assert that the customer input search has a "Required" error message
	- After clicking on the first customer
		- Assert that the error message element no longer exists
		- Assert that the label above the search input field get's the customers name
*/
export const customerSearch = (() => {

	const fieldId = 'search';
	const fieldSel = `#${fieldId}`;
	const searchBox = `[data-testid="customerSearchBoxList"]`;


	const run = (doAssert: boolean) => {

		if (doAssert) {
			cy.get('form').submit();

			// Assert error message
			cy.get(fieldSel).parent().next().should('have.text', errorMsgs.default);
		}


		// Click on first customer from the list
		cy.get(searchBox).find('[class*="CustomerSearchBoxsc"]:first').click().then(($customer) => {

			if (doAssert) {
				// error message element should not exist
				cy.get(fieldSel).parent().next().should('not.exist');

				let customerName = $customer.find('> div > div > div:nth-child(2) > :first-child').text();
				customerName = customerName.slice(0, customerName.lastIndexOf('(')).trim();

				cy.get(fieldSel).parent().parent().find('> :first').then($label => {
					expect($label, 'Label above input').to.contain.text(customerName);
				});

			} else {

			}
		})
	}


	const assert = () => {
		return run(true);
	}

	const fill = () => {
		return run(false);
	}

	return {
		assert,
		fill
	}

})();

export const createPresentation = () => {
	cy.intercept('POST', '**/presentation').as('createPresentation');

	cy.get('form').submit();

	// cy.wait('@createPresentation').its('status').should('eq', 200);
	cy.wait('@createPresentation').should(({request, response}) => {
		console.log(response);
		expect(response.statusCode).to.be.eq(200);
		expect(response.body).to.have.property('data');
	});

	cy.visit('/CYPRESS/showroom');

}