'use strict'

const { validate } = use('Validator')
const User = use('App/Models/User')

class UserController {

  async index({response}) {
  	const users = await User.all()

  	return response.json(users)
  }

  async signup({request, response, auth}) {
  	
  	// validate form input
	const validation = await validate(request.all(), {
	  email: 'required|email:unique:users',
	  username: 'required|unique:users',
	  password: 'required'
	})

	// show error messages upon validation fail
	if (validation.fails()) {
	  return response.send(validation.messages())
	}
	
	const user = new User()
	user.email = request.input('email')
	user.username = request.input('username')
	user.password = request.input('password')
	await user.save()

	const data = await auth.generate(user)
	
	return response.json(data)
  }

  async signin({request, response, auth}) {
  	const parameter = request.only(['email', 'password'])

  	if (!parameter) {
  		return response.status(404).json({data: 'Resource not found'})
  	}

  	const token = await auth.attempt(parameter.email, parameter.password)
  	return response.json({
  		token: token
  	})
  }
}

module.exports = UserController
