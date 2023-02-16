const {nanoid} = require('nanoid');
const bookshelf = require('./bookshelf');

const saveNewBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name) {
    const id = nanoid(16);

    if (pageCount < readPage) {
      const response = h.response({
        status: 'fail',
        message:
      'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    };
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };

    bookshelf.push(newBook);

    const isSuccess = bookshelf.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    };

    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  };

  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku. Mohon isi nama buku',
  });
  response.code(400);
  return response;
};

const showAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  if (reading === '0') {
    const filteredBooks = bookshelf.filter((b) => b.reading == false);
    const response = h.response({
      status: 'success',
      data: {
        // eslint-disable-next-line max-len
        books: filteredBooks.map(({id, name, publisher}) => ({id, name, publisher})),
      },
    });
    response.code(200);
    return response;
  } else if (reading === '1') {
    const filteredBooks = bookshelf.filter((b) => b.reading == true);
    const response = h.response({
      status: 'success',
      data: {
        // eslint-disable-next-line max-len
        books: filteredBooks.map(({id, name, publisher}) => ({id, name, publisher})),
      },
    });
    response.code(200);
    return response;
  } else if (finished === '0') {
    const filteredBooks = bookshelf.filter((b) => b.finished == false);
    const response = h.response({
      status: 'success',
      data: {
        // eslint-disable-next-line max-len
        books: filteredBooks.map(({id, name, publisher}) => ({id, name, publisher})),
      },
    });
    response.code(200);
    return response;
  } else if (finished === '1') {
    const filteredBooks = bookshelf.filter((b) => b.finished == true);
    const response = h.response({
      status: 'success',
      data: {
        // eslint-disable-next-line max-len
        books: filteredBooks.map(({id, name, publisher}) => ({id, name, publisher})),
      },
    });
    response.code(200);
    return response;
  } else if (name !== undefined) {
    // eslint-disable-next-line max-len
    const filteredBooks = bookshelf.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()));
    const response = h.response({
      status: 'success',
      data: {
        // eslint-disable-next-line max-len
        books: filteredBooks.map(({id, name, publisher}) => ({id, name, publisher})),
      },
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: 'success',
      data: {
        // eslint-disable-next-line max-len
        books: bookshelf.map(({id, name, publisher}) => ({id, name, publisher})),
      },
    });
    response.code(200);
    return response;
  };
};

const showBookDetailHandler = (request, h) => {
  const {bookId} = request.params;

  const book = bookshelf.filter((b) => b.id === bookId);
  const bookCheck = book[0];
  if (bookCheck !== undefined) {
    const bookObject = {};
    for (let i = 0; i < book.length; i++) {
      Object.assign(bookObject, book[i]);
    };
    return {
      status: 'success',
      data: {
        book: bookObject,
      },
    };
  };

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookDataHandler = (request, h) => {
  const {bookId} = request.params;

  const index = bookshelf.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;

    if (name) {
      if (pageCount < readPage) {
        const response = h.response({
          status: 'fail',
          message:
        // eslint-disable-next-line max-len
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
      };

      const finished = pageCount === readPage;
      const updatedAt = new Date().toISOString();
      const insertedAt = bookshelf.map(({insertedAt}) => ({insertedAt}));
      bookshelf[index] = {
        ...bookshelf[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
      };
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    };

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  };

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookDataHandler = (request, h) => {
  const {bookId} = request.params;

  const index = bookshelf.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    bookshelf.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  };

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  saveNewBookHandler,
  showAllBooksHandler,
  showBookDetailHandler,
  editBookDataHandler,
  deleteBookDataHandler,
};
