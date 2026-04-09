# GitHub Issues and Branch Setup

This repository now has the following local feature branches created from `main`:

- `feature/frontend-ui`
- `feature/backend-api`
- `feature/database-schema`
- `feature/auth-flow`

## Labels to Create

Create these repository labels in GitHub:

- `frontend`
- `backend`
- `database`
- `auth`
- `docs`

## Issues to Create

Because the GitHub CLI is not installed in this environment, the issues could not be created remotely from the terminal session. Use the following issue definitions in GitHub.

### Issue 1

- Title: `Scaffold React dashboard frontend`
- Labels: `frontend`
- Suggested branch: `feature/frontend-ui`
- Description:
  Build the initial React frontend scaffold for the Campus Sustainability Tracker. Include the dashboard shell, API integration points, and placeholder components for metrics, alerts, reports, and recommendations.

### Issue 2

- Title: `Implement FastAPI backend route stubs`
- Labels: `backend`
- Suggested branch: `feature/backend-api`
- Description:
  Create the FastAPI backend structure, route stubs for all use cases, CORS configuration, environment loading, and report download streaming behavior.

### Issue 3

- Title: `Design PostgreSQL schema for sustainability data`
- Labels: `database`
- Suggested branch: `feature/database-schema`
- Description:
  Define the initial database schema for campuses, buildings, metrics, alerts, thresholds, reports, and historical records needed for forecasting and analytics.

### Issue 4

- Title: `Add authentication and role-based access foundation`
- Labels: `auth`
- Suggested branch: `feature/auth-flow`
- Description:
  Add the authentication flow foundation, login endpoint integration, and role-aware access scaffolding for students, facility managers, and administrators.

### Issue 5

- Title: `Document architecture, stack rationale, and setup`
- Labels: `docs`
- Suggested branch: `main` or a separate docs branch if needed later
- Description:
  Maintain the project documentation, including the architecture diagram, stack justification, local setup instructions, and delivery notes for milestone tracking.

## Notes

- The current working branch is `backend-api`.
- If you want these branches pushed to GitHub, run `git push -u origin <branch-name>` for each branch after committing the relevant work.
