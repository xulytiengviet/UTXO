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
