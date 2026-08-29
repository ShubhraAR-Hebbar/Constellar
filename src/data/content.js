export const profile = {
  name: "Shubhra AR Hebbar",
  title: "AI/ML & Full-Stack Engineer",
  subtitle: "MCA Candidate · Bengaluru, India",
  location: "Bengaluru, India",
  phone: "+91 8431912914",
  email: "shubhraar797@gmail.com",
  linkedin: "https://linkedin.com/in/shubhra-ar-hebbar",
  github: "https://github.com/ShubhraAR-Hebbar",
  summary:
    "AI/ML and Full-Stack Engineer (MCA, SGPA 8.07) with hands-on internship experience across three companies building end-to-end ML pipelines, NLP-based content moderation systems, and production-ready web applications. Proficient in Python, React.js, TensorFlow, and modern AI frameworks. Passionate about leveraging AI to solve real-world problems and eager to contribute to innovative, fast-paced engineering teams.",
  education: [
    {
      degree: "Master of Computer Applications (MCA)",
      institution: "Atria Institute of Technology",
      location: "Bengaluru, India",
      dates: "Expected Jun 2026",
      gpa: "SGPA: 8.07"
    },
    {
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "Sri Dharmasthala Manjunatheshwara College",
      location: "Mangalore, India",
      dates: "Jun 2021 – Jun 2024",
      gpa: "SGPA: 7.82"
    }
  ]
};

export const skills = [
  { name: "Python", category: "Languages", nodeColor: "#7dd8ff" },
  { name: "React.js", category: "Frontend", nodeColor: "#61dafb" },
  { name: "TensorFlow", category: "AI/ML", nodeColor: "#ff6f00" },
  { name: "FastAPI", category: "Backend", nodeColor: "#009688" },
  { name: "MongoDB", category: "Databases", nodeColor: "#47a248" },
  { name: "NLP", category: "AI/ML", nodeColor: "#b388ff" },
  { name: "Agile", category: "Methodology", nodeColor: "#ffb86b" },
  { name: "Scikit-Learn", category: "AI/ML", nodeColor: "#f7931e" },
  { name: "Flask", category: "Backend", nodeColor: "#bfe9ff" },
  { name: "Node.js", category: "Backend", nodeColor: "#68a063" },
  { name: "Express.js", category: "Backend", nodeColor: "#828282" },
  { name: "REST APIs", category: "Architecture", nodeColor: "#7CFFB2" },
  { name: "Git & GitHub", category: "Tools", nodeColor: "#f05032" },
  { name: "MySQL", category: "Databases", nodeColor: "#00758f" },
  { name: "DSA & OOP", category: "CS Fundamentals", nodeColor: "#e040fb" }
];

export const experience = [
  {
    company: "PAT Technologies Pvt. Ltd.",
    role: "AI Intern",
    dates: "Feb 2026 – May 2026",
    location: "Bengaluru",
    bullets: [
      "Built end-to-end ML pipelines (preprocessing, feature engineering, training, tuning, evaluation) on live industry datasets using Scikit-learn and TensorFlow, contributing to production-ready model delivery.",
      "Delivered AI-based solutions for real-world problems in a project-driven team, strengthening Python, Git, and scalable model development practices across multiple live projects."
    ],
    tech: ["Python", "TensorFlow", "Scikit-learn", "Git", "ML Pipelines"]
  },
  {
    company: "CodeLab Systems",
    role: "Application Developer",
    dates: "May 2024 – Oct 2024",
    location: "Bengaluru, Karnataka",
    bullets: [
      "Developed responsive web interfaces using React, HTML, CSS, and JavaScript; built RESTful APIs using modern development frameworks.",
      "Collaborated on debugging, UI optimization, and code quality; implemented front-end best practices including component architecture and state management.",
      "Applied Agile methodologies, participated in code reviews, and worked on full-stack projects combining backend and frontend technologies."
    ],
    tech: ["React.js", "JavaScript", "REST APIs", "Agile", "Full-Stack"]
  }
];

export const projects = [
  {
    id: "platex",
    name: "PlateX",
    glowColor: "#ffb86b", // warm orange
    secondaryColor: "#ff7043",
    stack: ["Python", "Image Recognition", "FastAPI", "React.js", "Tailwind CSS"],
    description:
      "AI-powered web app using image recognition to identify food items, returning calorie counts and macronutrient breakdowns via a FastAPI backend, with real-time diet tracking and personalized insights.",
    github: "https://github.com/ShubhraAR-Hebbar/PlateX",
    demo: "#"
  },
  {
    id: "sentix",
    name: "SentiX",
    glowColor: "#b388ff", // violet
    secondaryColor: "#7c4dff",
    stack: ["Python", "Llama 3 (Groq API)", "NLP", "Flask", "React.js"],
    description:
      "Code-mixed Hindi-English sentiment analysis tool using Llama 3 via Groq, classifying Positive / Negative / Neutral with confidence scores, backed by a Flask REST API.",
    github: "https://github.com/ShubhraAR-Hebbar/SentiX",
    demo: "#"
  },
  {
    id: "ecotrack",
    name: "EcoTrack",
    glowColor: "#7CFFB2", // soft green
    secondaryColor: "#00e676",
    stack: ["Python", "React.js", "Node.js", "Express.js", "MongoDB"],
    description:
      "Carbon footprint calculator estimating CO₂ emissions from transportation, energy, diet, and waste inputs, with actionable sustainability recommendations and visual emission breakdowns.",
    github: "https://github.com/ShubhraAR-Hebbar/EcoTrack",
    demo: "#"
  }
];

export const leadership = [
  {
    role: "Web Master",
    organization: "Rotaract Club",
    description:
      "Managed club's digital presence and chaired 5+ events, handling end-to-end logistics, coordination, and execution."
  },
  {
    role: "Facility Lead",
    organization: "FXC Club, MCA",
    description:
      "Spearheaded technical initiatives, organized workshops, and mentored junior students in programming and project development."
  },
  {
    role: "Coordinator",
    organization: "Atria Ignite 2026",
    description:
      "Coordinated a state-level technical event for colleges across Bengaluru as part of Atria Institute of Technology's flagship CSR initiative."
  },
  {
    role: "Rovers Ranger",
    organization: "International Cultural Jamboree",
    location: "Alva's Moodbidri",
    description:
      "Supported camp operations and facilitated inter-cultural coordination across diverse teams."
  }
];

export const certifications = [
  {
    title: "Python for Data Science",
    issuer: "Infosys Springboard",
    year: "2025"
  },
  {
    title: "MongoDB Certified DBA Associate (C100DBA)",
    issuer: "Infosys Springboard",
    year: "2025"
  },
  {
    title: "Programming Essentials in Python",
    issuer: "Cisco Networking Academy",
    year: "2025"
  },
  {
    title: "Web Application Development",
    issuer: "CodeLab Systems, Mangalore",
    year: "2024"
  },
  {
    title: "Web Application Development in React JS",
    issuer: "CodeLab Systems, Mangalore",
    year: "2024"
  }
];
