# Project Sosialize

## URL : **\_\_\_**

## API

- Authencation : /auth
- ### `Create USER` (`method: POST`): "URL/register" - body: {
  "firstName": **,
  "lastName": **,
  "email": **,
  "password": **,
  "phone": **,
  "bithday": **,
  "gender": \_\_ }

    ### `Login USER` (`method: POST`): "URL/login"
      - body: {userName: "" or phone:""  , password: ""}
    ### `Logout USER` (`method: POST`): "URL/logout"
      - header: {cookie} , save refreshToken in cookie after login
   ### `RefreshToken` (`method: POST`): "URL/refreshToken"
      - header:{cookie} , after login, save refreshToken to cookie,
      generate new accessToken use every where.  "
   ### `Change Password` (`method: PUT`): "URL/refreshToken"
      - header: { Authencation: Bearer: accessToken}
      - body: {userName: __, passwordCurrent: __, password: __}
      generate new accessToken use every where.  "

  ==================================================================

- User: /users

  ### `getUserCurrent` (`method: GET`): "URL/:userName"

  - params: {userName: \_\_}

  ### `deleteUser` (`method: DELETE`): "URL/delete/:userName"

  - params: { userName: \_\_}

  ### `updateUser` (`method: PUT`): "URL/update/:userName"

  - params: { userName: \_\_}
  - body: { firstName:** , lastName: ** , avatar:** ,cover:** , bithday:** , gender: ** }

  ==================================================================

- Friend /users/friend/

  ### `ADD` (`method: POST`): "URL/add"

  - body: { self:user_name, reiceiver: friend_name },
  - header: { accessToken: Bear \_\_\_}

  ### `ACCEPT` (`method: POST`): "URL/accept"

  - body: { self:user_name, reiceiver: friend_name },
  - header: { accessToken: Bear \_\_\_}

  ### `REJECT` (`method: POST`): "URL/reject"

  - body: { self:user_name, reiceiver: friend_name },
  - header: { accessToken: Bear \_\_\_}

  ### `DELETE` (`method: POST`): "URL/delete"

  - body: { self:user_name, reiceiver: friend_name },
  - header: { accessToken: Bear \_\_\_}

  ### `LIST FRIEND` (`method: GET`): "URL/"

  - body: { user_name: \_\_}
  - header: { accessToken: Bear \_\_\_}

  ### `LIST INVITE REQUEST ` (`method: GET`): "URL/invite_request"

  - body: { user_name: \_\_}
  - header: { accessToken: Bear \_\_\_}

  ### `LIST FOLLOWER ` (`method: GET`): "URL/follower "

  - body: { user_name: \_\_}
  - header: { accessToken: Bear \_\_\_}

  ### `COMMOM FRIEND` (`method: GET`): "URL/mutual_friend"

  - body: { user_name: ** , others: ** }
  - header: { accessToken: Bear \_\_\_ }
