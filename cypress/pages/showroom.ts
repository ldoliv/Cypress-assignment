

export const showAllPresentations = (): void => {

	const footerFilterDropdowns = '[data-testid="dropdown-menu"]';
	const dropdownList = '[data-testid="dropdown-list"]';

	cy.get(footerFilterDropdowns).each(($el, index) => {
		cy.wrap($el).click();
		cy.wrap($el.find(dropdownList).children().first()).click();
	})
}


type responseT = {
	presentations?: {
		list?: object[];
		total?: number;
	}
}

export const filterPresentationsByText = (searchText: string) => {
	return new Promise<responseT>((resolve) => {
		const searchIcon = '[data-testid="icon-Search"]';
		const searchInput = '[data-testid="catalogSearchInput"]';

		cy.intercept('POST', '**/presentation').as('searchPresentations');

		cy.get(searchIcon).click();
		cy.get(searchInput).should('exist').clear().type(searchText);
		cy.wait('@searchPresentations').should(({request, response}) => {
			// console.log(response);
			expect(response.statusCode, 'Response code').to.be.eq(200);
			expect(response.body, 'Response having "data" property').to.have.property('data');

			if (response.statusCode === 200) {
				resolve(response.body.data);
			}
		});
	});
}

export const assertTotalPresentations = (total: number) => {
	const presentList = '[data-testid="presentationList"]';

	if (total) {
		cy.get(presentList).children().should('have.length', total);
	} else {
		cy.get(presentList).should('not.exist');
	}
}