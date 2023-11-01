import UserModel from '../model/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js';

/** middleware for verify user */
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == 'GET' ? req.query : req.body;

    //check the user existence
    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: 'Cannot find User!' });

    next();
  } catch (error) {
    return res.status(404).send({ error: 'Authentication Error' });
  }
}

/** POST: http://localhost:8080/api/register
 *
 * @param : {
 * "username": "example123",
 * "password": "admin1234",
 * "email": "example@gmail.com",
 * "firstName": "Bill",
 * "lastName": "William",
 * "mobile": 01625770833,
 * "address": "Akdas apartment, Uttara",
 * "profile": ""
 * }
 */
// export async function register(req, res) {
//   try {
//     const { username, password, profile, email } = req.body;

//     // check the existing user
//     const existUsername = new Promise((resolve, reject) => {
//       UserModel.findOne({ username }, function (err, user) {
//         if (err) reject(new Error(err));
//         if (user) reject({ error: 'Please use unique username' });

//         resolve();
//       });
//     });

//     // check for existing email
//     const existEmail = new Promise((resolve, reject) => {
//       UserModel.findOne({ email }, function (err, email) {
//         if (err) reject(new Error(err));
//         if (email) reject({ error: 'Please use unique Email' });

//         resolve();
//       });
//     });

//     Promise.all([existUsername, existEmail])
//       .then(() => {
//         if (password) {
//           bcrypt
//             .hash(password, 10)
//             .then((hashedPassword) => {
//               const user = new UserModel({
//                 username,
//                 password: hashedPassword,
//                 profile: profile || '',
//                 email,
//               });

//               // return save result as a response
//               user
//                 .save()
//                 .then((result) =>
//                   res.status(201).send({ msg: 'User Register Successfully' })
//                 )
//                 .catch((error) => res.status(500).send({ error }));
//             })
//             .catch((error) => {
//               return res.status(500).send({
//                 error: 'Enable to hashed password',
//               });
//             });
//         }
//       })
//       .catch((error) => {
//         return res.status(500).send({ error });
//       });
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// }

export async function register(req, res, next) {
  try {
    const { username, password, email, profile } = req.body;

    if (!username || !email) {
      return res.status(400).json({ msg: 'Bad Request' });
    }

    //check if the user exists
    const existUsername = await UserModel.findOne({ username });
    //check if the email exists
    const existEmail = await UserModel.findOne({ email });

    if (existUsername || existEmail) {
      return res.status(400).json({ msg: 'Bad Request! User already exist' });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      username,
      password: hashedPassword,
      profile: profile || '',
      email,
    });

    // return save result as a response
    user.save();

    res.status(201).json({ msg: 'Registered Successfully', user });
  } catch (error) {
    next(error);
  }
}

/** POST: http://localhost:8080/api/login
 *
 * @param : {
  "username": "example123",
  "password": "admin1234"
  }
 */
export async function login(req, res, next) {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User Not Found!' });

    const isMatchedPassword = await bcrypt.compare(password, user.password);
    if (!isMatchedPassword)
      return res.status(400).json({ error: 'Invalid Input' });

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      ENV.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).send({
      msg: 'Login Successfully..!',
      username: user.username,
      token,
    });
  } catch (error) {
    next(error);
  }
}

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res, next) {
  const { username } = req.params;

  try {
    if (!username) return res.status(501).send({ error: 'Invalid Username' });

    const user = await UserModel.findOne({ username }).select('-password');
    if (!user) return res.status(404).send({ error: 'User not found!' });

    res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
}

/** PUT: http://localhost:8080/api/updateuser
 * @param: {
    "id": "<userId>"
}
  body: {
    firstName: '',
    address: '',
    profile: ''
}
*/
export async function updateUser(req, res, next) {
  try {
    const { userId } = req.user;

    if (!userId) return res.status(404).send({ msg: 'User not found' });

    const body = req.body;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).send({ error: 'User Not Found' });

    const updatedUser = await UserModel.findOneAndUpdate(
      { id: user._id },
      body,
      {
        new: true,
      }
    );

    res.status(201).send({ msg: 'Updated Successfully', updatedUser });
  } catch (error) {
    next(error);
  }
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
  res.json('generateOTP route');
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
  res.json('verifyOTP route');
}

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
  res.json('createResetSession route');
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
  res.json('resetPassword route');
}
