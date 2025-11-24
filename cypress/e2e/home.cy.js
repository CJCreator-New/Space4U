describe('Home Page E2E Tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should display the home page correctly', () => {
        cy.get('h1').should('be.visible');
        cy.contains(/welcome|home/i).should('exist');
    });

    it('should navigate to mood tracker', () => {
        cy.contains(/track.*mood|mood.*tracker/i).click();
        cy.url().should('include', '/mood');
    });

    it('should navigate to gratitude journal', () => {
        cy.contains(/gratitude/i).click();
        cy.url().should('include', '/gratitude');
    });

    it('should display quick mood check-in if available', () => {
        cy.get('body').then(($body) => {
            if ($body.find('[data-testid*="mood"]').length > 0) {
                cy.get('[data-testid*="mood"]').should('be.visible');
            }
        });
    });

    it('should be responsive on mobile', () => {
        cy.viewport('iphone-x');
        cy.get('h1').should('be.visible');
    });

    it('should be responsive on tablet', () => {
        cy.viewport('ipad-2');
        cy.get('h1').should('be.visible');
    });
});
