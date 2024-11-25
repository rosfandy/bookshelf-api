import { createBook, deleteBook, getBook, updateBook } from "../../controller/index.js";

export const routes = [
    {
        method: 'GET',
        path: '/',
        handler: (req, res) => {
            return res.response({ message: 'Welcome to Bookshelf API' }).code(200);
        }
    },
    {
        method: 'GET',
        path: '/books',
        handler: getBook
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBook
    },
    {
        method: 'POST',
        path: '/books',
        handler: createBook
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateBook
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBook
    }
];