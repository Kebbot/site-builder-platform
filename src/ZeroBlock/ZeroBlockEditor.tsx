import React, { useState } from 'react';
import './ZeroBlockEditor.css';

interface ZeroBlockEditorProps {
    initialHTML?: string;
    initialCSS?: string;
    initialJS?: string;
    onSave: (html: string, css: string, js: string) => void;
    onClose: () => void;
}

const ZeroBlockEditor: React.FC<ZeroBlockEditorProps> = ({
    initialHTML = '',
    initialCSS = '',
    initialJS = '',
    onSave,
    onClose
}) => {
    const [html, setHtml] = useState(initialHTML);
    const [css, setCss] = useState(initialCSS);
    const [js, setJs] = useState(initialJS);
    const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'preview'>('html');

    const handleSave = () => {
        onSave(html, css, js);
        onClose();
    };

    const renderPreview = () => {
        return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
    };

    return (
        <div className="zero-block-overlay">
            <div className="zero-block-editor">
                <div className="editor-header">
                    <h2>🎛️ ZeroBlock Редактор</h2>
                    <div className="editor-actions">
                        <button className="preview-btn" onClick={() => setActiveTab('preview')}>
                            👁️ Предпросмотр
                        </button>
                        <button className="save-btn" onClick={handleSave}>
                            💾 Сохранить
                        </button>
                        <button className="close-btn" onClick={onClose}>
                            ✕
                        </button>
                    </div>
                </div>

                <div className="editor-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'html' ? 'active' : ''}`}
                        onClick={() => setActiveTab('html')}
                    >
                        📝 HTML
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'css' ? 'active' : ''}`}
                        onClick={() => setActiveTab('css')}
                    >
                        🎨 CSS
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'js' ? 'active' : ''}`}
                        onClick={() => setActiveTab('js')}
                    >
                        ⚡ JavaScript
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('preview')}
                    >
                        👁️ Предпросмотр
                    </button>
                </div>

                <div className="editor-content">
                    {activeTab === 'html' && (
                        <textarea
                            value={html}
                            onChange={(e) => setHtml(e.target.value)}
                            placeholder="Введите HTML код..."
                            className="code-editor"
                            spellCheck="false"
                        />
                    )}

                    {activeTab === 'css' && (
                        <textarea
                            value={css}
                            onChange={(e) => setCss(e.target.value)}
                            placeholder="Введите CSS стили..."
                            className="code-editor"
                            spellCheck="false"
                        />
                    )}

                    {activeTab === 'js' && (
                        <textarea
                            value={js}
                            onChange={(e) => setJs(e.target.value)}
                            placeholder="Введите JavaScript код..."
                            className="code-editor"
                            spellCheck="false"
                        />
                    )}

                    {activeTab === 'preview' && (
                        <iframe
                            srcDoc={renderPreview()}
                            className="preview-frame"
                            title="ZeroBlock Preview"
                        />
                    )}
                </div>

                <div className="editor-footer">
                    <div className="footer-tips">
                        💡 <strong>Совет:</strong> Используйте ZeroBlock для кастомных элементов!
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ZeroBlockEditor;