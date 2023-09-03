import { prismaClient } from "../app/database.js"
import { logger } from "../app/logging.js"
import ResponseError from "../error/response-error.js"
import { createAddressValidation, getAddressValidation, updateAddressValidation } from "../validation/address-validation.js"
import { getContactValidation } from "../validation/contact-validation.js"
import { validate } from "../validation/validation.js"

const checkContactMustExists = async (user, contactId) => {
    contactId = validate(getContactValidation,  contactId)
    const totalContact = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contactId,
        }
    })

    if (totalContact !== 1) {
        throw new ResponseError(404, "Contact is not found")
    }

    return contactId
}

const create = async (user, contactId, request) => {
    contactId = await checkContactMustExists(user, contactId)

    const address = validate(createAddressValidation, request)
    address.contact_id = contactId
    return prismaClient.address.create({
        data: address,
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true
        }
    })
}

const get = async (user, contactId, addressId) => {
    contactId = await checkContactMustExists(user, contactId)
    
    addressId = validate(getAddressValidation, addressId)

    const address = await prismaClient.address.findFirst({
        where: {
            contact_id: contactId,
            id: addressId
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true
        }
    })

    if (!address) {
        throw new ResponseError(404, "Address is not found")
    }

    return address
}

const update = async (user, contactId, request) => {
    contactId = await checkContactMustExists(user, contactId)
    const address = validate(updateAddressValidation, request)

    const totalAddress = await prismaClient.address.count({
        where: {
            contact_id: contactId,
            id: address.id
        }
    })

    if (totalAddress !== 1) {
        throw new ResponseError(404, "Address is not found")
    }

    return prismaClient.address.update({
        where: {
            id: address.id
        },
        data: {
            street: address.street,
            city: address.city,
            province: address.province,
            country: address.country,
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true
        }
         
    })
}

const remove = async (user, contactId, addressId) => {
    contactId = await checkContactMustExists(user, contactId)
    
    addressId = validate(getAddressValidation, addressId)

    const totalAddress = await prismaClient.address.count({
        where: {
            contact_id: contactId,
            id: addressId
        }
    })

    if (totalAddress !== 1) {
        throw new ResponseError(404, "Address is not found")
    }

    return prismaClient.address.delete({
        where: {
            id: addressId
        }
    })
}

const list = async (user, contactId) => {
    contactId = await checkContactMustExists(user, contactId)

    return prismaClient.address.findMany({
        where: {
            contact_id: contactId
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true
        }
    })
}

export default {
    create,
    get,
    update,
    remove,
    list
}