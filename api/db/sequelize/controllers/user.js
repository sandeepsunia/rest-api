import { Models } from '../models'
import jwtOld from 'jsonwebtoken'
import { apiSecret } from '../../../../config/secrets'
import { defaultRole } from '../../../../config/app'
import Promise from 'bluebird'
import csv from 'fast-csv'


const User = Models.User
const Role = Models.Role
const Token = Models.Token
const jwt = Promise.promisifyAll(jwtOld)

export function register (req, res) {
  const { name, email, password, speaker, title, bio, affiliation, abstract, talkTitle, contact } = req.body
  if (!email || !password) {
    return res.status(400).json({ success: false, message: `Please enter email and password.` })
  }

  const params = speaker != undefined
     ? {
       name: name,
       email: email, 
       password: password,
       title: title,
       bio: bio,
       affiliation: affiliation,
       contact: contact,
       abstract: abstract,
       talkTitle: talkTitle,
       speaker: true} 
     : {
       email: email, 
       password: password,
       title: title,
       bio: bio,
       affiliation: affiliation,
       contact: contact,
       abstract: abstract,
       talkTitle: talkTitle,
       speaker: false}

  return User.findOne({
    where: {email: email}
  })
  .then(user => {
    if(user) {
      return res.status(200).json({success: false, message: `User already exists with the email`})
    } else {
      return Promise.all([
        User.create(params),
        Role.findOne({where: {name: defaultRole}})
      ])
      .then(results => {
        let user = results[0]
        let role = results[1]
        if(role != null) {
          return user.addRole(role)
        } else {
          return user.createRole({ name: defaultRole })
        }
      })
      .then(() => {
        return res.status(201).json({ success: true, message: `Created user successfully `})
      })
    }
  })
  .catch(err => {
    return res.status(200).json({ success: false, message: `${JSON.stringify(err)}` })
  })
}

export function updateUserById (req, res) {
  const { name, gender, location, fileName, bio, affiliation, contact, title, address, speaker, abstract, talkTitle } = req.body
  const { id } = req.params
  let image = ''
  let imageName = ''
  if (fileName) {
    fileName.map(data => {
      if (data.field == 'file') {
        image = data.name
        imageName = data.originalname
      }
    })
  } 
  if (id) {
    return User.findOne({
      where: { id: id }
    })
    .then(user => {
      if (user == null) {
        return res.status(404).json({ success: false, message: `No user found with provided id.` })
      } 
      else {
        return user.update({
          name: name ? name : user.name,
          gender: gender ? gender : user.gender,
          location: location ? location : user.location,
          picture: image ? image : user.picture,
          bio: bio ? bio : user.bio,
          abstract: abstract ? abstract : user.abstract,
          talkTitle: talkTitle ? talkTitle : user.talkTitle,
          affiliation: affiliation ? affiliation : user.affiliation,
          contact: contact ? contact : user.contact,
          title: title ? title : user.title,
          address: address ? address : user.address,
          speaker: speaker ? speaker : user.speaker
        })
        .then(user => {
          return res.status(200).json({
            success: true,
            message: `Updated User Successfully`,
            responseObject: {
              type: 'User',
              count: 1,
              data: [
                user
              ]
            }
          })
        })
      }
    })
    .catch(err => {
      return res.status(200).json({ success: false, message: `Something went wrong while updating User ${err.message}` })
    })
  } else {
    return res.status(404).json({success: false, message: `User not found.`})
  }
}

export function uploadCsv(req, res) {
  let counter = 0
  const defaultPassword = 'nystar2017'
  const defaultRole = 'guest'
  csv
  .fromPath(req.file.path)
  .on("data", function (data) {
    if (counter > 0) {
      let params = {
        email: data[0],
        name: data[1],
        affiliation: data[2],
        title: data[3],
        contact: data[4],        
        speaker: data[5],
        bio: data[6],
        picture: data[7],
        password: data[8] ? data[8] : defaultPassword
      }
      
      return Models.User.findOne({
        where: {email: data[0]}
      })
      .then(user => {
        if (user != null) {
          return Promise.all([
            user.update(params),
            Models.Role.findOne({where: {name: defaultRole}})
          ])
        } else {
          return Promise.all([
            Models.User.create(params),
            Models.Role.findOne({where: {name: defaultRole}})
          ])
        }
      })
      .then(results => {
        let user = results[0]
        let role = results[1]
        if (role != null) {
          return user.addRole(role)
        } else {
          return user.createRole({name: defaultRole})
        }
      })
      .catch(e => {
        return res.status(200).json({ success: false, message: `Something went wrong while uploading User ${e.message}` })
      })

    }
    counter += 1
  })
  .on("end", function () {
    return res.status(200).json({ success: true, message: `Users uploaded successfully` })
  })  
}

export function updateUser (req, res) {
  const { name, gender, location, fileName, bio, affiliation, contact, title, address, speaker, abstract, talkTitle } = req.body
  const userId = req.user.id
  let image = ''
  let imageName = ''
  if (fileName) {
    fileName.map(data => {
      if (data.field == 'file') {
        image = data.name
        imageName = data.originalname
      }
    })
  } 
  if (userId) {
    return User.findOne({
      where: { id: userId }
    })
    .then(user => {
      if (user == null) {
        return res.status(404).json({ success: false, message: `No user found with provided id.` })
      } 
      else {
        return user.update({
          name: name ? name : user.name,
          gender: gender ? gender : user.gender,
          location: location ? location : user.location,
          picture: image ? image : user.picture,
          bio: bio ? bio : user.bio,
          affiliation: affiliation ? affiliation : user.affiliation,
          contact: contact ? contact : user.contact,
          title: title ? title : user.title,
          abstract: abstract ? abstract : user.abstract,
          talkTitle: talkTitle ? talkTitle : user.talkTitle,
          address: address ? address : user.address,
          speaker: speaker ? speaker : user.speaker
        })
        .then(user => {
          return res.status(200).json({
            success: true,
            message: `Updated User Successfully`,
            responseObject: {
              type: 'User',
              count: 1,
              data: [
                user
              ]
            }
          })
        })
      }
    })
    .catch(err => {
      return res.status(200).json({ success: false, message: `Something went wrong while updating User ${err.message}` })
    })
  } else {
    return res.status(404).json({success: false, message: `User not found.`})
  }
}

export function addRoleToUser (req, res) {
  const { userId, roleId } = req.params
  
  if (!(userId != "undefined") || !(roleId != "undefined")) {
    return res.status(400).json({ success: false, message: `User and Role both are required.` })
  }

  Promise.all([
    User.findOne({ where: { id: userId } }),
    Role.findOne({ where: { id: roleId } })
  ])
  .then((data) => {
    let user = data[0]
    let role = data[1]
    if (!user || !role) {
      return null
    }
    return user.addRole(role).return(user)
  })
  .then((user) => {
    if (user == null) {
      return res.status(400).json({ success: false, message: `User or Role not found` })
    } else {
      return res.status(201).json({ success: true, message: `Role added to user id - ${user.id}` })
    }
  })
  .catch(err => {
    throw err
  })
}

export function expireToken (req, res) {
  const { email } = req.user
  User.findOne({where: {email: email}})
    .then(user => {
      return user.setToken(null)
    })
    .then(() => {
      return res.status(200).json({ success: true, message: `Done` })
    })
    .catch(err => {
      return res.status(200).json({ success: false, message: `Error ${err.message}` })
    })
}

export function fetchByEmail (req, res) {
  const { email } = req.params
  User.findOne({where: {email: email}})
    .then(user => {
      if (user) {
        return res.status(200).json( {
          success: true,
          message: `User found`,
          responseObject: {
            type: 'User',
            count: 1,
            data: [
              user.toJSON()
            ]
          }
        })
      } else {
        return res.status(404).json({ success: false, message: `User not found` })
      }
    })
    .catch(err => {
      return res.status(200).json({ success: false, message: `Error: ${err.message}`})
    })
}

export function fetchById (req, res) {
  const { userId } = req.params
  User.findOne({where: {id: userId}})
    .then(user => {
      if (user) {
        return res.status(200).json( {
          success: true,
          message: `User found`,
          responseObject: {
            type: 'User',
            count: 1,
            data: [
              user.toJSON()
            ]
          }
        })
      } else {
        return res.status(404).json({ success: false, message: `User not found` })
      }
    })
    .catch(err => {
      return res.status(200).json({ success: false, message: `Error: ${err.message}`})
    })
}

export function authenticate (req, res) {
  let { email, password } = req.body
  email = email.toLowerCase()
    User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        return res.status(400).send({ success: false, message: `Authentication failed. User not found` })
      } else {
        user.comparePassword(password)
          .then((isMatch) => {
            if (isMatch === true) {
              return jwt.signAsync(user.toJSON(), apiSecret, { expiresIn: 10080 })
                .then(token => {
                  return user.setToken(null)
                    .then(() => {
                      return user.createToken({
                        kind: 'token',
                        accessToken: `JWT ${token}`
                      })
                    })
                })
                .then(authToken => {
                  return Token.findAll({
                    where: { userId: null }
                  }).then((tokens) => {
                    return Promise.map(tokens, token => {
                      return token.destroy()
                    })
                  }).return(authToken)
                })
                .then((authToken) => {
                  return res.status(200).send({ success: true, message: `Auth Token created`, responseObject: {count: 1, data: [authToken.toJSON()]} })
                })
                .catch((err) => {
                  return res.status(200).send({ success: false, message: `Something went wrong ${err.message}` })
                })
                
              
            } else {
              return res.status(401).send({ success: false, message: `Authentication failed. Passwords did not match` })
            }
          })
          .catch(err => {
            throw err
          })
      }
    })
    .catch(err => {
      throw err
    })
}

export function fetchUsers (req, res) {
  const { tag, speaker } = req.query
  let query = { order: [['name', 'ASC']] }
  if ( (tag && speaker) && ( tag != '' && speaker != '' ) ) {
    query = { where: {
      $or: [ { name: { $ilike: `%${tag}%` } },
        { affiliation: { $ilike: `%${tag}%` } }
      ],
      $and: [ { speaker: speaker } ]
    },
      order: [['name', 'ASC']]
    }
  } else if ( tag ) {
    query = { where: {
      $or: [ { name: { $ilike: `%${tag}%` } },
        { affiliation: { $ilike: `%${tag}%` } }
      ]
    },
      order: [['name', 'ASC']]
    }
  } else if ( speaker ) {
    query = { where: {
      speaker: speaker
    },
      order: [['name', 'ASC']]
    }
  }
  if ( ( tag == '' && speaker == '' ) || ( tag == '' && speaker === undefined ) || ( tag === undefined && speaker == '' ) ) {
    return res.status(400).send({ success: false, message: `Provide search text or filter.` }) 
  } else {
    User.findAll( query )
      .then(users => {
        if (!users || users.length == 0) {
          return res.status(200).json({ success: false, message: `No users found` })
        } else {
          return res.status(200).json({
            success: true,
            message: 'All Users',
            responseObject: {
              type: 'User',
              count: users.length,
              data: users
            }
          })
        }
      } )
    .catch(err => {
      return res.status(200).send({ success: false, message: `Soemthing went wrong fetching all users ${err.message}` })
    } )
  }
}

export function getProfile (req, res) {
  return res.status(200).json({
    success: true,
    message: 'Your Profile',
    responseObject: {
      type: 'User',
      count: 1,
      data: [
        req.user
      ]
    }
  })
}

export function deleteById(req, res) {
  const { id } = req.params
  return Models.User.destroy({
    where: { id: id}
  })
  .then(() => {
    return res.status(200).json({success: true, message: `Deleted User Successfully`})
  })
  .catch(err => {
    return res.status(200).json({success: false, message: `Something went wrong while deleting user ${err.message}`})
  })
}

export default {
  register,
  updateUser,
  uploadCsv,
  authenticate,
  expireToken,
  addRoleToUser,
  fetchUsers,
  fetchById,
  fetchByEmail,
  getProfile,
  updateUserById,
  deleteById
}
