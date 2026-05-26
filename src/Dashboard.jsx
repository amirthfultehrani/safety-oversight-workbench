import React, { useState, useRef, useCallback } from 'react';
import { Activity, AlertCircle, Lock } from 'lucide-react';

export default function Dashboard({ data, dialogue, hoveredTurnIndex, onHoverTurn, onClickTurn, isFinalTurnConcealed }) {
  const [hoveredMetric, setHoveredMetric] = useState(false);
  const hoverTimeoutRef = useRef(null);

  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const n = data ? (data.driftHistory ? data.driftHistory.length : 0) : 0;
  const lastIndex = n - 1;

  // Dynamically position the critical turn line & label at the actual turn it specifies
  const match = data?.criticalTurnText ? data.criticalTurnText.match(/T(\d+)/) : null;
  const criticalIndex = match ? parseInt(match[1], 10) - 1 : lastIndex;
  const criticalX = n > 1 ? criticalIndex * (100 / (n - 1)) : 100;
  const criticalY = n > 0 && data?.driftHistory ? 40 - (data.driftHistory[criticalIndex] / 100) * 32 : 40;

  const getTurnMessage = (idx) => {
    if (!dialogue) return null;
    const aiTurns = dialogue.filter(t => t.role === 'ai');
    return aiTurns[idx] || aiTurns[aiTurns.length - 1];
  };

  const hasHoveredTurn = hoveredTurnIndex !== null && data?.driftHistory && hoveredTurnIndex >= 0 && hoveredTurnIndex < data.driftHistory.length;
  const hoveredTurn = hasHoveredTurn ? getTurnMessage(hoveredTurnIndex) : null;
  const hoveredVal = hasHoveredTurn ? data.driftHistory[hoveredTurnIndex] : null;
  const svgCx = hasHoveredTurn ? hoveredTurnIndex * (100 / (data.driftHistory.length - 1)) : 0;
  const svgCy = hasHoveredTurn ? 40 - (hoveredVal / 100) * 32 : 0;

  const handleHover = useCallback((idx) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (onHoverTurn) onHoverTurn(idx);
  }, [onHoverTurn]);

  const handleLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      if (onHoverTurn) onHoverTurn(null);
    }, 80);
  }, [onHoverTurn]);

  const handleClick = useCallback((idx) => {
    if (onClickTurn) onClickTurn(idx);
  }, [onClickTurn]);

  if (!data) return null;

  const getRiskLabel = (val) => {
    if (val > 70) return { text: 'HIGH RISK', color: '#f43f5e', icon: '⚠' };
    if (val > 40) return { text: 'MODERATE', color: '#f59e0b', icon: '⚡' };
    return { text: 'LOW RISK', color: '#22c55e', icon: '✓' };
  };

  const getTooltipStyle = (idx) => {
    let transform = 'translate(-50%, -100%)';
    let arrowLeft = '50%';
    if (idx === 0) {
      transform = 'translate(-15%, -100%)';
      arrowLeft = '15%';
    } else if (idx === lastIndex) {
      transform = 'translate(-85%, -100%)';
      arrowLeft = '85%';
    }
    return { transform, arrowLeft };
  };

  return (
    <div className="glass-panel p-5 flex flex-col gap-4 flex-1 min-h-0 h-full">
      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b border-dark-700 pb-2 flex items-center gap-2">
        <Activity size={16} /> Drift Dashboard
      </h2>
      <div className="space-y-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-xs text-gray-500 mb-1">Session Risk Profile</div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 flex-1 bg-dark-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-frontier-amber to-frontier-red w-full"></div>
            </div>
            <span className="text-xs font-mono text-frontier-red font-bold">{data.riskProfile}</span>
          </div>
        </div>
        
        <div className="bg-dark-900/50 p-3 rounded border border-frontier-red/30 shrink-0">
          <div className="text-xs text-frontier-red font-semibold mb-1 flex items-center gap-1">
            <AlertCircle size={12} /> {data.metricType}
          </div>
          <div className="text-xs text-gray-400 break-words leading-relaxed">
            {data.description}
          </div>
        </div>
        
        <div className="bg-dark-900 rounded-lg p-4 border border-dark-700/50 relative flex-1 flex flex-col min-h-0 justify-between">
          <div className="text-sm font-semibold mb-3 flex items-center justify-between">
            <span className="text-gray-300 flex items-center gap-2">
              <Activity size={16} className="text-frontier-red" />
              Drift Graph
            </span>
            <div className="relative flex items-center">
              <span 
                className="text-frontier-red font-mono bg-frontier-red/10 px-2 py-0.5 rounded text-xs border border-frontier-red/20 cursor-help"
                onMouseEnter={() => setHoveredMetric(true)}
                onMouseLeave={() => setHoveredMetric(false)}
              >
                {data.metricValue}
              </span>
              {data.metricTooltip && hoveredMetric && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-dark-900 border border-frontier-red/30 text-gray-300 text-[11px] p-3 rounded-lg shadow-2xl z-[100] pointer-events-none">
                  <div className="absolute -top-1.5 right-4 w-3 h-3 bg-dark-900 border-l border-t border-frontier-red/30 rotate-45"></div>
                  <div className="font-bold text-frontier-red text-xs mb-1.5 pb-1.5 border-b border-dark-700">
                    {data.metricType}
                  </div>
                  <div className="leading-relaxed">{data.metricTooltip}</div>
                </div>
              )}
            </div>
          </div>
          
          {/* SVG Graph Container */}
          <div className="flex-1 flex items-center min-h-0 relative">
            <svg viewBox="-14 -14 128 75" className="w-full h-full overflow-visible">
              {/* Y-axis title (rotated) */}
              <text x="-12" y="24" fontSize="3.5" fill="#9ca3af" textAnchor="middle" transform="rotate(-90, -12, 24)" fontWeight="600" letterSpacing="0.5">Alignment Drift</text>

              {/* Background Grid */}
              <line x1="0" y1="8" x2="100" y2="8" stroke="#2c3145" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="16" x2="100" y2="16" stroke="#2c3145" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="24" x2="100" y2="24" stroke="#2c3145" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="32" x2="100" y2="32" stroke="#2c3145" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="40" x2="100" y2="40" stroke="#2c3145" strokeWidth="0.5" strokeDasharray="2,2" />
              
              {/* Y-axis labels */}
              <text x="-3" y="9.5" fontSize="3.5" fill="#6b7280" textAnchor="end">1.0</text>
              <text x="-3" y="17.5" fontSize="3.5" fill="#6b7280" textAnchor="end">0.75</text>
              <text x="-3" y="25.5" fontSize="3.5" fill="#6b7280" textAnchor="end">0.50</text>
              <text x="-3" y="33.5" fontSize="3.5" fill="#6b7280" textAnchor="end">0.25</text>
              <text x="-3" y="41.5" fontSize="3.5" fill="#6b7280" textAnchor="end">0.0</text>

              {/* X-axis title */}
              <text x="50" y="58" fontSize="3.5" fill="#9ca3af" textAnchor="middle" fontWeight="600" letterSpacing="0.5">Conversation Turn</text>

              {/* Dynamic Sparkline Polyline */}
              {data.driftHistory && (
                <polyline 
                  points={data.driftHistory.map((val, i) => `${i * (100 / (data.driftHistory.length - 1))},${40 - (val / 100) * 32}`).join(' ')}
                  fill="none" 
                  stroke="#f43f5e" 
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="sparkline-path drop-shadow-[0_2px_4px_rgba(244,63,94,0.6)]"
                />
              )}
              
              {/* Interactive Hover Nodes */}
              {data.driftHistory && data.driftHistory.map((val, idx) => {
                const cx = idx * (100 / (data.driftHistory.length - 1));
                const cy = 40 - (val / 100) * 32;
                const isLast = idx === lastIndex;
                return (
                  <g key={idx} className="cursor-pointer">
                    {/* Large invisible hit target — sits on top of everything */}
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r="6" 
                      fill="transparent"
                      stroke="transparent"
                      strokeWidth="10"
                      className="cursor-pointer"
                      onMouseEnter={() => handleHover(idx)}
                      onMouseLeave={handleLeave}
                      onClick={() => handleClick(idx)}
                    />
                    {/* Visible node dot */}
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={hoveredTurnIndex === idx ? "4" : isLast ? "4" : "2.2"} 
                      fill={hoveredTurnIndex === idx ? "#f43f5e" : "#151821"} 
                      stroke="#f43f5e" 
                      strokeWidth={hoveredTurnIndex === idx ? "2.5" : isLast ? "2" : "1.75"} 
                      className={`pointer-events-none ${isLast ? 'animate-pulse' : ''}`}
                    />
                  </g>
                );
              })}

              {/* Critical turn label (text only, no separate marker circle) */}
              {n > 0 && (
                <g className="pointer-events-none">
                  <line 
                    x1={criticalX} 
                    y1={criticalY} 
                    x2={criticalX} 
                    y2="42" 
                    stroke="#f43f5e" 
                    strokeWidth="0.5" 
                    className="opacity-40" 
                  />
                  {/* Background rect mask to block background grid lines cleanly */}
                  <rect
                    x={criticalX - 18}
                    y={criticalY - 11.5}
                    width="36"
                    height="6.5"
                    fill="var(--color-dark-900)"
                    rx="1"
                  />
                  {/* Primary text */}
                  <text 
                    x={criticalX} 
                    y={criticalY - 7} 
                    fontSize="5" 
                    fill="#f43f5e" 
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {data.criticalTurnText || `T${n} (Critical)`}
                  </text>
                </g>
              )}
              
              {/* X-axis labels */}
              {data.driftHistory && data.driftHistory.map((val, idx) => {
                const cx = idx * (100 / (data.driftHistory.length - 1));
                return (
                  <text 
                    key={idx}
                    x={cx} 
                    y="50" 
                    fontSize="4.5" 
                    fill={hoveredTurnIndex === idx ? "#f43f5e" : "#6b7280"} 
                    fontWeight={hoveredTurnIndex === idx ? "bold" : "normal"}
                    textAnchor="middle"
                    className="cursor-pointer"
                    onMouseEnter={() => handleHover(idx)}
                    onMouseLeave={handleLeave}
                    onClick={() => handleClick(idx)}
                  >
                    Turn {idx + 1}
                  </text>
                );
              })}
            </svg>

            {/* HTML Floating Tooltip — positioned dynamically via static CSS calculations */}
            {hasHoveredTurn && hoveredTurn && hoveredVal !== null && (() => {
              const risk = getRiskLabel(hoveredVal);
              const isConcealed = hoveredTurnIndex === lastIndex && isFinalTurnConcealed;
              const { transform, arrowLeft } = getTooltipStyle(hoveredTurnIndex);
              return (
                <div 
                  className="absolute z-[200] pointer-events-none"
                  style={{
                    left: `${((svgCx + 14) / 128) * 100}%`,
                    top: `calc(${((svgCy + 14) / 75) * 100}% - 8px)`,
                    transform: transform
                  }}
                >
                  <div className="bg-dark-800 border border-dark-600 rounded-xl p-3 shadow-2xl w-64 text-left border-dark-600/80">
                    {/* Arrow */}
                    <div className="absolute bottom-[-6px] w-3 h-3 bg-dark-800 border-r border-b border-dark-600" style={{ left: arrowLeft, transform: 'translateX(-50%) rotate(45deg)' }}></div>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-1.5 pb-1.5 border-b border-dark-700">
                      <span className="text-[10px] font-bold text-frontier-red flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-frontier-red animate-pulse"></span>
                        Turn {hoveredTurnIndex + 1}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ color: risk.color, backgroundColor: risk.color + '15', border: `1px solid ${risk.color}33` }}>
                        {hoveredVal}%
                      </span>
                    </div>
                    {/* Content preview */}
                    {isConcealed ? (
                      <div className="mb-1.5 p-2 bg-frontier-red/10 border border-frontier-red/20 rounded flex flex-col items-center justify-center gap-1">
                        <Lock size={12} className="text-frontier-red" />
                        <span className="text-[9px] text-frontier-red font-bold uppercase tracking-wider text-center">Final Turn Concealed</span>
                        <span className="text-[8px] text-gray-400 text-center leading-tight">Complete Adjudication to Unlock</span>
                        <div className="mt-1 text-[8px] text-white bg-frontier-red px-2 py-0.5 rounded font-bold uppercase tracking-widest animate-pulse">Click to open Adjudication Gate</div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[10px] text-gray-300 leading-relaxed mb-1.5 italic" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          "{hoveredTurn.content.substring(0, 100)}{hoveredTurn.content.length > 100 ? '...' : ''}"
                        </p>
                        <div className="text-[8px] text-frontier-blue font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                          <span>✦</span> <span>Click to jump to this response</span>
                        </div>
                      </div>
                    )}
                    {/* Risk bar */}
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider" style={{ color: risk.color }}>
                        <span>{risk.icon}</span> <span>{risk.text}</span>
                      </span>
                      <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${hoveredVal}%`, backgroundColor: risk.color }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Bottom Info Panel */}
          <div className="mt-3 relative bg-dark-900 border border-dark-700/60 rounded-lg p-3 flex flex-col justify-center min-h-[52px] shadow-inner">
            {hoveredTurnIndex !== null && hoveredTurn ? (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-frontier-red tracking-wider uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-frontier-red animate-pulse"></span>
                    Turn {hoveredTurnIndex + 1}: AI Response
                  </span>
                  <span className="text-[10px] font-mono bg-frontier-red/10 text-frontier-red px-2 py-0.5 rounded border border-frontier-red/20 font-extrabold">
                    DRIFT: {data.driftHistory[hoveredTurnIndex]}%
                  </span>
                </div>
                {(hoveredTurnIndex === lastIndex && isFinalTurnConcealed) ? (
                  <div className="flex items-center justify-between gap-2 mt-1 bg-frontier-red/5 p-2 rounded border border-frontier-red/10 cursor-pointer hover:bg-frontier-red/10 transition-colors" onClick={() => handleClick(hoveredTurnIndex)}>
                    <div className="flex items-center gap-2">
                      <Lock size={14} className="text-frontier-red animate-pulse" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-frontier-red font-bold">CONCEALED:</span>
                        <span className="text-[9px] text-gray-400">Click to start the required Pre-Commitment Adjudication.</span>
                      </div>
                    </div>
                    <span className="text-[9px] bg-frontier-red text-white px-2 py-1 rounded font-bold uppercase tracking-wider shrink-0 animate-pulse">Start Adjudication</span>
                  </div>
                ) : (
                  <div className="cursor-pointer group/bottom-panel" onClick={() => handleClick(hoveredTurnIndex)}>
                    <p className="text-[11px] text-gray-300 leading-relaxed italic group-hover/bottom-panel:text-white transition-colors" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      "{hoveredTurn.content}"
                    </p>
                    <div className="text-[9px] text-frontier-blue font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1.5 opacity-80 group-hover/bottom-panel:opacity-100 transition-opacity">
                      <span>✦</span> <span>Click to scroll to this response in transcript</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-1">
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide flex items-center justify-center gap-2">
                  <Activity size={14} className="text-frontier-red/50" />
                  Hover over any node or turn label to inspect AI responses
                </div>
                <div className="text-[10px] text-gray-600 mt-0.5">Each point tracks how far the model drifted from its safety baseline</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
