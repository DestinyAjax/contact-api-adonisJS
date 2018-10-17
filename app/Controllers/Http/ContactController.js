'use strict'

const Contact = use('App/Models/Contact')
const User = use('App/Models/User')
const StarContact = use('App/Models/StarContact')
const { validate } = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with contacts
 */
class ContactController {
  
  /**
   * Show a list of all contacts.
   * GET contacts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {
    try {
      const user = await User.find(auth.user.id)
      const contacts = await user.contacts().fetch()

      response.json(contacts)
    } catch(err) {
      return response.status(400).json({
        status: 'error',
        message: 'Resource not found'
      })
    }
  }

  /**
   * Render a form to be used for creating a new contact.
   * GET contacts/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {

  }

  /**
   * Create/save a new contact.
   * POST contacts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    // validate form input
    const validation = await validate(request.all(), {
      fullname: 'required',
      email: 'required|email',
      telephone: 'required',
      address: 'required'
    })

    // show error messages upon validation fail
    if (validation.fails()) {
      return response.send(validation.messages())
    }

    try {
      const parameter = request.only(['fullname', 'email', 'telephone', 'address'])

      const contact = new Contact()
      contact.fullname = parameter.fullname
      contact.email = parameter.email
      contact.telephone = parameter.telephone
      contact.address = parameter.address
      contact.user_id = auth.user.id

      await contact.save()

      return response.status(201).json({
        message: 'Contact created successfully',
        data: contact
      })
      
    } catch (err) {
      return response.status(400).json({
        status: 'error',
        message: 'Could not create contact'
      })
    }
  }

  /**
   * Display a single contact.
   * GET contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, auth }) {
    const contact = await Contact.find(params.id)

    if (!contact) {
      return response.status(404).json({data: 'Resource not found'})
    }

    return response.json(contact)
  }

  /**
   * Render a form to update an existing contact.
   * GET contacts/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {

  }

  /**
   * Update contact details.
   * PUT or PATCH contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const parameter = request.only(['fullname','email', 'telephone', 'address'])
    const contact = await Contact.find(params.id)

    try {
      contact.address = parameter.address
      contact.email = parameter.email
      contact.telephone = parameter.telephone
      contact.fullname = parameter.fullname

      await contact.status

      return response.status(201).json({
        message: 'Updated successfully',
        data: contact
      })

    } catch(err) {
      return response.status(400).json({
        status: 'error',
        message: 'Could not update contact'
      })
    }
  }

  /**
   * Delete a contact with id.
   * DELETE contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const contact = await Contact.find(params.id)

    if (!contact) {
      return response.status(404).json({data: 'Resource not found'})
    }
    await contact.delete()

    return response.status(201).json({data: 'Deleted successfully'}) 
  }

  /**
   * Star a single contact with id.
   * DELETE contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async starContact({params, request, response, auth}) {
    try {
      const contact = new StarContact()
      contact.user_id = auth.user.id
      contact.contact_id = params.id
      await contact.save()

      return response.json({
        message: 'Contact starred successfully'
      })
    } catch (err) {
      return response.status(400).json({
        status: 'error',
        message: 'Could not star contact'
      })
    }
  }

  /** [starredContacts list of contacts starred by a user]
   * 
   */
  async starredContacts({request, response, auth}) {
    try {
      const user = await User.find(auth.user.id)
      const contacts = await user.starred().fetch()

      response.json(contacts)
    } catch(err) {
      return response.status(400).json({
        status: 'error',
        message: 'Resource not found'
      })
    }
  }
}

module.exports = ContactController
