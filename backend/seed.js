require('dotenv').config();

const API = `http://localhost:${process.env.PORT}`;

async function call(method, url, body, token) {
  const res = await fetch(API + url, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: body && JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`${method} ${url} failed: ${res.status} ${data.message}`);
  return data;
}

const posts = [
  {
    user: 1,
    title: 'Building a Responsive Portfolio with HTML and CSS',
    tags: 'html, css',
    content:
      'In Practical 1 we built a personal portfolio page using only HTML and CSS. Flexbox arranged the project cards, CSS Grid laid out the skill cards, and media queries switched the layout to a single column on small screens. The dark mode toggle used the checkbox hack with the :checked selector, so no JavaScript was needed.',
  },
  {
    user: 2,
    title: 'Interactive Pages with DOM Manipulation',
    tags: 'javascript, dom',
    content:
      'Practical 3 was about changing a page with JavaScript. We selected elements with getElementById and querySelector, handled click and keyup events, and created or removed elements with createElement and remove(). The to-do list, image gallery, calculator, live search and colour picker all followed this pattern.',
  },
  {
    user: 1,
    title: 'Creating REST APIs with Express',
    tags: 'node, express',
    content:
      'In Practical 5 we built REST APIs with Node.js and Express. Each route mapped an HTTP method to an action: GET to read, POST to create, PUT to update and DELETE to remove. Middleware such as express.json(), cors() and a custom logger ran before the routes, and we tested every endpoint in Postman.',
  },
  {
    user: 2,
    title: 'React Components and Hooks',
    tags: 'react, hooks',
    content:
      'Practical 8 introduced React with Vite. Components received data through props, useState stored values like a counter or form fields, and useEffect fetched posts when a component first loaded. Controlled forms kept every input in state, which made validation simple.',
  },
];

async function seed() {
  const users = {};
  for (const n of [1, 2]) {
    const data = await call('POST', '/auth/register', {
      username: `demo${n}`,
      email: `demo${n}@example.com`,
      password: 'demo123',
    });
    users[n] = data.token;
  }
  const created = [];
  for (const p of posts) {
    created.push(await call('POST', '/posts', { title: p.title, content: p.content, tags: p.tags }, users[p.user]));
  }
  const express = created[2]._id;
  await call('POST', `/posts/${express}/comments`, { text: 'The custom logger middleware made debugging much easier.' }, users[2]);
  await call('POST', `/posts/${express}/comments`, { text: 'Agreed, and Postman helped us test the error cases too.' }, users[1]);
  console.log('Seeded 2 users, 4 posts and 2 comments');
}

seed().catch(err => {
  console.error(err.message);
  process.exit(1);
});
