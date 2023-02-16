const {
  saveNewBookHandler,
  showAllBooksHandler,
  showBookDetailHandler,
  editBookDataHandler,
  deleteBookDataHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: saveNewBookHandler,
  },
  {
    method: 'GET',
    path: '/{books?}',
    handler: showAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: showBookDetailHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookDataHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookDataHandler,
  },
];

module.exports = routes;
