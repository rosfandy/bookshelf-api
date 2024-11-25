import Joi from "joi";

export const bookSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.empty': 'Gagal menambahkan buku. Mohon isi nama buku',
        'any.required': 'Gagal menambahkan buku. Mohon isi nama buku',
    }),
    year: Joi.number().integer(),
    author: Joi.string(),
    summary: Joi.string(),
    publisher: Joi.string(),
    pageCount: Joi.number().integer(),
    readPage: Joi.number().integer().min(0).max(Joi.ref('pageCount')).messages({
        'number.max': 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }),
    finished: Joi.boolean(),
    reading: Joi.boolean()
});