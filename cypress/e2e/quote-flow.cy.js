/* global cy, describe, it */
const API = 'https://jsonplaceholder.typicode.com/posts';

function fillValidForm() {
  cy.get('#name').type('Ali Khan');
  cy.get('#email').type('ali@example.com');
  cy.get('#phone').type('+923001234567');
  cy.get('#insuranceType').select('health');
}

describe('Quote flow', () => {
  it('shows validation errors on an empty submit', () => {
    cy.visit('/quote');
    cy.contains('button', 'Get my quote').click();
    cy.contains('Full name is required.').should('be.visible');
    cy.contains('Email is required.').should('be.visible');
    cy.focused().should('have.attr', 'id', 'name');
  });

  it('submits a valid form and shows the quote card', () => {
    cy.intercept('POST', API, { statusCode: 201, body: { id: 101 } }).as('createQuote');
    cy.visit('/quote');
    fillValidForm();
    cy.contains('button', 'Get my quote').click();

    cy.wait('@createQuote');
    cy.get('article[aria-label="Your insurance quote"]').within(() => {
      cy.contains('Quote for Ali Khan');
      cy.contains('$1,361');
      cy.contains('$272,200');
      cy.contains('Quote ID: SH-101');
    });
  });

  it('shows an error and lets the user retry', () => {
    cy.intercept('POST', API, { forceNetworkError: true }).as('failedQuote');
    cy.visit('/quote');
    fillValidForm();
    cy.contains('button', 'Get my quote').click();

    cy.get('[role="alert"]')
      .contains('We could not get your quote right now. Please try again.')
      .should('be.visible');

    cy.intercept('POST', API, { statusCode: 201, body: { id: 202 } }).as('retryQuote');
    cy.contains('button', 'Try again').click();
    cy.wait('@retryQuote');
    cy.contains('Quote ID: SH-202').should('be.visible');
  });

  it('remembers the dark theme after a reload', () => {
    cy.visit('/');
    cy.get('button[aria-label="Switch to dark mode"]').click();
    cy.get('html').should('have.attr', 'data-theme', 'dark');
    cy.reload();
    cy.get('html').should('have.attr', 'data-theme', 'dark');
  });
});