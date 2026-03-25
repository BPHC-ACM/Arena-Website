import type { SportId } from "@/app/lib/sports";
import type { MatchData } from "@/app/lib/types";

export function generateShareCard(sport: SportId, match: MatchData) {
  const W = 1200, H = 630;
  
  // Try to load the Arena logo specifically requested
  const logo = new Image();
  logo.crossOrigin = "anonymous";
  logo.onload = () => renderCard(logo);
  logo.onerror = () => renderCard(null); // Fallback if logo fails
  logo.src = "/arena logo_ 2.png"; // Note the space in filename

  function renderCard(loadedLogo: HTMLImageElement | null) {
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    
    // Using Impact font as landing page inspiration
    const F = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    const IMPACT = "'Impact', sans-serif";

    // Black background like the landing page
    ctx.fillStyle = "#050505"; ctx.fillRect(0, 0, W, H);

    // Accent Lines - Top Edge
    ctx.fillStyle = "#57a639"; ctx.fillRect(0, 0, W, 10);
    ctx.fillStyle = "#a3e635"; ctx.fillRect(0, 10, W, 4);

    if (loadedLogo) {
      // Giant faint background logo watermark
      ctx.globalAlpha = 0.05;
      const size = 700;
      ctx.drawImage(loadedLogo, W/2 - size/2, H/2 - size/2, size, size);
      
      // Crisp corner logo
      ctx.globalAlpha = 1.0;
      const lh = 120; // Increased logo size
      const lw = (loadedLogo.width / loadedLogo.height) * lh;
      ctx.drawImage(loadedLogo, 40, 40, lw, lh);
    } else {
      ctx.font = `italic bold 42px ${IMPACT}`; ctx.fillStyle = "#fff"; ctx.textAlign = "left";
      ctx.fillText("ARENA", 40, 90);
    }

    // ARENA 2026 Branding
    ctx.font = `italic bold 56px ${IMPACT}`; ctx.fillStyle = "#fff"; ctx.textAlign = "right";
    ctx.fillText("ARENA 2026", W - 40, 80);
    ctx.font = `bold 28px ${F}`; ctx.fillStyle = "#7E9678";
    ctx.fillText(sport.toUpperCase(), W - 40, 115);

    const cx = W / 2;
    const isTeam = !["tennis", "badminton"].includes(sport);

    if (isTeam) {
      let lN = "", rN = "", lS = "", rS = "", lSub = "", rSub = "", ctr = "", cSub = "";
      switch (sport) {
        case "cricket":
          lN=match.teamA; rN=match.teamB;
          lS=`${match.scoreA?.runs}/${match.scoreA?.wickets}`; lSub=`${match.scoreA?.overs} ov`;
          rS=`${match.scoreB?.runs}/${match.scoreB?.wickets}`; rSub=`${match.scoreB?.overs} ov`; break;
        case "basketball":
          lN=match.teamA; rN=match.teamB; lS=String(match.scoreA); rS=String(match.scoreB);
          ctr=match.gameClock; cSub=`Q${match.currentQuarter}`; break;
        case "football":
          lN=match.teamA; rN=match.teamB; lS=String(match.scoreA); rS=String(match.scoreB);
          ctr=`${match.matchTime}'`; cSub=match.half===1?"1st Half":"2nd Half"; break;
        case "volleyball":
          lN=match.teamA; rN=match.teamB; lS=String(match.setWinsA); rS=String(match.setWinsB); break;
        case "kabaddi":
          lN=match.teamA; rN=match.teamB; lS=String(match.scoreA); rS=String(match.scoreB);
          ctr=`${match.raidTimer}s`; cSub="Raid"; break;
        case "frisbee":
          lN=match.teamA; rN=match.teamB; lS=String(match.scoreA); rS=String(match.scoreB);
          ctr=match.timeRemaining; cSub=`Cap ${match.pointCap}`; break;
      }
      
      const sY = H / 2 + 30;
      
      // Team A
      ctx.textAlign="center"; ctx.font=`bold 56px ${IMPACT}`; ctx.fillStyle="#fff"; 
      ctx.fillText(lN.toUpperCase(), W/4, sY - 120);
      ctx.font=`bold 220px ${IMPACT}`; ctx.fillStyle="#57a639"; 
      ctx.fillText(lS, W/4, sY + 80);
      if(lSub){ctx.font=`600 36px ${F}`; ctx.fillStyle="#7E9678"; ctx.fillText(lSub, W/4, sY + 140);}

      // VS & Center Info
      if(ctr) {
        ctx.font=`bold 56px ${IMPACT}`; ctx.fillStyle="#57a639"; ctx.fillText(ctr, cx, sY - 30);
        if(cSub){ctx.font=`bold 32px ${F}`; ctx.fillStyle="#7E9678"; ctx.fillText(cSub, cx, sY + 20);}
      } else {
        ctx.font=`italic 72px ${IMPACT}`; ctx.fillStyle="#1a1a1a"; ctx.fillText("VS", cx, sY + 20);
      }

      // Team B
      ctx.textAlign="center"; ctx.font=`bold 56px ${IMPACT}`; ctx.fillStyle="#fff"; 
      ctx.fillText(rN.toUpperCase(), (W/4)*3, sY - 120);
      ctx.font=`bold 220px ${IMPACT}`; ctx.fillStyle="#fff"; 
      ctx.fillText(rS, (W/4)*3, sY + 80);
      if(rSub){ctx.font=`600 36px ${F}`; ctx.fillStyle="#7E9678"; ctx.fillText(rSub, (W/4)*3, sY + 140);}

    } else {
      // Tennis / Badminton
      const rows = sport==="tennis"
        ? [{n:match.player1,sets:match.setsPlayer1??[],cur:match.currentGameScorePlayer1},{n:match.player2,sets:match.setsPlayer2??[],cur:match.currentGameScorePlayer2}]
        : [{n:match.player1,sets:match.gamesPlayer1??[],cur:match.currentPointsPlayer1},{n:match.player2,sets:match.gamesPlayer2??[],cur:match.currentPointsPlayer2}];
        
      const startY = 260;
      rows.forEach((r,i)=>{
        const y = startY + i * 180;
        
        ctx.textAlign="left"; ctx.font=`bold 64px ${IMPACT}`; ctx.fillStyle = i===0 ? "#57a639" : "#fff"; 
        ctx.fillText(String(r.n).toUpperCase(), 70, y + 90);
        
        ctx.textAlign="right"; 
        const last = r.sets.length;
        r.sets.forEach((s: number,j: number)=>{
           ctx.font=`bold 80px ${F}`; ctx.fillStyle="#444"; 
           ctx.fillText(String(s), W - 70 - (last-j)*160, y + 90);
        });
        
        ctx.font=`bold 140px ${IMPACT}`; ctx.fillStyle="#fff"; 
        ctx.fillText(String(r.cur), W - 70, y + 100);
        
        if(i===0){
           ctx.strokeStyle="#1c1c1c"; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(70, y + 150); ctx.lineTo(W - 70, y + 150); ctx.stroke();
        }
      });
    }

    if(match.status){
       ctx.textAlign="center"; ctx.font=`bold 32px ${F}`; ctx.fillStyle="#57a639"; 
       ctx.fillText(String(match.status).toUpperCase(), cx, H - 40);
    }
    
    // Accent Lines - Bottom Edge
    ctx.fillStyle = "#a3e635"; ctx.fillRect(0, H-10, W, 4);
    ctx.fillStyle = "#57a639"; ctx.fillRect(0, H-6, W, 6);

    canvas.toBlob(blob=>{
      if(!blob) return;
      const url=URL.createObjectURL(blob); 
      const a=document.createElement("a"); 
      a.href=url;
      a.download=`${match.teamA??match.player1??sport}-vs-${match.teamB??match.player2??""}.png`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a); 
      URL.revokeObjectURL(url);
    },"image/png");
  }
}
