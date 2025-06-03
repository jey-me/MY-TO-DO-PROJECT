# My To Do List

A task management app built with **Vue 3**, **Pinia**, **Vite**, and **Supabase**.  
This project was developed as the final assignment for a frontend development course, demonstrating core skills like component architecture, state management, authentication, and API integration.

---

## Features

- **Authentication** (login & register) via Supabase
- **Add, update, delete & toggle** tasks
- Support for task **titles** (like mini project headers)
- **Protected routes** with role-based access control
- Fully **responsive** layout
- Clean codebase using **Composition API** and **Pinia stores**

---

## 🛠 Tech Stack

- [Vue 3](https://vuejs.org/) (Composition API)
- [Vite](https://vitejs.dev/) for fast bundling
- [Pinia](https://pinia.vuejs.org/) for state management
- [Supabase](https://supabase.com/) for auth and database
- [Vue Router](https://router.vuejs.org/) for navigation

---

## Project Setup

```bash
git clone https://github.com/your-username/my-todo-list.git
cd my-todo-list
npm install
```

### Supabase Configuration

1. Create a [Supabase](https://supabase.com/) project.
2. Inside `src/supabaseClient.js`, set your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
3. In your Supabase DB, create a `projects` table with the following structure:

| Field     | Type            |
|-----------|-----------------|
| id        | int8            |
| created_at| timestamptz     |
| task      | text            |
| title     | text (optional) |
| complete  | boolean         |
| userid    | uuid            |

4. Enable **Row Level Security** and use this policy:
```sql
-- Example policy
CREATE POLICY "Users can manage their own tasks"
ON projects
FOR ALL
USING (auth.uid() = userid);
```

---

## Folder Structure

```
├── src/
│   ├── components/       # LoginForm, RegisterForm, NavBar, TaskManager
│   ├── stores/           # authStore.js, projectsStore.js (Pinia)
│   ├── router/           # index.js with route guards
│   ├── supabaseClient.js # Supabase config
│   └── main.js
├── public/
│   └── index.html
```

---

## Future Improvements

- Real-time sync using Supabase subscriptions
- Dark mode toggle
- Inline editing and task tagging
- Unit & E2E testing (Vitest / Cypress)

---

## Author

Made with ❤️ by jey-me as part of the Frontend Development Course Final Project.  
Feel free to fork, contribute, or reach out!

---