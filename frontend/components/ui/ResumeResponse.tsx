"use client";

import { useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, PieChart, Pie, Cell, Legend,
  RadialBarChart, RadialBar,
} from "recharts";
import {
  AlertTriangle, ShieldCheck, TrendingUp, Target, Zap, CheckCircle,
  XCircle, AlertCircle, Code, Star, Briefcase, Award, User, Mail,
  Phone, Github, Linkedin, Globe, MapPin, ChevronRight, ArrowRight,
  BarChart2, FileText, Brain, Layers, Hash, Eye, BookOpen, Activity,
} from "lucide-react";
import { ResumeAnalysisResponse } from "@/type";

interface ResumeResponseProps {
  data: ResumeAnalysisResponse;
}
const C = {
  emerald:"#10b981", blue:"#3b82f6", indigo:"#6366f1",
  amber:"#f59e0b", rose:"#f43f5e", violet:"#8b5cf6",
  cyan:"#06b6d4", slate:"#64748b",
};

const TT = { background:"#18181b", border:"1px solid #27272a", borderRadius:8, color:"#f4f4f5", fontSize:12 };

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Sora:wght@700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
::-webkit-scrollbar{width:5px;height:5px;}::-webkit-scrollbar-track{background:#18181b;}::-webkit-scrollbar-thumb{background:#3f3f46;border-radius:3px;}
.riq{font-family:'DM Sans',sans-serif;background:#09090b;min-height:100vh;color:#f4f4f5;overflow-x:hidden;}

/* HEADER */
.riq-hdr{background:linear-gradient(135deg,#0f172a 0%,#09090b 70%);border-bottom:1px solid #27272a;padding:18px 16px 0;position:sticky;top:0;z-index:50;backdrop-filter:blur(12px);}
@media(min-width:640px){.riq-hdr{padding:22px 24px 0;}}
@media(min-width:1024px){.riq-hdr{padding:24px 40px 0;}}
.riq-hdr-inner{max-width:1400px;margin:0 auto;}
.riq-brand{display:flex;align-items:center;gap:10px;margin-bottom:16px;}
.riq-brand-icon{background:linear-gradient(135deg,#10b981,#06b6d4);border-radius:10px;padding:7px;flex-shrink:0;}
.riq-brand h1{font-family:'Sora',sans-serif;font-size:clamp(15px,2.5vw,20px);font-weight:800;color:#f4f4f5;white-space:nowrap;}
.riq-brand p{font-size:10px;color:#71717a;margin-top:1px;}

/* TABS */
.riq-tabs{display:flex;gap:2px;overflow-x:auto;scrollbar-width:none;padding-bottom:0;}
.riq-tabs::-webkit-scrollbar{display:none;}
.riq-tab{padding:7px 12px;font-size:11px;font-weight:600;cursor:pointer;border:none;border-radius:8px 8px 0 0;border-bottom:2px solid transparent;text-transform:capitalize;letter-spacing:.03em;white-space:nowrap;transition:all .2s;background:transparent;color:#71717a;flex-shrink:0;}
@media(min-width:640px){.riq-tab{padding:8px 16px;font-size:12px;}}
.riq-tab.active{background:rgba(16,185,129,.1);color:#10b981;border-bottom-color:#10b981;}

/* MAIN */
.riq-main{max-width:1400px;margin:0 auto;padding:18px 14px 80px;}
@media(min-width:640px){.riq-main{padding:22px 20px 80px;}}
@media(min-width:1024px){.riq-main{padding:28px 40px 80px;}}

/* CARD */
.card{background:#18181b;border:1px solid #27272a;border-radius:14px;overflow:hidden;}
.cp{padding:14px;}
@media(min-width:640px){.cp{padding:18px;}}
@media(min-width:1024px){.cp{padding:22px;}}
.cplg{padding:18px;}
@media(min-width:640px){.cplg{padding:22px;}}
@media(min-width:1024px){.cplg{padding:28px;}}

/* RESPONSIVE GRIDS */
.g-hero{display:grid;grid-template-columns:1fr;gap:12px;}
@media(min-width:640px){.g-hero{grid-template-columns:1fr 1fr;}}
@media(min-width:1024px){.g-hero{grid-template-columns:250px 1fr 1fr 1fr;gap:16px;}}

.g-charts{display:grid;grid-template-columns:1fr;gap:12px;}
@media(min-width:768px){.g-charts{grid-template-columns:1fr 1fr;}}
@media(min-width:1200px){.g-charts{grid-template-columns:1fr 1fr 1fr;gap:16px;}}

.g-scores{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
@media(min-width:768px){.g-scores{grid-template-columns:repeat(3,1fr);}}
@media(min-width:1200px){.g-scores{grid-template-columns:repeat(5,1fr);gap:12px;}}

.g-3col{display:grid;grid-template-columns:1fr;gap:12px;}
@media(min-width:640px){.g-3col{grid-template-columns:1fr 1fr;}}
@media(min-width:1024px){.g-3col{grid-template-columns:1fr 1fr 1fr;gap:16px;}}

.g-2col{display:grid;grid-template-columns:1fr;gap:12px;}
@media(min-width:768px){.g-2col{grid-template-columns:1fr 1fr;gap:16px;}}

.g-2meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;}

.g-4stat{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
@media(min-width:1024px){.g-4stat{grid-template-columns:repeat(4,1fr);gap:12px;}}

.g-3stat{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
@media(min-width:640px){.g-3stat{grid-template-columns:repeat(3,1fr);gap:14px;}}

.g-summary{display:grid;grid-template-columns:1fr;gap:12px;}
@media(min-width:1024px){.g-summary{grid-template-columns:1fr 2fr;gap:16px;}}

.g-ba{display:grid;grid-template-columns:1fr;gap:10px;}
@media(min-width:640px){.g-ba{grid-template-columns:1fr 1fr;gap:14px;}}

/* UTILS */
.stack{display:flex;flex-direction:column;}
.gap-12{gap:12px;}
.gap-16{gap:16px;}

.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:99px;font-size:11px;font-weight:600;}
.chip{display:inline-block;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:500;margin:3px;}
.sec-title{font-size:clamp(12px,1.4vw,14px);font-weight:700;margin-bottom:12px;}
.meta-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#52525b;margin-bottom:5px;}
.stat-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #27272a;gap:8px;}
.stat-row:last-child{border-bottom:none;}
.s-lbl{font-size:12px;color:#71717a;flex-shrink:0;}
.s-val{font-size:12px;font-weight:600;color:#f4f4f5;text-align:right;}
.inner{background:#09090b;border:1px solid #27272a;border-radius:10px;padding:12px;}
.meta-row{font-size:11px;color:#71717a;display:flex;align-items:center;gap:6px;margin-bottom:12px;text-transform:uppercase;letter-spacing:.06em;}

@keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
.fu{animation:fadeUp .35s ease both;}

.radial-c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.big-n{font-family:'Sora',sans-serif;font-size:clamp(24px,5vw,34px);font-weight:900;color:#10b981;line-height:1;}
`;

export default function ResumeResponse({ data }: ResumeResponseProps) {
  const [tab, setTab] = useState("overview");
  const { scoreBreakdown: sb, competitivePositioning: cp, keywordGapAnalysis: kga, roleAlignment: ra } = data;

  const radarData = [
    { c:"Format",     v:sb.formatting.score },
    { c:"Keywords",   v:sb.keywords.score },
    { c:"Structure",  v:sb.structure.score },
    { c:"Readable",   v:sb.readability.score },
    { c:"Impact",     v:sb.impact.score },
  ];
  const compBar = [
    { name:"Avg Resume",  score:cp.comparisonToAverage.averageATSScore, fill:C.slate },
    { name:"Your Resume", score:cp.comparisonToAverage.yourScore,       fill:C.emerald },
    { name:"After Fixes", score:data.estimatedScoreAfterFixes,          fill:C.indigo },
  ];
  const catBar = [
    { name:"Format",   score:sb.formatting.score,  fill:C.blue },
    { name:"Keywords", score:sb.keywords.score,    fill:C.indigo },
    { name:"Structure",score:sb.structure.score,   fill:C.emerald },
    { name:"Readable", score:sb.readability.score, fill:C.amber },
    { name:"Impact",   score:sb.impact.score,      fill:C.violet },
  ];
  const kwPie = [
    { name:"Matched", value:kga.matchedKeywords.length,  fill:C.emerald },
    { name:"Missing", value:kga.missingKeywords.length,  fill:C.rose },
  ];
  const radial = [{ name:"ATS", value:data.atsScore, fill:C.emerald }];
  const TABS = ["overview","keywords","risks","sections","alignment","suggestions"];

  return (
    <div className="riq">
      <style>{CSS}</style>

      {/* HEADER */}
      <div className="riq-hdr">
        <div className="riq-hdr-inner">
          <div className="riq-brand">
            <div className="riq-brand-icon"><FileText size={18} color="#fff"/></div>
            <div>
              <h1>ResumeIQ <span style={{color:"#10b981"}}>Analysis</span></h1>
              <p>Full ATS Compatibility Report · {new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</p>
            </div>
          </div>
          <div className="riq-tabs">
            {TABS.map(t=>(
              <button key={t} className={`riq-tab${tab===t?" active":""}`} onClick={()=>setTab(t)}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="riq-main">

        {/* ── OVERVIEW ── */}
        {tab==="overview" && (
          <div className="stack gap-12 fu">

            {/* Hero row */}
            <div className="g-hero">

              {/* Radial ATS */}
              <div className="card cp" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"20px 14px"}}>
                <p style={{fontSize:10,color:"#71717a",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>ATS Score</p>
                <div style={{position:"relative",width:"min(140px,38vw)",height:"min(140px,38vw)",margin:"0 auto"}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart innerRadius="58%" outerRadius="84%" data={radial} startAngle={90} endAngle={-270} barSize={11}>
                      <RadialBar background={{fill:"#27272a"}} dataKey="value" cornerRadius={6}/>
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="radial-c">
                    <span className="big-n">{data.atsScore}</span>
                    <span style={{fontSize:10,color:"#71717a"}}>/100</span>
                  </div>
                </div>
                <span className="badge" style={{background:"rgba(16,185,129,.15)",color:C.emerald,marginTop:10}}>
                  <TrendingUp size={10}/> {cp.comparisonToAverage.percentile}
                </span>
                <p style={{fontSize:11,color:"#71717a",marginTop:6}}>After fixes: <strong style={{color:C.indigo}}>{data.estimatedScoreAfterFixes}</strong></p>
              </div>

              {/* Market pos */}
              <div className="card cp">
                <p className="meta-row"><BarChart2 size={12}/> Market Position</p>
                <div style={{fontFamily:"'Sora',sans-serif",fontSize:"clamp(18px,3vw,26px)",fontWeight:800,marginBottom:4}}>{cp.comparisonToAverage.percentile}</div>
                <p style={{fontSize:11,color:"#71717a",marginBottom:12}}>{cp.marketLevel}</p>
                <div className="g-2meta">
                  {[
                    {label:"ATS Pass",        val:cp.atsPassProbability,            color:C.emerald},
                    {label:"Shortlist",        val:cp.recruiterShortlistProbability, color:C.blue},
                    {label:"Auto-Reject Risk", val:cp.riskOfAutoRejection,          color:C.amber},
                    {label:"Avg ATS Score",    val:`${cp.comparisonToAverage.averageATSScore}/100`, color:C.slate},
                  ].map(m=>(
                    <div key={m.label} className="inner" style={{padding:"8px 10px"}}>
                      <p style={{fontSize:9,color:"#52525b"}}>{m.label}</p>
                      <p style={{fontSize:13,fontWeight:700,color:m.color,marginTop:2}}>{m.val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role alignment */}
              <div className="card cp">
                <p className="meta-row"><Target size={12}/> Role Alignment</p>
                <div style={{fontFamily:"'Sora',sans-serif",fontSize:"clamp(20px,3.5vw,28px)",fontWeight:800,color:C.indigo,marginBottom:4}}>{ra.alignmentScore}%</div>
                <p style={{fontSize:11,color:"#a1a1aa",marginBottom:6}}>{ra.detectedPrimaryRole}</p>
                <span className="badge" style={{background:"rgba(99,102,241,.15)",color:C.indigo,marginBottom:12}}>{ra.roleMatchStrength}</span>
                <p style={{fontSize:10,color:"#52525b",marginBottom:5}}>Alternate Roles</p>
                {ra.alternateRoles.map(r=>(
                  <div key={r} style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                    <ChevronRight size={10} color={C.indigo}/>
                    <span style={{fontSize:11,color:"#a1a1aa"}}>{r}</span>
                  </div>
                ))}
              </div>

              {/* Employment */}
              <div className="card cp">
                <p className="meta-row"><Briefcase size={12}/> Employment</p>
                {[
                  {label:"Experience",   val:`${data.employmentHistory.totalYearsExperience} yrs`},
                  {label:"Employed",     val:data.employmentHistory.currentlyEmployed?"Yes":"No"},
                  {label:"Job Hop Risk", val:data.employmentHistory.jobHoppingRisk},
                  {label:"Growth",       val:data.employmentHistory.careerProgression},
                  {label:"Gaps",         val:data.employmentHistory.employmentGaps.length===0?"None":data.employmentHistory.employmentGaps.join(", ")},
                ].map(m=>(
                  <div key={m.label} className="stat-row">
                    <span className="s-lbl">{m.label}</span>
                    <span className="s-val">{m.val}</span>
                  </div>
                ))}
                <p style={{fontSize:11,color:"#71717a",marginTop:8,lineHeight:1.6}}>{data.employmentHistory.notes}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="g-charts">
              <div className="card cp">
                <p className="sec-title">Score Radar</p>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#27272a"/>
                    <PolarAngleAxis dataKey="c" tick={{fill:"#71717a",fontSize:10}}/>
                    <PolarRadiusAxis angle={30} domain={[0,100]} tick={{fill:"#52525b",fontSize:8}}/>
                    <Radar dataKey="v" stroke={C.emerald} fill={C.emerald} fillOpacity={0.25} strokeWidth={2} dot={{fill:C.emerald,r:3}}/>
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="card cp">
                <p className="sec-title">Score vs Market</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={compBar} layout="vertical" barSize={14} margin={{left:4,right:12}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false}/>
                    <XAxis type="number" domain={[0,100]} tick={{fill:"#71717a",fontSize:10}}/>
                    <YAxis type="category" dataKey="name" tick={{fill:"#a1a1aa",fontSize:10}} width={76}/>
                    <Tooltip contentStyle={TT}/>
                    <Bar dataKey="score" radius={[0,6,6,0]}>{compBar.map((d,i)=><Cell key={i} fill={d.fill}/>)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card cp">
                <p className="sec-title">Category Breakdown</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={catBar} barSize={20} margin={{left:0,right:6}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false}/>
                    <XAxis dataKey="name" tick={{fill:"#71717a",fontSize:10}}/>
                    <YAxis domain={[0,100]} tick={{fill:"#71717a",fontSize:10}}/>
                    <Tooltip contentStyle={TT}/>
                    <Bar dataKey="score" radius={[5,5,0,0]}>{catBar.map((d,i)=><Cell key={i} fill={d.fill}/>)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Score category cards */}
            <div className="g-scores">
              {[
                {label:"Formatting",  icon:<Layers size={14}/>,   color:C.blue,   d:sb.formatting},
                {label:"Keywords",    icon:<Hash size={14}/>,     color:C.indigo, d:sb.keywords},
                {label:"Structure",   icon:<BookOpen size={14}/>, color:C.emerald,d:sb.structure},
                {label:"Readability", icon:<Eye size={14}/>,      color:C.amber,  d:sb.readability},
                {label:"Impact",      icon:<Activity size={14}/>, color:C.violet, d:sb.impact},
              ].map(({label,icon,color,d})=>(
                <div key={label} className="card cp">
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <div style={{color,background:`${color}18`,borderRadius:7,padding:5}}>{icon}</div>
                    <span style={{fontSize:9,color:"#52525b",fontWeight:600}}>{d.weight}</span>
                  </div>
                  <div style={{fontFamily:"'Sora',sans-serif",fontSize:"clamp(22px,4vw,30px)",fontWeight:800,color,lineHeight:1}}>{d.score}</div>
                  <div style={{fontSize:10,color:"#71717a",margin:"4px 0 8px"}}>{label}</div>
                  <div style={{height:3,background:"#27272a",borderRadius:99,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${d.score}%`,background:`linear-gradient(90deg,${color}80,${color})`,borderRadius:99}}/>
                  </div>
                  <p style={{fontSize:10,color:"#71717a",marginTop:8,lineHeight:1.6}}>{d.feedback?.slice(0,70)}…</p>
                </div>
              ))}
            </div>

            {/* Contact / Context / Wins */}
            <div className="g-3col">
              {/* Contact */}
              <div className="card cp">
                <p className="sec-title" style={{display:"flex",alignItems:"center",gap:7}}><User size={13} color={C.cyan}/> Contact Validation</p>
                {[
                  {label:"Email",     has:data.contactInfoValidation.hasEmail,     fmt:data.contactInfoValidation.emailFormat, icon:<Mail size={11}/>},
                  {label:"Phone",     has:data.contactInfoValidation.hasPhone,     fmt:data.contactInfoValidation.phoneFormat, icon:<Phone size={11}/>},
                  {label:"LinkedIn",  has:data.contactInfoValidation.hasLinkedIn,  icon:<Linkedin size={11}/>},
                  {label:"GitHub",    has:data.contactInfoValidation.hasGitHub,    icon:<Github size={11}/>},
                  {label:"Portfolio", has:data.contactInfoValidation.hasPortfolio, icon:<Globe size={11}/>},
                  {label:"Location",  has:data.contactInfoValidation.hasLocation,  icon:<MapPin size={11}/>},
                ].map(c=>(
                  <div key={c.label} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid #27272a"}}>
                    <span style={{color:c.has?C.emerald:"#52525b"}}>{c.icon}</span>
                    <span style={{flex:1,fontSize:12,color:c.has?"#f4f4f5":"#52525b"}}>{c.label}</span>
                    {c.fmt&&<span style={{fontSize:10,color:C.emerald}}>{c.fmt}</span>}
                    {c.has?<CheckCircle size={13} color={C.emerald}/>:<XCircle size={13} color={C.rose}/>}
                  </div>
                ))}
                {data.contactInfoValidation.missingCritical.map((m,i)=>(
                  <div key={i} style={{marginTop:8,background:"rgba(244,63,94,.08)",border:"1px solid rgba(244,63,94,.2)",borderRadius:8,padding:"7px 10px",fontSize:11,color:C.rose}}>⚠ {m}</div>
                ))}
              </div>

              {/* Context */}
              <div className="card cp">
                <p className="sec-title" style={{display:"flex",alignItems:"center",gap:7}}><Code size={13} color={C.violet}/> Auto-Detected Context</p>
                <div className="g-2meta" style={{marginBottom:12}}>
                  {[
                    {label:"Experience", val:data.autoDetectedContext.detectedExperienceLevel},
                    {label:"Domain",     val:data.autoDetectedContext.detectedDomain},
                    {label:"Words",      val:data.autoDetectedContext.resumeWordCount},
                    {label:"Pages",      val:data.autoDetectedContext.estimatedPages},
                  ].map(m=>(
                    <div key={m.label} className="inner" style={{padding:"8px 10px"}}>
                      <p style={{fontSize:9,color:"#52525b"}}>{m.label}</p>
                      <p style={{fontSize:11,fontWeight:600,color:"#f4f4f5",marginTop:2}}>{m.val}</p>
                    </div>
                  ))}
                </div>
                <p style={{fontSize:10,color:"#52525b",marginBottom:5}}>Primary Stack</p>
                <div style={{display:"flex",flexWrap:"wrap"}}>
                  {data.autoDetectedContext.primaryTechStack.map(t=>(
                    <span key={t} className="chip" style={{background:"rgba(139,92,246,.15)",color:C.violet,border:"1px solid rgba(139,92,246,.3)"}}>{t}</span>
                  ))}
                </div>
                <p style={{fontSize:10,color:"#52525b",marginTop:10,marginBottom:5}}>Inferred Target Roles</p>
                {data.autoDetectedContext.inferredTargetRoles.map(r=>(
                  <div key={r} style={{display:"flex",gap:5,alignItems:"flex-start",marginBottom:3}}>
                    <ChevronRight size={10} color={C.violet} style={{marginTop:2,flexShrink:0}}/>
                    <span style={{fontSize:11,color:"#a1a1aa",lineHeight:1.5}}>{r}</span>
                  </div>
                ))}
              </div>

              {/* Quick wins */}
              <div className="card cp">
                <p className="sec-title" style={{display:"flex",alignItems:"center",gap:7}}><Zap size={13} color={C.amber}/> Quick Wins</p>
                {data.quickWins.map((w,i)=>(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",padding:"9px 10px",background:"rgba(245,158,11,.06)",border:"1px solid rgba(245,158,11,.15)",borderRadius:9,marginBottom:7}}>
                    <span style={{color:C.amber,fontWeight:700,fontSize:12,flexShrink:0,marginTop:1}}>{i+1}</span>
                    <span style={{fontSize:11,color:"#d4d4d8",lineHeight:1.6}}>{w}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths + Summary */}
            <div className="g-summary">
              <div className="card cp">
                <p className="sec-title" style={{display:"flex",alignItems:"center",gap:7}}><Star size={13} color={C.emerald}/> Strengths</p>
                {data.strengths.map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:9}}>
                    <ShieldCheck size={13} color={C.emerald} style={{flexShrink:0,marginTop:2}}/>
                    <span style={{fontSize:12,color:"#d4d4d8",lineHeight:1.7}}>{s}</span>
                  </div>
                ))}
              </div>
              <div className="card cplg" style={{background:"linear-gradient(135deg,#0f2027,#18181b)"}}>
                <p className="sec-title" style={{display:"flex",alignItems:"center",gap:7}}><Brain size={13} color={C.cyan}/> Final Analysis Summary</p>
                <p style={{fontSize:"clamp(12px,1.3vw,14px)",color:"#a1a1aa",lineHeight:1.85}}>{data.summary}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── KEYWORDS ── */}
        {tab==="keywords" && (
          <div className="stack gap-12 fu">
            <div className="g-2col">
              <div className="card cp">
                <p className="sec-title">Keyword Coverage</p>
                <p style={{fontSize:11,color:"#71717a",marginBottom:14}}>For: {kga.forDetectedRole}</p>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={kwPie} cx="50%" cy="50%" innerRadius="52%" outerRadius="78%" paddingAngle={4} dataKey="value">
                      {kwPie.map((d,i)=><Cell key={i} fill={d.fill}/>)}
                    </Pie>
                    <Tooltip contentStyle={TT}/><Legend wrapperStyle={{fontSize:11,color:"#a1a1aa"}}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{display:"flex",justifyContent:"center",gap:20,marginTop:6}}>
                  {[
                    {label:"Matched",val:kga.matchedKeywords.length,color:C.emerald},
                    {label:"Missing",val:kga.missingKeywords.length,color:C.rose},
                    {label:"Score",  val:`${kga.matchScore}%`,      color:C.blue},
                  ].map(m=>(
                    <div key={m.label} style={{textAlign:"center"}}>
                      <div style={{fontFamily:"'Sora',sans-serif",fontSize:"clamp(18px,3vw,24px)",fontWeight:800,color:m.color}}>{m.val}</div>
                      <div style={{fontSize:10,color:"#71717a"}}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card cp">
                <p className="sec-title">Keyword Metrics</p>
                {[
                  {label:"Keyword Density",  val:sb.keywords.keywordDensity,          note:sb.keywords.densityAssessment,color:C.emerald},
                  {label:"Role Match %",      val:`${sb.keywords.roleMatchPercentage}%`,                               color:C.blue},
                  {label:"Detected Keywords", val:sb.keywords.detectedKeywords.length,                                 color:C.indigo},
                  {label:"Missing Critical",  val:sb.keywords.missingCriticalKeywords.length,                          color:C.rose},
                  {label:"ATS Compatibility", val:sb.formatting.atsCompatibility,                                      color:C.emerald},
                ].map(m=>(
                  <div key={m.label} className="stat-row">
                    <span className="s-lbl">{m.label}</span>
                    <span>
                      <span style={{fontSize:14,fontWeight:700,color:m.color}}>{m.val}</span>
                      {m.note&&<span style={{fontSize:10,color:C.emerald,marginLeft:5}}>· {m.note}</span>}
                    </span>
                  </div>
                ))}
                <div style={{marginTop:14}}>
                  <p style={{fontSize:10,color:"#52525b",marginBottom:7}}>Recommendations</p>
                  {kga.recommendations.map((r,i)=>(
                    <div key={i} style={{display:"flex",gap:7,alignItems:"flex-start",marginBottom:7}}>
                      <ArrowRight size={11} color={C.indigo} style={{flexShrink:0,marginTop:2}}/>
                      <span style={{fontSize:12,color:"#a1a1aa",lineHeight:1.6}}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="g-3col">
              {[
                {title:"Your Keywords",items:kga.yourKeywords,    color:C.blue,   bg:"rgba(59,130,246,.12)",  bd:"rgba(59,130,246,.3)"},
                {title:"✓ Matched",    items:kga.matchedKeywords, color:C.emerald,bg:"rgba(16,185,129,.12)",  bd:"rgba(16,185,129,.3)"},
                {title:"✗ Missing",    items:kga.missingKeywords, color:C.rose,   bg:"rgba(244,63,94,.12)",   bd:"rgba(244,63,94,.3)"},
              ].map(({title,items,color,bg,bd})=>(
                <div key={title} className="card cp">
                  <p className="sec-title" style={{color}}>{title}</p>
                  <div style={{display:"flex",flexWrap:"wrap"}}>
                    {items.map(k=><span key={k} className="chip" style={{background:bg,color,border:`1px solid ${bd}`}}>{k}</span>)}
                  </div>
                </div>
              ))}
            </div>

            <div className="card cp">
              <p className="sec-title" style={{display:"flex",alignItems:"center",gap:7}}><Award size={13} color={C.amber}/> Industry Standard Keywords</p>
              <div style={{display:"flex",flexWrap:"wrap"}}>
                {kga.industryStandardKeywords.map(k=>{
                  const ok=kga.matchedKeywords.includes(k);
                  return <span key={k} className="chip" style={{background:ok?"rgba(16,185,129,.12)":"rgba(244,63,94,.12)",color:ok?C.emerald:C.rose,border:`1px solid ${ok?"rgba(16,185,129,.3)":"rgba(244,63,94,.3)"}`}}>{ok?"✓":"✗"} {k}</span>;
                })}
              </div>
            </div>

            <div className="card cp">
              <p className="sec-title">All Detected Keywords</p>
              <div style={{display:"flex",flexWrap:"wrap"}}>
                {sb.keywords.detectedKeywords.map(k=><span key={k} className="chip" style={{background:"rgba(99,102,241,.12)",color:C.indigo,border:"1px solid rgba(99,102,241,.3)"}}>{k}</span>)}
              </div>
            </div>
          </div>
        )}

        {/* ── RISKS ── */}
        {tab==="risks" && (
          <div className="stack gap-12 fu">
            <div className="g-3stat">
              {[
                {label:"Total Risks",         val:data.parsingRisks.length,                                  color:C.rose},
                {label:"High Severity",        val:data.parsingRisks.filter(r=>r.severity==="high").length,   color:C.rose},
                {label:"Potential Score Gain", val:"+7 pts",                                                  color:C.emerald},
              ].map(m=>(
                <div key={m.label} className="card cp" style={{textAlign:"center"}}>
                  <div style={{fontFamily:"'Sora',sans-serif",fontSize:"clamp(26px,5vw,40px)",fontWeight:900,color:m.color}}>{m.val}</div>
                  <div style={{fontSize:11,color:"#71717a",marginTop:4}}>{m.label}</div>
                </div>
              ))}
            </div>
            {data.parsingRisks.map((risk,i)=>(
              <div key={i} className="card cplg" style={{borderLeft:`4px solid ${risk.severity==="high"?C.rose:C.amber}`}}>
                <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:12}}>
                  <h3 style={{fontSize:"clamp(12px,1.5vw,15px)",fontWeight:700,display:"flex",alignItems:"center",gap:7}}>
                    <AlertTriangle size={15} color={risk.severity==="high"?C.rose:C.amber}/>{risk.issue}
                  </h3>
                  <div style={{display:"flex",gap:6}}>
                    <span className="badge" style={{background:risk.severity==="high"?"rgba(244,63,94,.15)":"rgba(245,158,11,.15)",color:risk.severity==="high"?C.rose:C.amber}}>{risk.severity.toUpperCase()}</span>
                    <span className="badge" style={{background:"rgba(16,185,129,.15)",color:C.emerald}}>{risk.estimatedScoreImpact}</span>
                  </div>
                </div>
                <div className="g-2col" style={{gap:10}}>
                  <div className="inner">
                    <p className="meta-lbl">Impact</p>
                    <p style={{fontSize:12,color:"#d4d4d8",lineHeight:1.7}}>{risk.impact}</p>
                  </div>
                  <div style={{background:"rgba(16,185,129,.05)",border:"1px solid rgba(16,185,129,.2)",borderRadius:10,padding:12}}>
                    <p className="meta-lbl" style={{color:C.emerald}}>How to Fix</p>
                    <p style={{fontSize:12,color:"#d4d4d8",lineHeight:1.7}}>{risk.fix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SECTIONS ── */}
        {tab==="sections" && (
          <div className="stack gap-12 fu">
            <div className="g-4stat">
              {[
                {label:"Section Order",    val:sb.structure.sectionOrder,       ok:true},
                {label:"Date Consistency", val:sb.structure.dateConsistency,    ok:sb.structure.dateConsistency==="Consistent"},
                {label:"Tense",            val:sb.readability.tenseConsistency, ok:true},
                {label:"Grammar Issues",   val:sb.readability.grammarIssues,    ok:sb.readability.grammarIssues===0},
              ].map(m=>(
                <div key={m.label} className="card cp" style={{textAlign:"center"}}>
                  <div style={{marginBottom:6,display:"flex",justifyContent:"center"}}>
                    {m.ok?<CheckCircle size={20} color={C.emerald}/>:<AlertCircle size={20} color={C.amber}/>}
                  </div>
                  <div style={{fontSize:13,fontWeight:700,color:m.ok?C.emerald:C.amber}}>{m.val}</div>
                  <div style={{fontSize:10,color:"#71717a",marginTop:3}}>{m.label}</div>
                </div>
              ))}
            </div>

            <div className="g-2col">
              <div className="card cp">
                <p className="sec-title" style={{color:C.emerald}}>✓ Present Sections</p>
                <div style={{display:"flex",flexWrap:"wrap"}}>
                  {sb.structure.presentSections.map(s=><span key={s} className="chip" style={{background:"rgba(16,185,129,.12)",color:C.emerald,border:"1px solid rgba(16,185,129,.3)"}}>✓ {s}</span>)}
                </div>
                {sb.structure.missingSections.length===0&&(
                  <div style={{marginTop:12,padding:"8px 12px",background:"rgba(16,185,129,.08)",borderRadius:8,fontSize:11,color:C.emerald}}>🎉 No missing sections — perfect structure!</div>
                )}
              </div>
              <div className="card cp">
                <p className="sec-title">Readability Details</p>
                {[
                  {label:"Avg Bullet Length",   val:sb.readability.averageBulletLength},
                  {label:"Action Verb Strength", val:sb.readability.actionVerbStrength},
                  {label:"Tense Consistency",    val:sb.readability.tenseConsistency},
                  {label:"Grammar Issues",        val:`${sb.readability.grammarIssues} found`},
                ].map(m=>(
                  <div key={m.label} className="stat-row">
                    <span className="s-lbl">{m.label}</span>
                    <span className="s-val">{m.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {data.sectionAnalysis.map((sec,i)=>(
              <div key={i} className="card cp">
                <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:12}}>
                  <h3 style={{fontSize:"clamp(12px,1.4vw,14px)",fontWeight:700,display:"flex",alignItems:"center",gap:7}}>
                    <BookOpen size={13} color={C.cyan}/>{sec.section}
                  </h3>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <span className="badge" style={{background:"rgba(16,185,129,.15)",color:C.emerald}}>{sec.quality}</span>
                    {sec.present?<CheckCircle size={13} color={C.emerald}/>:<XCircle size={13} color={C.rose}/>}
                  </div>
                </div>
                <div className={sec.bulletPointCount?"g-3col":"g-2col"} style={{gap:10}}>
                  <div className="inner">
                    <p className="meta-lbl">Feedback</p>
                    <p style={{fontSize:12,color:"#d4d4d8",lineHeight:1.7}}>{sec.feedback}</p>
                  </div>
                  <div style={{background:"rgba(99,102,241,.05)",border:"1px solid rgba(99,102,241,.2)",borderRadius:10,padding:12}}>
                    <p className="meta-lbl" style={{color:C.indigo}}>Suggestion</p>
                    <p style={{fontSize:12,color:"#d4d4d8",lineHeight:1.7}}>{sec.suggestion}</p>
                  </div>
                  {sec.bulletPointCount&&(
                    <div className="inner">
                      <p className="meta-lbl">Bullets</p>
                      <div style={{display:"flex",gap:18,marginTop:4}}>
                        <div><div style={{fontFamily:"'Sora',sans-serif",fontSize:20,fontWeight:800,color:"#f4f4f5"}}>{sec.bulletPointCount}</div><div style={{fontSize:9,color:"#52525b"}}>Total</div></div>
                        <div><div style={{fontFamily:"'Sora',sans-serif",fontSize:20,fontWeight:800,color:C.emerald}}>{sec.quantifiedCount}</div><div style={{fontSize:9,color:"#52525b"}}>Quantified</div></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="card cplg">
              <p className="sec-title">Impact & Quantification</p>
              <p style={{fontSize:12,color:"#71717a",marginBottom:14}}>{sb.impact.feedback}</p>
              <div className="g-4stat" style={{marginBottom:16}}>
                {[
                  {label:"Total Bullets", val:sb.impact.totalBulletPoints,  color:"#f4f4f5"},
                  {label:"Quantified",    val:sb.impact.quantifiedBullets,  color:C.emerald},
                  {label:"Rate",          val:sb.impact.quantificationRate, color:C.blue},
                  {label:"Impact Level",  val:sb.impact.impactLevel,        color:C.amber},
                ].map(m=>(
                  <div key={m.label} className="inner" style={{textAlign:"center"}}>
                    <div style={{fontFamily:"'Sora',sans-serif",fontSize:"clamp(18px,3vw,24px)",fontWeight:800,color:m.color}}>{m.val}</div>
                    <div style={{fontSize:10,color:"#71717a",marginTop:3}}>{m.label}</div>
                  </div>
                ))}
              </div>
              <div style={{height:6,background:"#27272a",borderRadius:99}}>
                <div style={{height:"100%",width:sb.impact.quantificationRate,background:`linear-gradient(90deg,${C.emerald},${C.cyan})`,borderRadius:99}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
                <span style={{fontSize:10,color:"#52525b"}}>0%</span>
                <span style={{fontSize:10,color:C.emerald}}>{sb.impact.quantificationRate} quantified</span>
                <span style={{fontSize:10,color:"#52525b"}}>100%</span>
              </div>
            </div>
          </div>
        )}

        {/* ── ALIGNMENT ── */}
        {tab==="alignment" && (
          <div className="stack gap-12 fu">
            <div className="g-2col">
              <div className="card cplg" style={{boxShadow:"0 0 36px rgba(99,102,241,.1)"}}>
                <p className="meta-row">Primary Role Alignment</p>
                <div style={{fontFamily:"'Sora',sans-serif",fontSize:"clamp(38px,8vw,58px)",fontWeight:900,color:C.indigo,lineHeight:1}}>{ra.alignmentScore}%</div>
                <p style={{fontSize:"clamp(12px,1.3vw,14px)",color:"#f4f4f5",margin:"8px 0 6px"}}>{ra.detectedPrimaryRole}</p>
                <span className="badge" style={{background:"rgba(99,102,241,.15)",color:C.indigo,marginBottom:18}}>{ra.roleMatchStrength}</span>
                <div style={{height:7,background:"#27272a",borderRadius:99}}>
                  <div style={{height:"100%",width:`${ra.alignmentScore}%`,background:`linear-gradient(90deg,${C.indigo},${C.cyan})`,borderRadius:99}}/>
                </div>
              </div>
              <div className="card cp">
                <p className="sec-title">Recommended Job Titles</p>
                {ra.recommendedJobTitles.map((t,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 13px",background:"#09090b",borderRadius:9,marginBottom:7,border:"1px solid #27272a"}}>
                    <Briefcase size={12} color={C.blue}/><span style={{fontSize:12,color:"#f4f4f5"}}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="g-3col">
              {[
                {title:"Best Fit Companies",items:ra.bestFitCompanies,color:C.emerald,icon:<Briefcase size={12}/>},
                {title:"Alternate Roles",   items:ra.alternateRoles,  color:C.blue,   icon:<Target size={12}/>},
                {title:"Missing for Role",  items:ra.missingForRole,  color:C.rose,   icon:<AlertTriangle size={12}/>},
              ].map(({title,items,color,icon})=>(
                <div key={title} className="card cp">
                  <p className="sec-title" style={{display:"flex",alignItems:"center",gap:7,color}}>{icon} {title}</p>
                  {items.map((item,i)=>(
                    <div key={i} style={{display:"flex",gap:7,alignItems:"flex-start",marginBottom:8}}>
                      <ChevronRight size={11} color={color} style={{flexShrink:0,marginTop:2}}/>
                      <span style={{fontSize:12,color:"#d4d4d8",lineHeight:1.6}}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="card cplg" style={{background:"linear-gradient(135deg,#0d1f0d,#18181b)"}}>
              <p className="sec-title" style={{color:C.emerald}}>Competitive Analysis</p>
              <p style={{fontSize:"clamp(12px,1.3vw,14px)",color:"#a1a1aa",lineHeight:1.85}}>{cp.reasoning}</p>
            </div>
          </div>
        )}

        {/* ── SUGGESTIONS ── */}
        {tab==="suggestions" && (
          <div className="stack gap-12 fu">
            {data.suggestions.map((s,i)=>(
              <div key={i} className="card cplg" style={{borderLeft:`4px solid ${s.priority==="critical"?C.rose:s.priority==="medium"?C.amber:C.blue}`}}>
                <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:14}}>
                  <div>
                    <span className="badge" style={{background:s.priority==="critical"?"rgba(244,63,94,.15)":"rgba(245,158,11,.15)",color:s.priority==="critical"?C.rose:C.amber}}>{s.priority.toUpperCase()}</span>
                    <h3 style={{fontSize:"clamp(13px,1.5vw,16px)",fontWeight:700,color:"#f4f4f5",margin:"7px 0 3px"}}>{s.issue}</h3>
                    <p style={{fontSize:11,color:"#71717a"}}>Category: {s.category}</p>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"'Sora',sans-serif",fontSize:"clamp(18px,3vw,24px)",fontWeight:800,color:C.emerald}}>{s.estimatedScoreIncrease}</div>
                    <div style={{fontSize:10,color:"#71717a"}}>Score Increase</div>
                  </div>
                </div>
                <p style={{fontSize:12,color:"#d4d4d8",lineHeight:1.7,marginBottom:14}}>{s.recommendation}</p>
                <div className="g-ba">
                  <div style={{background:"rgba(244,63,94,.06)",borderRadius:10,padding:14,border:"1px solid rgba(244,63,94,.2)"}}>
                    <p className="meta-lbl" style={{color:C.rose}}>Before</p>
                    <code style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#fca5a5",background:"rgba(244,63,94,.1)",padding:"5px 9px",borderRadius:6,display:"block",wordBreak:"break-word"}}>{s.example.before}</code>
                  </div>
                  <div style={{background:"rgba(16,185,129,.06)",borderRadius:10,padding:14,border:"1px solid rgba(16,185,129,.2)"}}>
                    <p className="meta-lbl" style={{color:C.emerald}}>After</p>
                    <code style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#6ee7b7",background:"rgba(16,185,129,.1)",padding:"5px 9px",borderRadius:6,display:"block",wordBreak:"break-word"}}>{s.example.after}</code>
                  </div>
                </div>
              </div>
            ))}

            <div className="card cplg" style={{textAlign:"center",background:"linear-gradient(135deg,#0d1f3c,#18181b)"}}>
              <p style={{fontSize:12,color:"#71717a",marginBottom:8}}>Estimated Score After All Fixes</p>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:"clamp(52px,10vw,80px)",fontWeight:900,color:C.emerald,lineHeight:1}}>{data.estimatedScoreAfterFixes}</div>
              <p style={{fontSize:12,color:"#71717a",marginTop:10}}>
                Current: <strong style={{color:"#f4f4f5"}}>{data.atsScore}</strong>
                {" → "}After fixes: <strong style={{color:C.emerald}}>{data.estimatedScoreAfterFixes}</strong>
                <span style={{color:C.emerald}}> (+{data.estimatedScoreAfterFixes - data.atsScore} pts)</span>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}