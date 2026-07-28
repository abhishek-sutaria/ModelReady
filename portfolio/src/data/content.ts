export const site = {
  name: 'Abhishek Sutaria',
  domain: 'abhishek-sutaria.me',
  title: 'AI Engineer & Data Scientist',
  tagline:
    'Building multi-agent systems, RAG pipelines, and production ML that move from research to real users.',
  email: 'abhishek.sutaria@gmail.com',
  phone: '+1 (930) 333-7194',
  location: 'Bloomington, IN',
  resumeUrl: '/resume.pdf',
  links: {
    github: 'https://github.com/abhishek-sutaria',
    linkedin: 'https://www.linkedin.com/in/abhishek-sutaria',
  },
}

export const education = {
  school: 'Indiana University Bloomington',
  degree: 'Master of Science in Data Science',
  dates: 'Aug 2024 – May 2026',
  gpa: '3.72 / 4.0',
}

export const experience = [
  {
    org: 'Kelley School of Business, Indiana',
    role: 'AI Research Engineer',
    dates: 'Sep 2025 – Present',
    points: [
      'Engineered a multi-agent RAG tutoring assistant with LangChain and CrewAI over multimodal academic data, improving student quiz scores by 35% in a structured pilot.',
      'Deployed Whisper ASR and ElevenLabs TTS into a WebRTC conversational UI with sub-1.2s end-to-end latency for real-time voice Q&A.',
    ],
  },
  {
    org: 'Project 990 Inc, Indiana',
    role: 'AI Engineer',
    dates: 'Jan 2026 – May 2026',
    points: [
      'Led 2 data analysts on a prompt-agnostic LLM classification pipeline for 100K+ nonprofit mission statements into 27 NTEE codes using Llama 3.3 70B and Gemma.',
      'Built a 9-module analytics pipeline over a 2.97M-record IRS 990 dataset, cutting grant-disparity analysis across 3,000+ US counties from weeks to minutes.',
    ],
  },
  {
    org: 'Digbi Health, California',
    role: 'Data Science Intern',
    dates: 'Jun 2025 – Nov 2025',
    points: [
      'Shipped FastAPI REST endpoints backed by PostgreSQL to clean, normalize, and CPT-tag clinical datasets, cutting preprocessing runtime by 40%.',
      'Productionized an MCP-based Text-to-SQL interface so 15+ clinicians could query claims data in natural language.',
    ],
  },
  {
    org: 'Edelweiss Global Markets, India',
    role: 'Data Engineer',
    dates: 'Jul 2022 – Aug 2024',
    points: [
      'Orchestrated 40+ Airflow / PySpark / Hadoop ETL pipelines on AWS processing 1 TB/day of equities and futures data.',
      'Raised data integrity from 85% to 98% with Great Expectations and Polars on S3 tick data across 500K+ records/day.',
      'Built PySpark-on-Kubernetes pipelines for 1M+ TBT market records daily into ClickHouse, cutting processing time by 12+ hours.',
    ],
  },
]

export const projects = [
  {
    name: 'Real-Time Trade Anomaly Detection',
    summary:
      'Kafka + PySpark Streaming ensemble (Isolation Forest + XGBoost) detecting spoofing patterns at 91% precision and 88% recall.',
  },
  {
    name: 'MeetSmart',
    summary:
      'Real-time meeting intelligence with FastAPI and Whisper ASR across 5+ languages, cutting post-meeting documentation time by 80%.',
  },
  {
    name: 'UnStutter AI',
    summary:
      '1st Place, Honeywell Hackathon @ NSBE 2026 — real-time speech accessibility for 70M+ people affected by speech disfluencies.',
  },
  {
    name: 'CareBridge',
    summary:
      '2nd Place, Claude Hackathon — multi-agent platform automating post-discharge patient follow-ups to reduce readmissions.',
  },
]

export const skillGroups = [
  {
    label: 'Languages',
    items: ['Python', 'SQL', 'R', 'PySpark', 'Shell', 'Java', 'C++'],
  },
  {
    label: 'ML & GenAI',
    items: [
      'PyTorch',
      'TensorFlow',
      'LangChain',
      'LangGraph',
      'CrewAI',
      'RAG',
      'Hugging Face',
      'MLflow',
    ],
  },
  {
    label: 'Data & Cloud',
    items: [
      'Airflow',
      'Kafka',
      'AWS',
      'GCP',
      'Docker',
      'Kubernetes',
      'PostgreSQL',
      'ClickHouse',
    ],
  },
]
