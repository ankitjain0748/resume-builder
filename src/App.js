'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Briefcase, GraduationCap, Award, Code, 
  Download, CheckCircle2, Trash2, Plus, Image as ImageIcon, 
  Palette, Eye, EyeOff, Layers, Mail, Phone, MapPin, ZoomIn, ZoomOut, Smartphone, Monitor, Printer, Maximize2, Sparkles, FileText, FileDown
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

// 100% Reliable Base64 Avatar
const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI2UyZThmMCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzgiIHI9IjE4IiBmaWxsPSIjNjQ3NDhiIi8+PHBhdGggZD0iTTIwIDg2Yz0tMTYuNSAxMy.1LTMwIDMwLTMwczMwIDEzLjUgMzAgMzB6IiBmaWxsPSIjNjQ3NDhiIi8+PC9zdmc+";

// Pre-built Bullet Points Bank (Free AI Alternative)
const SUGGESTED_BULLETS = [
  "Developed responsive web applications using React.js, Node.js, Express.js, and MongoDB.",
  "Implemented secure JWT authentication and optimized RESTful APIs for improved security and performance.",
  "Improved application page load speed by 35% through code splitting and efficient database indexing.",
  "Collaborated with UI/UX designers and backend engineers in an Agile environment to deliver scalable digital products.",
  "Wrote unit and integration tests using Jest and React Testing Library, reducing bug reports by 40%.",
  "Integrated third-party payment gateways (Stripe, PayPal) and real-time socket communication features."
];

export default function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState('personal');
  const [selectedTemplate, setSelectedTemplate] = useState('ankit_harvard'); 
  const [accentColor, setAccentColor] = useState('#1e3a8a'); 
  const [showPhoto, setShowPhoto] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [mobileView, setMobileView] = useState('editor'); 
  const [previewScale, setPreviewScale] = useState(0.85);

  const resumeRef = useRef(null);
  const previewWrapperRef = useRef(null);

  // Section Visibility Toggles
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

  // Master State with LocalStorage Initialization
  const [resumeData, setResumeData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pro_resume_builder_data');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error loading saved resume data", e);
        }
      }
    }
    return {
      personalInfo: {
        fullName: "Alex Morgan",
        jobTitle: "Full Stack Web Developer",
        email: "alex.morgan@example.com",
        phone: "+1 555-010-2048",
        address: "123 Demo Street, Sample City",
        city: "Sample City",
        country: "United States",
        linkedin: "linkedin.com/in/alex-morgan",
        github: "github.com/alexmorgan",
        portfolio: "alexmorgan.example.com",
        licenseNo: "DEMO-123456",
        declaration: "I hereby declare that the information provided above is true and accurate to the best of my knowledge.",
        photo: DEFAULT_AVATAR,
      },
      summary: "Motivated Full Stack Developer with experience building responsive web applications, developing REST APIs, integrating third-party services, and optimizing application performance.",
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
          location: "Sample City",
          duration: "Aug 2020 – May 2024",
          grade: "8.5 CGPA",
        }
      ],
      experience: [
        {
          id: "exp-1",
          role: "Full Stack Developer",
          company: "Tech Solutions Inc.",
          location: "Sample City",
          duration: "Jan 2023 – Present",
          description: "Developed responsive web applications using React.js, Node.js, Express.js, and MongoDB.\nImplemented secure authentication and REST APIs for web applications.",
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
          description: "Developed a responsive e-commerce platform with product listings, search, and checkout.",
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

  // Save to LocalStorage automatically whenever resumeData changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pro_resume_builder_data', JSON.stringify(resumeData));
    }
  }, [resumeData]);

  // Calculate live preview fit scale
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

  // Form Handlers
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
      if (file.size > 3 * 1024 * 1024) {
        alert('File size must be under 3MB');
        return;
      }
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

  const handleExpChange = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addBulletToExperience = (id, bulletText) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map(item => {
        if (item.id === id) {
          const newDesc = item.description ? `${item.description}\n${bulletText}` : bulletText;
          return { ...item, description: newDesc };
        }
        return item;
      })
    }));
  };

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, { id: `exp-${Date.now()}`, role: '', company: '', location: '', duration: '', description: '' }]
    }));
  };

  const removeExperience = (id) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter(item => item.id !== id)
    }));
  };

  const handleEduChange = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, { id: `edu-${Date.now()}`, degree: '', institution: '', location: '', duration: '', grade: '' }]
    }));
  };

  const removeEducation = (id) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter(item => item.id !== id)
    }));
  };

  const handleProjChange = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, { id: `proj-${Date.now()}`, title: '', tech: '', duration: '', description: '' }]
    }));
  };

  const removeProject = (id) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter(item => item.id !== id)
    }));
  };

  // Safe Loader for html2canvas & jsPDF
  const ensurePdfTools = async () => {
    const getHtml2Canvas = () => {
      return new Promise((resolve, reject) => {
        if (typeof window !== 'undefined' && typeof window.html2canvas === 'function') {
          return resolve(window.html2canvas);
        }
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        s.onload = () => resolve(window.html2canvas);
        s.onerror = () => reject(new Error('Failed to load html2canvas'));
        document.head.appendChild(s);
      });
    };

    const getJsPDF = () => {
      return new Promise((resolve, reject) => {
        const existingClass = window.jspdf?.jsPDF || window.jsPDF;
        if (typeof existingClass === 'function') {
          return resolve(existingClass);
        }
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        s.onload = () => {
          const loadedClass = window.jspdf?.jsPDF || window.jsPDF;
          resolve(loadedClass);
        };
        s.onerror = () => reject(new Error('Failed to load jsPDF'));
        document.head.appendChild(s);
      });
    };

    const [html2canvasFn, jsPdfClass] = await Promise.all([getHtml2Canvas(), getJsPDF()]);
    return { html2canvasFn, jsPdfClass };
  };

  // Direct PDF Download
  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    setIsExporting(true);

    try {
      const { html2canvasFn, jsPdfClass } = await ensurePdfTools();
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
      exportContainer.style.transform = 'none';

      clone.style.margin = '0';
      clone.style.transform = 'none';
      clone.style.boxShadow = 'none';
      exportContainer.appendChild(clone);
      document.body.appendChild(exportContainer);

      const canvas = await html2canvasFn(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 794,
        height: 1122,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        windowHeight: 1122
      });

      document.body.removeChild(exportContainer);

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPdfClass({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      const safeName = (resumeData.personalInfo.fullName || 'Resume').replace(/\s+/g, '_');
      const fileName = `${safeName}_Resume.pdf`;

      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = blobUrl;
      downloadAnchor.download = fileName;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('PDF generation me issue aaya. Direct browser print button use karein.');
    } finally {
      setIsExporting(false);
    }
  };

  // Direct DOCX Download Feature
  const handleDownloadDocx = () => {
    setIsExportingDocx(true);
    try {
      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>${resumeData.personalInfo.fullName} Resume</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #1e3a8a; text-transform: uppercase; margin-bottom: 0;">${resumeData.personalInfo.fullName}</h1>
          <p style="font-size: 14px; font-weight: bold; color: #555;">${resumeData.personalInfo.jobTitle}</p>
          <p style="font-size: 11px; color: #666;">${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.city}</p>
          <hr style="border: 1px solid #1e3a8a;" />
          
          <h3>Professional Summary</h3>
          <p>${resumeData.summary}</p>
          
          <h3>Work Experience</h3>
          ${resumeData.experience.map(exp => `
            <div>
              <strong>${exp.role}</strong> at <em>${exp.company}</em> (${exp.duration})<br/>
              <p style="white-space: pre-line;">${exp.description}</p>
            </div>
          `).join('')}

          <h3>Education</h3>
          ${resumeData.education.map(edu => `
            <div>
              <strong>${edu.degree}</strong> - ${edu.institution} (${edu.duration})<br/>
              <span>Grade: ${edu.grade}</span>
            </div>
          `).join('')}

          <h3>Technical Skills</h3>
          <p><strong>Languages:</strong> ${resumeData.skillCategories.languages}</p>
          <p><strong>Frameworks:</strong> ${resumeData.skillCategories.frameworks}</p>
          <p><strong>Tools:</strong> ${resumeData.skillCategories.tools}</p>
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff' + htmlContent], {
        type: 'application/msword'
      });
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

  const handleNativePrint = () => {
    window.print();
  };

  const getSkillsList = () => {
    return [
      ...resumeData.skillCategories.languages.split(','),
      ...resumeData.skillCategories.frameworks.split(','),
      ...resumeData.skillCategories.tools.split(',')
    ].map(s => s.trim()).filter(Boolean);
  };

  // Base A4 Locked Dimensions
  const a4CanvasStyle = {
    width: '794px',
    height: '1122px',
    minHeight: '1122px',
    maxHeight: '1122px',
    backgroundColor: '#ffffff',
    color: '#000000',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative'
  };

  // =========================================================================
  // 10 INDUSTRY TEMPLATES
  // =========================================================================

  const renderAnkitHarvardATS = () => (
    <div style={{ ...a4CanvasStyle, padding: '32px 42px', fontFamily: '"Times New Roman", Times, Georgia, serif', fontSize: '11px', lineHeight: '1.35', color: '#000000' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #000000', paddingBottom: '10px', marginBottom: '10px' }}>
        <div style={{ flex: 1, textAlign: showPhoto && resumeData.personalInfo.photo ? 'left' : 'center' }}>
          <h1 style={{ fontSize: '23px', fontWeight: 'bold', margin: '0 0 2px 0', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            {resumeData.personalInfo.fullName}
          </h1>
          <div style={{ fontSize: '11px', color: '#222222', marginBottom: '4px' }}>
            {resumeData.personalInfo.address}
          </div>
          <div style={{ display: 'flex', justifyContent: showPhoto && resumeData.personalInfo.photo ? 'flex-start' : 'center', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '10px', color: '#111111' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Phone size={11} /> {resumeData.personalInfo.phone}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Mail size={11} /> {resumeData.personalInfo.email}</span>
            {resumeData.personalInfo.linkedin && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><FaLinkedin size={11} /> {resumeData.personalInfo.linkedin}</span>}
            {resumeData.personalInfo.github && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><FaGithub size={11} /> {resumeData.personalInfo.github}</span>}
          </div>
        </div>
        {showPhoto && resumeData.personalInfo.photo && (
          <div style={{ width: '70px', height: '82px', border: '1.5px solid #000000', padding: '2px', backgroundColor: '#ffffff', marginLeft: '16px', flexShrink: 0 }}>
            <img src={resumeData.personalInfo.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
          </div>
        )}
      </div>

      {visibility.education && resumeData.education.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', borderBottom: '1px solid #000000', paddingBottom: '1px', marginBottom: '4px' }}>Education</div>
          {resumeData.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <strong>{edu.institution}</strong>
                <strong>{edu.duration}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontStyle: 'italic', color: '#333333' }}>
                <span>{edu.degree}</span>
                <span>{edu.location}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {visibility.experience && resumeData.experience.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', borderBottom: '1px solid #000000', paddingBottom: '1px', marginBottom: '4px' }}>Experience</div>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <strong>{exp.company}</strong>
                <strong>{exp.duration}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontStyle: 'italic', color: '#333333', marginBottom: '2px' }}>
                <span>{exp.role}</span>
                <span>{exp.location}</span>
              </div>
              <div style={{ fontSize: '10px', whiteSpace: 'pre-line', lineHeight: '1.4', paddingLeft: '8px' }}>{exp.description}</div>
            </div>
          ))}
        </div>
      )}

      {visibility.skills && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', borderBottom: '1px solid #000000', paddingBottom: '1px', marginBottom: '4px' }}>Technical Skills</div>
          <div style={{ fontSize: '10.5px', lineHeight: '1.5' }}>
            <div><strong>Languages:</strong> {resumeData.skillCategories.languages}</div>
            <div><strong>Developer Tools:</strong> {resumeData.skillCategories.tools}</div>
            <div><strong>Technologies/Frameworks:</strong> {resumeData.skillCategories.frameworks}</div>
            <div><strong>Others:</strong> {resumeData.skillCategories.softSkills}</div>
          </div>
        </div>
      )}

      {visibility.projects && resumeData.projects.length > 0 && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', borderBottom: '1px solid #000000', paddingBottom: '1px', marginBottom: '4px' }}>Projects</div>
          {resumeData.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span><strong>{proj.title}</strong> | <em>{proj.tech}</em></span>
                <strong>{proj.duration}</strong>
              </div>
              <div style={{ fontSize: '10px', whiteSpace: 'pre-line', lineHeight: '1.38', marginTop: '1px', paddingLeft: '8px' }}>{proj.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderClassicATS = () => (
    <div style={{ ...a4CanvasStyle, padding: '34px 42px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2.5px solid ${accentColor}`, paddingBottom: '10px', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, color: '#0f172a' }}>{resumeData.personalInfo.fullName}</h1>
          <div style={{ fontSize: '11.5px', fontWeight: 'bold', color: accentColor, marginTop: '3px' }}>{resumeData.personalInfo.jobTitle}</div>
          <div style={{ fontSize: '9.5px', color: '#475569', marginTop: '5px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span>{resumeData.personalInfo.email}</span> • <span>{resumeData.personalInfo.phone}</span> • <span>{resumeData.personalInfo.city}</span>
          </div>
        </div>
        {showPhoto && resumeData.personalInfo.photo && (
          <div style={{ width: '74px', height: '74px', borderRadius: '10px', overflow: 'hidden', border: `2px solid ${accentColor}`, flexShrink: 0 }}>
            <img src={resumeData.personalInfo.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
          </div>
        )}
      </div>
      {visibility.summary && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: accentColor, borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', marginBottom: '4px' }}>Professional Summary</div>
          <p style={{ fontSize: '9.5px', lineHeight: '1.45', margin: 0, color: '#334155' }}>{resumeData.summary}</p>
        </div>
      )}
      {visibility.skills && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: accentColor, borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', marginBottom: '4px' }}>Core Competencies</div>
          <div style={{ fontSize: '9.5px', color: '#334155', lineHeight: '1.5' }}>{getSkillsList().join('  •  ')}</div>
        </div>
      )}
      {visibility.experience && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: accentColor, borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', marginBottom: '6px' }}>Work Experience</div>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontWeight: 'bold' }}>
                <span>{exp.role} — <span style={{ color: '#475569', fontWeight: 'normal' }}>{exp.company}</span></span>
                <span style={{ fontSize: '9.5px', color: '#64748b' }}>{exp.duration}</span>
              </div>
              <div style={{ fontSize: '9.5px', color: '#334155', whiteSpace: 'pre-line', lineHeight: '1.4', marginTop: '2px' }}>{exp.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderNovoresumeClean = () => (
    <div style={{ ...a4CanvasStyle, padding: '32px 36px', fontFamily: '"Segoe UI", Tahoma, sans-serif' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 180px', gap: '15px', alignItems: 'center', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '14px', marginBottom: '14px' }}>
        <div>
          <h1 style={{ fontSize: '23px', fontWeight: '800', color: accentColor, margin: 0 }}>{resumeData.personalInfo.fullName}</h1>
          <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600', marginTop: '2px' }}>{resumeData.personalInfo.jobTitle}</div>
        </div>
        {showPhoto && resumeData.personalInfo.photo && (
          <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', border: `2px solid ${accentColor}` }}>
            <img src={resumeData.personalInfo.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
          </div>
        )}
        <div style={{ fontSize: '8.5px', color: '#475569', textAlign: 'right' }}>
          <div>{resumeData.personalInfo.email} ✉</div>
          <div>{resumeData.personalInfo.phone} 📞</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '22px' }}>
        <div>
          {visibility.experience && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', marginBottom: '8px' }}>Work Experience</div>
              {resumeData.experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 'bold' }}>{exp.role}</div>
                  <div style={{ fontSize: '9.5px', color: accentColor, fontWeight: '600' }}>{exp.company}</div>
                  <div style={{ fontSize: '8.5px', color: '#334155', whiteSpace: 'pre-line', lineHeight: '1.4' }}>{exp.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          {visibility.skills && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', marginBottom: '8px' }}>Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {getSkillsList().map((s, i) => (
                  <span key={i} style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '8.5px', fontWeight: '600', padding: '2px 6px', borderRadius: '4px' }}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderModernDev = () => (
    <div style={{ ...a4CanvasStyle, padding: 0, fontFamily: 'Consolas, monospace' }}>
      <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', padding: '22px 34px', borderBottom: `4px solid ${accentColor}` }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>{resumeData.personalInfo.fullName}</h1>
        <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '3px' }}>&lt;{resumeData.personalInfo.jobTitle} /&gt;</div>
      </div>
      <div style={{ padding: '22px 34px' }}>
        {visibility.experience && (
          <div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: accentColor, borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', marginBottom: '6px' }}>// Experience</div>
            {resumeData.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 'bold' }}>{exp.role} @ {exp.company}</div>
                <div style={{ fontSize: '9px', color: '#334155', whiteSpace: 'pre-line' }}>{exp.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

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
        .top-navbar-inner { max-width: 1720px; margin: 0 auto; display: flex; align-items: center; }
        .brand-logo-img { height: 42px; width: auto; max-width: 190px; object-fit: contain; }
        .action-group { display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
        .custom-select { background-color: #0e192d; color: #ffffff; border: 1px solid #243552; padding: 8px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; outline: none; cursor: pointer; }
        .custom-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid #243552; background-color: #0e192d; color: #f8fafc; transition: all 0.2s; }
        .custom-btn:hover { background-color: #172744; border-color: #3b82f6; }
        .custom-btn-primary { background: linear-gradient(135deg, #2563eb, #1d4ed8); border-color: #2563eb; color: #ffffff; }
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
        .form-input, .form-textarea { background-color: #060b14; border: 1px solid #1a273f; border-radius: 8px; padding: 10px 12px; font-size: 13.5px; color: #ffffff; outline: none; width: 100%; }
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
        @media (max-width: 1080px) {
          .mobile-mode-bar { display: flex; }
          .main-workspace { height: auto; padding: 8px; }
          .editor-container { width: 100%; min-width: 100%; height: calc(100vh - 120px); display: none; }
          .preview-container { width: 100%; min-width: 100%; height: calc(100vh - 120px); display: none; }
          .editor-container.mobile-active { display: flex; }
          .preview-container.mobile-active { display: flex; }
        }
        @media print {
          .top-navbar, .mobile-mode-bar, .resume-hero, .editor-container, .preview-topbar, .zoom-controls { display: none !important; }
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
          </div>
        </header>

        <section className={`resume-hero ${mobileView === 'preview' ? 'hide-on-preview' : ''}`}>
          <span className="resume-hero-badge"><Sparkles size={12} /> Auto-Saved & ATS Optimized</span>
          <h1>Free ATS-Friendly Resume Builder</h1>
          <p>Build a professional resume with instant local auto-save, pre-built bullet suggestions, and DOCX/PDF export.</p>

          <div className="action-group">
            <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)} className="custom-select">
              <option value="ankit_harvard">01. Ankit Harvard ATS (+ Photo)</option>
              <option value="classic_ats">02. Classic Corporate ATS</option>
              <option value="novoresume_clean">03. Novoresume Modern 2-Col</option>
              <option value="modern_dev">04. Tech Lead & Cloud Engineer</option>
              <option value="executive">05. Executive Leadership</option>
              <option value="finance_consulting">06. Banking & Finance</option>
              <option value="healthcare">07. Healthcare & Medical</option>
              <option value="fresher">08. Fresher & Graduate</option>
              <option value="creative_purple">09. Creative Designer</option>
              <option value="govt_formal">10. Government Official CV</option>
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
              <span>{isExportingDocx ? 'Saving...' : 'DOCX'}</span>
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
                { id: 'personal', label: 'Personal', icon: User },
                { id: 'experience', label: 'Experience', icon: Briefcase },
                { id: 'education', label: 'Education', icon: GraduationCap },
                { id: 'skills', label: 'Skills', icon: Award },
                { id: 'projects', label: 'Projects', icon: Code },
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#060b14', padding: '8px 6px', borderRadius: '9px', border: '1px solid #1a273f' }}>
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

                  <div className="form-field">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" type="text" name="fullName" value={resumeData.personalInfo.fullName} onChange={handlePersonalChange} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Job Title / Designation</label>
                    <input className="form-input" type="text" name="jobTitle" value={resumeData.personalInfo.jobTitle} onChange={handlePersonalChange} />
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label">Email</label>
                      <input className="form-input" type="email" name="email" value={resumeData.personalInfo.email} onChange={handlePersonalChange} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Phone</label>
                      <input className="form-input" type="text" name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalChange} />
                    </div>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Professional Summary</label>
                    <textarea className="form-textarea" rows={3} value={resumeData.summary} onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })} />
                  </div>
                </>
              )}

              {activeTab === 'experience' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="form-label">Work Experience</div>
                    <button onClick={addExperience} className="custom-btn custom-btn-primary" style={{ padding: '4px 8px', fontSize: '11px' }} type="button"><Plus size={11} /> Add Role</button>
                  </div>
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="form-card">
                      <button onClick={() => removeExperience(exp.id)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }} type="button"><Trash2 size={13} /></button>
                      <div className="form-row" style={{ marginBottom: '6px' }}>
                        <input className="form-input" placeholder="Company Name" value={exp.company} onChange={(e) => handleExpChange(exp.id, 'company', e.target.value)} />
                        <input className="form-input" placeholder="Role" value={exp.role} onChange={(e) => handleExpChange(exp.id, 'role', e.target.value)} />
                      </div>
                      <div className="form-row" style={{ marginBottom: '6px' }}>
                        <input className="form-input" placeholder="Duration" value={exp.duration} onChange={(e) => handleExpChange(exp.id, 'duration', e.target.value)} />
                        <input className="form-input" placeholder="Location" value={exp.location} onChange={(e) => handleExpChange(exp.id, 'location', e.target.value)} />
                      </div>
                      <textarea className="form-textarea" rows={3} placeholder="Responsibilities" value={exp.description} onChange={(e) => handleExpChange(exp.id, 'description', e.target.value)} />
                      
                      {/* Pre-built Bullet Points Bank */}
                      <div style={{ marginTop: '8px', borderTop: '1px solid #1a273f', paddingTop: '6px' }}>
                        <div style={{ fontSize: '10px', color: '#38bdf8', marginBottom: '4px', fontWeight: 'bold' }}>⚡ Quick Pro Bullet Points (Click to Add):</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '90px', overflowY: 'auto' }}>
                          {SUGGESTED_BULLETS.map((bullet, idx) => (
                            <button key={idx} onClick={() => addBulletToExperience(exp.id, bullet)} type="button" style={{ textAlign: 'left', background: '#060b14', border: '1px solid #1a273f', color: '#94a3b8', fontSize: '10px', padding: '4px 6px', borderRadius: '4px', cursor: 'pointer' }}>
                              + {bullet}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {activeTab === 'education' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="form-label">Education</div>
                    <button onClick={addEducation} className="custom-btn custom-btn-primary" style={{ padding: '4px 8px', fontSize: '11px' }} type="button"><Plus size={11} /> Add Degree</button>
                  </div>
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="form-card">
                      <button onClick={() => removeEducation(edu.id)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }} type="button"><Trash2 size={13} /></button>
                      <div className="form-field" style={{ marginBottom: '6px' }}><input className="form-input" placeholder="Institution" value={edu.institution} onChange={(e) => handleEduChange(edu.id, 'institution', e.target.value)} /></div>
                      <div className="form-field" style={{ marginBottom: '6px' }}><input className="form-input" placeholder="Degree" value={edu.degree} onChange={(e) => handleEduChange(edu.id, 'degree', e.target.value)} /></div>
                      <div className="form-row">
                        <input className="form-input" placeholder="Duration" value={edu.duration} onChange={(e) => handleEduChange(edu.id, 'duration', e.target.value)} />
                        <input className="form-input" placeholder="Grade/CGPA" value={edu.grade} onChange={(e) => handleEduChange(edu.id, 'grade', e.target.value)} />
                      </div>
                    </div>
                  ))}
                </>
              )}

              {activeTab === 'skills' && (
                <>
                  <div className="form-field"><label className="form-label">Languages</label><input className="form-input" value={resumeData.skillCategories.languages} onChange={(e) => setResumeData({ ...resumeData, skillCategories: { ...resumeData.skillCategories, languages: e.target.value } })} /></div>
                  <div className="form-field"><label className="form-label">Tools</label><input className="form-input" value={resumeData.skillCategories.tools} onChange={(e) => setResumeData({ ...resumeData, skillCategories: { ...resumeData.skillCategories, tools: e.target.value } })} /></div>
                  <div className="form-field"><label className="form-label">Frameworks</label><input className="form-input" value={resumeData.skillCategories.frameworks} onChange={(e) => setResumeData({ ...resumeData, skillCategories: { ...resumeData.skillCategories, frameworks: e.target.value } })} /></div>
                </>
              )}

              {activeTab === 'projects' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="form-label">Projects</div>
                    <button onClick={addProject} className="custom-btn custom-btn-primary" style={{ padding: '4px 8px', fontSize: '11px' }} type="button"><Plus size={11} /> Add Project</button>
                  </div>
                  {resumeData.projects.map((proj) => (
                    <div key={proj.id} className="form-card">
                      <button onClick={() => removeProject(proj.id)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }} type="button"><Trash2 size={13} /></button>
                      <div className="form-row" style={{ marginBottom: '6px' }}><input className="form-input" placeholder="Title" value={proj.title} onChange={(e) => handleProjChange(proj.id, 'title', e.target.value)} /></div>
                      <textarea className="form-textarea" rows={3} placeholder="Description" value={proj.description} onChange={(e) => handleProjChange(proj.id, 'description', e.target.value)} />
                    </div>
                  ))}
                </>
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
              <span style={{ fontWeight: '600', color: '#e2e8f0' }}>Live A4 Preview (Auto-Saved)</span>
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
      </main>
    </>
  );
}
