# USER REGISTRATION (/auth/register)
The JSON data sent to the API must follow the following pattern:
```JSON
{
	"firstName": "Paul",
	"lastName":"Gilbert",
	"email":"paul@gmail.com",
	"password":"123456",
	"permission":"general_user"
}
```
The "permission" property can be either "admin", "general_user", or "helpdesk_attendant".




# USER AUTHENTICATION / LOGIN (/auth/authenticate)
The JSON data sent to the API must follow the following pattern:
```JSON
{
	"email":"paul@gmail.com",
	"password":"123456"
}
```



# ACCESS AUTHORIZATION
Being logged in the application, to access any of the routes, the client will need to send the authentication token together in the HTPP request.

There is a middleware in each route of this application controlling the access by checking each of the HTTP request received looking for a token. If it's found, the algorithm will then validate weather the token is valid.

]The HTTP header of the request must contain a field called "Authentication" carrying as value the token provided whenever a user register or log in the application.





# AUTHENTICATION TOKEN
The token for authentication purposes is composed of two parts separated by a space: 
     1) the first part is the key word "bearer" (case insensitive).
     2) the second part is the token hash itself.
