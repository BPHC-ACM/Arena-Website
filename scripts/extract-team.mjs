import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.resolve(__dirname, '../raw-images/TeamPage_Final.html');
const outDir = path.resolve(__dirname, '../public/team');
const dataOutPath = path.resolve(__dirname, '../app/team/data.ts');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
if (!fs.existsSync(path.dirname(dataOutPath))) {
  fs.mkdirSync(path.dirname(dataOutPath), { recursive: true });
}

let content = fs.readFileSync(htmlPath, 'utf8');

// Find the allMembers array definition
const startMatch = content.indexOf('const allMembers = [');
if (startMatch === -1) throw new Error("Could not find allMembers");

const endMatch = content.indexOf('];', startMatch);
if (endMatch === -1) throw new Error("Could not find end of allMembers array");

const arrayStrings = content.substring(startMatch + 'const allMembers = '.length, endMatch + 1);

// We eval it to get the JS array safely
let allMembers;
try {
  allMembers = eval(arrayStrings);
} catch (e) {
  console.error("Failed to eval array", e);
  process.exit(1);
}

const cleanedMembers = [];

for (const member of allMembers) {
  if (member.photo && member.photo.startsWith('data:image/webp;base64,')) {
    const base64Data = member.photo.replace(/^data:image\/webp;base64,/, '');
    const filename = `${member.id}.webp`;
    const filepath = path.join(outDir, filename);
    fs.writeFileSync(filepath, base64Data, 'base64');
    
    // Update the member object
    cleanedMembers.push({
      ...member,
      photo: `/team/${filename}`
    });
  } else {
    cleanedMembers.push(member);
  }
}

const tsCode = `export type TeamMember = {
  id: number;
  name: string;
  role: string;
  department: string;
  council: string;
  group: string;
  photo: string;
  linkedin?: string;
  instagram?: string;
};

export const allMembers: TeamMember[] = ${JSON.stringify(cleanedMembers, null, 2)};
`;

fs.writeFileSync(dataOutPath, tsCode, 'utf8');
console.log(`Successfully extracted ${cleanedMembers.length} members and saved their images to public/team/.`);
