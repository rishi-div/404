// Terminal Interface JavaScript
class Terminal {
    constructor() {
        this.output = document.getElementById('output');
        this.input = document.getElementById('commandInput');
        this.currentDirectory = '/home/user';
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.fileSystem = {
            '/home/user': {
                'about.txt': 'about-content',
                'experiments/': {
                    'sitch.lol': 'sitch-content',
                    'merch.txt': 'merch-content',
                    'secret_project_x.???': 'secret-content'
                },
                'contact.sh': 'contact-content'
            }
        };
        
        this.commands = {
            'help': this.showHelp.bind(this),
            'ls': this.listFiles.bind(this),
            'cat': this.showFile.bind(this),
            'cd': this.changeDirectory.bind(this),
            'pwd': this.showDirectory.bind(this),
            'clear': this.clearScreen.bind(this),
            'whoami': this.whoami.bind(this),
            'date': this.showDate.bind(this),
            'uname': this.showSystem.bind(this),
            'ps': this.showProcesses.bind(this),
            'top': this.showTop.bind(this),
            'ping': this.ping.bind(this),
            'curl': this.curl.bind(this),
            'open': this.openLink.bind(this),
            'send-idea': this.sendIdea.bind(this),
            'email': this.showEmail.bind(this),
            'contact': this.showContact.bind(this),
            'hack': this.hack.bind(this),
            'matrix': this.matrix.bind(this),
            'glitch': this.glitch.bind(this),
            'easter-egg': this.easterEgg.bind(this),
            'konami': this.konami.bind(this)
        };
        
        this.init();
    }
    
    init() {
        this.input.addEventListener('keydown', this.handleInput.bind(this));
        this.input.focus();
        
        // Add scan line effect
        this.addScanLine();
        
        // Auto-focus input when clicking anywhere
        document.addEventListener('click', () => {
            this.input.focus();
        });
        
        // Konami code listener
        this.konamiCode = [];
        this.konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        document.addEventListener('keydown', this.handleKonami.bind(this));
    }
    
    handleInput(event) {
        if (event.key === 'Enter') {
            const command = this.input.value.trim();
            if (command) {
                this.executeCommand(command);
                this.commandHistory.push(command);
                this.historyIndex = this.commandHistory.length;
            }
            this.input.value = '';
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.commandHistory[this.historyIndex];
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.input.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                this.input.value = '';
            }
        } else if (event.key === 'Tab') {
            event.preventDefault();
            this.autoComplete();
        }
    }
    
    executeCommand(commandLine) {
        const parts = commandLine.split(' ');
        const command = parts[0];
        const args = parts.slice(1);
        
        // Echo command
        this.addOutput(`<div class="command-echo">${commandLine}</div>`);
        
        if (this.commands[command]) {
            this.commands[command](args);
        } else {
            this.addOutput(`<div class="error">bash: ${command}: command not found</div>`);
            this.addOutput(`<div class="info">Type 'help' to see available commands</div>`);
        }
        
        this.scrollToBottom();
    }
    
    addOutput(content) {
        this.output.innerHTML += content + '\\n';
    }
    
    scrollToBottom() {
        const terminal = document.getElementById('terminal');
        terminal.scrollTop = terminal.scrollHeight;
    }
    
    // Commands implementation
    showHelp() {
        const helpText = `
<div class="section-header">AVAILABLE COMMANDS:</div>
<div class="file-content">
<span class="command-suggestion">ls</span>          - list files and directories
<span class="command-suggestion">cat [file]</span>  - display file contents
<span class="command-suggestion">cd [dir]</span>    - change directory
<span class="command-suggestion">pwd</span>         - show current directory
<span class="command-suggestion">clear</span>       - clear terminal screen
<span class="command-suggestion">whoami</span>      - display current user
<span class="command-suggestion">date</span>        - show current date/time
<span class="command-suggestion">uname</span>       - system information
<span class="command-suggestion">ps</span>          - show running processes
<span class="command-suggestion">ping [host]</span> - ping a host
<span class="command-suggestion">open [link]</span> - open external links
<span class="command-suggestion">email</span>       - show email contact
<span class="command-suggestion">contact</span>     - show full contact info
<span class="command-suggestion">send-idea</span>   - submit your crazy idea

SPECIAL COMMANDS:
<span class="command-suggestion">hack</span>        - initiate hacking sequence
<span class="command-suggestion">matrix</span>      - enter the matrix
<span class="command-suggestion">glitch</span>      - activate glitch mode
<span class="command-suggestion">konami</span>      - ↑↑↓↓←→←→BA

QUICK START:
Try: <span class="terminal-link">ls</span> then <span class="terminal-link">cat about.txt</span>
Contact: <span class="terminal-link">email</span> or <span class="terminal-link">contact</span>
</div>`;
        this.addOutput(helpText);
    }
    
    listFiles(args) {
        const path = args[0] || this.currentDirectory;
        const files = this.getDirectoryContents(path);
        
        if (files === null) {
            this.addOutput(`<div class="error">ls: cannot access '${path}': No such file or directory</div>`);
            return;
        }
        
        let output = '<div class="file-listing">';
        output += 'total ' + Object.keys(files).length + '\\n';
        
        for (const [name, content] of Object.entries(files)) {
            const isDir = typeof content === 'object';
            const permissions = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
            const size = isDir ? '4096' : Math.floor(Math.random() * 8192) + 512;
            const date = 'Dec 25 04:04';
            
            output += `${permissions}  1 user lvl404  ${size} ${date} ${name}\\n`;
        }
        
        output += '</div>';
        this.addOutput(output);
    }
    
    showFile(args) {
        if (!args[0]) {
            this.addOutput(`<div class="error">cat: missing file operand</div>`);
            return;
        }
        
        const filename = args[0];
        const content = this.getFileContent(filename);
        
        if (content === null) {
            this.addOutput(`<div class="error">cat: ${filename}: No such file or directory</div>`);
            return;
        }
        
        const hiddenElement = document.getElementById(content);
        if (hiddenElement) {
            this.addOutput(hiddenElement.innerHTML);
        } else {
            this.addOutput(`<div class="error">cat: ${filename}: Permission denied</div>`);
        }
    }
    
    changeDirectory(args) {
        if (!args[0]) {
            this.currentDirectory = '/home/user';
            this.addOutput(`<div class="success">Changed to home directory</div>`);
            return;
        }
        
        const newPath = args[0];
        if (this.getDirectoryContents(newPath) !== null) {
            this.currentDirectory = newPath;
            this.addOutput(`<div class="success">Changed directory to ${newPath}</div>`);
        } else {
            this.addOutput(`<div class="error">cd: ${newPath}: No such file or directory</div>`);
        }
    }
    
    showDirectory() {
        this.addOutput(`<div class="info">${this.currentDirectory}</div>`);
    }
    
    clearScreen() {
        this.output.innerHTML = '';
    }
    
    whoami() {
        this.addOutput(`<div class="info">user</div>`);
        this.addOutput(`<div class="success">You are a digital explorer in the lvl404 void</div>`);
    }
    
    showDate() {
        const now = new Date();
        this.addOutput(`<div class="info">${now.toString()}</div>`);
    }
    
    showSystem() {
        this.addOutput(`<div class="info">lvl404 4.04.404 #1 SMP PREEMPT Digital Void x86_64 GNU/Glitch</div>`);
    }
    
    showProcesses() {
        const processes = `
<div class="file-listing">
  PID TTY          TIME CMD
 1337 pts/0    00:00:01 bash
 1404 pts/0    00:00:00 sitch.lol
 2048 pts/0    00:00:00 glitch_engine
 4096 pts/0    00:00:00 meme_generator
 8192 pts/0    00:00:00 void_explorer
</div>`;
        this.addOutput(processes);
    }
    
    showTop() {
        this.addOutput(`<div class="info">top - 04:04:04 up 404 days, 4:04, 1 user, load average: 4.04, 4.04, 4.04</div>`);
        this.addOutput(`<div class="success">Tasks: 5 total, 1 running, 4 sleeping, 0 stopped, 0 zombie</div>`);
    }
    
    ping(args) {
        const host = args[0] || 'sitch.lol';
        this.addOutput(`<div class="info">PING ${host} (404.404.404.404): 56 data bytes</div>`);
        this.addOutput(`<div class="success">64 bytes from ${host}: icmp_seq=1 ttl=64 time=4.04 ms</div>`);
        this.addOutput(`<div class="success">64 bytes from ${host}: icmp_seq=2 ttl=64 time=0.404 ms</div>`);
    }
    
    curl(args) {
        const url = args[0] || 'lvl404.com';
        this.addOutput(`<div class="info">Fetching ${url}...</div>`);
        this.addOutput(`<div class="success">HTTP/1.1 200 OK</div>`);
        this.addOutput(`<div class="info">Content-Type: application/glitch</div>`);
    }
    
    openLink(args) {
        const link = args[0];
        if (link === 'sitch' || link === 'sitch.lol') {
            window.open('https://sitch.lol', '_blank');
            this.addOutput(`<div class="success">Opening sitch.lol in new tab...</div>`);
        } else {
            this.addOutput(`<div class="error">Unknown link: ${link}</div>`);
            this.addOutput(`<div class="info">Available links: sitch</div>`);
        }
    }
    
    sendIdea() {
        this.addOutput(`<div class="section-header">IDEA SUBMISSION FORM</div>`);
        this.addOutput(`<div class="info">Launching idea submission interface...</div>`);
        this.addOutput(`<div class="success">Form loaded. Type your crazy idea below:</div>`);
        this.addOutput(`<div class="warning">Note: This is a demo. Real form would be interactive.</div>`);
        this.addOutput(`<div class="terminal-link">Contact us: 404@lvl404.com</div>`);
    }
    
    showEmail() {
        this.addOutput(`<div class="success">📧 EMAIL: 404@lvl404.com</div>`);
        this.addOutput(`<div class="info">We don't take clients. We take ideas.</div>`);
        this.addOutput(`<div class="terminal-link">Send your crazy ideas to this email!</div>`);
    }
    
    showContact() {
        const hiddenElement = document.getElementById('contact-content');
        if (hiddenElement) {
            this.addOutput(hiddenElement.innerHTML);
        }
    }
    
    hack() {
        this.addOutput(`<div class="error">Initiating hack sequence...</div>`);
        this.addOutput(`<div class="warning">Bypassing firewall... [████████████] 100%</div>`);
        this.addOutput(`<div class="success">Access granted to level 404</div>`);
        this.addOutput(`<div class="info">Welcome to the secret level, hacker.</div>`);
    }
    
    matrix() {
        this.addOutput(`<div class="success">Entering the matrix...</div>`);
        this.addOutput(`<div class="glitch-text">Wake up, Neo...</div>`);
        this.startMatrixRain();
    }
    
    glitch() {
        this.addOutput(`<div class="error">G̴̰̈l̵̰̇i̴̱̍t̶̰̄c̵̱̈ḣ̴̰ ̵̰̍m̴̱̄ö̵̰ḏ̴̇ḛ̵̍ ̴̱̄ä̵̰ċ̴̱t̵̰̍ī̴̱v̵̰̈ȧ̴̱t̵̰̍ē̴̱d̵̰̈</div>`);
        document.body.style.animation = 'glitch 0.3s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 3000);
    }
    
    easterEgg() {
        this.addOutput(`<div class="success">🥚 You found an easter egg! 🥚</div>`);
        this.addOutput(`<div class="info">The real treasure was the glitches we made along the way.</div>`);
    }
    
    konami() {
        this.addOutput(`<div class="glitch-text">KONAMI CODE ACTIVATED!</div>`);
        this.addOutput(`<div class="success">30 lives granted! Wait, this isn't a game...</div>`);
        this.addOutput(`<div class="info">But you get extra hacker points! 🎮</div>`);
    }
    
    // Helper methods
    getDirectoryContents(path) {
        if (path === '.' || path === this.currentDirectory) {
            return this.fileSystem['/home/user'];
        }
        if (path === 'experiments' || path === 'experiments/') {
            return this.fileSystem['/home/user']['experiments/'];
        }
        return null;
    }
    
    getFileContent(filename) {
        const files = this.fileSystem['/home/user'];
        if (files[filename]) {
            return files[filename];
        }
        
        const expFiles = files['experiments/'];
        if (expFiles && expFiles[filename]) {
            return expFiles[filename];
        }
        
        return null;
    }
    
    autoComplete() {
        const input = this.input.value;
        const commands = Object.keys(this.commands);
        const matches = commands.filter(cmd => cmd.startsWith(input));
        
        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            this.addOutput(`<div class="info">${matches.join('  ')}</div>`);
        }
    }
    
    addScanLine() {
        const scanLine = document.createElement('div');
        scanLine.className = 'scan-line';
        document.querySelector('.terminal-content').appendChild(scanLine);
    }
    
    startMatrixRain() {
        // Simple matrix rain effect
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const drops = [];
        
        for (let i = 0; i < 50; i++) {
            drops.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                char: chars[Math.floor(Math.random() * chars.length)]
            });
        }
        
        // This would need canvas implementation for full effect
        this.addOutput(`<div class="success">Matrix rain activated (simplified version)</div>`);
    }
    
    handleKonami(event) {
        this.konamiCode.push(event.code);
        
        if (this.konamiCode.length > this.konamiSequence.length) {
            this.konamiCode.shift();
        }
        
        if (this.konamiCode.length === this.konamiSequence.length) {
            const match = this.konamiCode.every((code, index) => code === this.konamiSequence[index]);
            if (match) {
                this.konami();
                this.konamiCode = [];
            }
        }
    }
}

// Initialize terminal when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});

// Prevent context menu for more authentic terminal feel
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Handle window resize
window.addEventListener('resize', () => {
    document.getElementById('commandInput').focus();
});

