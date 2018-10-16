'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ContactsSchema extends Schema {
  up () {
    this.create('contacts', (table) => {
      table.increments()
      table.string('fullname').unique()
      table.string('email').unique()
      table.string('address', 80)
      table.string('telephone')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.boolean('is_starred').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('contacts')
  }
}

module.exports = ContactsSchema
