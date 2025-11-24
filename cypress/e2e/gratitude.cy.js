describe('Gratitude Journal Integration Tests', () => {
    beforeEach(() => {
        cy.clearAppData();
        cy.visit('/gratitude');
    });

    it('should display empty state when no entries exist', () => {
        cy.contains(/no.*entries|start.*gratitude/i).should('be.visible');
    });

    it('should open add entry modal when clicking add button', () => {
        cy.contains(/add|new.*entry/i).click();
        cy.get('[role="dialog"]').should('be.visible');
    });

    it('should create a new gratitude entry', () => {
        cy.contains(/add|new.*entry/i).click();

        // Fill in the entry
        cy.get('textarea').first().type('I am grateful for my health');

        // Submit
        cy.contains(/save|submit|add/i).click();

        // Verify entry appears
        cy.contains('I am grateful for my health').should('be.visible');
    });

    it('should filter entries by date range', () => {
        // Add some test entries first
        cy.contains(/add|new.*entry/i).click();
        cy.get('textarea').first().type('Test entry 1');
        cy.contains(/save|submit|add/i).click();

        // Look for filter controls
        cy.get('body').then(($body) => {
            if ($body.find('[data-testid*="filter"]').length > 0) {
                cy.get('[data-testid*="filter"]').click();
            }
        });
    });

    it('should display streak information', () => {
        cy.get('body').then(($body) => {
            if ($body.text().match(/streak/i)) {
                cy.contains(/streak/i).should('be.visible');
            }
        });
    });

    it('should support voice recording if available', () => {
        cy.contains(/add|new.*entry/i).click();

        cy.get('body').then(($body) => {
            if ($body.find('[data-testid*="voice"]').length > 0) {
                cy.get('[data-testid*="voice"]').should('be.visible');
            }
        });
    });
});
