import { useEffect, useState } from 'react';

export default function ToolCard({ tool, index }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), index * 140);
    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <div
      className="tool-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.45s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.05}s`,
        '--tool-color': tool.color,
      }}
    >
      <div className="tool-card-header">
        <div
          className="tool-icon"
          style={{
            background: `linear-gradient(135deg, ${tool.color}28, ${tool.color}0a)`,
            border: `1px solid ${tool.color}40`,
          }}
        >
          {tool.emoji}
        </div>
        <div className="tool-content">
          <div className="tool-meta">
            {tool.rank && (
              <span
                className="tool-rank-badge"
                style={{
                  background: tool.rank === 1 ? 'linear-gradient(135deg, #c9a96e, #a07e45)' :
                    tool.rank === 2 ? 'linear-gradient(135deg, #94a3b8, #64748b)' :
                      'linear-gradient(135deg, #b45309, #92400e)',
                  color: '#fff',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  padding: '2px 8px',
                  letterSpacing: '0.04em',
                }}
              >
                #{tool.rank}
              </span>
            )}
            <span className="tool-name">{tool.name}</span>
            {tool.model && (
              <span
                className="tool-model-badge"
                style={{
                  background: `${tool.color}18`,
                  color: tool.color,
                  border: `1px solid ${tool.color}35`,
                }}
              >
                {tool.model}
              </span>
            )}
            <span className={`tool-free-badge ${tool.free ? 'free' : 'paid'}`}>
              {tool.free ? '✓ Free tier' : '$ Paid'}
            </span>
          </div>
          {tool.why_best && (
            <div
              style={{
                fontSize: '13px',
                color: tool.rank === 1 ? '#c9a96e' : '#9d9b96',
                fontStyle: 'italic',
                marginBottom: '4px',
                fontFamily: "'Crimson Text', serif",
                lineHeight: 1.5,
              }}
            >
              {tool.rank === 1 ? '★ ' : ''}
              {tool.why_best}
            </div>
          )}
          <p className="tool-description">{tool.description}</p>
          {tool.steps && (
            <div className="tool-steps">
              <div className="tool-steps-label">How to start</div>
              {tool.steps.map((step, stepIndex) => (
                <div key={stepIndex} className="tool-step">
                  <span className="tool-step-num" style={{ color: tool.color }}>
                    {stepIndex + 1}.
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          )}
          {tool.url && (
            <a
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              className="tool-link"
              style={{ color: tool.color }}
            >
              → {tool.url.replace('https://', '').replace('www.', '')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
