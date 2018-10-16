'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

/** route endpoint for users */
Route.group(() => {
  Route.get('users', 'UserController.index')
  Route.post('users/signup', 'UserController.signup').middleware(['guest'])
  Route.post('users/signin', 'UserController.signin').middleware(['guest'])
}).prefix('api/v1')

/** route endpoint for contact */
Route.group(() => {
  Route.get('contacts', 'ContactController.index').middleware(['auth'])
  Route.get('contact/:id', 'ContactController.show').middleware(['auth'])
  Route.post('contact', 'ContactController.store').middleware(['auth'])
  Route.put('contacts/:id', 'ContactController.update').middleware(['auth'])
  Route.delete('contacts/:id', 'ContactController.destroy').middleware(['auth'])
  Route.patch('contacts/:id/star', 'ContactController.starContact').middleware(['auth'])
  Route.get('starred/contacts', 'ContactController.starredContacts').middleware(['auth'])
}).prefix('api/v1')
