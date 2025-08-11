# Node Vulnerability Testing App

This is a simple Express.js application with a deliberate CWE-22 (Path Traversal) vulnerability for testing purposes.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the TypeScript code:
```bash
npm run build
```

3. Start the server:
```bash
npm start
```

## Vulnerability Demonstration

The application has a vulnerable endpoint at `/download` that accepts a `file` query parameter. Due to improper input validation, this endpoint is vulnerable to path traversal attacks.

### Normal Usage
To download the sample file:
```
http://localhost:3000/download?file=sample.txt
```

### Exploiting the Vulnerability
The vulnerability can be exploited by using path traversal sequences:
```
http://localhost:3000/download?file=../../../../etc/passwd
```

This demonstrates a CWE-22 vulnerability where an attacker can potentially access files outside the intended directory.

## Security Note
This application is intentionally vulnerable and should only be used for testing and educational purposes. Do not deploy this in a production environment. 