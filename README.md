## Note: Connection to Mongo cluster is commented out. Use your own mongo cluster to save the user data.

# WeConnect-JWT-auth

### EndPoints

#### 1.Login
/api/user/login
POST

Endpoint: https://incampusbackend.herokuapp.com/api/user/login

A JWT auth token will be returned that can be stored in the front end local storage. While accessing any protected route, this token needs to be returned along with auth headers.


#### 2.Register
/api/user/register
POST

Endpoint: https://incampusbackend.herokuapp.com/api/user/register

This route will require two information as of now.
{
"username" : "String",
"password" : "String"
}

This is only going to save the new user and will not login. The login route needs to accessed to login the user in the app.

#### 3.Logout
/api/user/logout
DELETE

Endpoint: https://incampusbackend.herokuapp.com/api/user/logout

This route will need the JWT auth of profile to be logged out to be passed in header.
The token used for logging out the profile will be blacklisted forever and will never be in use for this server auth.
If the same user wants to login again, they will login and a new token will be generated.
The previous logged out expired token will be stored in DB.

#### 4.Posts
/api/user/posts
GET

Endpoint: https://incampusbackend.herokuapp.com/api/user/posts

To check the working of this JWT auth, a "posts" array has been created. The user which logs in will only see their post as a JSON reply. 
