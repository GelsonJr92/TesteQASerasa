let boardId;
let listId;
let cardId;

describe('Trello API Test Suite', () => {
    it('Deve criar um board', () => {
        cy.request({
            method: 'POST',
            url: `https://api.trello.com/1/boards/?name=MyBoard&key=${Cypress.env('TRELLO_API_KEY')}&token=${Cypress.env('TRELLO_API_TOKEN')}`
        }).then((response) => {
            expect(response.status).to.eq(200);
            boardId = response.body.id;
            cy.log('Board ID:', boardId);
            // Obter a primeira lista padrão criada no board
            cy.request({
                method: 'GET',
                url: `https://api.trello.com/1/boards/${boardId}/lists?key=${Cypress.env('TRELLO_API_KEY')}&token=${Cypress.env('TRELLO_API_TOKEN')}`
            }).then((response) => {
                expect(response.status).to.eq(200);
                listId = response.body[0].id;
                cy.log('List ID:', listId);
            });
        });
    });

    it('Deve cadastrar um card', () => {
        cy.request({
            method: 'POST',
            url: `https://api.trello.com/1/cards?idList=${listId}&name=MyCard&key=${Cypress.env('TRELLO_API_KEY')}&token=${Cypress.env('TRELLO_API_TOKEN')}`
        }).then((response) => {
            expect(response.status).to.eq(200);
            cardId = response.body.id;
            cy.log('Card ID:', cardId);
        });
    });

    it('Deve excluir um card', () => {
        cy.request({
            method: 'DELETE',
            url: `https://api.trello.com/1/cards/${cardId}?key=${Cypress.env('TRELLO_API_KEY')}&token=${Cypress.env('TRELLO_API_TOKEN')}`
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Deve excluir um board', () => {
        cy.request({
            method: 'DELETE',
            url: `https://api.trello.com/1/boards/${boardId}?key=${Cypress.env('TRELLO_API_KEY')}&token=${Cypress.env('TRELLO_API_TOKEN')}`
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    after(() => {
        // Tentativa de excluir o card
        if (cardId) {
            cy.log('Attempting to delete card with ID:', cardId);
            cy.request({
                method: 'DELETE',
                url: `https://api.trello.com/1/cards/${cardId}?key=${Cypress.env('TRELLO_API_KEY')}&token=${Cypress.env('TRELLO_API_TOKEN')}`,
                failOnStatusCode: false // Continue even if the request fails
            }).then((response) => {
                if (response.status !== 200) {
                    cy.log(`Failed to delete card: ${response.body}`);
                } else {
                    cy.log('Card successfully deleted.');
                }
            });
        }

        // Tentativa de excluir o board
        if (boardId) {
            cy.log('Attempting to delete board with ID:', boardId);
            cy.request({
                method: 'DELETE',
                url: `https://api.trello.com/1/boards/${boardId}?key=${Cypress.env('TRELLO_API_KEY')}&token=${Cypress.env('TRELLO_API_TOKEN')}`,
                failOnStatusCode: false // Continue even if the request fails
            }).then((response) => {
                if (response.status !== 200) {
                    cy.log(`Failed to delete board: ${response.body}`);
                } else {
                    cy.log('Board successfully deleted.');
                }
            });
        }
    });
});
