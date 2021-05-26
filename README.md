# spomenarapp
Web app to create, read and answer collections of questions made by users.

### Installing packages

``` npm install && npm run client-install ```

### Running in development mode

This will ask concurrently package to run both backend and frontend on the same server simultaneously.

``` npm run dev ```

###  Environment variables

You should create a .env file in root directory and fill the values for keys given in .env.example file

KEYS | VALUES
---- | ------
MONGO_URI | MongoDB connection string
JWT_SECRET | Any string you like to sing JWTs
EMAIL | Email address used to send verification and password reset emails, check with nodemailer supported services which type could be used. If gmail is used "Less secure apps" must be ON.
EMAIL_PASS | Password for that email address
CLOUD_NAME | Cloudinary cloud name used to store images
CLOUDINARY_API_KEY | Cloadinary API Key 
CLOUDINARY_API_SECRET | Generic API Secret created by you
ADMIN_KEY | Key used if you want to access admin routes (deletion routes). Field in request is called "admin-key"
