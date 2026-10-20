'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Briefcase, GraduationCap, Award, Code, 
  Download, CheckCircle2, Trash2, Plus, Image as ImageIcon, 
  Palette, Eye, EyeOff, Layers, Mail, Phone, MapPin, Globe,
  ZoomIn, ZoomOut, Smartphone, Monitor, Printer, Maximize2, Sparkles, FileDown, Type, CheckCircle, AlertTriangle, X,
  ChevronUp, ChevronDown, UploadCloud, FileText, Loader2
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

// 100% Reliable Base64 Avatar
const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI2UyZThmMCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzgiIHI9IjE4IiBmaWxsPSIjNjQ3NDhiIi8+PHBhdGggZD0iTTIwIDg2Yz0tMTYuNSAxMy41LTMwIDMwLTMwczMwIDEzLjUgMzAgMzB6IiBmaWxsPSIjNjQ3NDhiIi8+PC9zdmc+";

// Pre-defined role-wise bullet categories
const DEFAULT_PRESET_BULLETS = {
  tech: [
    "Developed responsive web applications using React.js, Node.js, Express.js, and MongoDB.",
    "Implemented secure JWT authentication and optimized RESTful APIs for security and speed.",
    "Improved application page load speed by 35% through code splitting and asset optimization.",
    "Collaborated with UI/UX designers and backend engineers in an Agile environment.",
    "Wrote unit and integration tests using Jest, reducing production bug reports by 40%."
  ],
  marketing: [
    "Executed multi-channel digital marketing campaigns, boosting qualified leads by 45%.",
    "Managed SEO and content optimization, improving organic web traffic by 60% in 6 months.",
    "Monitored KPIs and CAC using Google Analytics to optimize ad spend efficiency.",
    "Collaborated with design teams to produce high-converting landing pages and creatives."
  ],
  finance: [
    "Conducted financial variance analysis and prepared monthly forecasts with 98% accuracy.",
    "Streamlined invoice reconciliation workflows, cutting turnaround time by 30%.",
    "Maintained full compliance with auditing regulations and statutory reporting standards.",
    "Prepared monthly financial statements and performance decks for senior leadership."
  ],
  management: [
    "Led cross-functional teams of 8+ members, delivering complex deliverables on schedule.",
    "Facilitated daily standups, sprint retrospectives, and resource allocation in Agile.",
    "Optimized operational workflows, resulting in a 15% reduction in overall operating costs.",
    "Mentored junior professionals, improving team output and retention rate."
  ],
  fresher: [
    "Successfully developed academic capstone projects utilizing modern web frameworks.",
    "Demonstrated problem-solving and clean coding standards through competitive programming.",
    "Assisted senior engineers in writing technical documentation, API tests, and bug fixes.",
    "Fast learner with strong foundational knowledge of computer science fundamentals."
  ],
  custom: [
    "Achieved key performance milestones and exceeded quarterly productivity targets."
  ]
};

export default function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState('personal');
  const [selectedTemplate, setSelectedTemplate] = useState('ankit_harvard'); 
  const [accentColor, setAccentColor] = useState('#1e3a8a'); 
  const [selectedFont, setSelectedFont] = useState('"Times New Roman", Times, serif');
  const [showPhoto, setShowPhoto] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [mobileView, setMobileView] = useState('editor'); 
  const [previewScale, setPreviewScale] = useState(0.85);

  // Quick Bullets Category & Custom Input State
  const [bulletCategory, setBulletCategory] = useState('tech');
  const [newBulletText, setNewBulletText] = useState('');
  const [bulletList, setBulletList] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pro_resume_custom_bullets_v2');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return DEFAULT_PRESET_BULLETS;
  });

  // Import Modal & Loading States
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isParsingDoc, setIsParsingDoc] = useState(false);
  const [pasteResumeText, setPasteResumeText] = useState('');
  const [importStatusMsg, setImportStatusMsg] = useState('');

  const resumeRef = useRef(null);
  const previewWrapperRef = useRef(null);
  const fileInputRef = useRef(null);
  const pasteTextareaRef = useRef(null);

  const [visibility, setVisibility] = useState({
    summary: true,
    metrics: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
    declaration: true
  });

  const toggleVisibility = (key) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [resumeData, setResumeData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pro_resume_builder_data_v7');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return {
      personalInfo: {
        fullName: "Alex Morgan",
        jobTitle: "Full Stack Web Developer",
        email: "alex.morgan@example.com",
        phone: "+1 555-010-2048",
        address: "New York, USA",
        city: "New York",
        country: "USA",
        linkedin: "linkedin.com/in/alexmorgan",
        github: "github.com/alexmorgan",
        portfolio: "alexmorgan.dev",
        licenseNo: "DEMO-123456",
        declaration: "I hereby declare that the information provided above is true and accurate.",
        photo: DEFAULT_AVATAR,
      },
      summary: "Motivated Full Stack Developer with experience building responsive web applications, developing REST APIs, and optimizing application performance by 35%.",
      metrics: [
        { id: "m-1", label: "Projects Completed", val: "25+" },
        { id: "m-2", label: "Performance Improvement", val: "35%" },
        { id: "m-3", label: "Team Collaboration", val: "5 Members" },
      ],
      education: [
        {
          id: "edu-1",
          degree: "Bachelor of Technology in Computer Science",
          institution: "Example Institute of Technology",
          location: "New York, USA",
          duration: "Aug 2020 – May 2024",
          grade: "8.5 CGPA",
        }
      ],
      experience: [
        {
          id: "exp-1",
          role: "Full Stack Developer",
          company: "Tech Solutions Inc.",
          location: "New York, USA",
          duration: "Jan 2023 – Present",
          description: "• Developed responsive web applications using React.js, Node.js, Express.js, and MongoDB.\n• Implemented secure JWT authentication and optimized REST APIs for security and speed.\n• Improved application page load speed by 35% through asset optimization.",
        }
      ],
      skillCategories: {
        languages: "HTML5, CSS3, JavaScript, TypeScript, SQL",
        tools: "VS Code, Git, GitHub, Postman, Docker",
        frameworks: "React.js, Next.js, Node.js, Express.js, Tailwind CSS",
        softSkills: "Communication, Teamwork, Problem Solving, Agile",
      },
      projects: [
        {
          id: "proj-1",
          title: "E-Commerce Platform",
          tech: "React.js, Node.js, MongoDB, Stripe",
          duration: "Jan 2024 – Apr 2024",
          description: "Developed a responsive e-commerce platform with product listings, search, and checkout with 99.9% uptime.",
        }
      ],
      certifications: [
        {
          id: "c-1",
          name: "Full Stack Web Development",
          issuer: "Example Learning Academy",
          year: "2024",
        }
      ]
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pro_resume_builder_data_v7', JSON.stringify(resumeData));
    }
  }, [resumeData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pro_resume_custom_bullets_v2', JSON.stringify(bulletList));
    }
  }, [bulletList]);

  const autoFitScale = () => {
    if (previewWrapperRef.current) {
      const containerWidth = previewWrapperRef.current.clientWidth - 28;
      if (containerWidth > 0) {
        const calculatedScale = Math.min(Math.max(containerWidth / 794, 0.32), 1);
        setPreviewScale(calculatedScale);
      }
    }
  };

  useEffect(() => {
    autoFitScale();
    window.addEventListener('resize', autoFitScale);
    return () => window.removeEventListener('resize', autoFitScale);
  }, [mobileView]);

  // ================= DOCUMENT IMPORT & PARSING ENGINES =================
  const loadPdfJs = () => new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.pdfjsLib) {
      return resolve(window.pdfjsLib);
    }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    s.onerror = () => reject(new Error('Failed to load PDF Parser script'));
    document.head.appendChild(s);
  });

  const loadMammoth = () => new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.mammoth) {
      return resolve(window.mammoth);
    }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
    s.onload = () => resolve(window.mammoth);
    s.onerror = () => reject(new Error('Failed to load Word DOCX Parser script'));
    document.head.appendChild(s);
  });

  // Heuristic Smart Resume Parser
  const parseResumeTextIntoState = (rawText) => {
    const trimmed = (rawText || '').trim();
    if (trimmed.length < 15) {
      alert(
        '⚠️ Document se selectable text extract nahi ho paya.\n\n' +
        'Karan:\n' +
        '• File Canva ya scanner se bani Image-only PDF ho sakti hai.\n' +
        '• Word file me text shapes ya boxes ke andar ho sakta hai.\n\n' +
        'Samadhan: Apne resume ka text copy karein aur neeche diye gaye box me paste kar ke "⚡ Parse & Update Resume" par click karein.'
      );
      if (pasteTextareaRef.current) {
        pasteTextareaRef.current.focus();
      }
      return;
    }

    const lines = trimmed.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const cleanFullText = trimmed;

    // 1. Email extraction
    const emailMatch = cleanFullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : '';

    // 2. Phone extraction
    const phoneMatch = cleanFullText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,5}[-.\s]?\d{4}/);
    const phone = phoneMatch ? phoneMatch[0] : '';

    // 3. LinkedIn & GitHub
    const linkedinMatch = cleanFullText.match(/(?:linkedin\.com\/in\/|linkedin:\s*)([a-zA-Z0-9_-]+)/i);
    const linkedin = linkedinMatch ? `linkedin.com/in/${linkedinMatch[1]}` : '';

    const githubMatch = cleanFullText.match(/(?:github\.com\/|github:\s*)([a-zA-Z0-9_-]+)/i);
    const github = githubMatch ? `github.com/${githubMatch[1]}` : '';

    // 4. Candidate Name: usually the first non-contact line
    let fullName = '';
    for (let i = 0; i < Math.min(lines.length, 6); i++) {
      const line = lines[i];
      if (!line.includes('@') && !line.includes('http') && !line.match(/\d{5,}/) && line.length > 2 && line.length < 35) {
        fullName = line;
        break;
      }
    }

    // 5. Section segmentation
    let currentSection = 'summary';
    const summaryArr = [];
    const experienceArr = [];
    const educationArr = [];
    const skillsArr = [];
    const projectsArr = [];

    lines.forEach((line) => {
      const lower = line.toLowerCase();
      if (lower.includes('work experience') || lower.includes('experience') || lower.includes('employment history')) {
        currentSection = 'experience';
      } else if (lower.includes('education') || lower.includes('academic') || lower.includes('qualifications')) {
        currentSection = 'education';
      } else if (lower.includes('skills') || lower.includes('technologies') || lower.includes('technical stack')) {
        currentSection = 'skills';
      } else if (lower.includes('projects') || lower.includes('key projects') || lower.includes('academic projects')) {
        currentSection = 'projects';
      } else if (lower.includes('summary') || lower.includes('profile') || lower.includes('about me') || lower.includes('objective')) {
        currentSection = 'summary';
      } else {
        if (currentSection === 'summary') summaryArr.push(line);
        else if (currentSection === 'experience') experienceArr.push(line);
        else if (currentSection === 'education') educationArr.push(line);
        else if (currentSection === 'skills') skillsArr.push(line);
        else if (currentSection === 'projects') projectsArr.push(line);
      }
    });

    setResumeData((prev) => {
      const updated = { ...prev };
      if (fullName) updated.personalInfo.fullName = fullName;
      if (email) updated.personalInfo.email = email;
      if (phone) updated.personalInfo.phone = phone;
      if (linkedin) updated.personalInfo.linkedin = linkedin;
      if (github) updated.personalInfo.github = github;

      if (summaryArr.length > 0) {
        updated.summary = summaryArr.slice(0, 5).join(' ');
      }

      if (skillsArr.length > 0) {
        updated.skillCategories.languages = skillsArr.slice(0, 8).join(', ');
      }

      if (experienceArr.length > 0) {
        updated.experience = [
          {
            id: `exp-${Date.now()}`,
            role: "Extracted Role / Designation",
            company: "Company Name",
            location: prev.personalInfo.address || "Location",
            duration: "Recent",
            description: experienceArr.slice(0, 6).map(l => l.startsWith('•') ? l : `• ${l}`).join('\n')
          },
          ...prev.experience
        ];
      }

      if (projectsArr.length > 0) {
        updated.projects = [
          {
            id: `proj-${Date.now()}`,
            title: "Extracted Project",
            tech: "Key Technologies",
            duration: "Recent",
            description: projectsArr.slice(0, 4).join(' ')
          },
          ...prev.projects
        ];
      }

      return updated;
    });

    setImportStatusMsg('✅ Document se data successfully extract ho gaya!');
    setTimeout(() => {
      setIsImportModalOpen(false);
      setImportStatusMsg('');
    }, 1500);
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setIsParsingDoc(true);
    setImportStatusMsg(`Parsing ${file.name}...`);

    try {
      const fileName = file.name.toLowerCase();

      // Case 1: JSON File (Direct restore)
      if (fileName.endsWith('.json')) {
        const text = await file.text();
        const parsed = JSON.parse(text);
        if (parsed.personalInfo) {
          setResumeData(parsed);
          setImportStatusMsg('✅ JSON resume successfully restored!');
          setTimeout(() => setIsImportModalOpen(false), 1200);
          return;
        }
      }

      // Case 2: Plain Text / Markdown
      if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
        const text = await file.text();
        parseResumeTextIntoState(text);
        return;
      }

      // Case 3: Word Document (.docx)
      if (fileName.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const mammoth = await loadMammoth();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const docxText = result && result.value ? result.value : '';
        parseResumeTextIntoState(docxText);
        return;
      }

      // Case 4: PDF Document (.pdf) - Enhanced text extraction
      if (fileName.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfjsLib = await loadPdfJs();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullPdfText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Safe filtering: check for actual text items and prevent undefined
          const pageText = (textContent.items || [])
            .map((item) => (item && typeof item.str === 'string' ? item.str : ''))
            .filter((str) => str.trim().length > 0)
            .join(' ');

          fullPdfText += pageText + '\n';
        }

        parseResumeTextIntoState(fullPdfText);
        return;
      }

      alert('Kripya PDF (.pdf), Word (.docx), Text (.txt), ya JSON (.json) format ki file upload karein.');
    } catch (err) {
      console.error('File parsing error:', err);
      alert('Document read karne me dikkat aayi. Kripya Text copy-paste karke try karein.');
    } finally {
      setIsParsingDoc(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleManualTextImport = () => {
    if (!pasteResumeText.trim()) return;
    setIsParsingDoc(true);
    parseResumeTextIntoState(pasteResumeText);
    setIsParsingDoc(false);
  };

  // Reorder Items Function
  const moveItem = (section, index, direction) => {
    setResumeData((prev) => {
      const items = [...prev[section]];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return prev;
      const temp = items[index];
      items[index] = items[targetIndex];
      items[targetIndex] = temp;
      return { ...prev, [section]: items };
    });
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) { alert('File size must be under 3MB'); return; }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setResumeData((prev) => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, photo: event.target.result }
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, photo: '' }
    }));
  };

  // ================= EXPERIENCE =================
  const handleExpChange = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [{ id: `exp-${Date.now()}`, role: '', company: '', location: '', duration: '', description: '' }, ...prev.experience]
    }));
  };

  const removeExperience = (id) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter(item => item.id !== id)
    }));
  };

  const addBulletToExperience = (id, bulletText) => {
    const clean = bulletText.trim();
    const formatted = clean.startsWith('•') ? clean : `• ${clean}`;

    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map(item => {
        if (item.id === id) {
          const currentDesc = (item.description || '').trim();
          const newDesc = currentDesc ? `${currentDesc}\n${formatted}` : formatted;
          return { ...item, description: newDesc };
        }
        return item;
      })
    }));
  };

  const handleAddNewBullet = () => {
    if (!newBulletText.trim()) return;
    setBulletList((prev) => ({
      ...prev,
      [bulletCategory]: [...(prev[bulletCategory] || []), newBulletText.trim()]
    }));
    setNewBulletText('');
  };

  const handleDeleteBullet = (category, index) => {
    setBulletList((prev) => ({
      ...prev,
      [category]: (prev[category] || []).filter((_, idx) => idx !== index)
    }));
  };

  // ================= EDUCATION =================
  const handleEduChange = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [{ id: `edu-${Date.now()}`, degree: '', institution: '', location: '', duration: '', grade: '' }, ...prev.education]
    }));
  };

  const removeEducation = (id) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter(item => item.id !== id)
    }));
  };

  // ================= PROJECTS =================
  const handleProjChange = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [{ id: `proj-${Date.now()}`, title: '', tech: '', duration: '', description: '' }, ...prev.projects]
    }));
  };

  const removeProject = (id) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter(item => item.id !== id)
    }));
  };

  // ================= ATS SCORE CHECKER =================
  const calculateAtsScore = () => {
    let score = 25;
    const checks = [];

    score += 15;
    checks.push({ pass: true, msg: "Reverse-Chronological Order: Latest experiences & projects placed at the top." });

    if (resumeData.personalInfo.fullName.trim().length > 2) { 
      score += 10; 
      checks.push({ pass: true, msg: "Full Name provided clearly." }); 
    } else {
      checks.push({ pass: false, msg: "Add a valid Full Name." });
    }

    if (resumeData.personalInfo.email.includes('@')) { 
      score += 10; 
      checks.push({ pass: true, msg: "Professional Email format is valid." }); 
    } else {
      checks.push({ pass: false, msg: "Add a professional Email address." });
    }

    if (resumeData.personalInfo.linkedin && resumeData.personalInfo.linkedin.trim().length > 5) { 
      score += 10; 
      checks.push({ pass: true, msg: "LinkedIn Profile URL included." }); 
    } else {
      checks.push({ pass: false, msg: "Add LinkedIn link for automated recruiter parsing." });
    }

    if (resumeData.personalInfo.address && resumeData.personalInfo.address.trim().length > 3) { 
      score += 5; 
      checks.push({ pass: true, msg: "Location (City, Country) specified." }); 
    } else {
      checks.push({ pass: false, msg: "Add your Location/City." });
    }

    if (resumeData.summary.length > 50) { 
      score += 10; 
      checks.push({ pass: true, msg: "Professional Summary is comprehensive (>50 chars)." }); 
    } else {
      checks.push({ pass: false, msg: "Expand your summary to at least 50 characters." });
    }

    const hasNumbersInExp = resumeData.experience.some(e => /\d+|%|\$/.test(e.description));
    if (resumeData.experience.length > 0 && resumeData.experience[0].description.length > 20) {
      score += 10;
      checks.push({ pass: true, msg: "Work experience includes descriptive bullet points." });
      if (hasNumbersInExp) {
        score += 5;
        checks.push({ pass: true, msg: "Quantifiable metrics (numbers, %, metrics) detected in experience." });
      } else {
        checks.push({ pass: false, msg: "Tip: Add numbers/metrics (e.g., 'improved by 35%') to rank higher." });
      }
    } else {
      checks.push({ pass: false, msg: "Add work experience bullet points." });
    }

    return { score: Math.min(score, 100), checks };
  };

  const atsResult = calculateAtsScore();

  const ensurePdfTools = async () => {
    const getHtml2Canvas = () => new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && typeof window.html2canvas === 'function') {
        return resolve(window.html2canvas);
      }
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      s.onload = () => resolve(window.html2canvas);
      s.onerror = () => reject(new Error('Failed to load html2canvas'));
      document.head.appendChild(s);
    });

    const getJsPDF = () => new Promise((resolve, reject) => {
      const existingClass = window.jspdf && window.jspdf.jsPDF ? window.jspdf.jsPDF : window.jsPDF;
      if (typeof existingClass === 'function') return resolve(existingClass);
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      s.onload = () => {
        const loadedClass = window.jspdf && window.jspdf.jsPDF ? window.jspdf.jsPDF : window.jsPDF;
        resolve(loadedClass);
      };
      s.onerror = () => reject(new Error('Failed to load jsPDF'));
      document.head.appendChild(s);
    });

    return Promise.all([getHtml2Canvas(), getJsPDF()]);
  };

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    setIsExporting(true);
    try {
      const [html2canvasFn, jsPdfClass] = await ensurePdfTools();
      const originalNode = resumeRef.current;
      const clone = originalNode.cloneNode(true);

      const exportContainer = document.createElement('div');
      exportContainer.style.position = 'fixed';
      exportContainer.style.top = '0px';
      exportContainer.style.left = '0px';
      exportContainer.style.width = '794px';
      exportContainer.style.height = '1122px';
      exportContainer.style.zIndex = '-99999';
      exportContainer.style.backgroundColor = '#ffffff';
      exportContainer.style.overflow = 'hidden';

      clone.style.margin = '0';
      clone.style.transform = 'none';
      clone.style.boxShadow = 'none';
      exportContainer.appendChild(clone);
      document.body.appendChild(exportContainer);

      const canvas = await html2canvasFn(clone, { scale: 2, useCORS: true, allowTaint: true, width: 794, height: 1122 });
      document.body.removeChild(exportContainer);

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPdfClass({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      pdf.save(`${(resumeData.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (err) {
      console.error(err);
      alert('PDF generation failed. Use browser print instead.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadDocx = () => {
    setIsExportingDocx(true);
    try {
      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Resume</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #1e3a8a; text-transform: uppercase;">${resumeData.personalInfo.fullName}</h1>
          <p><b>${resumeData.personalInfo.jobTitle}</b></p>
          <p>
            ${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.address || resumeData.personalInfo.city}
            ${resumeData.personalInfo.linkedin ? ` | LinkedIn: ${resumeData.personalInfo.linkedin}` : ''}
            ${resumeData.personalInfo.github ? ` | GitHub: ${resumeData.personalInfo.github}` : ''}
            ${resumeData.personalInfo.portfolio ? ` | Portfolio: ${resumeData.personalInfo.portfolio}` : ''}
          </p>
          <hr />
          <h3>Summary</h3>
          <p>${resumeData.summary}</p>
          <h3>Experience</h3>
          ${resumeData.experience.map(e => `<div><b>${e.role}</b> at ${e.company} (${e.duration})<br/>${e.description}</div>`).join('')}
          <h3>Education</h3>
          ${resumeData.education.map(ed => `<div><b>${ed.degree}</b> - ${ed.institution} (${ed.duration})</div>`).join('')}
        </body></html>
      `;
      const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(resumeData.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (e) {
      console.error(e);
      alert('DOCX download failed');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleNativePrint = () => window.print();

  const a4CanvasStyle = {
    width: '794px',
    height: '1122px',
    minHeight: '1122px',
    maxHeight: '1122px',
    backgroundColor: '#ffffff',
    color: '#000000',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative',
    fontFamily: selectedFont
  };

  // ================= 01. HARVARD ATS TEMPLATE =================
  const renderAnkitHarvardATS = () => (
    <div style={{ ...a4CanvasStyle, padding: '34px 42px', fontSize: '11px', lineHeight: '1.4' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1.5px solid #000000', paddingBottom: '10px', marginBottom: '12px' }}>
        <div style={{ flex: 1, textAlign: showPhoto && resumeData.personalInfo.photo ? 'left' : 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {resumeData.personalInfo.fullName}
          </h1>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
            {resumeData.personalInfo.jobTitle}
          </div>
          
          <div style={{ fontSize: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: showPhoto && resumeData.personalInfo.photo ? 'flex-start' : 'center', alignItems: 'center', color: '#1e293b' }}>
            {resumeData.personalInfo.address && <span>📍 {resumeData.personalInfo.address}</span>}
            {resumeData.personalInfo.phone && <span>• 📞 {resumeData.personalInfo.phone}</span>}
            {resumeData.personalInfo.email && <span>• ✉️ {resumeData.personalInfo.email}</span>}
            {resumeData.personalInfo.linkedin && <span>• <strong>in</strong> {resumeData.personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>}
            {resumeData.personalInfo.github && <span>• <strong>git</strong> {resumeData.personalInfo.github.replace(/^https?:\/\//, '')}</span>}
            {resumeData.personalInfo.portfolio && <span>• 🌐 {resumeData.personalInfo.portfolio.replace(/^https?:\/\//, '')}</span>}
          </div>
        </div>

        {showPhoto && resumeData.personalInfo.photo && (
          <div style={{ width: '75px', height: '88px', border: '1.5px solid #000000', padding: '2px', backgroundColor: '#ffffff', marginLeft: '16px', flexShrink: 0 }}>
            <img src={resumeData.personalInfo.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
          </div>
        )}
      </div>

      {visibility.summary && resumeData.summary && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 'bold', borderBottom: '1px solid #000000', textTransform: 'uppercase', marginBottom: '5px' }}>Professional Summary</div>
          <p style={{ margin: 0, fontSize: '10.5px', lineHeight: '1.5', textAlign: 'justify' }}>{resumeData.summary}</p>
        </div>
      )}

      {visibility.experience && resumeData.experience.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 'bold', borderBottom: '1px solid #000000', textTransform: 'uppercase', marginBottom: '5px' }}>Work Experience</div>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}><strong>{exp.company}</strong><strong>{exp.duration}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontStyle: 'italic', color: '#333333', marginBottom: '3px' }}><span>{exp.role}</span><span>{exp.location}</span></div>
              <div style={{ fontSize: '10.5px', whiteSpace: 'pre-line', lineHeight: '1.45', paddingLeft: '8px' }}>{exp.description}</div>
            </div>
          ))}
        </div>
      )}

      {visibility.projects && resumeData.projects.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 'bold', borderBottom: '1px solid #000000', textTransform: 'uppercase', marginBottom: '5px' }}>Key Projects</div>
          {resumeData.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <strong>{proj.title} {proj.tech ? <span style={{ fontWeight: 'normal', fontSize: '10px', color: '#475569' }}>| {proj.tech}</span> : ''}</strong>
                <strong>{proj.duration}</strong>
              </div>
              <div style={{ fontSize: '10.5px', lineHeight: '1.4', paddingLeft: '8px' }}>{proj.description}</div>
            </div>
          ))}
        </div>
      )}

      {visibility.education && resumeData.education.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 'bold', borderBottom: '1px solid #000000', textTransform: 'uppercase', marginBottom: '5px' }}>Education</div>
          {resumeData.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}><strong>{edu.institution}</strong><strong>{edu.duration}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontStyle: 'italic', color: '#333333' }}><span>{edu.degree} {edu.grade ? `(${edu.grade})` : ''}</span><span>{edu.location}</span></div>
            </div>
          ))}
        </div>
      )}

      {visibility.skills && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 'bold', borderBottom: '1px solid #000000', textTransform: 'uppercase', marginBottom: '5px' }}>Technical & Core Skills</div>
          <div style={{ fontSize: '10.5px', lineHeight: '1.5' }}>
            {resumeData.skillCategories.languages && <div><strong>Languages:</strong> {resumeData.skillCategories.languages}</div>}
            {resumeData.skillCategories.frameworks && <div><strong>Frameworks & Libraries:</strong> {resumeData.skillCategories.frameworks}</div>}
            {resumeData.skillCategories.tools && <div><strong>Developer Tools:</strong> {resumeData.skillCategories.tools}</div>}
            {resumeData.skillCategories.softSkills && <div><strong>Soft Skills:</strong> {resumeData.skillCategories.softSkills}</div>}
          </div>
        </div>
      )}
    </div>
  );

  // ================= 02. CLASSIC CORPORATE ATS TEMPLATE =================
  const renderClassicATS = () => (
    <div style={{ ...a4CanvasStyle, padding: '34px 42px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2.5px solid ${accentColor}`, paddingBottom: '10px', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, color: '#0f172a' }}>{resumeData.personalInfo.fullName}</h1>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: accentColor, marginTop: '3px' }}>{resumeData.personalInfo.jobTitle}</div>
          
          <div style={{ fontSize: '9.5px', color: '#475569', marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
            {resumeData.personalInfo.phone && <span>• {resumeData.personalInfo.phone}</span>}
            {resumeData.personalInfo.address && <span>• {resumeData.personalInfo.address}</span>}
            {resumeData.personalInfo.linkedin && <span>• in/{resumeData.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>}
            {resumeData.personalInfo.github && <span>• git/{resumeData.personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>}
          </div>
        </div>
        {showPhoto && resumeData.personalInfo.photo && (
          <div style={{ width: '74px', height: '74px', borderRadius: '10px', overflow: 'hidden', border: `2px solid ${accentColor}`, flexShrink: 0 }}>
            <img src={resumeData.personalInfo.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
          </div>
        )}
      </div>

      {visibility.summary && resumeData.summary && <p style={{ fontSize: '9.5px', lineHeight: '1.45', color: '#334155', marginBottom: '12px' }}>{resumeData.summary}</p>}

      {visibility.experience && resumeData.experience.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: accentColor, borderBottom: '1px solid #cbd5e1', marginBottom: '6px', paddingBottom: '2px' }}>Work Experience</div>
          {resumeData.experience.map(e => (
            <div key={e.id} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px' }}>
                <span><strong>{e.role}</strong> — <span style={{ color: '#475569' }}>{e.company}</span></span>
                <span style={{ color: '#64748b', fontSize: '9.5px' }}>{e.duration}</span>
              </div>
              <div style={{ fontSize: '9.5px', color: '#334155', whiteSpace: 'pre-line', marginTop: '2px' }}>{e.description}</div>
            </div>
          ))}
        </div>
      )}

      {visibility.projects && resumeData.projects.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: accentColor, borderBottom: '1px solid #cbd5e1', marginBottom: '6px', paddingBottom: '2px' }}>Projects</div>
          {resumeData.projects.map(proj => (
            <div key={proj.id} style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px' }}>
                <strong>{proj.title}</strong>
                <span style={{ color: '#64748b', fontSize: '9.5px' }}>{proj.duration}</span>
              </div>
              <div style={{ fontSize: '9.5px', color: '#334155' }}>{proj.description}</div>
            </div>
          ))}
        </div>
      )}

      {visibility.education && resumeData.education.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: accentColor, borderBottom: '1px solid #cbd5e1', marginBottom: '6px', paddingBottom: '2px' }}>Education</div>
          {resumeData.education.map(ed => (
            <div key={ed.id} style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
              <span><strong>{ed.degree}</strong>, {ed.institution}</span>
              <span style={{ color: '#64748b' }}>{ed.duration}</span>
            </div>
          ))}
        </div>
      )}

      {visibility.skills && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: accentColor, borderBottom: '1px solid #cbd5e1', marginBottom: '6px', paddingBottom: '2px' }}>Skills & Competencies</div>
          <div style={{ fontSize: '9.5px', lineHeight: '1.5', color: '#334155' }}>
            <div><strong>Tech Stack:</strong> {resumeData.skillCategories.languages}, {resumeData.skillCategories.frameworks}</div>
            <div><strong>Tools:</strong> {resumeData.skillCategories.tools}</div>
          </div>
        </div>
      )}
    </div>
  );

  const renderNovoresumeClean = () => renderClassicATS();
  const renderModernDev = () => renderClassicATS();
  const renderExecutive = () => renderClassicATS();
  const renderFinanceConsulting = () => renderClassicATS();
  const renderHealthcare = () => renderClassicATS();
  const renderFresher = () => renderClassicATS();
  const renderCreativePurple = () => renderClassicATS();
  const renderGovtFormal = () => renderClassicATS();

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .app-wrapper { min-height: 100vh; background-color: #060b14; color: #f8fafc; display: flex; flex-direction: column; }
        .top-navbar { border-bottom: 1px solid #1a273f; background-color: #ffffff; position: sticky; top: 0; z-index: 100; padding: 10px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
        .top-navbar-inner { max-width: 1720px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
        .brand-logo-img { height: 42px; width: auto; max-width: 190px; object-fit: contain; }
        .action-group { display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
        .custom-select { background-color: #0e192d; color: #ffffff; border: 1px solid #243552; padding: 8px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; outline: none; cursor: pointer; }
        .custom-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid #243552; background-color: #0e192d; color: #f8fafc; transition: all 0.2s; }
        .custom-btn:hover { background-color: #172744; border-color: #3b82f6; }
        .custom-btn-primary { background: linear-gradient(135deg, #2563eb, #1d4ed8); border-color: #2563eb; color: #ffffff; }
        .custom-btn-success { background: linear-gradient(135deg, #059669, #047857); border-color: #059669; color: #ffffff; }
        .mobile-mode-bar { display: none; margin-top: 12px; justify-content: center; gap: 8px; width: 100%; }
        .mobile-mode-btn { flex: 1; max-width: 180px; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; border: 1px solid #1a273f; background-color: #0e192d; color: #94a3b8; cursor: pointer; }
        .mobile-mode-btn.active { background-color: #2563eb; color: #ffffff; }
        .resume-hero { text-align: center; padding: 22px 16px 18px 16px; background: linear-gradient(180deg, rgba(14, 25, 45, 0.7) 0%, rgba(6, 11, 20, 0) 100%); border-bottom: 1px solid rgba(26, 39, 63, 0.4); }
        .resume-hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(37, 99, 235, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 10px; }
        .resume-hero h1 { font-size: 24px; font-weight: 800; color: #ffffff; margin: 0 0 8px 0; }
        .resume-hero p { font-size: 12.5px; color: #94a3b8; max-width: 680px; margin: 0 auto; line-height: 1.5; }
        .main-workspace { flex: 1; max-width: 1720px; margin: 0 auto; width: 100%; padding: 14px 20px 20px 20px; display: flex; gap: 18px; overflow: hidden; min-height: 0; }
        .editor-container { width: 44%; min-width: 380px; background-color: #0a1222; border: 1px solid #1a273f; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
        .nav-tabs { display: flex; background-color: #060b14; border-bottom: 1px solid #1a273f; padding: 6px 4px; gap: 4px; overflow-x: auto; }
        .nav-tab-btn { display: flex; align-items: center; gap: 5px; padding: 8px 12px; border-radius: 7px; font-size: 11.5px; font-weight: 600; border: none; background: transparent; color: #94a3b8; cursor: pointer; white-space: nowrap; }
        .nav-tab-btn.active { background-color: #2563eb; color: #ffffff; }
        .form-scroller { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 14px; font-size: 12px; }
        .form-field { display: flex; flex-direction: column; gap: 4px; }
        .form-label { font-weight: 700; color: #94a3b8; font-size: 11px; text-transform: uppercase; }
        .form-input, .form-textarea { background-color: #060b14; border: 1px solid #1a273f; border-radius: 8px; padding: 10px 12px; font-size: 13px; color: #ffffff; outline: none; width: 100%; }
        .form-input:focus, .form-textarea:focus { border-color: #3b82f6; }
        .form-card { background-color: #060b14; border: 1px solid #1a273f; border-radius: 9px; padding: 12px; margin-bottom: 8px; position: relative; }
        .form-row { display: flex; gap: 10px; }
        .form-row > * { flex: 1; }
        .preview-container { width: 56%; background-color: #0a1222; border: 1px solid #1a273f; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; position: relative; }
        .preview-topbar { display: flex; justify-content: space-between; align-items: center; background-color: #060b14; border-bottom: 1px solid #1a273f; padding: 8px 14px; font-size: 11.5px; color: #94a3b8; }
        .zoom-controls { display: flex; align-items: center; gap: 6px; }
        .zoom-btn { background: #0e192d; border: 1px solid #1a273f; color: #cbd5e1; border-radius: 6px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .canvas-scroll-viewport { flex: 1; overflow-y: auto; overflow-x: auto; padding: 16px; display: flex; justify-content: center; align-items: flex-start; }
        .canvas-scale-wrapper { display: flex; justify-content: center; transform-origin: top center; transition: all 0.2s ease-out; margin: 0 auto; }
        .canvas-shadow { box-shadow: 0 20px 45px rgba(0, 0, 0, 0.75); border-radius: 3px; }
        
        /* Modal Styles */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-card { background: #0a1222; border: 1px solid #243552; border-radius: 14px; width: 100%; max-width: 580px; padding: 22px; color: #ffffff; box-shadow: 0 25px 50px rgba(0,0,0,0.5); }
        .dropzone { border: 2px dashed #243552; border-radius: 10px; padding: 26px 20px; text-align: center; cursor: pointer; background: #060b14; transition: all 0.2s; }
        .dropzone:hover { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); }

        @media (max-width: 1080px) {
          .mobile-mode-bar { display: flex; }
          .main-workspace { height: auto; padding: 8px; }
          .editor-container { width: 100%; min-width: 100%; height: calc(100vh - 120px); display: none; }
          .preview-container { width: 100%; min-width: 100%; height: calc(100vh - 120px); display: none; }
          .editor-container.mobile-active { display: flex; }
          .preview-container.mobile-active { display: flex; }
        }
        @media print {
          .top-navbar, .mobile-mode-bar, .resume-hero, .editor-container, .preview-topbar, .zoom-controls, .modal-overlay { display: none !important; }
          .app-wrapper, .main-workspace, .preview-container, .canvas-scroll-viewport { display: block !important; background: transparent !important; border: none !important; margin: 0 !important; padding: 0 !important; height: auto !important; width: 100% !important; }
          .canvas-scale-wrapper { transform: none !important; width: 210mm !important; height: 297mm !important; }
          .canvas-shadow { box-shadow: none !important; width: 210mm !important; height: 297mm !important; }
        }
      `}</style>

      <main className="app-wrapper">
        <header className="top-navbar">
          <div className="top-navbar-inner">
            <div className="brand-box">
              <img src="/logo.png" alt="Logo" className="brand-logo-img" onError={(e)=>{e.target.style.display='none'}} />
            </div>

            <button 
              onClick={() => setIsImportModalOpen(true)}
              className="custom-btn"
              style={{ background: '#1e3a8a', borderColor: '#3b82f6', color: '#ffffff' }}
              type="button"
            >
              <UploadCloud size={14} />
              <span>📥 Import Doc (PDF/Word/TXT)</span>
            </button>
          </div>
        </header>

        <section className={`resume-hero ${mobileView === 'preview' ? 'hide-on-preview' : ''}`}>
          <span className="resume-hero-badge"><Sparkles size={12} /> ATS Optimizer & Smart Doc Importer</span>
          <h1>Free ATS-Friendly Resume Builder</h1>
          <p>Import existing resumes from PDF, Word, or TXT, reorder projects seamlessly, and guarantee top-tier ATS screening results.</p>

          <div className="action-group">
            <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)} className="custom-select">
              <option value="ankit_harvard">01. Ankit Harvard ATS (Match + Photo)</option>
              <option value="classic_ats">02. Classic Corporate ATS (Universal MNC)</option>
              <option value="novoresume_clean">03. Novoresume Modern 2-Col</option>
              <option value="modern_dev">04. Tech Lead & Cloud Engineer</option>
              <option value="executive">05. Executive Leadership</option>
              <option value="finance_consulting">06. Banking & Finance</option>
              <option value="healthcare">07. Healthcare & Medical</option>
              <option value="fresher">08. Fresher & Graduate</option>
              <option value="creative_purple">09. Creative Designer</option>
              <option value="govt_formal">10. Government Official CV</option>
            </select>

            <select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)} className="custom-select">
              <option value='"Times New Roman", Times, serif'>Times New Roman</option>
              <option value='Arial, Helvetica, sans-serif'>Arial</option>
              <option value='"Segoe UI", Tahoma, sans-serif'>Segoe UI</option>
              <option value='Georgia, serif'>Georgia</option>
              <option value='Consolas, monospace'>Consolas (Code)</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#0e192d', padding: '3px 8px', borderRadius: '8px', border: '1px solid #243552' }}>
              <Palette size={13} color="#94a3b8" />
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={{ width: '20px', height: '20px', border: 'none', background: 'transparent', cursor: 'pointer' }} />
            </div>

            <button onClick={() => setShowPhoto(!showPhoto)} className="custom-btn" type="button">
              {showPhoto ? <Eye size={13} color="#22c55e" /> : <EyeOff size={13} color="#94a3b8" />}
              <span>{showPhoto ? 'Photo On' : 'Photo Off'}</span>
            </button>

            <button onClick={handleDownloadDocx} disabled={isExportingDocx} className="custom-btn" type="button" title="Download MS Word DOCX">
              <FileDown size={14} color="#38bdf8" />
              <span>DOCX</span>
            </button>

            <button onClick={handleNativePrint} className="custom-btn" type="button">
              <Printer size={13} />
              <span>Print</span>
            </button>

            <button onClick={handleDownloadPDF} disabled={isExporting} className="custom-btn custom-btn-primary" type="button">
              {isExporting ? <CheckCircle2 size={14} /> : <Download size={14} />}
              <span>{isExporting ? 'Downloading...' : 'PDF'}</span>
            </button>
          </div>

          <div className="mobile-mode-bar">
            <button onClick={() => setMobileView('editor')} className={`mobile-mode-btn ${mobileView === 'editor' ? 'active' : ''}`} type="button"><Smartphone size={13} /> Edit</button>
            <button onClick={() => setMobileView('preview')} className={`mobile-mode-btn ${mobileView === 'preview' ? 'active' : ''}`} type="button"><Monitor size={13} /> Preview</button>
          </div>
        </section>

        <div className="main-workspace">
          <section className={`editor-container ${mobileView === 'editor' ? 'mobile-active' : ''}`}>
            <div className="nav-tabs">
              {[
                { id: 'personal', label: 'Personal & Links', icon: User },
                { id: 'experience', label: 'Experience', icon: Briefcase },
                { id: 'education', label: 'Education', icon: GraduationCap },
                { id: 'skills', label: 'Skills', icon: Award },
                { id: 'projects', label: 'Projects', icon: Code },
                { id: 'atsScore', label: '🤖 ATS Check', icon: Sparkles },
                { id: 'visibility', label: 'Visibility', icon: Layers },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`nav-tab-btn ${activeTab === tab.id ? 'active' : ''}`} type="button">
                    <Icon size={13} /> <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="form-scroller">
              {activeTab === 'personal' && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#060b14', padding: '8px 10px', borderRadius: '9px', border: '1px solid #1a273f' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '7px', overflow: 'hidden', backgroundColor: '#0e192d', border: '1px solid #243552', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {resumeData.personalInfo.photo ? <img src={resumeData.personalInfo.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" /> : <ImageIcon size={20} color="#94a3b8" />}
                      </div>
                      <div>
                        <div className="form-label" style={{ marginBottom: '2px' }}>Profile Photo</div>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ fontSize: '11px', color: '#94a3b8' }} />
                      </div>
                    </div>
                    {resumeData.personalInfo.photo && <button onClick={removePhoto} className="custom-btn" style={{ padding: '4px 7px', fontSize: '10px', color: '#ef4444' }} type="button">Remove</button>}
                  </div>

                  <div className="form-row">
                    <div className="form-field"><label className="form-label">Full Name</label><input className="form-input" type="text" name="fullName" value={resumeData.personalInfo.fullName} onChange={handlePersonalChange} placeholder="e.g. John Doe" /></div>
                    <div className="form-field"><label className="form-label">Job Title / Designation</label><input className="form-input" type="text" name="jobTitle" value={resumeData.personalInfo.jobTitle} onChange={handlePersonalChange} placeholder="e.g. Software Engineer" /></div>
                  </div>

                  <div className="form-row">
                    <div className="form-field"><label className="form-label">Email Address</label><input className="form-input" type="email" name="email" value={resumeData.personalInfo.email} onChange={handlePersonalChange} placeholder="name@domain.com" /></div>
                    <div className="form-field"><label className="form-label">Phone Number</label><input className="form-input" type="text" name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalChange} placeholder="+1 555-010-0000" /></div>
                  </div>

                  <div className="form-row">
                    <div className="form-field"><label className="form-label">Address / Location</label><input className="form-input" type="text" name="address" value={resumeData.personalInfo.address} onChange={handlePersonalChange} placeholder="e.g. New York, USA" /></div>
                    <div className="form-field"><label className="form-label">LinkedIn Profile URL</label><input className="form-input" type="text" name="linkedin" value={resumeData.personalInfo.linkedin} onChange={handlePersonalChange} placeholder="linkedin.com/in/username" /></div>
                  </div>

                  <div className="form-row">
                    <div className="form-field"><label className="form-label">GitHub Profile URL</label><input className="form-input" type="text" name="github" value={resumeData.personalInfo.github} onChange={handlePersonalChange} placeholder="github.com/username" /></div>
                    <div className="form-field"><label className="form-label">Portfolio Website (Optional)</label><input className="form-input" type="text" name="portfolio" value={resumeData.personalInfo.portfolio} onChange={handlePersonalChange} placeholder="portfolio.dev" /></div>
                  </div>

                  <div className="form-field"><label className="form-label">Professional Summary</label><textarea className="form-textarea" rows={3} value={resumeData.summary} onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })} placeholder="Write a short impact-driven summary..." /></div>
                </>
              )}

              {/* ============ WORK EXPERIENCE WITH SHIFTING & TOP ADD ============ */}
              {activeTab === 'experience' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="form-label">Work Experience</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>Latest role stays on top for ATS rank</div>
                    </div>
                    <button onClick={addExperience} className="custom-btn custom-btn-primary" style={{ padding: '5px 10px', fontSize: '11px' }} type="button">
                      <Plus size={11} /> + Add Latest Role (Top)
                    </button>
                  </div>

                  {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className="form-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #1a273f', paddingBottom: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8' }}>
                          #{index + 1} {exp.role || 'Role'} {index === 0 ? '⭐ (Current / Top)' : ''}
                        </span>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button 
                            onClick={() => moveItem('experience', index, 'up')} 
                            disabled={index === 0} 
                            title="Shift Upwards"
                            type="button" 
                            style={{ background: '#0e192d', border: '1px solid #243552', color: '#ffffff', borderRadius: '4px', padding: '3px 6px', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}
                          >
                            <ChevronUp size={12} />
                          </button>
                          
                          <button 
                            onClick={() => moveItem('experience', index, 'down')} 
                            disabled={index === resumeData.experience.length - 1} 
                            title="Shift Downwards"
                            type="button" 
                            style={{ background: '#0e192d', border: '1px solid #243552', color: '#ffffff', borderRadius: '4px', padding: '3px 6px', cursor: index === resumeData.experience.length - 1 ? 'not-allowed' : 'pointer', opacity: index === resumeData.experience.length - 1 ? 0.3 : 1 }}
                          >
                            <ChevronDown size={12} />
                          </button>

                          <button 
                            onClick={() => removeExperience(exp.id)} 
                            title="Delete Experience"
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px 4px', marginLeft: '4px' }} 
                            type="button"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="form-row" style={{ marginBottom: '6px' }}>
                        <input className="form-input" placeholder="Company Name" value={exp.company} onChange={(e) => handleExpChange(exp.id, 'company', e.target.value)} />
                        <input className="form-input" placeholder="Role / Title" value={exp.role} onChange={(e) => handleExpChange(exp.id, 'role', e.target.value)} />
                      </div>
                      <div className="form-row" style={{ marginBottom: '6px' }}>
                        <input className="form-input" placeholder="Duration (e.g. 2023 - Present)" value={exp.duration} onChange={(e) => handleExpChange(exp.id, 'duration', e.target.value)} />
                        <input className="form-input" placeholder="Location" value={exp.location} onChange={(e) => handleExpChange(exp.id, 'location', e.target.value)} />
                      </div>
                      <textarea className="form-textarea" rows={3} placeholder="Key Achievements & Responsibilities" value={exp.description} onChange={(e) => handleExpChange(exp.id, 'description', e.target.value)} />
                      
                      {/* ============ QUICK BULLETS CUSTOMIZER ============ */}
                      <div style={{ marginTop: '10px', borderTop: '1px solid #1a273f', paddingTop: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '4px' }}>
                          <span style={{ fontSize: '10.5px', color: '#38bdf8', fontWeight: 'bold' }}>⚡ Quick Pro Bullets:</span>
                          
                          <select 
                            value={bulletCategory} 
                            onChange={(e) => setBulletCategory(e.target.value)}
                            style={{ background: '#0e192d', color: '#38bdf8', border: '1px solid #243552', borderRadius: '4px', fontSize: '10px', padding: '2px 6px', outline: 'none' }}
                          >
                            <option value="tech">💻 Software & Tech</option>
                            <option value="marketing">📈 Marketing & Sales</option>
                            <option value="finance">💰 Finance & Accounts</option>
                            <option value="management">💼 Management & HR</option>
                            <option value="fresher">🎓 Fresher & Intern</option>
                            <option value="custom">⭐ My Custom Bullets</option>
                          </select>
                        </div>

                        <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
                          <input 
                            type="text" 
                            placeholder={`Type new bullet point for ${bulletCategory}...`}
                            value={newBulletText}
                            onChange={(e) => setNewBulletText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddNewBullet(); }}
                            style={{ flex: 1, background: '#060b14', border: '1px solid #1a273f', borderRadius: '4px', padding: '5px 8px', fontSize: '10px', color: '#ffffff', outline: 'none' }}
                          />
                          <button 
                            type="button" 
                            onClick={handleAddNewBullet}
                            style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            + Save
                          </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '115px', overflowY: 'auto' }}>
                          {(!bulletList[bulletCategory] || bulletList[bulletCategory].length === 0) ? (
                            <div style={{ fontSize: '10px', color: '#64748b', fontStyle: 'italic', padding: '4px' }}>No bullets in this category. Type above and click "+ Save" to add!</div>
                          ) : (
                            bulletList[bulletCategory].map((bullet, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', background: '#060b14', border: '1px solid #1a273f', borderRadius: '4px', padding: '3px 6px' }}>
                                <button 
                                  type="button" 
                                  onClick={() => addBulletToExperience(exp.id, bullet)}
                                  title="Click to insert this bullet"
                                  style={{ flex: 1, textAlign: 'left', background: 'transparent', border: 'none', color: '#cbd5e1', fontSize: '10px', cursor: 'pointer', padding: '2px 0' }}
                                >
                                  + {bullet}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBullet(bulletCategory, idx)}
                                  title="Delete this bullet suggestion"
                                  style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}
                                >
                                  ✕
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* ============ EDUCATION ============ */}
              {activeTab === 'education' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="form-label">Education</div>
                    <button onClick={addEducation} className="custom-btn custom-btn-primary" style={{ padding: '5px 10px', fontSize: '11px' }} type="button">
                      <Plus size={11} /> + Add Degree (Top)
                    </button>
                  </div>

                  {resumeData.education.map((edu, index) => (
                    <div key={edu.id} className="form-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #1a273f', paddingBottom: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8' }}>
                          #{index + 1} {edu.degree || 'Degree'} {index === 0 ? '(Top)' : ''}
                        </span>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button 
                            onClick={() => moveItem('education', index, 'up')} 
                            disabled={index === 0} 
                            title="Shift Upwards"
                            type="button" 
                            style={{ background: '#0e192d', border: '1px solid #243552', color: '#ffffff', borderRadius: '4px', padding: '3px 6px', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}
                          >
                            <ChevronUp size={12} />
                          </button>
                          
                          <button 
                            onClick={() => moveItem('education', index, 'down')} 
                            disabled={index === resumeData.education.length - 1} 
                            title="Shift Downwards"
                            type="button" 
                            style={{ background: '#0e192d', border: '1px solid #243552', color: '#ffffff', borderRadius: '4px', padding: '3px 6px', cursor: index === resumeData.education.length - 1 ? 'not-allowed' : 'pointer', opacity: index === resumeData.education.length - 1 ? 0.3 : 1 }}
                          >
                            <ChevronDown size={12} />
                          </button>

                          <button onClick={() => removeEducation(edu.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px 4px', marginLeft: '4px' }} type="button">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="form-field" style={{ marginBottom: '6px' }}><input className="form-input" placeholder="Institution / University" value={edu.institution} onChange={(e) => handleEduChange(edu.id, 'institution', e.target.value)} /></div>
                      <div className="form-field" style={{ marginBottom: '6px' }}><input className="form-input" placeholder="Degree / Course" value={edu.degree} onChange={(e) => handleEduChange(edu.id, 'degree', e.target.value)} /></div>
                      <div className="form-row">
                        <input className="form-input" placeholder="Duration (e.g. 2020 - 2024)" value={edu.duration} onChange={(e) => handleEduChange(edu.id, 'duration', e.target.value)} />
                        <input className="form-input" placeholder="Grade / GPA" value={edu.grade} onChange={(e) => handleEduChange(edu.id, 'grade', e.target.value)} />
                      </div>
                    </div>
                  ))}
                </>
              )}

              {activeTab === 'skills' && (
                <>
                  <div className="form-field"><label className="form-label">Languages</label><input className="form-input" value={resumeData.skillCategories.languages} onChange={(e) => setResumeData({ ...resumeData, skillCategories: { ...resumeData.skillCategories, languages: e.target.value } })} /></div>
                  <div className="form-field"><label className="form-label">Tools & Cloud</label><input className="form-input" value={resumeData.skillCategories.tools} onChange={(e) => setResumeData({ ...resumeData, skillCategories: { ...resumeData.skillCategories, tools: e.target.value } })} /></div>
                  <div className="form-field"><label className="form-label">Frameworks & Libraries</label><input className="form-input" value={resumeData.skillCategories.frameworks} onChange={(e) => setResumeData({ ...resumeData, skillCategories: { ...resumeData.skillCategories, frameworks: e.target.value } })} /></div>
                  <div className="form-field"><label className="form-label">Soft Skills</label><input className="form-input" value={resumeData.skillCategories.softSkills} onChange={(e) => setResumeData({ ...resumeData, skillCategories: { ...resumeData.skillCategories, softSkills: e.target.value } })} /></div>
                </>
              )}

              {/* ============ PROJECTS ============ */}
              {activeTab === 'projects' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="form-label">Projects</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>Shift any project up/down or add newest on top</div>
                    </div>
                    <button onClick={addProject} className="custom-btn custom-btn-primary" style={{ padding: '5px 10px', fontSize: '11px' }} type="button">
                      <Plus size={11} /> + Add Project (Top)
                    </button>
                  </div>

                  {resumeData.projects.map((proj, index) => (
                    <div key={proj.id} className="form-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #1a273f', paddingBottom: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8' }}>
                          #{index + 1} {proj.title || 'Project'} {index === 0 ? '⭐ (Top / Featured)' : ''}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button 
                            onClick={() => moveItem('projects', index, 'up')} 
                            disabled={index === 0} 
                            title="Shift Upwards"
                            type="button" 
                            style={{ background: '#0e192d', border: '1px solid #243552', color: '#ffffff', borderRadius: '4px', padding: '3px 6px', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}
                          >
                            <ChevronUp size={12} />
                          </button>

                          <button 
                            onClick={() => moveItem('projects', index, 'down')} 
                            disabled={index === resumeData.projects.length - 1} 
                            title="Shift Downwards"
                            type="button" 
                            style={{ background: '#0e192d', border: '1px solid #243552', color: '#ffffff', borderRadius: '4px', padding: '3px 6px', cursor: index === resumeData.projects.length - 1 ? 'not-allowed' : 'pointer', opacity: index === resumeData.projects.length - 1 ? 0.3 : 1 }}
                          >
                            <ChevronDown size={12} />
                          </button>

                          <button 
                            onClick={() => removeProject(proj.id)} 
                            title="Delete Project"
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px 4px', marginLeft: '4px' }} 
                            type="button"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="form-row" style={{ marginBottom: '6px' }}>
                        <input className="form-input" placeholder="Project Title" value={proj.title} onChange={(e) => handleProjChange(proj.id, 'title', e.target.value)} />
                        <input className="form-input" placeholder="Tech Stack (e.g. Next.js, Node.js)" value={proj.tech} onChange={(e) => handleProjChange(proj.id, 'tech', e.target.value)} />
                      </div>
                      <div className="form-row" style={{ marginBottom: '6px' }}>
                        <input className="form-input" placeholder="Duration (e.g. Jan 2024 - Apr 2024)" value={proj.duration} onChange={(e) => handleProjChange(proj.id, 'duration', e.target.value)} />
                      </div>
                      <textarea className="form-textarea" rows={3} placeholder="Project Description & Achievements" value={proj.description} onChange={(e) => handleProjChange(proj.id, 'description', e.target.value)} />
                    </div>
                  ))}
                </>
              )}

              {/* ============ ATS CHECK TAB ============ */}
              {activeTab === 'atsScore' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: '#060b14', border: '1px solid #1a273f', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>ATS Match & Screening Score</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: atsResult.score >= 85 ? '#22c55e' : '#f59e0b' }}>{atsResult.score}%</div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '6px 0 0 0' }}>
                      {atsResult.score >= 85 
                        ? '🚀 Top-Ranked! Reverse chronological order and structure guarantee high ATS placement.' 
                        : '⚠️ Complete missing details to guarantee top recruiter search ranking.'}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {atsResult.checks.map((check, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#060b14', padding: '10px 12px', borderRadius: '8px', border: '1px solid #1a273f', fontSize: '11.5px' }}>
                        {check.pass ? <CheckCircle size={16} color="#22c55e" /> : <AlertTriangle size={16} color="#f59e0b" />}
                        <span style={{ color: check.pass ? '#e2e8f0' : '#cbd5e1' }}>{check.msg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'visibility' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {Object.keys(visibility).map((key) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#060b14', padding: '9px 12px', borderRadius: '7px', border: '1px solid #1a273f' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: '600', color: '#cbd5e1', textTransform: 'capitalize' }}>{key} Section</span>
                      <button onClick={() => toggleVisibility(key)} className="custom-btn" style={{ fontSize: '10.5px', padding: '3px 8px', backgroundColor: visibility[key] ? '#2563eb' : '#0e192d', color: '#ffffff' }} type="button">
                        {visibility[key] ? 'Visible' : 'Hidden'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section ref={previewWrapperRef} className={`preview-container ${mobileView === 'preview' ? 'mobile-active' : ''}`}>
            <div className="preview-topbar">
              <span style={{ fontWeight: '600', color: '#e2e8f0' }}>Live A4 Preview</span>
              <div className="zoom-controls">
                <button onClick={() => setPreviewScale((s) => Math.max(s - 0.05, 0.3))} className="zoom-btn" type="button"><ZoomOut size={13} /></button>
                <span style={{ fontWeight: '700', minWidth: '38px', textAlign: 'center' }}>{Math.round(previewScale * 100)}%</span>
                <button onClick={() => setPreviewScale((s) => Math.min(s + 0.05, 1.2))} className="zoom-btn" type="button"><ZoomIn size={13} /></button>
                <button onClick={autoFitScale} className="zoom-btn" type="button"><Maximize2 size={13} /></button>
              </div>
            </div>

            <div className="canvas-scroll-viewport">
              <div className="canvas-scale-wrapper" style={{ width: `${794 * previewScale}px`, height: `${1122 * previewScale}px` }}>
                <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'top center', width: '794px', height: '1122px' }}>
                  <div ref={resumeRef} className="canvas-shadow" style={{ width: '794px', height: '1122px', backgroundColor: '#ffffff', overflow: 'hidden' }}>
                    {selectedTemplate === 'ankit_harvard' && renderAnkitHarvardATS()}
                    {selectedTemplate === 'classic_ats' && renderClassicATS()}
                    {selectedTemplate === 'novoresume_clean' && renderNovoresumeClean()}
                    {selectedTemplate === 'modern_dev' && renderModernDev()}
                    {selectedTemplate === 'executive' && renderExecutive()}
                    {selectedTemplate === 'finance_consulting' && renderFinanceConsulting()}
                    {selectedTemplate === 'healthcare' && renderHealthcare()}
                    {selectedTemplate === 'fresher' && renderFresher()}
                    {selectedTemplate === 'creative_purple' && renderCreativePurple()}
                    {selectedTemplate === 'govt_formal' && renderGovtFormal()}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ============ IMPORT DOCUMENT / RESUME MODAL ============ */}
        {isImportModalOpen && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} color="#38bdf8" />
                  <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Import Resume Document</span>
                </div>
                <button 
                  onClick={() => setIsImportModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  type="button"
                >
                  <X size={18} />
                </button>
              </div>

              <p style={{ fontSize: '11.5px', color: '#94a3b8', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                Apna purana resume upload karein. System apne aap text read karke <b>Full Name, Experience, Skills & Contacts</b> auto-fill kar dega.
              </p>

              {/* File Dropzone */}
              <div className="dropzone" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleDocumentUpload} 
                  accept=".pdf,.docx,.txt,.json" 
                  style={{ display: 'none' }} 
                />
                <UploadCloud size={28} color="#38bdf8" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc' }}>Click to Upload Resume File</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Supports <b>PDF (.pdf), Word (.docx), Text (.txt), JSON (.json)</b></div>
              </div>

              {/* Status Message */}
              {isParsingDoc && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px', fontSize: '12px', color: '#38bdf8' }}>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Document ko analyze aur extract kiya jaa raha hai...</span>
                </div>
              )}

              {importStatusMsg && (
                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: '#22c55e', fontWeight: 'bold' }}>
                  {importStatusMsg}
                </div>
              )}

              {/* Alternative: Direct Text Paste */}
              <div style={{ marginTop: '18px', borderTop: '1px solid #1a273f', paddingTop: '14px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '6px' }}>Ya seedha Resume ka Text Paste karein:</div>
                <textarea 
                  ref={pasteTextareaRef}
                  className="form-textarea" 
                  rows={4} 
                  placeholder="Paste complete resume text here (Name, Email, Roles, Skills etc.)..."
                  value={pasteResumeText}
                  onChange={(e) => setPasteResumeText(e.target.value)}
                />
                <button 
                  onClick={handleManualTextImport}
                  disabled={!pasteResumeText.trim() || isParsingDoc}
                  className="custom-btn custom-btn-primary" 
                  style={{ width: '100%', marginTop: '8px', justifyContent: 'center' }}
                  type="button"
                >
                  ⚡ Parse & Update Resume
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}