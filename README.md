# Installation

To begin installing this app please clone the app into a folder from github. [link](https://github.com/desperate-housewares/dh-backend)

## Steps:

1. Open the terminal
2. CD into the dh-frontend-cra directory after cloning it as above. 
3. Type into the terminal 'npm install' and wait for it to complete the installation.
4. Type into the terminal 'npm run dev' to start the application on your local machine.

Note: If you run into files not found when you have started the server but the components are present make sure that the directory name for the component matches the import statement. This should not effect your build if you deploy the website online using a platform such as netlify.

# Dependencies

In this project the back end makes use of the following libraries:

1. [Express](https://github.com/expressjs/express)  
   Web framework for Node.js that provides simple features that made the development of this application more efficient.
2. [Dotenv](https://github.com/motdotla/dotenv)  
   This package is used to be able to safely store environment variables in a `.env` file and load them when required through the global object `process.env`.
3. [Multer](https://github.com/expressjs/multer)  
   A middleware responsible for handling the multipart/form-data, which is required in order to handle the data sent by the frontend forms with image upload.
4. [Cloudinary Node SDK](https://github.com/cloudinary/cloudinary_npm)  
   This Software Development Kit includes the necessary tools to integrate the server API with Cloudinary in order to upload and retrieve images.
5. [multer-storage-cloudinary](https://github.com/affanshahid/multer-storage-cloudinary)  
   This package provides an easy way to inform `multer` that the file should be stored in Cloudinary.   
6. [Express-session](https://github.com/expressjs/session)  
   A module used to create and manage session middleware for the Express app.  
7. [Connect-mongo](https://github.com/jdesboeufs/connect-mongo)  
   Module used to store Express sessions in MongoDB using a dedicated MongoDB connection.
8. [Mongoose](https://mongoosejs.com/)  
   Mongoose is an object modelling library for Node.js that enables schema-based models and validations to be implemented in our server API.
9. [CORS](https://github.com/expressjs/cors)  
   This Node.js middleware is used allow data to flow between the frontend and the backend by adding CORS (Cross-Origin Resource Sharing) support to the server and informing which origin is allowed to access the server.
10. [Jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)  
   This package allows the implementation of JWT used for authentication and authorisation through the available `sign` and `verify` methods.
11. [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)  
   Library used for password hashing so it can be stored and transmitted securely through the application.