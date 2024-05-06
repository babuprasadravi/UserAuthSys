# PROJECT: USER AUTHENTICATION SYSTEM

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

## OTHER INFORMATION:

### SIGNUP PAGE:
The User Registration page is validated so that you can only enter one UNIQUE EMAIL ADDRESS and ONE UNIQUE PHONE NUMBER. 
Make sure the email address is valid and the phone number is entered in international format, otherwise, the page won't be validated. Example: (+91 63xxx 40xxx)

### ACCOUNT ACTIVATION and FORGOT PASSWORD:
Both account activation and forgot password processes occur with a unique link sent to email. Make sure you open the link sent to email where the project is deployed locally on localhost.

### DATABASE:
I have used MongoDB Atlas for Database connectivity. If you want to view my Database, here is the MongoDB Compass connection URL:
URL: "mongodb+srv://babu:babu123@cluster0.uicsygs.mongodb.net/"

The Database name is "UserAuthSys" and the Schema name is "users".

In the Database, you can see how the user data is being stored.

If you face any errors or difficulties while deploying the project and testing it, kindly email me at the below email address so that I can assist you:
-My personal Email: babuprasad784@gmail.com.

Thank You!

## DATABASE SCHEMA:

// Define the schema for the user collection
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        // Validate phone number using libphonenumber-js
        validate: {
            validator: function(value) {
                return PhoneNumber.isValidNumber(value);
            },
            message: 'Invalid phone number'
        }
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'subscriber'
    },
    resetPasswordLink: {
        type: String,
        default: ''
    }
}, 
// Add timestamps for createdAt and updatedAt
{ timestamps: true });

#### The above is the Database schema of my Project.
