# kezhia.online

The code behind my portfolio at [kezhia.online](https://kezhia.online). I'm Kezhia, a D3 Computer
Technology graduate from Telkom University and a web developer in Bandung.

The site plays like a small 16-bit RPG: a title screen, then my profile, a quest log for work
experience, a level select for projects, an inventory for my tech stack, achievements for
certificates and a save point for contact. It's in English and Indonesian, has a day and a night
theme, and all of the content is edited in a Payload CMS admin.

Stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Payload CMS 3, PostgreSQL.

## Running it locally

You'll need Node.js 22 or 24, and Docker if you want Postgres in a container.

Install the dependencies and create your env file, then set `PAYLOAD_SECRET` in `.env` to a long
random string:

```bash
npm install
cp .env.example .env
```

Next, start Postgres:

```bash
docker compose up -d postgres
```

`npm run db:docker` does the same thing. No Docker? `npm run db:dev` starts a local Postgres that
keeps its data in `.pgdata/`. Leave it running in its own terminal. It uses the same user, password
and database name as the Docker one, so the `DATABASE_URL` from `.env.example` works with either.

Then start the dev server:

```bash
npm run dev
```

The site runs at http://localhost:3000, and `/` redirects to `/en` or `/id` based on the browser
language. On the first run, open http://localhost:3000/admin to create the admin user, then load
the starter content:

```bash
npm run seed
```

The seed fills in the profile, tech stack, site title, experiences, projects and certifications in
both languages. You can run it again, but it resets all of that back to the seeded version.

A few other scripts I use:

- `npm run lint` for ESLint
- `npm run test:int` for the Vitest unit tests
- `npm run test:e2e` for the Playwright tests, which need Postgres running, the seed loaded and
  `npx playwright install chromium` once. They create and remove a test admin, so only run them
  against a local database.
- `npm run generate:types` after changing a collection or global
- `npm run generate:importmap` after adding or moving a custom admin component

## Editing content

Everything on the page comes from the admin at `/admin`. In the sidebar, Page content holds the
single pages and Portfolio holds the lists:

| Section        | What it controls                                               |
| -------------- | -------------------------------------------------------------- |
| Profile        | Name, role, intro, about text, education, contact links and CV |
| Tech stack     | Skill groups in the inventory                                  |
| Site & SEO     | Browser title and search description                           |
| Experiences    | Quest log entries                                              |
| Projects       | Level select tiles, and which interactive demo a project shows |
| Certifications | Achievement badges and their credential links                  |

Switch the locale at the top of an edit screen to write the Indonesian version. Saving refreshes
`/en` and `/id`, so changes show up right away.

## Deploying

The `prod` profile in `docker-compose.yml` builds the app and runs it next to Postgres. On the
server, put a `.env` next to the compose file with at least these:

```env
POSTGRES_PASSWORD=a-strong-password
PAYLOAD_SECRET=a-long-random-string
NEXT_PUBLIC_SERVER_URL=https://kezhia.online
```

`POSTGRES_USER` and `POSTGRES_DB` both default to `kezhia`. Then build and start it:

```bash
docker compose --profile prod up -d --build
```

On the first start the app runs the migrations in `src/migrations` to create the database tables.
It only listens on `127.0.0.1:3000`, so point the domain at the server and put a reverse proxy like
Caddy or Nginx in front of it to handle HTTPS. The database is kept in the `pgdata` volume and
uploads such as the CV in the `media` volume.

If you change a collection or global, run `npm run payload migrate:create` before deploying so
production picks up the new schema.
