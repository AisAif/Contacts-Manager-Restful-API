import { prismaClient } from "../app/database.js"
import ResponseError from "../error/response-error.js"
import { createContactValidation, getContactValidation, searchContactValidation, updateContactValidation } from "../validation/contact-validation.js"
import { validate } from "../validation/validation.js"

const create = async (user, request) => {
    const contact = validate(createContactValidation, request)
    contact.username = user.username
    return prismaClient.contact.create({
        data: contact,
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            phone: true
        }
    })
}

const get = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId)

    const contact = await prismaClient.contact.findFirst({
        where:{
            username: user.username,
            id: contactId
        },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            phone: true
        }
    })

    if (!contact) {
        throw new ResponseError(404, "Contact is not found")
    }

    return contact
}

const update = async (user, request) => {
    const contact = validate(updateContactValidation, request)
    
    const totalContact = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contact.id
        }
    })

    if (totalContact !== 1) {
        throw new ResponseError(404, "Contact is not found")
    }

    return prismaClient.contact.update({
        where: {
            id: contact.id
        },
        data: {
            firstname: contact.firstname,
            lastname: contact.lastname,
            email: contact.email,
            phone: contact.phone,
        }, 
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            phone: true,
        }
    })
}

const remove = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId)

    const totalContact = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contactId,
        }
    })

    if (totalContact !== 1) {
        throw new ResponseError(404, "Contact is not found")
    }

    return prismaClient.contact.delete({
        where: {
            id: contactId
        }
    })
}

const search = async (user, search) => {
    const request = validate(searchContactValidation, search)
    const skip = (request.page - 1) * request.size

    const filters = [
        {
            username: user.username
        }
    ]
    if (request.name) {
        filters.push({
            OR: [
                {
                    firstname: {
                        contains: request.name
                    }
                },
                {
                    lastname: {
                        contains: request.name
                    }
                }
            ]
        })
    }
    if (request.email) {
        filters.push({
            email: {
                contains: request.email
            }
        })
    }
    if (request.phone) {
        filters.push({
            phone: {
                contains: request.phone
            }
        })
    }

    const contacts = await prismaClient.contact.findMany({
        where: {
            AND: filters
        },
        take: request.size,
        skip: skip
    })

    const totalItems = await prismaClient.contact.count({
        where: {
            AND: filters
        }
    })

    return {
        data: contacts,
        paging: {
            page: request.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems/request.size)
        }
    }
}

export default {
    create,
    get,
    update,
    remove,
    search
}