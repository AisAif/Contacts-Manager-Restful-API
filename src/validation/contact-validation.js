import Joi from "joi"

const createContactValidation = Joi.object({
    firstname: Joi.string().max(100).required(),
    lastname: Joi.string().max(100).optional(),
    email: Joi.string().max(100).optional().email(),
    phone: Joi.string().max(20).optional(),
})

const getContactValidation = Joi.number().positive().required()

const updateContactValidation = Joi.object({
    id: Joi.number().positive().required(),
    firstname: Joi.string().max(100).required(),
    lastname: Joi.string().max(100).optional(),
    email: Joi.string().max(100).optional().email(),
    phone: Joi.string().max(20).optional(),
})

const searchContactValidation = Joi.object({
    page: Joi.number().min(1).positive().default(1),
    size: Joi.number().min(10).max(20).positive().default(10),
    name: Joi.string().optional(),
    email: Joi.string().optional(),
    phone: Joi.string().optional(),
})

export {
    createContactValidation,
    getContactValidation,
    updateContactValidation,
    searchContactValidation
}