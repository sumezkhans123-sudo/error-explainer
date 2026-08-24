# Error Explainer

An AI-powered web application that explains programming errors in beginner-friendly language.

## Live Demo

https://error-explainer-pr3i.onrender.com

## GitHub Repository

https://github.com/sumezkhans123-sudo/error-explainer

## What It Does

Error Explainer helps developers understand programming errors without having to search through multiple websites.

A user pastes a programming error into the application, and the AI explains:

1. What the error means
2. The likely cause
3. How to fix it
4. What to check next

The goal is to make debugging easier and more understandable, especially for beginners.

## Features

- AI-powered programming error explanations
- Beginner-friendly explanations
- Example errors for quick testing
- Loading state while the AI generates a response
- Error handling for invalid requests and API failures
- Copy explanation button
- Responsive web interface
- Backend API keeps the AI API key secure
- Deployed online using Render

## Tech Stack

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Node.js
- Express
- Axios
- CORS
- dotenv

### AI

- OpenRouter API
- `openai/gpt-4o-mini`

### Deployment

- GitHub
- Render

## How It Works

```text
User
  |
  v
Frontend
  |
  | POST /generate
  v
Express Backend
  |
  | OpenRouter API request
  v
OpenRouter
  |
  | AI explanation
  v
Express Backend
  |
  v
Frontend
  |
  v
Explanation shown to user
