# PROJECT: USER AUTHENTICATION SYSTEM (MERN STACK)

## CODE EXECUTION INSTRUCTIONS:

1. Download the zip file of the source code from the GitHub repository and extract it.

2. Open the project folder path in either a terminal or code editor.

3. Navigate to the client folder with the following command:
    ```
    cd client
    ```

4. Run npm install in the client folder path:
    ```
    npm install
    ```

5. Open a new terminal in the project folder path and navigate to the server folder with the following command:
    ```
    cd server
    ```

6. Run npm install in the server folder path:
    ```
    npm install
    ```

Now all the dependencies for the project are installed.

7. In the server folder path, run the following command to deploy the server on localhost:
    ```
    npm start
    ```

8. In the client folder path, run the following command to deploy the client on localhost:
    ```
    npm run dev
    ```

By following these steps, the project should be deployed locally for testing.

## SAMPLE DATA:

### For ADMIN:
- Email: userauthsys@gmail.com
- Password: Admin@123

### For regular users (subscribers / customers):
- Email: babuprasad784@gmail.com
- Password: Babu@123

Whenever a user signs up, they will be automatically assigned the role of subscribers. The ADMIN role should be changed manually in the DB.

Since this is an authentication project alone, once a user logs in, they will be automatically redirected based on their role. If admin, then they will be redirected to /admin, otherwise to /user. A subscriber cannot access the /admin route because the route is protected.

## DATABASE SCHEMA :

### Subscriber Scehma :
```
{
  "name": "BABU PRASAD",
  "email": "babuprasad784@gmail.com",
  "phone": "+916379340409",
  "password": "$2b$10$cM/XykMxyQMlgHe6rNlnPepFfWMDWeyXQngszY2M6OKWc9nouoqxG",
  "role": "subscriber",
  "resetPasswordLink": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM3ZDM0MzE1ZDNmOTI2MjRkMzA1OTAiLCJpYXQiOjE3MTQ5ODcyNTksImV4cCI6MTcxNDk4Nzg1OX0.lNUptxp129yinLrnQXQLQuYoYDFlxcds6dSbMS5BNyU",
  "createdAt": {
    "$date": "2024-05-05T18:43:15.224Z"
  },
  "updatedAt": {
    "$date": "2024-05-06T09:20:59.339Z"
  },
  "__v": 0
}
```
### Admin Schema :
```
{
  "name": "ADMIN",
  "email": "userauthsys@gmail.com",
  "phone": "+919842426856",
  "password": "$2b$10$GGvn3IqTXlx31SnM3WDSBOuqu2cav2QXRm.k9XMDV1xor1KwmQuMy",
  "role": "admin",
  "resetPasswordLink": "",
  "createdAt": {
    "$date": "2024-05-02T04:48:18.127Z"
  },
  "updatedAt": {
    "$date": "2024-05-06T08:45:31.428Z"
  },
  "__v": 0
}
```
### FailedLoginAttempts Schema :
```
{
  "_id": {
    "$oid": "6639bd93dd17467a3d08b8bc"
  },
  "ip": "::1",
  "__v": 0,
  "attempts": 1,
  "lastAttempt": {
    "$date": "2024-05-07T05:35:13.544Z"
  }
}

```

## OTHER INFORMATION:

### SIGNUP PAGE:
The User Registration page is validated so that you can only enter one **UNIQUE EMAIL ADDRESS** and **ONE UNIQUE PHONE NUMBER**. 
Make sure the email address is valid and the phone number is entered in international format, otherwise, the page won't be validated. Example: (+91 63xxx 40xxx)

### ACCOUNT ACTIVATION and FORGOT PASSWORD:
Both account activation and forgot password processes occur with a unique link sent to email. Make sure you open the link sent to email where the project is deployed locally on localhost.

### Authentication Security : 
 1) Passwords are validated to only get **STRONG PASSWORDS**, so that its much secure.
 2) The signin page is protected from **BRUTE FORCE ATTACKS**. If someone is trying with various combination of passwords, so they might enter a lot of wrong passwords. So if a user enters more than five wrong passwords in a single minute, their ip address gets blocked (only for 15 mins) for further login. So this prevents the project from brute force attacks

### DATABASE:
I have used MongoDB Atlas for Database connectivity. If you want to view my Database, here is the MongoDB Compass connection URL:
                          ```mongodb+srv://babu:babu123@cluster0.uicsygs.mongodb.net/```

The Database name is "UserAuthSys" and the Schema name is "users".

In the Database, you can see how the user data is being stored.

If you face any errors or difficulties while deploying the project and testing it, kindly email me at the below email address so that I can assist you:
-My personal Email: babuprasad784@gmail.com.

Thank You!
