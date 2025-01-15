## Description

Full authentication SPA, combined of 2 projects, [Auth-Model](https://github.com/liamdoan/react-MERN-auth-module) and [App](https://github.com/liamdoan/todo_app_mern)
with React-Nodejs-Espress-MongoDB, redux. After loggin in, users can perform CRUD operation, and `see only their own data`. (screenshots below)

- After user signs up, an email with verification code is sent to user email
- After providing correct code, user account will be verified, and then direct to login page.
- After clicking Forgot Password button and providing correct email, a link to reset password is sent to user email.
  Through that link, user can provide new password. If everything works, an email to confirm password reset will be sent.
- User logs in, and will be direct to Homepage which is a `protected route`, only authenticated user can see.
- With cookie, if user session is still valid, user will not have to log in if browser is shut down or refreshed.
- If user session is still valid and user clicks login button from root home page, it directs user to `protected route` without having to stop at login page.

`(currently tested ok with Mailtrap demo, and demo service only allows Mailtrap to send emails to user's own account email address - me)`.

Frontend:

- TypeScript React, Redux.

Backend:

- NodeJS, Express, jwt (jsonwebtoken), bcryptjs and crypto library.

Database:

- MongoDB

## Screenshot

- Email view:
  ![Email Screenshots](client/public/screenshots/email-screens.png)

- User Authentication flowview:
  ![UI Screenshots](client/public/screenshots/user-screens.png)

- "Admin" role view:
  ![Admin homepage](client/public/screenshots/homepage-admin.PNG)

- "admin" dashboard, admin can manipulate database:
  ![admin dashboard edit roles](client/public/screenshots/dashboard-admin-assign-roles.PNG)
  ![admin dashboard edit info](client/public/screenshots/dashboard-admin-edit.PNG)
  ![admin dashboard delete](client/public/screenshots/dashboard-admin-delete.PNG)

- "Manager" role view:
  ![Manager homepage](client/public/screenshots/homepage-manager.PNG)

- "Manager" dashboard, read only:
  ![manager dashboard](client/public/screenshots/dashboard-manager.PNG)

- "User" role view:
  ![Main View](client/public/screenshots/homepage-user.PNG)
