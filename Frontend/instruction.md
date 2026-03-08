Project: MindLift Role Portal
Stack: React + Vite + Tailwind + shadcn/ui
Goal: Implement the UI pages based on the designs located in the `Design/` folder.

Important Rules (MANDATORY):

1. All pages must follow the design provided in the `Design/` folder.
   Each page has:

- `page-name.html` (layout reference)
- `page-name.png` (visual reference)

The UI implementation must visually match these designs as closely as possible.

2. Use ONLY the design tokens defined in `index.css`.
   Do NOT introduce new colors, fonts, spacing, or borders.

Use Tailwind tokens already configured in the project such as:

- `bg-background`
- `text-foreground`
- `border-border`
- `bg-primary`
- `text-primary-foreground`
- `muted`
- `card`
- `input`
- etc.

Never hardcode hex colors.

3. Use shadcn/ui components wherever possible.

If a component is needed that is not installed yet, use the appropriate shadcn component.

4. Follow a clean component architecture.

Structure:

src/
components/
pages/
layouts/
features/
lib/

5. Create reusable components for repeated UI elements such as:

- Application form sections
- Role cards
- Applicant table rows
- Status badges
- Evaluation score inputs
- Document preview cards

6. Pages to implement

User Pages:

- LandingPage
- ApplicationFormPage (multi-step)
- MinimalApplicationPage
- ContactPage
- PrivacyPolicyPage
- TermsOfServicePage

Admin Pages:

- AdminLoginPage
- AdminDashboardPage
- ApplicantListPage
- ApplicantDetailsPage

7. Layout Requirements

Public pages should use:
PublicLayout

Admin pages should use:
AdminLayout with sidebar navigation.

8. Admin Sidebar Navigation

Dashboard
Applicants
Roles
Notifications
Settings

9. Application Form Features

Multi-step form with sections:

Step 1 — Personal Info
Step 2 — Professional Info
Step 3 — Documents
Step 4 — Links
Step 5 — Review & Submit

File uploads must support:

- CV
- Motivation Letter
- Additional Documents

Use shadcn Input + Textarea + Select + File upload UI.

10. Applicant List Table

Must support:

- search
- filters
- sorting
- pagination

Columns:
Name
Role
Submission Date
Score
Status
Actions

11. Applicant Details Page

Sections:

Candidate Overview
Document Preview
Motivation Letter
Evaluation Panel
Admin Notes

Evaluation scoring:
1–5 scale per category.

Categories:
Experience
Education
Skills
Motivation
Leadership

12. Styling Rules

Use shadcn components styled with the project tokens.

Examples:

Button
Card
Input
Textarea
Badge
Table
Tabs
Dialog

Spacing should follow Tailwind spacing scale.

13. Responsive Behavior

Pages must support:
Desktop
Tablet
Mobile

Admin tables may collapse to cards on small screens.

14. Do NOT implement backend logic yet.

Mock data should be used in:
`/src/lib/mock-data.ts`

15. The Design folder must remain untouched.
    It is reference-only.

Your task is to recreate those designs using React components.

Deliverables:

- All pages implemented
- Clean reusable components
- Consistent styling using project design tokens
- Admin dashboard UI fully working with mock data

# Folder Structure

src
│
├── components
│ ├── layout
│ │ ├── PublicLayout.tsx
│ │ └── AdminLayout.tsx
│ │
│ ├── application
│ ├── applicants
│ ├── dashboard
│ └── shared
│
├── pages
│ ├── public
│ │ ├── LandingPage.tsx
│ │ ├── ApplicationFormPage.tsx
│ │ ├── MinimalApplicationPage.tsx
│ │ ├── ContactPage.tsx
│ │ ├── PrivacyPolicyPage.tsx
│ │ └── TermsOfServicePage.tsx
│ │
│ └── admin
│ ├── AdminLoginPage.tsx
│ ├── AdminDashboardPage.tsx
│ ├── ApplicantListPage.tsx
│ └── ApplicantDetailsPage.tsx
│
├── lib
│ └── mock-data.ts
