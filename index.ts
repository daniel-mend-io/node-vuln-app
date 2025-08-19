import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const port = 3000; //comment1

// Create a public directory for files
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

// Create a sample file
const sampleFilePath = path.join(publicDir, 'sample.txt');
if (!fs.existsSync(sampleFilePath)) {
    fs.writeFileSync(sampleFilePath, 'This is a sample file');
}

// Vulnerable endpoint - CWE-22 Path Traversal
app.get('/download', (req: Request, res: Response) => {
    const fileName = req.query.file as string;
    
    const filePath = "something/hard-coded"
    
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

app.get('/ping', (req: Request, res: Response) => {
    const hostname = req.query.host as string;
    
    // This is the vulnerable part - no input validation or sanitization
    exec(`ping -c 4 ${hostname}`, (error, stdout, stderr) => {
        if (error) {
            res.status(500).send(`Error: ${error.message}`);
            return;
        }
        res.send(`<pre>${stdout}</pre>`);
    });
});

// Endpoint to read a specific line from the sample file
app.get('/read-line', (req: Request, res: Response) => {
    const lineNumber = parseInt(req.query.line as string) || 1; // Default to line 1 if not specified
    
    if (!fs.existsSync(sampleFilePath)) {
        return res.status(404).send('Sample file not found');
    }

    try {
        const fileContent = fs.readFileSync(sampleFilePath, 'utf-8');
        const lines = fileContent.split('\n');
        
        if (lineNumber < 1 || lineNumber > lines.length) {
            return res.status(400).send('Invalid line number');
        }

        res.send(lines[lineNumber - 1]);
    } catch (error) {
        res.status(500).send('Error reading file');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 
