'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StarContactSchema extends Schema {
  up () {
    this.create('star_contacts', (table) => {
      table.increments()
      table.integer('user_id').unsigned().notNullable()
      table.integer('contact_id').unsigned().notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('star_contacts')
  }
}

module.exports = StarContactSchema
