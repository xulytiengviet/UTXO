const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const s=fs.readFileSync(__dirname+'/index.html','utf8');
const ctx=vm.createContext({});
vm.runInContext(s.slice(s.indexOf('function calculateOutputs'),s.indexOf("$('spend').onclick"))+s.slice(s.indexOf('const mod='),s.indexOf("$('nonceRun').onclick")),ctx);
assert.deepEqual(JSON.parse(JSON.stringify(ctx.calculateOutputs(30000,1000,true))),{change:69000,fee:1000});
assert.equal(ctx.calculateOutputs(30000,1000,false).fee,70000);
assert.equal(ctx.calculateOutputs(99000,1000,true).change,0);
for(const a of [-1,0,1.5,NaN,Infinity,100001])assert.throws(()=>ctx.calculateOutputs(a,1000,true));
assert.throws(()=>ctx.calculateOutputs(99001,1000,true));
assert.equal(ctx.mul(19,[5,1]),null);
let valid=0;for(let k=1;k<19;k++){try{const r=ctx.nonceExample(k);assert.equal(r.d,7);assert.equal(r.k,k);valid++;}catch(e){if(!e.message.includes('bằng 0'))throw e;}}
assert.ok(valid>0);assert.equal(ctx.nonceExample(2).d,7);
// Verify all generated signatures against Q = dG, independently of recovery.
for(let k=1;k<19;k++){let r;try{r=ctx.nonceExample(k);}catch{continue;}for(const [e,sig] of [[5,r.s1],[9,r.s2]]){const inv=ctx.inv(sig,19),P=ctx.add(ctx.mul(e*inv%19,[5,1]),ctx.mul(r.r*inv%19,ctx.mul(7,[5,1])));assert.equal(P[0]%19,r.r);}}
console.log('PASS: value conservation, change omission, invalid input rejection, curve order, '+valid+' valid nonce cases, signature verification.');
const elements={};const get=id=>elements[id]??=( {value:'',checked:false,textContent:'',innerHTML:''} );
const state=vm.createContext({$:get,Number,Error});
vm.runInContext(s.slice(s.indexOf('let spent=false'),s.indexOf('// Đường cong đồ chơi')),state);
get('amount').value='30000';get('fee').value='1000';get('change').checked=true;
state.resetUTXO();get('spend').onclick();const flow=get('flow').innerHTML;
assert.match(get('utxoResult').textContent,/Chấp nhận/);get('spend').onclick();assert.match(get('utxoResult').textContent,/Từ chối/);assert.equal(get('flow').innerHTML,flow);
get('again').onclick();assert.match(get('utxoResult').textContent,/Từ chối chi trùng/);
state.resetUTXO();assert.match(get('flow').innerHTML,/Chưa tiêu/);
console.log('PASS: state transition, double-spend rejection and reset.');
// Historical Nils Schneider fixture: independent consistency checks.
const hist=vm.createContext({});
vm.runInContext(s.slice(s.indexOf('const Nils ='),s.indexOf('let nilsStep='))+'\nthis.C=Nils;',hist);
const C=hist.C, result=C.calculate();
assert.equal(result.d,88865298299719117682218467295833367085649033095698151055007620974294165995414n);
assert.equal(result.d,result.direct);assert.equal(result.match,true);
assert.equal(result.nonceMatch,true);assert.equal(result.valid1,true);assert.equal(result.valid2,true);
assert.equal(C.multiply(C.N),null);assert.throws(()=>C.inverse(0n,C.N));
assert.equal(C.verify(C.z2+1n,C.s2,result.Q),false);
console.log('PASS: historical key, public key, both signatures, nonce, group order and altered-digest rejection.');
// Lifecycle and competing-chain behavior.
const journeyContext=vm.createContext({Number,Error});
vm.runInContext(s.slice(s.indexOf('function journeyModel'),s.indexOf('let journeyIndex='))+s.slice(s.indexOf('function chainModel'),s.indexOf('let branchA=')),journeyContext);
for(const amount of [10000,30000,90000])for(let step=0;step<=5;step++){
 const m=journeyContext.journeyModel(step,amount,true);
 assert.equal(amount+m.change+1000,100000);
 assert.equal(m.confirmations,Math.max(0,step-3));
 assert.equal(m.confirmed,step>=4);
 if(step<4)assert.equal(m.state,'S = {An:100000}');
}
for(let step=2;step<=5;step++){const m=journeyContext.journeyModel(step,30000,false);assert.equal(m.blocked,true);assert.equal(m.canNext,false);assert.equal(m.confirmations,0);assert.equal(m.state,'S = {An:100000}');}
assert.throws(()=>journeyContext.journeyModel(6,30000,true));
assert.throws(()=>journeyContext.journeyModel(2,Infinity,true));
assert.equal(journeyContext.chainModel(2,1).confirmations,2);
assert.equal(journeyContext.chainModel(2,2,'A').selected,'A');
assert.equal(journeyContext.chainModel(2,3,'A').reorg,true);
assert.equal(journeyContext.chainModel(2,3,'A').confirmations,0);
assert.equal(journeyContext.chainModel(4,3,'B').confirmations,4);
console.log('PASS: lifecycle, invalid signature gate, fee conservation, fork tie and reorg.');
const elliptic=vm.createContext({});
vm.runInContext(s.slice(s.indexOf('const EcLesson='),s.indexOf("let realMode="))+'\nthis.E=EcLesson;',elliptic);
const E=elliptic.E;
assert.equal(E.points.length,27);
for(const [P,n] of [[[0,1],28],[[6,19],14],[[5,19],7],[[11,3],4],[[4,0],2]])assert.equal(E.multiples(P).length-1,n);
for(const P of E.points){assert.deepEqual(E.add(P,null),P);assert.equal(E.add(P,[P[0],E.M(-P[1])]),null);for(const Q of E.points){const R=E.add(P,Q);if(R)assert.equal(E.M(R[1]**2),E.M(R[0]**3+R[0]+1));}}
vm.runInContext(s.slice(s.indexOf('function signLesson'),s.indexOf('function renderSign')),ctx);
let signatures=0;for(let d=1;d<19;d++)for(let k=1;k<19;k++)for(let z=0;z<19;z++){try{assert.equal(ctx.signLesson(d,k,z).valid,true);signatures++;}catch(e){if(!e.message.includes('bằng 0'))throw e;}}
const addressCtx=vm.createContext({});vm.runInContext(s.slice(s.indexOf('const addressFixture ='),s.indexOf('function renderAddress'))+'this.fixtures=addressFixture;',addressCtx);
assert.equal(addressCtx.fixtures.compressed.address,'1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH');
assert.equal(addressCtx.fixtures.uncompressed.address,'1EHNa6Q4Jz2uvNExL497mE43ikXhwF6kZm');
const crypto=require('node:crypto');const digest=(algo,data)=>crypto.createHash(algo).update(data).digest();
for(const v of Object.values(addressCtx.fixtures)){const pub=Buffer.from(v.key,'hex'),sha=digest('sha256',pub),hash=digest('ripemd160',sha),payload=Buffer.concat([Buffer.from([0]),hash]);assert.equal(sha.toString('hex'),v.sha);assert.equal(hash.toString('hex'),v.hash);assert.equal(digest('sha256',digest('sha256',payload)).subarray(0,4).toString('hex'),v.checksum);}
console.log('PASS: F23 group closure, five subgroup orders, '+signatures+' ECDSA signatures and address fixtures.');
