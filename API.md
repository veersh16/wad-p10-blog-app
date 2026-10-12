# API Documentation

Base URL: `http://localhost:5001`. Protected routes need the header `Authorization: Bearer <token>`.

| Method | URL | Auth | Sample request body | Sample response |
|---|---|---|---|---|
| POST | /auth/register | No | {"username":"demo1","email":"demo1@example.com","password":"demo123"} | 201 {"token":"eyJhbGciOi…","user":{"id":"6abbd716…","username":"demo1","email":"demo1@example.com"}} |
| POST | /auth/login | No | {"email":"demo1@example.com","password":"demo123"} | 200 {"token":"eyJhbGciOi…","user":{"id":"6abbd716…","username":"demo1","email":"demo1@example.com"}} |
| GET | /posts | No | – | 200 [{"_id":"6abbd716…","title":"Creating REST APIs with Express","tags":["node","express"],"author":{"_id":"6abbd716…","username":"demo1"},…}] |
| GET | /posts/:id | No | – | 200 {"_id":"6abbd716…","title":"Creating REST APIs with Express","content":"In Practical 5…","author":{"_id":"6abbd716…","username":"demo1"},"createdAt":"2026-09-29T15:19:50…"} |
| POST | /posts | Yes | {"title":"Creating REST APIs with Express","content":"In Practical 5…","tags":"node, express"} | 201 {"_id":"6abbd716…","title":"Creating REST APIs with Express","tags":["node","express"],…} |
| PUT | /posts/:id | Yes (author) | {"title":"REST APIs with Express"} | 200 {"_id":"6abbd716…","title":"REST APIs with Express",…} |
| DELETE | /posts/:id | Yes (author) | – | 200 {"message":"Post deleted"} |
| GET | /posts/:id/comments | No | – | 200 [{"_id":"6abbd716…","text":"Great post","author":{"_id":"6abbd716…","username":"demo1"},…}] |
| POST | /posts/:id/comments | Yes | {"text":"Great post"} | 201 {"_id":"6abbd716…","text":"Great post","author":{"_id":"6abbd716…","username":"demo1"},…} |

## Error responses

| Status | When | Sample response |
|---|---|---|
| 400 | Missing or invalid fields | {"message":"Title must be at least 3 characters"} |
| 401 | No token, bad token, or wrong password | {"message":"Please login first"} |
| 403 | Editing or deleting someone else's post | {"message":"You can only edit your own posts"} |
| 404 | Unknown post id or route | {"message":"Post not found"} |
| 500 | Unexpected server error | {"message":"Server error"} |
