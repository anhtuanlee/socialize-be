# Project Sosialize

## URL : **\_\_\_**

## API

- Authencation : /auth ### `Create USER` (`method: POST`): "URL/register" - body: {
  "first_name": **,
  "last_name": **,
  "email": **,
  "password": **,
  "phone": **,
  "bithday": **,
  "gender": \_\_ }

      ### `Login USER` (`method: POST`): "URL/login"
      - body: {user_name: "" or phone:""  , password: ""}
      ### `Logout USER` (`method: POST`): "URL/logout"
      - header: {cookie} , save refreshToken in cookie after login
      ### `RefreshToken` (`method: POST`): "URL/refreshToken"
      - header:{cookie} , after login, save refreshToken to cookie,
      generate new accessToken use every where.  "
      ### `Change Password` (`method: PUT`): "URL/refreshToken"
      - header: { Authencation: Bearer: accessToken}
      - body: {user_name: __, passwordCurrent: __, password: __}
      generate new accessToken use every where.  "

  ==================================================================

- User: /users

  ### `getUserCurrent` (`method: GET`): "URL/:user_name"

  - params: {user_name: \_\_}

  ### `deleteUser` (`method: DELETE`): "URL/delete/:user_name"

  - params: { user_name: \_\_}

  ### `updateUser` (`method: PUT`): "URL/update/:user_name"

  - params: { user_name: \_\_}
  - body: { require: string, first_name:**, last_name: **,avatar:** ,cover:**,bithday:**, gender: ** }
