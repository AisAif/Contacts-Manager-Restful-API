import contactService from "../service/contact-service.js"

const create = async (req, res, next) => {
    try {
        const user = req.user
        const request = req.body
        const result = await contactService.create(user, request)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const get = async(req, res, next) => {
    try {
        const result = await contactService.get(req.user, req.params.contactId)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const user = req.user
        const contactId = req.params.contactId
        const request = req.body
        request.id = contactId
        const result = await contactService.update(user, request)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const remove = async (req, res, next) => {
    try {
        await contactService.remove(req.user, req.params.contactId)
        res.status(200).json({
            data: "Contact removed successfully"
        })
    } catch (error) {
        next(error)
    }
}

const search = async (req, res, next) => {
    try {
        const request = {
            name: req.query.name,
            email: req.query.email,
            phone: req.query.phone,
            page: req.query.page,
            size: req.query.size,
        }
        const result = await contactService.search(req.user, request)
        res.status(200).json({
            data: result.data,
            paging: result.paging
        })
    } catch (error) {
        next(error)
    }
}

export default {
    create,
    get,
    update,
    remove,
    search
}