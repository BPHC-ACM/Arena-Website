"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ACCENT } from "@/app/lib/sports";
import type { SportId } from "@/app/lib/sports";
import { Minus, Plus, Pause, Play, Save } from "lucide-react";

interface Props { sport: SportId; match: any; onSave: (data: any) => void; isCreate?: boolean; }

const STATUS_OPTS: Record<SportId, string[]> = {
  cricket: [],
  basketball: ["Quarter I", "Quarter II", "Half Time", "Quarter III", "Quarter IV", "Full time", "OT"],
  football:   ["Kick-off", "1st half", "Half time", "2nd half", "Full time", "Extra time AET"],
  tennis:     ["Match started", "Set 1", "Set 2", "Set 3", "Set 4", "Set 5", "Match complete"],
  badminton:  ["Game 1", "Game 2", "Game 3", "Match complete"],
  volleyball: ["Set 1", "Set 2", "Set 3", "Set 4", "Set 5", "Match complete"],
  kabaddi:    ["1st half", "Half time", "2nd half", "Match complete"],
  frisbee:    ["1st half", "Half time", "2nd half", "Game complete"],
};

const defaults: Record<SportId, any> = {
  cricket: {},
  basketball: { teamA:"", teamB:"", scoreA:0, scoreB:0, currentQuarter:1, gameClock:"12:00", shotClock:24, quarterScoresA:[0,0,0,0], quarterScoresB:[0,0,0,0], foulsA:0, foulsB:0, status:"Quarter I" },
  football:   { teamA:"", teamB:"", scoreA:0, scoreB:0, matchTime:0, half:1, events:[], status:"Kick-off" },
  tennis:     { player1:"", player2:"", setsPlayer1:[], setsPlayer2:[], currentSet:1, currentGameScorePlayer1:"0", currentGameScorePlayer2:"0", server:1, surface:"", status:"Match started" },
  badminton:  { player1:"", player2:"", gamesPlayer1:[], gamesPlayer2:[], currentGame:1, currentPointsPlayer1:0, currentPointsPlayer2:0, server:1, bestOf:3, status:"Game 1" },
  volleyball: { teamA:"", teamB:"", setsTeamA:[], setsTeamB:[], currentSet:1, currentPointsTeamA:0, currentPointsTeamB:0, setWinsA:0, setWinsB:0, bestOf:5, status:"Set 1" },
  kabaddi:    { teamA:"", teamB:"", scoreA:0, scoreB:0, playersOnMatA:7, playersOnMatB:7, raidTimer:30, raidingTeam:"", bonusActive:false, superRaidActive:false, half:1, timeRemaining:"20:00", status:"1st half" },
  frisbee:    { teamA:"", teamB:"", scoreA:0, scoreB:0, timeRemaining:"48:00", pointCap:21, possession:"", status:"1st half" },
};

// Shared field component
function TF({ label, path, type="text", placeholder="", form, setForm, textVal, handleTextChange, handleTextBlur, get }: any) {
  const upd = (v:any) => setForm((p:any)=>{
    const parts=path.split("."); const n=JSON.parse(JSON.stringify(p??{})); let c=n;
    for(let i=0;i<parts.length-1;i++) c=c[parts[i]]??={};
    c[parts[parts.length-1]]=v; return n;
  });
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-[#888] font-medium uppercase tracking-wider">{label}</Label>
      {type === "number" ? (
        <Input type="number" value={(get ? get(path) : path.split(".").reduce((c:any,k:string)=>c?.[k], form)) ?? 0} onChange={e=>upd(Number(e.target.value))} className="bg-[#0d0d0d] border-[#222] text-sm h-9" />
      ) : (
        <Input type="text" value={textVal ? textVal(path) : (form[path]??"")} placeholder={placeholder} onChange={e=>handleTextChange?handleTextChange(path, e.target.value):upd(e.target.value)} onBlur={()=>handleTextBlur?handleTextBlur(path):undefined} className="bg-[#0d0d0d] border-[#222] text-sm h-9" />
      )}
    </div>
  );
}

// +/- stepper
function Stepper({ label, value, onChange }: { label:string; value:number; onChange:(v:number)=>void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-[#888] font-medium uppercase tracking-wider">{label}</Label>
      <div className="flex items-center gap-2">
        <button onClick={()=>onChange(Math.max(0,value-1))} className="w-9 h-9 rounded-lg bg-[#161616] border border-[#222] text-white hover:bg-[#222] flex items-center justify-center">
          <Minus className="w-3 h-3 flex-shrink-0" />
        </button>
        <span className="font-mono text-xl font-bold text-white w-12 text-center">{value}</span>
        <button onClick={()=>onChange(value+1)} className="w-9 h-9 rounded-lg bg-[#161616] border border-[#222] text-white hover:bg-[#222] flex items-center justify-center">
          <Plus className="w-3 h-3 flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}

// Score bump buttons (large, for main scores)
function ScorePanel({ name, score, onDelta, children }: { name:string; score:number; onDelta:(d:number)=>void; children?:React.ReactNode }) {
  return (
    <div className="flex-1 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] p-4 space-y-3">
      <p className="text-xs text-[#888] font-semibold uppercase tracking-wider truncate">{name || "Team"}</p>
      <div className="flex items-center gap-2">
        <button onClick={()=>onDelta(-1)} className="w-10 h-10 rounded-lg bg-[#161616] border border-[#222] flex items-center justify-center text-[#888] hover:text-white">
          <Minus className="w-3.5 h-3.5 flex-shrink-0" />
        </button>
        <span className="font-mono text-4xl font-extrabold text-white w-14 text-center">{score}</span>
        <button onClick={()=>onDelta(1)} className="w-10 h-10 rounded-lg bg-[#161616] border border-[#222] flex items-center justify-center text-[#888] hover:text-white">
          <Plus className="w-3.5 h-3.5 flex-shrink-0" />
        </button>
      </div>
      {children}
    </div>
  );
}

// Toggle choice row
function Toggle({ label, options, value, onChange }: { label:string; options:{l:string;v:any}[]; value:any; onChange:(v:any)=>void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-[#888] font-medium uppercase tracking-wider">{label}</Label>
      <div className="flex gap-2 flex-wrap">
        {options.map(o=>(
          <button key={String(o.v)} onClick={()=>onChange(o.v)}
            className="px-3 h-9 rounded-lg text-sm font-semibold border transition-colors"
            style={String(value)===String(o.v)?{background:`${ACCENT}20`,borderColor:`${ACCENT}44`,color:ACCENT}:{background:"#0d0d0d",borderColor:"#222",color:"#888"}}>
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

// Timer toggle button
function TimerToggle({ running, onToggle }: { running: boolean; onToggle: (r: boolean) => void }) {
  return (
    <button onClick={() => onToggle(!running)}
      className="w-full flex items-center justify-center h-9 mt-1 rounded-lg text-[13px] font-bold transition-colors border"
      style={{
        background: running ? "#1a0808" : `${ACCENT}18`,
        borderColor: running ? "#3a1010" : `${ACCENT}44`,
        color: running ? "#ef4444" : ACCENT
      }}>
      {running ? <Pause className="w-3.5 h-3.5 mr-2" /> : <Play className="w-3.5 h-3.5 mr-2" />}
      {running ? "Pause Clock" : "Start Clock"}
    </button>
  );
}

// Status dropdown
function StatusSelect({ sport, value, onChange }: { sport:SportId; value:string; onChange:(v:string)=>void }) {
  return (
    <div className="space-y-1.5 w-full">
      <Label className="text-xs text-[#888] font-medium uppercase tracking-wider">Status</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-[#0d0d0d] border-[#222] text-sm h-9 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-[#111] border-[#222]">
          {(STATUS_OPTS[sport] ?? []).map(s=><SelectItem key={s} value={s} className="text-sm">{s}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

function SaveBtn({ onClick, isCreate }: { onClick:()=>void; isCreate?:boolean }) {
  return (
    <button onClick={onClick}
      className="w-full h-12 rounded-xl text-sm font-bold text-black flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
      style={{ background: ACCENT }}>
      <Save className="w-4 h-4 mr-2 flex-shrink-0" />
      {isCreate ? "Create Match" : "Save Changes"}
    </button>
  );
}

export function GenericAdminForm({ sport, match, onSave, isCreate }: Props) {
  const [form, setReactForm] = useState<any>(match ?? defaults[sport]);
  const [localValues, setLocalValues] = useState<Record<string, string>>({});

  useEffect(()=>{ 
    setReactForm(match ?? defaults[sport]); 
    setLocalValues({});
  }, [match, sport]);

  useEffect(() => {
    if (!match) return;
    setReactForm((prev: any) => ({
      ...prev,
      gameClock: match.gameClock,
      matchTime: match.matchTime,
      raidTimer: match.raidTimer,
      timeRemaining: match.timeRemaining,
      clockRunning: match.clockRunning,
    }));
  }, [match]);

  const setForm = (updater: any) => {
    setReactForm((prev: any) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (!isCreate) setTimeout(() => onSave(next), 0);
      return next;
    });
  };

  const get = (path:string) => path.split(".").reduce((c:any,k)=>c?.[k], form);
  const set = (path:string, value:any) => setForm((p:any)=>{
    const parts=path.split("."); const n=JSON.parse(JSON.stringify(p??{})); let c=n;
    for(let i=0;i<parts.length-1;i++) c=c[parts[i]]??={};
    c[parts[parts.length-1]]=value; return n;
  });

  const textVal = (path:string) => localValues[path] ?? get(path) ?? "";
  const handleTextChange = (path: string, v: string) => setLocalValues(p => ({ ...p, [path]: v }));
  const handleTextBlur = (path: string) => {
    const v = localValues[path];
    if (v !== undefined) {
      setLocalValues(p => { const n = { ...p }; delete n[path]; return n; });
      set(path, v);
    }
  };

  const handleStatusChange = (v: string) => {
    if (["Full time", "Match complete", "Game complete"].includes(v)) {
      setForm((prev: any) => {
        const next = { ...prev, status: v };
        const tA = next.teamA || next.player1 || "Team A";
        const tB = next.teamB || next.player2 || "Team B";
        if (sport === "basketball" || sport === "football" || sport === "kabaddi" || sport === "frisbee") {
          const sa = next.scoreA || 0;
          const sb = next.scoreB || 0;
          if (sa === sb) next.summary = "Match Tied";
          else next.summary = `${sa > sb ? tA : tB} won by ${Math.abs(sa - sb)} points`;
        } else if (sport === "tennis" || sport === "volleyball" || sport === "badminton") {
          next.summary = `${tA} won`; // simplistic fallback for racket sports
        }
        return next;
      });
    } else {
      set("status", v);
    }
  };

  const fp = { form, setForm, textVal, handleTextChange, handleTextBlur, get };

  const submitForm = () => {
    const next = JSON.parse(JSON.stringify(form));
    for (const [k, v] of Object.entries(localValues)) {
      const parts = k.split('.');
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]] ??= {};
      if (v !== "") cur[parts[parts.length - 1]] = v;
    }
    onSave(next);
  };

  // ── Basketball ─────────────────────────────────────────────────────────────
  if (sport==="basketball") return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <TF label="Team A" path="teamA" placeholder="Lakers" {...fp} />
        <TF label="Team B" path="teamB" placeholder="Warriors" {...fp} />
      </div>
      <Separator className="bg-[#1e1e1e]" />
      <div className="flex gap-3">
        <ScorePanel name={form.teamA||"Team A"} score={form.scoreA} onDelta={d=>setForm((p:any)=>{
          const qIdx = Math.max(0, (p.currentQuarter||1)-1);
          const qa = [...(p.quarterScoresA||[0,0,0,0])];
          qa[qIdx] = Math.max(0, (qa[qIdx]||0) + d);
          return {...p, scoreA: Math.max(0, p.scoreA+d), quarterScoresA: qa};
        })}>
          <div className="flex gap-1.5">
            {[{l:"+2",d:2},{l:"+3",d:3},{l:"+1 FT",d:1}].map(({l,d})=>(
              <button key={l} onClick={()=>setForm((p:any)=>{
                const qIdx = Math.max(0, (p.currentQuarter||1)-1);
                const qa = [...(p.quarterScoresA||[0,0,0,0])];
                qa[qIdx] = Math.max(0, (qa[qIdx]||0) + d);
                return {...p, scoreA: Math.max(0, p.scoreA+d), quarterScoresA: qa};
              })}
                className="flex-1 h-8 rounded-lg bg-[#161616] border border-[#222] text-sm font-bold text-[#aaa] hover:text-white">{l}</button>
            ))}
          </div>
          <button onClick={()=>set("foulsA",(form.foulsA||0)+1)}
            className="w-full h-8 rounded-lg bg-[#1a0808] border border-[#2e1010] text-sm font-bold text-[#f87171]">
            Foul ({form.foulsA||0})
          </button>
        </ScorePanel>
        <ScorePanel name={form.teamB||"Team B"} score={form.scoreB} onDelta={d=>setForm((p:any)=>{
          const qIdx = Math.max(0, (p.currentQuarter||1)-1);
          const qb = [...(p.quarterScoresB||[0,0,0,0])];
          qb[qIdx] = Math.max(0, (qb[qIdx]||0) + d);
          return {...p, scoreB: Math.max(0, p.scoreB+d), quarterScoresB: qb};
        })}>
          <div className="flex gap-1.5">
            {[{l:"+2",d:2},{l:"+3",d:3},{l:"+1 FT",d:1}].map(({l,d})=>(
              <button key={l} onClick={()=>setForm((p:any)=>{
                const qIdx = Math.max(0, (p.currentQuarter||1)-1);
                const qb = [...(p.quarterScoresB||[0,0,0,0])];
                qb[qIdx] = Math.max(0, (qb[qIdx]||0) + d);
                return {...p, scoreB: Math.max(0, p.scoreB+d), quarterScoresB: qb};
              })}
                className="flex-1 h-8 rounded-lg bg-[#161616] border border-[#222] text-sm font-bold text-[#aaa] hover:text-white">{l}</button>
            ))}
          </div>
          <button onClick={()=>set("foulsB",(form.foulsB||0)+1)}
            className="w-full h-8 rounded-lg bg-[#1a0808] border border-[#2e1010] text-sm font-bold text-[#f87171]">
            Foul ({form.foulsB||0})
          </button>
        </ScorePanel>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <TF label="Quarter" path="currentQuarter" type="number" {...fp} />
        <div className="space-y-2">
          <TF label="Game Clock" path="gameClock" placeholder="12:00" {...fp} />
          <TimerToggle running={!!form.clockRunning} onToggle={v=>set("clockRunning",v)} />
        </div>
        <TF label="Shot Clock" path="shotClock" type="number" {...fp} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-[#888] font-medium uppercase tracking-wider">Quarter Scores</Label>
        <div className="flex gap-2">
          {form.quarterScoresA?.map((_:any, i:number) => (
            <div key={i} className="flex-1 bg-[#0d0d0d] border border-[#222] rounded-md p-2 text-center relative">
               {i+1 === Number(form.currentQuarter) && <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green-500 m-1"/>}
               <p className="text-[10px] text-[#555] font-bold">Q{i+1}</p>
               <p className="text-sm font-mono text-white mt-1">{form.quarterScoresA[i]} - {form.quarterScoresB[i]}</p>
            </div>
          ))}
        </div>
      </div>
      <StatusSelect sport={sport} value={form.status??""} onChange={handleStatusChange} />
      {isCreate && <SaveBtn onClick={submitForm} isCreate={isCreate} />}
    </div>
  );

  // ── Football ───────────────────────────────────────────────────────────────
  if (sport==="football") return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <TF label="Team A" path="teamA" placeholder="Man United" {...fp} />
        <TF label="Team B" path="teamB" placeholder="Liverpool" {...fp} />
      </div>
      <Separator className="bg-[#1e1e1e]" />
      <div className="flex gap-3">
        <ScorePanel name={form.teamA||"Team A"} score={form.scoreA} onDelta={d=>set("scoreA",Math.max(0,form.scoreA+d))} />
        <ScorePanel name={form.teamB||"Team B"} score={form.scoreB} onDelta={d=>set("scoreB",Math.max(0,form.scoreB+d))} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Stepper label="Match Time (min)" value={form.matchTime||0} onChange={v=>set("matchTime",v)} />
          <TimerToggle running={!!form.clockRunning} onToggle={v=>set("clockRunning",v)} />
        </div>
        <Toggle label="Half" options={[{l:"1st Half",v:1},{l:"2nd Half",v:2}]} value={form.half} onChange={v=>set("half",v)} />
      </div>
      <StatusSelect sport={sport} value={form.status??""} onChange={handleStatusChange} />
      {isCreate && <SaveBtn onClick={submitForm} isCreate={isCreate} />}
    </div>
  );

  // ── Tennis ─────────────────────────────────────────────────────────────────
  if (sport==="tennis") {
    const SCORES=["0","15","30","40","A"];
    const winPoint=(player:1|2)=>{
      const cs1=String(form.currentGameScorePlayer1), cs2=String(form.currentGameScorePlayer2);
      const wFld=player===1?"currentGameScorePlayer1":"currentGameScorePlayer2";
      const wCur=player===1?cs1:cs2, lCur=player===1?cs2:cs1;
      const winGame=()=>{
        const s1=[...(form.setsPlayer1??[])], s2=[...(form.setsPlayer2??[])];
        const si=(form.currentSet||1)-1;
        if(!s1[si])s1[si]=0; if(!s2[si])s2[si]=0;
        s1[si]+=(player===1?1:0); s2[si]+=(player===2?1:0);
        setForm((p:any)=>({...p,setsPlayer1:s1,setsPlayer2:s2,currentGameScorePlayer1:"0",currentGameScorePlayer2:"0",server:p.server===1?2:1}));
      };
      if(wCur==="A"||(wCur==="40"&&lCur!=="40"&&lCur!=="A")) return winGame();
      if(wCur==="40"&&lCur==="A") setForm((p:any)=>({...p,currentGameScorePlayer1:"40",currentGameScorePlayer2:"40"}));
      else if(wCur==="40"&&lCur==="40") setForm((p:any)=>({...p,[wFld]:"A"}));
      else { const idx=SCORES.indexOf(wCur); setForm((p:any)=>({...p,[wFld]:SCORES[Math.min(idx+1,3)]})); }
    };
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <TF label="Player 1" path="player1" placeholder="Djokovic" {...fp} />
          <TF label="Player 2" path="player2" placeholder="Nadal" {...fp} />
        </div>
        <Separator className="bg-[#1e1e1e]" />
        <Label className="text-xs text-[#888] font-medium uppercase tracking-wider">Award Point</Label>
        <div className="flex gap-3">
          <button onClick={()=>winPoint(1)} className="flex-1 py-4 rounded-xl border text-sm font-bold"
            style={{background:`${ACCENT}18`,borderColor:`${ACCENT}44`,color:ACCENT}}>
            Point → {form.player1||"P1"}
          </button>
          <button onClick={()=>winPoint(2)} className="flex-1 py-4 rounded-xl border text-sm font-bold text-[#ccc]"
            style={{background:"#161616",borderColor:"#2a2a2a"}}>
            Point → {form.player2||"P2"}
          </button>
        </div>
        <div className="flex gap-6 py-3 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] justify-center">
          <div className="text-center"><p className="text-xs text-[#888]">{form.player1||"P1"}</p><p className="font-mono text-3xl font-extrabold text-white mt-1">{form.currentGameScorePlayer1}</p></div>
          <div className="self-center text-[#333] text-lg">—</div>
          <div className="text-center"><p className="text-xs text-[#888]">{form.player2||"P2"}</p><p className="font-mono text-3xl font-extrabold text-white mt-1">{form.currentGameScorePlayer2}</p></div>
        </div>
        <Toggle label="Server" options={[{l:`${form.player1||"P1"} Serves`,v:1},{l:`${form.player2||"P2"} Serves`,v:2}]} value={form.server} onChange={v=>set("server",v)} />
        <div className="grid grid-cols-3 gap-3">
          <TF label="Current Set" path="currentSet" type="number" {...fp} />
          <div className="space-y-1.5">
            <Label className="text-xs text-[#888] font-medium uppercase tracking-wider">Sets P1</Label>
            <Input value={(form.setsPlayer1??[]).join(", ")} onChange={e=>set("setsPlayer1",e.target.value.split(",").map((v:string)=>Number(v.trim())||0))} className="bg-[#0d0d0d] border-[#222] text-sm h-9" placeholder="6, 4" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-[#888] font-medium uppercase tracking-wider">Sets P2</Label>
            <Input value={(form.setsPlayer2??[]).join(", ")} onChange={e=>set("setsPlayer2",e.target.value.split(",").map((v:string)=>Number(v.trim())||0))} className="bg-[#0d0d0d] border-[#222] text-sm h-9" placeholder="3, 6" />
          </div>
        </div>
        <TF label="Surface" path="surface" placeholder="hard / clay / grass" {...fp} />
        <StatusSelect sport={sport} value={form.status??""} onChange={handleStatusChange} />
        {isCreate && <SaveBtn onClick={submitForm} isCreate={isCreate} />}
      </div>
    );
  }

  // ── Badminton ──────────────────────────────────────────────────────────────
  if (sport==="badminton") {
    const winRally=(player:1|2)=>{
      const f=player===1?"currentPointsPlayer1":"currentPointsPlayer2";
      const oF=player===1?"currentPointsPlayer2":"currentPointsPlayer1";
      const pts=(form[f]||0)+1, opp=(form[oF]||0);
      if(pts>=21&&pts-opp>=2){
        const g1=[...(form.gamesPlayer1??[])], g2=[...(form.gamesPlayer2??[])];
        g1.push(player===1?pts:opp); g2.push(player===2?pts:opp);
        setForm((p:any)=>({...p,gamesPlayer1:g1,gamesPlayer2:g2,currentGame:(p.currentGame||1)+1,currentPointsPlayer1:0,currentPointsPlayer2:0,server:player}));
      } else setForm((p:any)=>({...p,[f]:pts,server:player}));
    };
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <TF label="Player 1" path="player1" placeholder="Lin Dan" {...fp} />
          <TF label="Player 2" path="player2" placeholder="Lee Chong Wei" {...fp} />
        </div>
        <Separator className="bg-[#1e1e1e]" />
        <Label className="text-xs text-[#888] font-medium uppercase tracking-wider">Rally Won By</Label>
        <div className="flex gap-3">
          <button onClick={()=>winRally(1)} className="flex-1 py-4 rounded-xl border text-sm font-bold" style={{background:`${ACCENT}18`,borderColor:`${ACCENT}44`,color:ACCENT}}>+1 {form.player1||"P1"}</button>
          <button onClick={()=>winRally(2)} className="flex-1 py-4 rounded-xl border text-sm font-bold text-[#ccc]" style={{background:"#161616",borderColor:"#2a2a2a"}}>+1 {form.player2||"P2"}</button>
        </div>
        <div className="flex gap-6 py-3 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] justify-center">
          <div className="text-center"><p className="text-xs text-[#888]">{form.player1||"P1"}</p><p className="font-mono text-3xl font-extrabold text-white mt-1">{form.currentPointsPlayer1||0}</p></div>
          <div className="self-center text-xs text-[#444]">Game {form.currentGame}</div>
          <div className="text-center"><p className="text-xs text-[#888]">{form.player2||"P2"}</p><p className="font-mono text-3xl font-extrabold text-white mt-1">{form.currentPointsPlayer2||0}</p></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label className="text-xs text-[#888] font-medium uppercase tracking-wider">Games P1</Label><Input value={(form.gamesPlayer1??[]).join(", ")} onChange={e=>set("gamesPlayer1",e.target.value.split(",").map((v:string)=>Number(v.trim())||0))} className="bg-[#0d0d0d] border-[#222] text-sm h-9" /></div>
          <div className="space-y-1.5"><Label className="text-xs text-[#888] font-medium uppercase tracking-wider">Games P2</Label><Input value={(form.gamesPlayer2??[]).join(", ")} onChange={e=>set("gamesPlayer2",e.target.value.split(",").map((v:string)=>Number(v.trim())||0))} className="bg-[#0d0d0d] border-[#222] text-sm h-9" /></div>
        </div>
        <StatusSelect sport={sport} value={form.status??""} onChange={handleStatusChange} />
        {isCreate && <SaveBtn onClick={submitForm} isCreate={isCreate} />}
      </div>
    );
  }

  // ── Volleyball ─────────────────────────────────────────────────────────────
  if (sport==="volleyball") {
    const winPt=(team:"A"|"B")=>{
      const f=team==="A"?"currentPointsTeamA":"currentPointsTeamB";
      const oF=team==="A"?"currentPointsTeamB":"currentPointsTeamA";
      const pts=(form[f]||0)+1, opp=(form[oF]||0);
      const minPts=form.currentSet===5?15:25;
      if(pts>=minPts&&pts-opp>=2){
        const sa=[...(form.setsTeamA??[])],sb=[...(form.setsTeamB??[])];
        sa.push(team==="A"?pts:opp); sb.push(team==="B"?pts:opp);
        const wA=(form.setWinsA||0)+(team==="A"?1:0), wB=(form.setWinsB||0)+(team==="B"?1:0);
        setForm((p:any)=>({...p,setsTeamA:sa,setsTeamB:sb,setWinsA:wA,setWinsB:wB,currentSet:(p.currentSet||1)+1,currentPointsTeamA:0,currentPointsTeamB:0}));
      } else setForm((p:any)=>({...p,[f]:pts}));
    };
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <TF label="Team A" path="teamA" placeholder="Brazil" {...fp} />
          <TF label="Team B" path="teamB" placeholder="USA" {...fp} />
        </div>
        <Separator className="bg-[#1e1e1e]" />
        <Label className="text-xs text-[#888] font-medium uppercase tracking-wider">Point Scored By</Label>
        <div className="flex gap-3">
          <button onClick={()=>winPt("A")} className="flex-1 py-4 rounded-xl border text-sm font-bold" style={{background:`${ACCENT}18`,borderColor:`${ACCENT}44`,color:ACCENT}}>+1 {form.teamA||"A"}</button>
          <button onClick={()=>winPt("B")} className="flex-1 py-4 rounded-xl border text-sm font-bold text-[#ccc]" style={{background:"#161616",borderColor:"#2a2a2a"}}>+1 {form.teamB||"B"}</button>
        </div>
        <div className="flex gap-6 py-3 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] justify-center">
          <div className="text-center"><p className="text-xs text-[#888]">{form.teamA||"A"}</p><p className="font-mono text-3xl font-extrabold text-white mt-1">{form.currentPointsTeamA||0}</p><p className="text-xs text-[#888] mt-1">{form.setWinsA||0} sets</p></div>
          <div className="self-center text-xs text-[#444]">Set {form.currentSet}</div>
          <div className="text-center"><p className="text-xs text-[#888]">{form.teamB||"B"}</p><p className="font-mono text-3xl font-extrabold text-white mt-1">{form.currentPointsTeamB||0}</p><p className="text-xs text-[#888] mt-1">{form.setWinsB||0} sets</p></div>
        </div>
        <StatusSelect sport={sport} value={form.status??""} onChange={handleStatusChange} />
        {isCreate && <SaveBtn onClick={submitForm} isCreate={isCreate} />}
      </div>
    );
  }

  // ── Kabaddi ────────────────────────────────────────────────────────────────
  if (sport==="kabaddi") {
    const raidEv=(t:"touch"|"tackle"|"bonus"|"super")=>{
      if(t==="touch"){set("scoreA",(form.scoreA||0)+1); set("playersOnMatB",Math.max(1,form.playersOnMatB-1));}
      else if(t==="tackle"){set("scoreB",(form.scoreB||0)+1); set("playersOnMatA",Math.max(1,form.playersOnMatA-1));}
      else if(t==="bonus"){set("scoreA",(form.scoreA||0)+1);}
      else if(t==="super"){set("scoreA",(form.scoreA||0)+2);}
    };
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <TF label="Team A" path="teamA" placeholder="Patna Pirates" {...fp} />
          <TF label="Team B" path="teamB" placeholder="Bengal Warriors" {...fp} />
        </div>
        <Separator className="bg-[#1e1e1e]" />
        <div className="flex gap-3">
          <ScorePanel name={form.teamA||"Team A"} score={form.scoreA} onDelta={d=>set("scoreA",Math.max(0,form.scoreA+d))}>
            <p className="text-xs text-[#888]">{form.playersOnMatA} on mat</p>
          </ScorePanel>
          <ScorePanel name={form.teamB||"Team B"} score={form.scoreB} onDelta={d=>set("scoreB",Math.max(0,form.scoreB+d))}>
            <p className="text-xs text-[#888]">{form.playersOnMatB} on mat</p>
          </ScorePanel>
        </div>
        <Label className="text-xs text-[#888] font-medium uppercase tracking-wider">Raid Outcome</Label>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={()=>raidEv("touch")} className="py-3 rounded-xl border text-sm font-bold" style={{background:`${ACCENT}18`,borderColor:`${ACCENT}44`,color:ACCENT}}>Touch (+1 A, −1 B)</button>
          <button onClick={()=>raidEv("tackle")} className="py-3 rounded-xl border text-sm font-bold" style={{background:"#1a0808",borderColor:"#3a1010",color:"#ef4444"}}>Tackle (+1 B, −1 A)</button>
          <button onClick={()=>raidEv("bonus")} className="py-3 rounded-xl border text-sm font-bold" style={{background:"#1a1408",borderColor:"#3a2a10",color:"#f97316"}}>Bonus +1 A</button>
          <button onClick={()=>raidEv("super")} className="py-3 rounded-xl border text-sm font-bold" style={{background:"#0d0d1a",borderColor:"#1a1a3a",color:"#818cf8"}}>Super Raid +2 A</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TF label="Raid Timer (s)" path="raidTimer" type="number" {...fp} />
          <TF label="Raiding Team" path="raidingTeam" placeholder={form.teamA} {...fp} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Toggle label="Half" options={[{l:"1st Half",v:1},{l:"2nd Half",v:2}]} value={form.half} onChange={v=>set("half",v)} />
          <div className="space-y-2">
            <TF label="Time Remaining" path="timeRemaining" placeholder="08:30" {...fp} />
            <TimerToggle running={!!form.clockRunning} onToggle={v=>set("clockRunning",v)} />
          </div>
        </div>
        <StatusSelect sport={sport} value={form.status??""} onChange={handleStatusChange} />
        {isCreate && <SaveBtn onClick={submitForm} isCreate={isCreate} />}
      </div>
    );
  }

  // ── Frisbee ────────────────────────────────────────────────────────────────
  if (sport==="frisbee") return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <TF label="Team A" path="teamA" placeholder="Wind Chill" {...fp} />
        <TF label="Team B" path="teamB" placeholder="Machine" {...fp} />
      </div>
      <Separator className="bg-[#1e1e1e]" />
      <Label className="text-xs text-[#888] font-medium uppercase tracking-wider">Point Scored By</Label>
      <div className="flex gap-3">
        <button onClick={()=>{set("scoreA",(form.scoreA||0)+1);set("possession",form.teamB);}}
          className="flex-1 py-4 rounded-xl border text-sm font-bold"
          style={{background:`${ACCENT}18`,borderColor:`${ACCENT}44`,color:ACCENT}}>+1 {form.teamA||"A"}</button>
        <button onClick={()=>{set("scoreB",(form.scoreB||0)+1);set("possession",form.teamA);}}
          className="flex-1 py-4 rounded-xl border text-sm font-bold text-[#ccc]"
          style={{background:"#161616",borderColor:"#2a2a2a"}}>+1 {form.teamB||"B"}</button>
      </div>
      <div className="flex gap-8 py-3 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] justify-center">
        <div className="text-center"><p className="text-xs text-[#888]">{form.teamA||"A"}</p><p className="font-mono text-3xl font-extrabold text-white mt-1">{form.scoreA||0}</p></div>
        <div className="text-center"><p className="text-xs text-[#888]">{form.teamB||"B"}</p><p className="font-mono text-3xl font-extrabold text-white mt-1">{form.scoreB||0}</p></div>
      </div>
      <Toggle label="Possession" options={[{l:form.teamA||"A",v:form.teamA||"A"},{l:form.teamB||"B",v:form.teamB||"B"}]} value={form.possession} onChange={v=>set("possession",v)} />
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <TF label="Time Remaining" path="timeRemaining" placeholder="15:30" {...fp} />
          <TimerToggle running={!!form.clockRunning} onToggle={v=>set("clockRunning",v)} />
        </div>
        <TF label="Point Cap" path="pointCap" type="number" {...fp} />
      </div>
      <StatusSelect sport={sport} value={form.status??""} onChange={handleStatusChange} />
      {isCreate && <SaveBtn onClick={submitForm} isCreate={isCreate} />}
    </div>
  );

  return <p className="text-sm text-[#888]">No form for this sport.</p>;
}
