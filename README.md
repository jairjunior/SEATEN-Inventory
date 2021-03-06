# INTRODUCTION

### Description
Web Application to control and keep track of all inventory information related to IT equipment under the responsability of the Help Desk Department, where I am currently working.

### The Problem to Solve
In my current job, there's a need to control all the computers and peripherals that we install for and users.
We request new items, such as desktops and screens, from the main warehouse and stock them in our own storeroom. We keep this personal storeroom to shorten the amount of time to begin the service. The equipment stored in this room then will be used to install new workstations or replace damaged parts.

Furthermore, there's a need to keep track of each desktop and screen by its inventory number (SKU - Stock Keeping Unit). It's needed to register which user is currently using each of the parts.

### Features
...

### Technologies (Stack)
In this application, the following technologies were used:
* Front-End:
	* HTML5
	* CSS3
	* JavaScript
* Back-End:
	* Node.js
	* MongoDB
* Frameworks and others:
	* jQuery 3.5.1
	* Bootstrap 4.5.3
	* Express
	* Mongoose
	* JWT (JSON Web Token)




# REGISTRATION, AUTHENTICATION AND ACCESS CONTROL

### USER REGISTRATION (/auth/register)
The User Registration is the act of creating a new user for the application. There are 3 (three) types of users:
* **System Admin**: The system admin, which has permissions for doing everything, including give upgrade an
* **General User**: Common user, which has only permissions to "read". This user can't store or modify any data within the application.
* **Help Desk Attendant**: Team worker, who has permissions to "read" and "write". This user can save data into the database and modify its content.

The JSON data sent to the API must follow the following pattern:
```JSON
{
	"firstName": "Paul",
	"lastName":"Gilbert",
	"email":"paul@gmail.com",
	"password":"123456"
}
```
Every new user registered starts off with "General User" permission. If a new user is supposed to be a "Help Desk Attendant" or even another "System Admin", one System Admin already registered should grant the permission.


### USER AUTHENTICATION / LOGIN (/auth/authenticate)
The User Authentication is the act of an user (already registered) to log in the application and start a new session.

The JSON data sent to the API must follow the following pattern:
```JSON
{
	"email":"paul@gmail.com",
	"password":"123456"
}
```
After logging in the application, the server will return a confirmation and the Access Token. The token will be needed to access all routes of the application.
See the **ACCESS TOKEN** section for more information.


### ACCESS TOKEN
For every HTTP request, to access the routes of the application, it will be requested by the server a token for validating the user access permission.

There is a middleware (auth.js) setted for controlling the client access by checking each of the HTTP requests received looking for a token. If it's found, the algorithm will then validate weather the token is valid. If it's not found or it's invalid, an error is returned to the client. Thus, the client needs to authenticate first to get a valid token.

The header of the HTTP request must contain a field called "Authentication" carrying as its value the token provided after authentication.

There are only 2 (two) routes that do not request a token:
* /auth/register
* /auth/athenticate

Finally, the token for authentication purposes is composed of two parts separated by a space: 
     1) the first part is the key word "bearer" (case insensitive).
     2) the second part is the token hash itself.

The token expires in 86,400 seconds or one day.





# DATABASE

### USER SCHEMA
The MongoDB document representing a user stored in the database is like below:
```JSON
{
	"_id": ObjectId("5fdasa754dlde0d7ed8f"),
	"firstName": "Paul",
	"lastName": "Gilbert",
	"email": "paul@gmail.com",
	"password": "12jkh98jhf3107bvhfhj6vxnsd",
	"permission": "system_admin",
	"createdAt": "2020-12-17T02:45:49.773+00:00",
	"__v": 0
}
```
The "permission" property can be either "system_admin", "general_user", or "helpdesk_attendant".

See the file "/src/db/User.js" to understand how the Mongoose Schema is used to fill those fields.






# TODO
* Create modal to show more information about the stock item when the user clicks a table row.
* Add to the modal an "Update" tab in which the user can edit the item (only system admin).
* Add to the modal an "Transfer" tab in which the user can transfer the item or edit it (only system admin).
* Implement the filter algorithm for the stock item table.
* Add pagination to the table with and dropdown menu to select the number of items to be shown at a time.
* Create the page for register a new Stock Item.
* Add the field "updatedAt" to the User Schema (or a timestamp in the Mongoose Schema).
* Add the "permission" of each user to the JWT payload. So the back-end can control some actions only System Admins can do.