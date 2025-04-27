const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  const data = req.body;

  const templatePath = path.join(__dirname, 'templates', 'resume_template.ejs');
  const htmlContent = await ejs.renderFile(templatePath, data);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'load' });

  const pdfPath = path.join(__dirname, 'resume_output', 'resume.pdf');
  await page.pdf({ path: pdfPath, format: 'A4' });

  await browser.close();

  res.download(pdfPath, 'resume.pdf', (err) => {
    if (err) console.error('Error sending file:', err);
    // Clean up if you want
    // fs.unlinkSync(pdfPath);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
