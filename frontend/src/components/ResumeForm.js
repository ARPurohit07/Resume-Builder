import React, { useState } from "react";
import "./ResumeForm.css";

const ResumeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    github:"",
    linkedin:"",
    education: "",
    skills: "",
    experience: "",
    projects: "",
    about_yourself: "",
  });

  const [atsScore, setAtsScore] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send data to backend
    const response = await fetch("http://localhost:5000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const blob = await response.blob();
      setDownloadLink(URL.createObjectURL(blob));
    }

    // Get ATS score
    const atsResponse = await fetch("http://localhost:5000/api/ats-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (atsResponse.ok) {
      const data = await atsResponse.json();
      setAtsScore(data.score);
    }
  };

  return (
    <div className="resume-form-container">
      <h1>Resume Builder + ATS Score</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} />
        <input name="github" placeholder="Github link" onChange={handleChange} />
        <input name="linkedin" placeholder="Linkedin" onChange={handleChange} />
        <textarea name="education" placeholder="Education" onChange={handleChange} />
        <textarea name="skills" placeholder="Skills (comma-separated)" onChange={handleChange} />
        <textarea name="experience" placeholder="Experience" onChange={handleChange} />
        <textarea name="projects" placeholder="Projects" onChange={handleChange} />
        <textarea name="about_yourself" placeholder="About Yourself" onChange={handleChange} />

        <button type="submit">Generate Resume</button>
      </form>

      {atsScore !== null && (
        <div className="score-result">
          <h3>ATS Score: {atsScore}/100</h3>
        </div>
      )}

      {downloadLink && (
        <a href={downloadLink} download="resume.pdf" className="download-link">
          Download Resume PDF
        </a>
      )}
    </div>
  );
};

export default ResumeForm;
