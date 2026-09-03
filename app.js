// QUOS Code IDE - Core Logic & Monaco Integration
// AI Assistant: QB-000

let editor;
let currentTheme = 'dark';
let activeFileId = 'file-1';

// Initial Project File System
let fileSystem = [
    {
        id: 'file-1',
        name: 'index.js',
        language: 'javascript',
        content: `// Welcome to QUOS Code - AI-Powered IDE
// AI Assistant QB-000 is online and ready to assist you.

function calculateQuantumRisk(portfolio, volatility) {
  console.log("Analyzing quantum risk vectors...");
  const baseFactor = 1.618; // Golden ratio
  let riskScore = 0;
  
  for (let i = 0; i < portfolio.length; i++) {
    riskScore += portfolio[i].value * volatility * baseFactor;
  }
  
  return {
    score: riskScore.toFixed(2),
    status: riskScore > 100 ? "HIGH_RISK" : "OPTIMIZED",
    timestamp: new Date().toISOString()
  };
}

// Example portfolio test
const myPortfolio = [
  { asset: "QUOS", value: 45.5 },
  { asset: "SOL", value: 30.2 }
];

const result = calculateQuantumRisk(myPortfolio, 0.85);
console.log("Analysis Result:", JSON.stringify(result, null, 2));
`
    },
    {
        id: 'file-2',
        name: 'aiAgent.py',
        language: 'python',
        content: `# QB-000 Python Neural Module

import math
import datetime

class QBAgent:
    def __init__(self, name="QB-000"):
        self.name = name
        self.version = "1.0.0"
        self.active = True

    def evaluate_code(self, code_snippet):
        print(f"[{self.name}] Evaluating snippet of length {len(code_snippet)}")
        # Simulate neural optimization
        complexity = len(code_snippet.split('\n'))
        return {
            "agent": self.name,
            "lines_analyzed": complexity,
            "recommendation": "Code looks robust and clean."
        }

if __name__ == "__main__":
    agent = QBAgent()
    res = agent.evaluate_code("print('Hello QUOS')")
    print(res)
`
    },
    {
        id: 'file-3',
        name: 'styles.css',
        language: 'css',
        content: `/* QUOS Design System Stylesheet */
:root {
  --quos-primary: #0066FF;
  --quos-bg: #0F0F10;
  --quos-glow: rgba(0, 102, 255, 0.4);
}

.quos-card {
  background: var(--quos-bg);
  border: 1px solid var(--quos-primary);
  border-radius: 12px;
  box-shadow: 0 0 20px var(--quos-glow);
  padding: 24px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.quos-card:hover {
  transform: translateY(-4px);
}
`
    },
    {
        id: 'file-4',
        name: 'App.jsx',
        language: 'javascript',
        content: `import React, { useState } from 'react';

export default function QUOSApp() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-8 bg-[#0F0F10] text-white min-h-screen">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
        QUOS Code Studio
      </h1>
      <p className="text-gray-400 mt-2">Powered by QB-000 AI Agent.</p>
      
      <button 
        onClick={() => setCount(count + 1)}
        className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition"
      >
        Count: {count}
      </button>
    </div>
  );
}
`
    }
];

let openFiles = ['file-1', 'file-2'];

// Initialize Monaco Editor
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min' }});

require(['vs/editor/editor.main'], function() {
    const activeFile = fileSystem.find(f => f.id === activeFileId);
    
    editor = monaco.editor.create(document.getElementById('monaco-container'), {
        value: activeFile ? activeFile.content : '',
        language: activeFile ? activeFile.language : 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 13,
        fontFamily: 'JetBrains Mono, monospace',
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on'
    });

    // Listen to content changes & update state
    editor.onDidChangeModelContent(() => {
        const val = editor.getValue();
        const file = fileSystem.find(f => f.id === activeFileId);
        if (file) {
            file.content = val;
        }
    });

    // Listen to cursor position changes
    editor.onDidChangeCursorPosition((e) => {
        const pos = e.position;
        document.getElementById('cursorPosition').innerText = \`Ln \${pos.lineNumber}, Col \${pos.column}\`;
    });

    renderFileTree();
    renderTabs();
    updateStatusBarInfo();
});

// Render File Explorer Tree
function renderFileTree() {
    const container = document.getElementById('sidebarContent');
    container.innerHTML = \`
        <div class="tree-folder">
            <i class="fa-solid fa-chevron-down"></i>
            <i class="fa-solid fa-folder-open" style="color: #DCB67A;"></i>
            <span>quos-ai-project</span>
        </div>
        <div class="sub-tree" id="fileTreeList"></div>
    \`;

    const listEl = document.getElementById('fileTreeList');
    listEl.innerHTML = fileSystem.map(file => {
        const isActive = file.id === activeFileId ? 'active' : '';
        let iconClass = 'fa-file-lines';
        let iconColor = '#8E8E93';
        if (file.language === 'javascript') { iconClass = 'fa-js'; iconColor = '#F7DF1E'; }
        else if (file.language === 'python') { iconClass = 'fa-python'; iconColor = '#3776AB'; }
        else if (file.language === 'css') { iconClass = 'fa-css3-alt'; iconColor = '#264DE4'; }

        return \`
            <div class="tree-file \${isActive}" onclick="selectFile('\${file.id}')">
                <i class="fa-brands \${iconClass}" style="color: \${iconColor};"></i>
                <span>\${file.name}</span>
            </div>
        \`;
    }).join('');
}

// Render Tabs
function renderTabs() {
    const tabsContainer = document.getElementById('editorTabs');
    tabsContainer.innerHTML = openFiles.map(fileId => {
        const file = fileSystem.find(f => f.id === fileId);
        if (!file) return '';
        const isActive = fileId === activeFileId ? 'active' : '';
        return \`
            <div class="editor-tab \${isActive}" onclick="selectFile('\${file.id}')">
                <span>\${file.name}</span>
                <i class="fa-solid fa-xmark close-tab" onclick="event.stopPropagation(); closeTab('\${file.id}')"></i>
            </div>
        \`;
    }).join('');
}

// Select File
function selectFile(fileId) {
    activeFileId = fileId;
    const file = fileSystem.find(f => f.id === fileId);
    if (!file) return;

    if (!openFiles.includes(fileId)) {
        openFiles.push(fileId);
    }

    if (editor) {
        const model = monaco.editor.createModel(file.content, file.language);
        editor.setModel(model);
    }

    document.getElementById('projectTitle').innerText = \`quos-ai-project — \${file.name}\`;
    document.getElementById('currentBreadcrumbFile').innerText = file.name;
    document.getElementById('activeFileContext').innerText = file.name;

    renderFileTree();
    renderTabs();
    updateStatusBarInfo();
}

// Close Tab
function closeTab(fileId) {
    openFiles = openFiles.filter(id => id !== fileId);
    if (openFiles.length === 0) {
        // keep at least one
        openFiles.push(fileSystem[0].id);
    }
    if (activeFileId === fileId) {
        selectFile(openFiles[openFiles.length - 1]);
    } else {
        renderTabs();
    }
}

// Update Status Bar info
function updateStatusBarInfo() {
    const file = fileSystem.find(f => f.id === activeFileId);
    if (!file) return;
    document.getElementById('fileLanguage').innerText = file.language.toUpperCase();
}

// Theme Toggle
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    const themeIcon = document.getElementById('themeIcon');
    if (currentTheme === 'light') {
        themeIcon.className = 'fa-solid fa-sun';
        monaco.editor.setTheme('vs');
    } else {
        themeIcon.className = 'fa-solid fa-moon';
        monaco.editor.setTheme('vs-dark');
    }
}

// AI Chat Panel Toggle
function toggleAiChatPanel() {
    const panel = document.getElementById('aiChatPanel');
    panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
}

function triggerAIChatShortcut() {
    const panel = document.getElementById('aiChatPanel');
    panel.style.display = 'flex';
    document.getElementById('aiChatInput').focus();
}

// Send AI Message (QB-000 AI Assistant)
function sendAiMessage() {
    const input = document.getElementById('aiChatInput');
    const text = input.value.trim();
    if (!text) return;

    const messagesContainer = document.getElementById('aiMessages');
    const activeFile = fileSystem.find(f => f.id === activeFileId);

    // Append User Message
    messagesContainer.innerHTML += \`
        <div class="ai-msg user">
            <div class="msg-avatar">YOU</div>
            <div class="msg-bubble">\${escapeHtml(text)}</div>
        </div>
    \`;

    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Simulate QB-000 Response
    setTimeout(() => {
        let aiReply = generateAiResponse(text, activeFile);
        messagesContainer.innerHTML += \`
            <div class="ai-msg assistant">
                <div class="msg-avatar">QB</div>
                <div class="msg-bubble">\${aiReply}</div>
            </div>
        \`;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 600);
}

function handleChatKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAiMessage();
    }
}

// Quick AI Actions
function quickAiAction(action) {
    const activeFile = fileSystem.find(f => f.id === activeFileId);
    let promptText = '';
    if (action === 'explain') promptText = \`Explain code in \${activeFile.name}\`;
    if (action === 'refactor') promptText = \`Refactor \${activeFile.name} for optimal performance and elegance\`;
    if (action === 'debug') promptText = \`Scan \${activeFile.name} for potential bugs and fix them\`;
    if (action === 'tests') promptText = \`Write unit test suite for \${activeFile.name}\`;

    document.getElementById('aiChatInput').value = promptText;
    sendAiMessage();
}

// Intelligent mock AI responses for QB-000
function generateAiResponse(query, file) {
    const q = query.toLowerCase();
    const code = file ? file.content : '';

    if (q.includes('explain') || q.includes('what does')) {
        return \`<p>Here is the architectural breakdown of <strong>\${file.name}</strong> by QB-000:</p>
        <p>This module implements high-performance execution flow using <em>\${file.language}</em>. It processes data streams cleanly with optimal time complexity O(n).</p>
        <pre><code>// QB-000 Verification: Clean & Secure</code></pre>\`;
    }

    if (q.includes('refactor') || q.includes('optimize')) {
        return \`<p>I have refactored <strong>\${file.name}</strong> for maximum efficiency:</p>
        <pre><code>// Refactored by QB-000 AI Agent
const optimizedExecute = () => {
  console.log("QB-000: Execution optimized successfully.");
  return true;
};
optimizedExecute();</code></pre>
        <p>Would you like me to inject this code directly into your editor?</p>\`;
    }

    if (q.includes('debug') || q.includes('fix') || q.includes('error')) {
        return \`<p>QB-000 scanned <strong>\${file.name}</strong>. No critical syntax errors or memory leaks detected. All variables are correctly scoped.</p>\`;
    }

    return \`<p>I have analyzed your request regarding <strong>\${file ? file.name : 'project'}</strong>. As QB-000, I recommend keeping your functions pure and modular. Let me know if you want me to rewrite or generate code!</p>\`;
}

// Terminal Execution Simulator
function runCurrentCode() {
    const terminalBody = document.getElementById('terminalBody');
    const file = fileSystem.find(f => f.id === activeFileId);
    
    terminalBody.innerHTML += \`<div class="term-line output-success">> node \${file.name}</div>\`;

    setTimeout(() => {
        if (file.language === 'javascript') {
            terminalBody.innerHTML += \`
                <div class="term-line">Analyzing quantum risk vectors...</div>
                <div class="term-line output-result">Analysis Result: {</div>
                <div class="term-line output-result">  "score": "119.73",</div>
                <div class="term-line output-result">  "status": "HIGH_RISK",</div>
                <div class="term-line output-result">  "timestamp": "\${new Date().toISOString()}"</div>
                <div class="term-line output-result">}</div>
                <div class="term-line output-success">[QB-000] Process exited with code 0</div>
            \`;
        } else if (file.language === 'python') {
            terminalBody.innerHTML += \`
                <div class="term-line">[QB-000 Python] Evaluating snippet of length 24</div>
                <div class="term-line output-result">{'agent': 'QB-000', 'lines_analyzed': 14, 'recommendation': 'Code looks robust and clean.'}</div>
                <div class="term-line output-success">[QB-000] Python process finished.</div>
            \`;
        } else {
            terminalBody.innerHTML += \`<div class="term-line output-result">File executed successfully in sandbox.</div>\`;
        }
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }, 400);
}

function clearTerminal() {
    document.getElementById('terminalBody').innerHTML = \`<div class="term-line output-welcome"><i class="fa-solid fa-circle-info"></i> Terminal cleared by user.</div>\`;
}

function toggleTerminal() {
    const term = document.getElementById('terminalPanel');
    term.style.height = term.style.height === '32px' ? '160px' : '32px';
}

function switchTerminalTab(tab) {
    document.querySelectorAll('.term-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
}

// Modal Prompt helper for creating new files
function createNewFilePrompt() {
    const modalHtml = \`
        <div class="modal-overlay" id="modalOverlay">
            <div class="modal-card">
                <h3>New File</h3>
                <input type="text" id="newFileNameInput" placeholder="e.g. utils.js, server.py, index.html" autofocus>
                <div class="modal-buttons">
                    <button class="btn-secondary" onclick="closeModal()">Cancel</button>
                    <button class="btn-primary" onclick="confirmCreateFile()">Create File</button>
                </div>
            </div>
        </div>
    \`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('newFileNameInput').onkeydown = (e) => { if (e.key === 'Enter') confirmCreateFile(); };
}

function confirmCreateFile() {
    const name = document.getElementById('newFileNameInput').value.trim();
    if (!name) return;

    let lang = 'javascript';
    if (name.endsWith('.py')) lang = 'python';
    if (name.endsWith('.css')) lang = 'css';
    if (name.endsWith('.html')) lang = 'html';

    const newFile = {
        id: 'file-' + Date.now(),
        name: name,
        language: lang,
        content: \`// \${name} created by QUOS Code IDE\\n\\nfunction init() {\\n  console.log("Initialized \${name}");\\n}\\ninit();\\n\`
    };

    fileSystem.push(newFile);
    closeModal();
    selectFile(newFile.id);
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.remove();
}

function createNewFolderPrompt() {
    alert("QB-000: Project folder structure updated.");
}

function collapseAllFiles() {
    renderFileTree();
}

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function switchSidebarTab(tab) {
    document.querySelectorAll('.activity-icon').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');
    if (tab === 'ai-presets') {
        triggerAIChatShortcut();
    }
}
