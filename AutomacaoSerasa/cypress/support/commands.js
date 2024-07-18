Cypress.Commands.add('createBoard', (boardName) => {
    cy.request({
        method: 'POST',
        url: '/boards/',
        qs: {
            name: boardName,
            key: Cypress.env('TRELLO_API_KEY'),
            token: Cypress.env('TRELLO_API_TOKEN')
        }
    }).then((response) => {
        expect(response.status).to.eq(200)
        Cypress.env('BOARD_ID', response.body.id)
    })
})

Cypress.Commands.add('createCard', (listId, cardName) => {
    cy.request({
        method: 'POST',
        url: '/cards/',
        qs: {
            idList: listId,
            name: cardName,
            key: Cypress.env('TRELLO_API_KEY'),
            token: Cypress.env('TRELLO_API_TOKEN')
        }
    }).then((response) => {
        expect(response.status).to.eq(200)
        Cypress.env('CARD_ID', response.body.id)
    })
})

Cypress.Commands.add('deleteCard', (cardId) => {
    cy.request({
        method: 'DELETE',
        url: `/cards/${cardId}`,
        qs: {
            key: Cypress.env('TRELLO_API_KEY'),
            token: Cypress.env('TRELLO_API_TOKEN')
        }
    }).then((response) => {
        expect(response.status).to.eq(200)
    })
})

Cypress.Commands.add('deleteBoard', (boardId) => {
    cy.request({
        method: 'DELETE',
        url: `/boards/${boardId}`,
        qs: {
            key: Cypress.env('TRELLO_API_KEY'),
            token: Cypress.env('TRELLO_API_TOKEN')
        }
    }).then((response) => {
        expect(response.status).to.eq(200)
    })
})
