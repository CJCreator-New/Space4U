// ***********************************************************
// This support file is loaded before all tests
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands
import './commands';

// Cypress default behavior overrides
Cypress.on('uncaught:exception', (err, runnable) => {
    // Prevent Cypress from failing the test on uncaught exceptions
    // You can customize this based on your needs
    return false;
});

// Custom before hooks
beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();

    // Set viewport to a common size
    cy.viewport(1280, 720);
});
