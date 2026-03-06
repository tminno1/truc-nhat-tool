
const days=["Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6"];

const dayTable=document.getElementById("dayTable");

days.forEach((d,i)=>{

dayTable.innerHTML+=`
<tr>
<td>${d}</td>

<td>
<input type="checkbox" id="in_s_${i}" checked>
</td>

<td>
<input type="checkbox" id="in_c_${i}">
</td>

<td>
<input type="checkbox" id="out_${i}">
</td>

</tr>
`

});

function shuffle(a){
for(let i=a.length-1;i>0;i--){
let j=Math.floor(Math.random()*(i+1));
[a[i],a[j]]=[a[j],a[i]];
}
}

function pickBalanced(list,count,stat,key,used){

let sorted=[...list].sort((a,b)=>{

let sa=stat[a]?stat[a][key]||0:0;
let sb=stat[b]?stat[b][key]||0:0;

return sa-sb;

});

let res=[];

for(let n of sorted){

if(res.length===count) break;

if(!used.has(n)){

res.push(n);

used.add(n);

if(!stat[n]) stat[n]={s:0,c:0,o:0};

stat[n][key]++;

}

}

return res.join(", ");

}

function generate(){

let inNames=document.getElementById("inNames").value
.split("\n")
.map(x=>x.trim())
.filter(Boolean);

let outNames=document.getElementById("outNames").value
.split("\n")
.map(x=>x.trim())
.filter(Boolean);

let quet=+document.getElementById("quet").value;
let lau=+document.getElementById("lau").value;
let rac=+document.getElementById("rac").value;
let laulop=+document.getElementById("laulop").value;

let outCount=+document.getElementById("outCount").value;

let stat={};

let html=`<h2>Lịch trực</h2><table>
<tr>
<th>Thứ</th>
<th>Sáng</th>
<th>Chiều</th>
</tr>`;

days.forEach((d,i)=>{

let sang="-";
let chieu="-";

if(document.getElementById(`in_s_${i}`).checked){

let used=new Set();

if(d==="Thứ 6"){

sang=`
<b>Đầu buổi</b><br>
Quét: ${pickBalanced(inNames,quet,stat,"s",used)}<br>
Lau bảng: ${pickBalanced(inNames,lau,stat,"s",used)}<br>
Đổ rác: ${pickBalanced(inNames,rac,stat,"s",used)}
<br><br>
<b>Cuối buổi</b><br>
Quét: ${pickBalanced(inNames,quet,stat,"s",used)}<br>
Lau bảng: ${pickBalanced(inNames,lau,stat,"s",used)}<br>
Đổ rác: ${pickBalanced(inNames,rac,stat,"s",used)}<br>
Lau lớp: ${pickBalanced(inNames,laulop,stat,"s",used)}
`;

}else{

sang=`
Quét: ${pickBalanced(inNames,quet,stat,"s",used)}<br>
Lau bảng: ${pickBalanced(inNames,lau,stat,"s",used)}<br>
Đổ rác: ${pickBalanced(inNames,rac,stat,"s",used)}
`;

}

}

if(document.getElementById(`in_c_${i}`).checked){

let used=new Set();

chieu=`
Quét: ${pickBalanced(inNames,quet,stat,"c",used)}<br>
Lau bảng: ${pickBalanced(inNames,lau,stat,"c",used)}<br>
Đổ rác: ${pickBalanced(inNames,rac,stat,"c",used)}
`;

}

html+=`
<tr class="${d==="Thứ 6"?"friday":""}">
<td>${d}</td>
<td>${sang}</td>
<td>${chieu}</td>
</tr>
`;

});

html+=`</table>`;

if(outNames.length){

html+=`<h2>Trực ngoài</h2><table>
<tr>
<th>Thứ</th>
<th>Người trực</th>
</tr>`;

days.forEach((d,i)=>{

if(document.getElementById(`out_${i}`).checked){

shuffle(outNames);

let chosen=outNames.slice(0,outCount);

chosen.forEach(n=>{
if(!stat[n]) stat[n]={s:0,c:0,o:0};
stat[n].o++;
});

html+=`
<tr>
<td>${d}</td>
<td>${chosen.join(", ")}</td>
</tr>
`;

}

});

html+=`</table>`;

}

document.getElementById("result").innerHTML=html;

let st=`<h2>Thống kê</h2>
<table>
<tr>
<th>Tên</th>
<th>Sáng</th>
<th>Chiều</th>
<th>Ngoài</th>
<th>Tổng</th>
</tr>`;

Object.keys(stat).forEach(n=>{

let s=stat[n];

st+=`
<tr>
<td>${n}</td>
<td>${s.s}</td>
<td>${s.c}</td>
<td>${s.o}</td>
<td>${s.s+s.c+s.o}</td>
</tr>
`;

});

st+=`</table>`;

document.getElementById("stats").innerHTML=st;

}

function exportPDF(){

let element=document.getElementById("result");

html2pdf().from(element).save("trucnhat.pdf");

}

function toggleDark(){

document.body.classList.toggle("dark");

}