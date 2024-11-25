import { nanoid } from "nanoid";
import { bookSchema } from "./schema.js";

let localStorage = [];

export function getBook(request, h) {
    const { bookId } = request.params;
    const { name, reading, finished } = request.query;

    try {
        if (bookId) {
            let book = localStorage.find(book => book.id === bookId);

            if (!book) {
                return h.response({
                    status: 'fail',
                    message: 'Buku tidak ditemukan'
                }).code(404);
            }

            return h.response({
                status: 'success',
                data: { book }
            }).code(200);
        }

        let filteredBooks = localStorage;
        console.log(filteredBooks)
        if (name) {
            const searchName = name.replace(/['"]+/g, '').toLowerCase();
            filteredBooks = name
                ? filteredBooks.filter(book => book.name.toLowerCase().includes(searchName))
                : filteredBooks;
        }

        filteredBooks = reading !== undefined
            ? filteredBooks.filter(book => book.reading === (reading === '1'))
            : filteredBooks;

        filteredBooks = finished !== undefined
            ? filteredBooks.filter(book => book.finished === (finished === '1'))
            : filteredBooks;

        filteredBooks = filteredBooks.map(book => {
            const { id, name, publisher } = book;
            return { id, name, publisher };
        });

        return h.response({
            status: 'success',
            data: { books: filteredBooks }
        }).code(200);
    } catch (error) {
        console.error('Error getting books:', error);
        return h.response({
            status: 'error',
            message: 'Internal Server Error'
        }).code(500);
    }
}


export function createBook(request, h) {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const { error } = bookSchema('POST').validate(request.payload);

    if (error)
        return h.response({
            status: 'fail',
            message: error.details[0].message
        }).code(400);

    try {
        const newBookId = nanoid();

        const newBook = {
            id: newBookId,
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished: pageCount === readPage ? true : false,
            reading,
            insertedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        localStorage.push(newBook);

        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: newBookId
            }
        }).code(201);

    } catch (error) {
        return h.response({
            status: 'fail',
            message: 'Internal Server Error'
        }).code(500);
    }
}

export function updateBook(request, h) {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, finished, reading } = request.payload;

    const { error } = bookSchema('PUT').validate(request.payload);

    if (error)
        return h.response({
            status: 'fail',
            message: error.details[0].message,
        }).code(400);

    try {
        const bookIndex = localStorage.findIndex(book => book.id === bookId);
        if (bookIndex === -1)
            return h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Id tidak ditemukan'
            }).code(404);

        const updatedBook = {
            ...localStorage[bookIndex],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished: pageCount === readPage ? true : false,
            reading,
            updatedAt: new Date().toISOString()
        };

        localStorage[bookIndex] = updatedBook;

        return h.response({
            status: "success",
            message: 'Buku berhasil diperbarui',
        }).code(200);
    } catch (error) {
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
}

export function deleteBook(request, h) {
    const { bookId } = request.params;

    try {
        const bookIndex = localStorage.findIndex(book => book.id === bookId);
        if (bookIndex === -1) {
            return h.response({
                status: 'fail',
                message: 'Buku gagal dihapus. Id tidak ditemukan'
            }).code(404);
        }

        localStorage.splice(bookIndex, 1);

        return h.response({
            status: "success",
            message: 'Buku berhasil dihapus',
        }).code(200);
    } catch (error) {
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
}
