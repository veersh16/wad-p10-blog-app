# WAD Blog: Blog System

- Name: Shah Veer
- Enrollment No: 241260131066
- Subject: Web Application Development (BE05000281)

## Problem Statement

Students in the WAD lab need a simple place to write about what they learn and discuss it with classmates. This blog lets registered users publish posts, edit or delete their own posts, and comment on any post.

## Tech Stack

- Frontend: React 19, React Router 8, Axios, Vite
- Backend: Node.js, Express 5, JWT (jsonwebtoken), bcryptjs
- Database: MongoDB with Mongoose

## Features

- Register and login with JWT; passwords stored as bcrypt hashes
- Create, edit and delete posts (title, content, tags, author, date)
- Only the author can edit or delete a post (403 for others)
- View all posts and a single post page with comments
- Comment on posts after logging in
- Toast messages, loading spinners, empty states and a 404 page
- Responsive layout for desktop and mobile

## API Documentation

| Method | URL | Auth | Purpose |
|---|---|---|---|
| POST | /auth/register | No | Create an account |
| POST | /auth/login | No | Login and get a token |
| GET | /posts | No | List all posts |
| GET | /posts/:id | No | Get one post |
| POST | /posts | Yes | Create a post |
| PUT | /posts/:id | Yes (author) | Update a post |
| DELETE | /posts/:id | Yes (author) | Delete a post and its comments |
| GET | /posts/:id/comments | No | List comments of a post |
| POST | /posts/:id/comments | Yes | Add a comment |

Full samples: API.md.

## How to Run

1. Start MongoDB on localhost:27017 (or put an Atlas URI in backend/.env).
2. Backend: cd backend, copy .env.example to .env, npm install, npm start (port 5001).
3. Optional demo data: in a second terminal, with the backend running and an empty database, npm run seed (users demo1 / demo2, password demo123).
4. Frontend: cd frontend, copy .env.example to .env, npm install, npm run dev, open http://localhost:5174.

## Screenshots

Screenshots of all pages are provided in the outputs document.
