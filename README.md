# Guide

We have already setup a few things upfront for you since the `Login` to the platform part can be time consuming.

Feel free to make any changes to this codebase you believe they are necessary and/or fit your needs

In this assignment we expect you to use `cypress`.

`typescript` is already set up in this project but if you are not confortable using it you can just use plain `javascript`, make sure that the files extension is `.ts` in order for the `specs` to run.

We understand that you might have questions before you start the assignment. Please ask your recruiter to set up an online meeting with a QA engineer from Stitch in order to help you.

# The assignment

**Configuration**

You will need to fill in the `AUTH_USERNAME` and the `AUTH_PASSWORD` in the `cypress.env.json`, they will be provided to you alongside this assignment. If you don't have them please ask your recruiter.

**Installation**

In your terminal do the following:

- `yarn` to install the necessary packages
- `yarn cypress:open` to start the Cypress Suite
- `yarn cypress:run` to run the Cypress tests in headless mode

_Note:_ if you are more familiar with `npm` feel free to use that instead of `yarn`.

**Objectives**

- Spec 1: Use `cypress` to Create a new Presentation. You can find the _Create Presentation Form_ by clicking the (+) at the bottom right corner of the screen you landed when you run `yarn cypress:open`. Make sure that the Presentation has been successfully created. Extra points: make sure the Form validation works as expected.
- Spec 2: Use `cypress` to filter the _Presentations List_ to show results from `All` Users and the presentations name contain the word `bot`. Make sure that the number of items that the server responded with are actually rendered in the page.
- Did you find any bugs? Please write up in a _markdown_ file what you found and what would you do to improve QA.

**When finished**

- Push the code of this assignment to a `GitHub` or `GitLab` repository if possible, otherwise you could just remove the `node_modules` and send us a `.zip` file.
- Give access to `sakiskatsikas` in case of `GitHub` OR `.Sakis` in case of `GitLab`.


# Notes / Considerations

## Spec 1 - Create presentation form

**Suggestion**

The field "Presentation based on" should indicate that it's a required field, after clicking on the "Create Presentation" button, a toast message indicating that there are missing required fields to be filled, there is no visible indication it being required, only after selectin an option, are the rest of the subfields revealed showing the required ones.

**Validation**

Form validation was done by having the form submit, then filling/selecting the required fields and verifying that the "Required" error message no longer shows.
Validation was done for both branches of the "Presentation based on" field, by Catalog and by Customer.

"Presentation based on"
For "Presentation based on" "Customer" option with the difference being waiting for 1 second for the "Select Brand Catalog" and "Select Division" fields to be automatically filled in after choosing a customer.

I considered a successful presentation creation by receiving a status 200 and property "data" from the post response by submitting the form.

## Spec 2 - Presentation List and filtering

**Validation**

After picking the options to show all presentations, the search filter is opened to enter text "bot".
The number of shown items in the table is then asserted with the "total" property value obtained from the post response.