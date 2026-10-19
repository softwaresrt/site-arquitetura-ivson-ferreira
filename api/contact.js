/* Vercel Node.js Serverless Function. No messages are fabricated or silently stored. */
module.exports = async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Método não permitido.'});}
  if(Number(req.headers['content-length']||0)>15000)return res.status(413).json({error:'Mensagem muito longa.'});
  const b=typeof req.body==='string'?safeJson(req.body):req.body;
  if(!b||typeof b!=='object')return res.status(400).json({error:'Solicitação inválida.'});
  const clean=(v,n=4000)=>typeof v==='string'?v.trim().slice(0,n):'';
  const nome=clean(b.nome,120),email=clean(b.email,150),telefone=clean(b.telefone,30),tipo=clean(b.tipo,90),cidade=clean(b.cidade,140),mensagem=clean(b.mensagem,4000);
  if(b.website)return res.status(200).json({ok:true}); // honeypot, do not send
  if(nome.length<2||!/^\S+@\S+\.\S+$/.test(email)||mensagem.length<10||b.consentimento!=='sim')return res.status(400).json({error:'Preencha nome, e-mail, mensagem e concordância com o uso dos dados.'});
  const {RESEND_API_KEY,CONTACT_TO_EMAIL,CONTACT_FROM_EMAIL}=process.env;
  if(!RESEND_API_KEY||!CONTACT_TO_EMAIL||!CONTACT_FROM_EMAIL)return res.status(503).json({error:'O envio pelo site ainda não está configurado.'});
  const esc=t=>t.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  try{
    const upstream=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:CONTACT_FROM_EMAIL,to:[CONTACT_TO_EMAIL],reply_to:email,subject:'Novo contato — Ivson Ferreira Arquitetura',html:`<h2>Novo contato do site</h2><p><strong>Nome:</strong> ${esc(nome)}</p><p><strong>E-mail:</strong> ${esc(email)}</p><p><strong>WhatsApp:</strong> ${esc(telefone)}</p><p><strong>Tipo:</strong> ${esc(tipo)}</p><p><strong>Cidade:</strong> ${esc(cidade)}</p><p><strong>Mensagem:</strong></p><p>${esc(mensagem).replace(/\n/g,'<br>')}</p>`})});
    if(!upstream.ok)return res.status(502).json({error:'Não foi possível enviar a mensagem neste momento.'});
    return res.status(200).json({ok:true});
  }catch{return res.status(502).json({error:'Falha de comunicação ao enviar. Tente pelo canal oficial.'});}
};
function safeJson(s){try{return JSON.parse(s)}catch{return null}}
