// ***********************************************
// Custom Cypress commands for Space4U
// ***********************************************

/**
 * Custom command to log in a user
 * @example cy.login('user@example.com', 'password123')
 */
Cypress.Commands.add('login', (email, password) => {
    cy.visit('/auth');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/auth');
});

/**
 * Custom command to add a mood entry
 * @example cy.addMoodEntry('happy', 'Feeling great today!')
 */
Cypress.Commands.add('addMoodEntry', (mood, note = '') => {
    cy.visit('/');
    cy.get(`[data-testid="mood-${mood}"]`).click();
    if (note) {
        cy.get('textarea[placeholder*="note"]').type(note);
    }
    cy.get('button[type="submit"]').contains(/save|add/i).click();
});

/**
 * Custom command to check if user is authenticated
 */
Cypress.Commands.add('checkAuth', () => {
    cy.window().its('localStorage').invoke('getItem', 'sb-auth-token').should('exist');
});

/**
 * Custom command to clear all app data
 */
Cypress.Commands.add('clearAppData', () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    indexedDB.deleteDatabase('Space4U');
});
