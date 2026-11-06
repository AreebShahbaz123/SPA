# Prompts Log – Ride Sharing SPA

This document records the significant prompts used during the development of the Ride Sharing Single Page Application using React and Redux.

## 1. Create React Components

**Prompt:**

Create the frontend components for a Ride Sharing SPA using React. The application should allow users to register, log in, post rides, browse available rides, and book rides. Create reusable components with a clean and organized folder structure. Focus on frontend functionality and component reusability.

## 2. Create Routes and Connect Components

**Prompt:**

Implement routing in the React application using React Router. Create at least three routes for the application and connect the existing components and pages. Add a shared layout with a common navigation bar so users can navigate between the different sections of the application.

## 3. Configure ESLint and Prettier

**Prompt:**

Configure ESLint and Prettier in the existing React project. Set up appropriate linting and formatting rules for JavaScript and React. Add the necessary scripts to package.json so I can run linting and formatting from the terminal. Fix existing linting issues and ensure the project passes ESLint without errors.

## 4. Add Redux State Management

**Prompt:**

Integrate Redux Toolkit into the existing React application for centralized state management. Create appropriate Redux slices for authentication, rides, and bookings. Implement actions and reducers for user registration, login, logout, posting rides, and booking rides. Connect the Redux store to the React components using React Redux hooks. Ensure that the existing frontend functionality continues to work correctly.

## 5. Test Frontend Functionality

**Prompt:**

Review the existing Ride Sharing SPA and test its frontend functionality. Check navigation between routes, form submissions, user registration and login, ride posting, ride browsing, and ride booking. Identify and fix any existing bugs or broken functionality. Ensure the application behaves consistently across its different pages.

## 6. Add index.css Code

**Prompt:**

Create a complete global stylesheet for the Ride Sharing SPA in index.css. Include styling for the navigation bar, page layouts, forms, buttons, ride cards, input fields, validation messages, and responsive layouts. Maintain a consistent visual design throughout the application.

## 7. Update the New index.css File

**Prompt:**

I have created a new index.css file. Write the complete CSS code in this file for the existing Ride Sharing SPA. Inspect the existing React components and pages first so the CSS classes match the actual HTML structure. Make the application visually consistent, modern, clean

## 8. Configure Vitest and Implement Unit Tests

**Prompt:**

Inspect my existing React + Redux Ride Sharing SPA and configure Vitest for unit testing. Implement the following three categories of unit tests using the existing Redux actions and reducers:

User Registration and Login: Test successful registration, successful login, incorrect password rejection, duplicate email rejection, short password rejection, and logout functionality.

Posting a Ride: Test that a user can post a ride and that the ride is correctly added to the Redux store with all required details. Also verify that multiple rides can be posted successfully.

Preventing Duplicate Bookings: Test that a user can book a ride only once. Attempt to book the same ride again with the same user and verify that the duplicate booking is rejected and available seats are not decremented again. Also test that different users can book the same ride and that one user can book different rides.

Use the existing Redux implementation rather than creating a separate demo application. Install and configure Vitest and any required dependencies, create the test files, and add a test script to package.json. Run all tests, fix any issues, and ensure all tests pass.