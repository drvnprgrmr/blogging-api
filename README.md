# Blogging-api
This is a sample backend for a blogging website.
It allows you to create and manage blogs and uses standard JSON for responses.

## Features
### User management
- Create an account with first name, last name, email and password
- Signin with credentials to get API key

### Viewing blogs (Doesn't require API key)
- View all published blogs (with pagination)
- Filter blogs by author, title and tags
- Sort blogs by reading time, views and publish date
- Detailed view of any blog

### Writing blogs (Requires API key)
- Create a new blog (defaults to draft state)
- View all blogs created by you
- Publish a blog
- Edit a blog
- Delete a blog


## Implementation
This project was built using Express.

Tokenization was handled using Json Web Tokens (JWTs).

Database used was MongoDB.

## Testing locally
- Clone this project
- Create a `.env` file in the root directory and add these variables.\
  MONGODB_URL="Your local or cloud url goes here"\
  JWT_SECRET="Long and random string goes here"
- Run `npm install` to install dependencies 
- Run `npm run dev` to start a development server
- Run `npm test` to make sure all tests are passing
