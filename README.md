# Doorstep

**Doorstep** is a web application designed to provide efficient solutions for daily requirements by connecting users with service providers such as plumbers, electricians, carpenters, tutors, and more. Our platform aims to streamline the process of finding and hiring professionals for various tasks, ensuring a hassle-free experience for users.

## Problem Statement

One of the key challenges faced in our project is the absence of a centralized place to connect service providers (e.g., plumbers, electricians, carpenters, tutors) with users who require their services. The goal is to create an efficient and user-friendly interface where users can easily find and engage with service providers based on their needs.

## Tech Stack

- **Next.js**: A React framework for server-side rendering and static site generation.
- **Tailwind CSS**: A utility-first CSS framework for creating custom designs quickly.
- **Drizzle**: A library for managing database interactions and migrations.
- **React Query**: A data-fetching and state management library for React applications.
- **Shadcn UI**: A component library for building modern user interfaces.
- **Jotai**: A minimalistic state management library for React.
- **Chart.js**: A JavaScript library for creating interactive charts and visualizations.

## Installation

To get started with Doorstep, follow these steps:

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd doorstep
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure environment variables by creating a `.env` file in the root directory. You can refer to `.env.example` for the required variables.

4. Run database migrations:
    ```bash
    npm run migrate
    ```

## Running the Application

To start the development server, use the following command:

```bash
npm run dev
