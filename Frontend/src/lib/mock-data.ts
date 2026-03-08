export type RoleCardItem = {
  id: string
  title: string
  category: string
  mode: string
  description: string
  openings: number
  image: string
}

export type Applicant = {
  id: string
  name: string
  email: string
  initials: string
  role: string
  submittedAt: string
  score: number
  status: "new" | "reviewing" | "shortlisted" | "rejected"
  location: string
  phone: string
  linkedin: string
  experience: string[]
  education: string
  motivationLetter: string
  documents: Array<{ name: string; type: string; size: string }>
  notes: string
  evaluation: Record<
    "Experience" | "Education" | "Skills" | "Motivation" | "Leadership",
    number
  >
}

export const adminSidebarItems = [
  "Dashboard",
  "Applicants",
  "Roles",
  "Notifications",
  "Settings",
] as const

export const roleCards: RoleCardItem[] = [
  {
    id: "board",
    title: "Board of Directors",
    category: "Leadership",
    mode: "Volunteer",
    description:
      "Strategic oversight and governance to guide our NGO's long-term vision and scale our impact.",
    openings: 3,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "it-lead",
    title: "IT Team Lead",
    category: "Technology",
    mode: "Remote",
    description:
      "Lead technical infrastructure and improve secure, accessible, and resilient digital platforms.",
    openings: 1,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "project",
    title: "Project Coordinator",
    category: "Operations",
    mode: "Full-time",
    description:
      "Coordinate outreach programs, align partners, and support smooth delivery of workshops.",
    openings: 4,
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop",
  },
]

export const dashboardStats = [
  { label: "Total Applications", value: "1,284", trend: "+12%" },
  { label: "Active Roles", value: "12", trend: "Stable" },
  { label: "Pending Review", value: "48", trend: "-5%" },
]

export const applicants: Applicant[] = [
  {
    id: "ap-001",
    name: "Alex Thompson",
    email: "alex.thompson@example.com",
    initials: "AT",
    role: "Senior UX Designer",
    submittedAt: "2026-03-01",
    score: 92,
    status: "shortlisted",
    location: "San Francisco, CA",
    phone: "+1 (555) 012-3456",
    linkedin: "linkedin.com/in/alexthompsonux",
    education: "MFA in Interaction Design, RISD",
    experience: [
      "Senior Product Designer at TechFlow (2019-Present)",
      "UX Designer at Creative Pulse (2016-2019)",
    ],
    motivationLetter:
      "I am inspired by MindLift's mission to expand mental health accessibility and I want to help craft tools that feel humane and inclusive.",
    documents: [
      { name: "Curriculum Vitae", type: "PDF", size: "1.2 MB" },
      { name: "Motivation Letter", type: "DOCX", size: "0.8 MB" },
    ],
    notes:
      "Strong systems thinking and leadership in cross-functional design teams.",
    evaluation: {
      Experience: 4,
      Education: 5,
      Skills: 4,
      Motivation: 5,
      Leadership: 4,
    },
  },
  {
    id: "ap-002",
    name: "Sarah Chen",
    email: "s.chen@tech.io",
    initials: "SC",
    role: "Frontend Developer",
    submittedAt: "2026-02-28",
    score: 85,
    status: "reviewing",
    location: "New York, NY",
    phone: "+1 (555) 210-9999",
    linkedin: "linkedin.com/in/sarahchen",
    education: "BSc Computer Science, NYU",
    experience: ["Frontend Engineer at Pixel Labs (2021-Present)"],
    motivationLetter:
      "I want to apply my frontend craft to mission-driven software that helps communities at scale.",
    documents: [{ name: "Resume", type: "PDF", size: "1.0 MB" }],
    notes:
      "Great technical depth; needs deeper experience in accessibility audits.",
    evaluation: {
      Experience: 4,
      Education: 4,
      Skills: 5,
      Motivation: 4,
      Leadership: 3,
    },
  },
  {
    id: "ap-003",
    name: "Marcus Tuan",
    email: "marcus.t@design.com",
    initials: "MT",
    role: "UX Researcher",
    submittedAt: "2026-02-26",
    score: 78,
    status: "new",
    location: "Austin, TX",
    phone: "+1 (555) 013-9911",
    linkedin: "linkedin.com/in/marcustuan",
    education: "MS Human Factors",
    experience: ["Research Associate at InView (2022-Present)"],
    motivationLetter:
      "MindLift's focus on real human outcomes aligns with my research values.",
    documents: [{ name: "Portfolio", type: "PDF", size: "5.2 MB" }],
    notes: "Strong qualitative methods; no health domain background yet.",
    evaluation: {
      Experience: 3,
      Education: 4,
      Skills: 4,
      Motivation: 4,
      Leadership: 2,
    },
  },
  {
    id: "ap-004",
    name: "Elena Rodriguez",
    email: "elena.ro@global.org",
    initials: "ER",
    role: "Product Manager",
    submittedAt: "2026-02-24",
    score: 45,
    status: "rejected",
    location: "Remote",
    phone: "+1 (555) 777-1234",
    linkedin: "linkedin.com/in/elena-ro",
    education: "MBA",
    experience: ["Associate PM at VentureScale (2018-2021)"],
    motivationLetter:
      "I am interested in moving into social impact organizations.",
    documents: [{ name: "Resume", type: "PDF", size: "0.7 MB" }],
    notes: "Insufficient role-fit for current senior PM opening.",
    evaluation: {
      Experience: 2,
      Education: 3,
      Skills: 2,
      Motivation: 3,
      Leadership: 2,
    },
  },
]

export const activityFeed = [
  "Sarah Miller approved an application",
  "New applicant submitted for Frontend Developer",
  "Role posting Senior Mentor expires in 3 days",
  "Admin note added to Tutor pipeline",
]

export const legalSections = {
  privacy: [
    {
      title: "Information We Collect",
      body: "We collect account identifiers, wellness logs, and platform usage information relevant to recruiting and service delivery.",
    },
    {
      title: "How We Use Data",
      body: "Data is used for personalization, communication, research insights, and platform safety operations.",
    },
    {
      title: "Your Rights",
      body: "You may request access, correction, export, and deletion of your personal data where applicable.",
    },
  ],
  terms: [
    {
      title: "Acceptance of Terms",
      body: "By using MindLift services, you agree to these terms and to responsible platform conduct.",
    },
    {
      title: "Account Security",
      body: "You are responsible for maintaining confidentiality of your credentials and account access.",
    },
    {
      title: "Prohibited Conduct",
      body: "Harassment, harmful content, and unauthorized access attempts are prohibited.",
    },
  ],
}
