const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage ;

  const newBooks = {
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

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBooks);
  const isSuccess = books.filter((book) => book.id).length > 0;
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
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, finished, reading } = request.query;
  const isFinished = finished === '1';
  const isRead = reading === '1'; 

  if (name !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
          .map((n) => ({
            id: n.id,
            name: n.name,
            publisher: n.publisher,
          })),
      },
    });
    response.code(200);
    return response;

} if (isFinished === true) {
    const response = h.response({
      status: 'success',
      data: { 
        books: books
          .filter((book) => book.finished === isFinished)
          .map((n) => ({
            id: n.id,
            name: n.name,
            publisher: n.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  } if (isFinished === false) {
    const response = h.response({
      status: 'success',
      data: { 
        books: books
          .filter((book) => book.finished === isFinished)
          .map((n) => ({
            id: n.id,
            name: n.name,
            publisher: n.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  } if (isRead === true) {
    const response = h.response({
      status: 'success',
      data: { 
        books: books
          .filter((bookie) => bookie.reading === isRead)
          .map((nr) => ({
            id: nr.id,
            name: nr.name,
            publisher: NodeFilter.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  } if (isRead === false) {
    const response = h.response({
      status: 'success',
      data: { 
        books: books
          .filter((bookrf) => bookrf.reading === isRead)
          .map((nf) => ({
            id: nf.id,
            name: nf.name,
            publisher: nf.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

const updateBooksHandler = (request, h) => {
  const { id } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBooksHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// eslint-disable-next-line eol-last
module.exports = {
  addBooksHandler, getAllBooksHandler, getBookByIdHandler, updateBooksHandler, deleteBooksHandler,
};
