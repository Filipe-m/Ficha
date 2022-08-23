var Dice20 = document.getElementById("d20");
Dice20.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
        dice20();
    }
});

var Dice8 = document.getElementById("d8");
Dice8.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
        dice8();
    }
});

var Dice6 = document.getElementById("d6");
Dice6.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
        dice6();
    }
});

var Dice4 = document.getElementById("d4");
Dice4.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
        dice4();
    }
});

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}

const dice20 = () => {
  let x = parseInt(document.getElementById('d20').value)
  d20(x)
  document.getElementById('d20').value = ''
}

const dice8 = () => {
  let x = parseInt(document.getElementById('d8').value)
  d8(x)
  document.getElementById('d8').value = ''
}

const dice6 = () => {
  let x = parseInt(document.getElementById('d6').value)
  d6(x)
  document.getElementById('d6').value = ''
}

const dice4 = () => {
  let x = parseInt(document.getElementById('d4').value)
  d4(x)
  document.getElementById('d4').value = ''
}

const d20 = number => {
  var arr = []
  while (arr.length < number) {
    var r = Math.floor(Math.random() * 20) + 1
    arr.push(r)
  }
  alert(
    `----🎲  ${arr.reduce((a, b) => a + b, 0)}  🎲----\n\n ${arr.sort(function (
      a,
      b
    ) {
      return b - a
    })}`
  )
}

const d8 = number => {
  var arr = []
  while (arr.length < number) {
    var r = Math.floor(Math.random() * 8) + 1
    arr.push(r)
  }
  alert(
    `----🎲  ${arr.reduce((a, b) => a + b, 0)}  🎲----\n\n ${arr.sort(function (
      a,
      b
    ) {
      return b - a
    })}`
  )
}

const d6 = number => {
  var arr = []
  while (arr.length < number) {
    var r = Math.floor(Math.random() * 6) + 1
    arr.push(r)
  }
  alert(
    `----🎲  ${arr.reduce((a, b) => a + b, 0)}  🎲----\n\n ${arr.sort(function (
      a,
      b
    ) {
      return b - a
    })}`
  )
}

const d4 = number => {
  var arr = []
  while (arr.length < number) {
    var r = Math.floor(Math.random() * 4) + 1
    arr.push(r)
  }
  alert(
    `----🎲  ${arr.reduce((a, b) => a + b, 0)}  🎲----\n\n ${arr.sort(function (
      a,
      b
    ) {
      return b - a
    })}`
  )
}

function att1(){
  if(localStorage.vidaB != undefined){
    document.getElementById('vidaB').value = localStorage.vidaB
    document.getElementById('labelVB').innerHTML = `${localStorage.vidaB}/50`
  }
}

const att2 = () =>{
  if(localStorage.vidaC != undefined){
    document.getElementById('vidaC').value = localStorage.vidaC
    document.getElementById('labelVC').innerHTML = `${localStorage.vidaC}/33`
  }
}

const att3 = () =>{
  if(localStorage.vidaE != undefined){
    document.getElementById('vidaE').value = localStorage.vidaE
    document.getElementById('labelVE').innerHTML = `${localStorage.vidaE}/46`
  }
}

const att4 = () =>{
  if(localStorage.vidaF != undefined){
    document.getElementById('vidaF').value = localStorage.vidaF
    document.getElementById('labelVF').innerHTML = `${localStorage.vidaF}/33`
  }
}

const att5 = () =>{
  if(localStorage.vidaL != undefined){
    document.getElementById('vidaL').value = localStorage.vidaL
    document.getElementById('labelVL').innerHTML = `${localStorage.vidaL}/50`
  }
}
const att6 = () =>{
  if(localStorage.vidaM != undefined){
    document.getElementById('vidaM').value = localStorage.vidaM
    document.getElementById('labelVM').innerHTML = `${localStorage.vidaM}/46`
  }
}
const att7 = () =>{
  if(localStorage.vidaN != undefined){
    document.getElementById('vidaN').value = localStorage.vidaN
    document.getElementById('labelVN').innerHTML = `${localStorage.vidaN}/43`
  }
}
const att8 = () =>{
  if(localStorage.vidaZ != undefined){
    document.getElementById('vidaZ').value = localStorage.vidaZ
    document.getElementById('labelVZ').innerHTML = `${localStorage.vidaZ}/64`
  }
}
/*  ##########################################################################       */
const att9 = () =>{
if(localStorage.sanidadeB != undefined){
  document.getElementById('sanidadeB').value = localStorage.sanidadeB
  document.getElementById('labelSB').innerHTML = `${localStorage.sanidadeB}/20`
  }
}
const att10 = () =>{
  if(localStorage.sanidadeC != undefined){
    document.getElementById('sanidadeC').value = localStorage.sanidadeC
    document.getElementById('labelSC').innerHTML = `${localStorage.sanidadeC}/20`
  }
}
const att11 = () =>{
  if(localStorage.sanidadeE != undefined){
    document.getElementById('sanidadeE').value = localStorage.sanidadeE
    document.getElementById('labelSE').innerHTML = `${localStorage.sanidadeE}/20`
  }
}
const att12 = () =>{
  if(localStorage.sanidadeF != undefined){
    document.getElementById('sanidadeF').value = localStorage.sanidadeF
    document.getElementById('labelSF').innerHTML = `${localStorage.sanidadeF}/20`

  }
}
const att13 = () =>{
  if(localStorage.sanidadeL != undefined){
    document.getElementById('sanidadeL').value = localStorage.sanidadeL
    document.getElementById('labelSL').innerHTML = `${localStorage.sanidadeL}/20`

  }
}
const att14 = () =>{
  if(localStorage.sanidadeM != undefined){
    document.getElementById('sanidadeM').value = localStorage.sanidadeM
    document.getElementById('labelSM').innerHTML = `${localStorage.sanidadeM}/20`
  }
}
const att15 = () =>{
  if(localStorage.sanidadeN != undefined){
    document.getElementById('sanidadeN').value = localStorage.sanidadeN
    document.getElementById('labelSN').innerHTML = `${localStorage.sanidadeN}/20`
  }
}
const att16 = () =>{
  if(localStorage.sanidadeZ != undefined){
    document.getElementById('sanidadeZ').value = localStorage.sanidadeZ
    document.getElementById('labelSZ').innerHTML = `${localStorage.sanidadeZ}/20`
  }
}

att1()
att2()
att3()
att4()
att5()
att6()
att7()
att8()
att9()
att10()
att11()
att12()
att13()
att14()
att15()
att16()

const danoL = () =>{
  let x = localStorage.vidaL;
  var y = document.getElementById('valueL').value;
  if(localStorage.vidaL === undefined){
    localStorage.vidaL = '50'
  }
  else if (y === ''){
    return 0;
  }

  else if(x != undefined){
    a = document.getElementById('valueL').value;
    y = parseInt(a)
    z = parseInt(localStorage.vidaL)
    localStorage.vidaL = z - y
  }
  document.getElementById('vidaL').value = localStorage.vidaL
  document.getElementById('labelVL').innerHTML = `${localStorage.vidaL}/50`
}

const healL = () =>{
  let x = localStorage.vidaL;
  var y = document.getElementById('valueL').value;
  if(localStorage.vidaL === undefined){
    localStorage.vidaL = '50'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueL').value;
    y = parseInt(a)
    z = parseInt(localStorage.vidaL)
    localStorage.vidaL = z + y
    document.getElementById('vidaL').value = localStorage.vidaL
    document.getElementById('labelVL').innerHTML = `${localStorage.vidaL}/50`
  }
}

const sanidadeL = () =>{
  let x = localStorage.sanidadeL;
  var y = document.getElementById('valueL').value;
  if(localStorage.sanidadeL === undefined){
    localStorage.sanidadeL = '20'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueL').value;
    y = parseInt(a)
    z = parseInt(localStorage.sanidadeL)
    localStorage.sanidadeL = z - y
  }
  document.getElementById('sanidadeL').value = localStorage.sanidadeL
  document.getElementById('labelSL').innerHTML = `${localStorage.sanidadeL}/20`
}

const felicidadeL = () =>{
  let x = localStorage.sanidadeL;
  var y = document.getElementById('valueL').value;
  if(localStorage.sanidadeL === undefined){
    localStorage.sanidadeL = '20'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueL').value;
    y = parseInt(a)
    z = parseInt(localStorage.sanidadeL)
    localStorage.sanidadeL = z + y
  }
  document.getElementById('sanidadeL').value = localStorage.sanidadeL
  document.getElementById('labelSL').innerHTML = `${localStorage.sanidadeL}/20`
}

/*                */

const danoB = () =>{
  let x = localStorage.vidaB;
  var y = document.getElementById('valueB').value;
  if(localStorage.vidaB === undefined){
    localStorage.vidaB = '50'
  }
  else if (y === ''){
    return 0;
  }

  else if(x != undefined){
    a = document.getElementById('valueB').value;
    y = parseInt(a)
    z = parseInt(localStorage.vidaB)
    localStorage.vidaB = z - y
  }
  document.getElementById('vidaB').value = localStorage.vidaB
  document.getElementById('labelVB').innerHTML = `${localStorage.vidaB}/50`
}

const healB = () =>{
  let x = localStorage.vidaB;
  var y = document.getElementById('valueB').value;
  if(localStorage.vidaB === undefined){
    localStorage.vidaB = '50'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueB').value;
    y = parseInt(a)
    z = parseInt(localStorage.vidaB)
    localStorage.vidaB = z + y
    document.getElementById('vidaB').value = localStorage.vidaB
    document.getElementById('labelVB').innerHTML = `${localStorage.vidaB}/50`
  }
}

const sanidadeB = () =>{
  let x = localStorage.sanidadeB;
  var y = document.getElementById('valueB').value;
  if(localStorage.sanidadeB === undefined){
    localStorage.sanidadeB = '20'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueB').value;
    y = parseInt(a)
    z = parseInt(localStorage.sanidadeB)
    localStorage.sanidadeB = z - y
  }
  document.getElementById('sanidadeB').value = localStorage.sanidadeB
  document.getElementById('labelSB').innerHTML = `${localStorage.sanidadeB}/20`
}

const felicidadeB = () =>{
  let x = localStorage.sanidadeB;
  var y = document.getElementById('valueB').value;
  if(localStorage.sanidadeB === undefined){
    localStorage.sanidadeB = '20'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueB').value;
    y = parseInt(a)
    z = parseInt(localStorage.sanidadeB)
    localStorage.sanidadeB = z + y
  }
  document.getElementById('sanidadeB').value = localStorage.sanidadeB
  document.getElementById('labelSB').innerHTML = `${localStorage.sanidadeB}/20`
}

const danoC = () =>{
  let x = localStorage.vidaC;
  var y = document.getElementById('valueC').value;
  if(localStorage.vidaC === undefined){
    localStorage.vidaC = '33'
  }
  else if (y === ''){
    return 0;
  }

  else if(x != undefined){
    a = document.getElementById('valueC').value;
    y = parseInt(a)
    z = parseInt(localStorage.vidaC)
    localStorage.vidaC = z - y
  }
  document.getElementById('vidaC').value = localStorage.vidaC
  document.getElementById('labelVC').innerHTML = `${localStorage.vidaC}/33`
}

const healC = () =>{
  let x = localStorage.vidaC;
  var y = document.getElementById('valueC').value;
  if(localStorage.vidaC === undefined){
    localStorage.vidaC = '33'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueC').value;
    y = parseInt(a)
    z = parseInt(localStorage.vidaC)
    localStorage.vidaC = z + y
    document.getElementById('vidaC').value = localStorage.vidaC
    document.getElementById('labelVC').innerHTML = `${localStorage.vidaC}/33`
  }
}

const sanidadeC = () =>{
  let x = localStorage.sanidadeC;
  var y = document.getElementById('valueC').value;
  if(localStorage.sanidadeC === undefined){
    localStorage.sanidadeC = '20'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueC').value;
    y = parseInt(a)
    z = parseInt(localStorage.sanidadeC)
    localStorage.sanidadeC = z - y
  }
  document.getElementById('sanidadeC').value = localStorage.sanidadeC
  document.getElementById('labelSC').innerHTML = `${localStorage.sanidadeC}/20`
}

const felicidadeC = () =>{
  let x = localStorage.sanidadeC;
  var y = document.getElementById('valueC').value;
  if(localStorage.sanidadeC === undefined){
    localStorage.sanidadeC = '20'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueC').value;
    y = parseInt(a)
    z = parseInt(localStorage.sanidadeC)
    localStorage.sanidadeC = z + y
  }
  document.getElementById('sanidadeC').value = localStorage.sanidadeC
  document.getElementById('labelSC').innerHTML = `${localStorage.sanidadeC}/20`
}

const danoE = () =>{
  let x = localStorage.vidaE;
  var y = document.getElementById('valueE').value;
  if(localStorage.vidaE === undefined){
    localStorage.vidaE = '46'
  }
  else if (y === ''){
    return 0;
  }

  else if(x != undefined){
    a = document.getElementById('valueE').value;
    y = parseInt(a)
    z = parseInt(localStorage.vidaE)
    localStorage.vidaE = z - y
  }
  document.getElementById('vidaE').value = localStorage.vidaE
  document.getElementById('labelVE').innerHTML = `${localStorage.vidaE}/46`
}

const healE = () =>{
  let x = localStorage.vidaE;
  var y = document.getElementById('valueE').value;
  if(localStorage.vidaE === undefined){
    localStorage.vidaE = '46'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueE').value;
    y = parseInt(a)
    z = parseInt(localStorage.vidaE)
    localStorage.vidaE = z + y
    document.getElementById('vidaE').value = localStorage.vidaE
    document.getElementById('labelVE').innerHTML = `${localStorage.vidaE}/46`
  }
}

const sanidadeE = () =>{
  let x = localStorage.sanidadeE;
  var y = document.getElementById('valueE').value;
  if(localStorage.sanidadeE === undefined){
    localStorage.sanidadeE = '20'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueE').value;
    y = parseInt(a)
    z = parseInt(localStorage.sanidadeE)
    localStorage.sanidadeE = z - y
  }
  document.getElementById('sanidadeE').value = localStorage.sanidadeE
  document.getElementById('labelSE').innerHTML = `${localStorage.sanidadeE}/20`
}

const felicidadeE = () =>{
  let x = localStorage.sanidadeE;
  var y = document.getElementById('valueE').value;
  if(localStorage.sanidadeE === undefined){
    localStorage.sanidadeE = '20'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueE').value;
    y = parseInt(a)
    z = parseInt(localStorage.sanidadeE)
    localStorage.sanidadeE = z + y
  }
  document.getElementById('sanidadeE').value = localStorage.sanidadeE
  document.getElementById('labelSE').innerHTML = `${localStorage.sanidadeE}/20`
}

const danoF = () =>{
  let x = localStorage.vidaF;
  var y = document.getElementById('valueF').value;
  if(localStorage.vidaF === undefined){
    localStorage.vidaF = '33'
  }
  else if (y === ''){
    return 0;
  }

  else if(x != undefined){
    a = document.getElementById('valueF').value;
    y = parseInt(a)
    z = parseInt(localStorage.vidaF)
    localStorage.vidaF = z - y
  }
  document.getElementById('vidaF').value = localStorage.vidaF
  document.getElementById('labelVF').innerHTML = `${localStorage.vidaF}/33`
}

const healF = () =>{
  let x = localStorage.vidaF;
  var y = document.getElementById('valueF').value;
  if(localStorage.vidaF === undefined){
    localStorage.vidaF = '33'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueF').value;
    y = parseInt(a)
    z = parseInt(localStorage.vidaF)
    localStorage.vidaF = z + y
    document.getElementById('vidaF').value = localStorage.vidaF
    document.getElementById('labelVF').innerHTML = `${localStorage.vidaF}/33`
  }
}

const sanidadeF = () =>{
  let x = localStorage.sanidadeF;
  var y = document.getElementById('valueF').value;
  if(localStorage.sanidadeF === undefined){
    localStorage.sanidadeF = '20'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueF').value;
    y = parseInt(a)
    z = parseInt(localStorage.sanidadeF)
    localStorage.sanidadeF = z - y
  }
  document.getElementById('sanidadeF').value = localStorage.sanidadeF
  document.getElementById('labelSF').innerHTML = `${localStorage.sanidadeF}/20`
}

const felicidadeF = () =>{
  let x = localStorage.sanidadeF;
  var y = document.getElementById('valueF').value;
  if(localStorage.sanidadeF === undefined){
    localStorage.sanidadeF = '20'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueF').value;
    y = parseInt(a)
    z = parseInt(localStorage.sanidadeF)
    localStorage.sanidadeF = z + y
  }
  document.getElementById('sanidadeF').value = localStorage.sanidadeF
  document.getElementById('labelSF').innerHTML = `${localStorage.sanidadeF}/20`
}

const danoM = () =>{
  let x = localStorage.vidaM;
  var y = document.getElementById('valueM').value;
  if(localStorage.vidaM === undefined){
    localStorage.vidaM = '46'
  }
  else if (y === ''){
    return 0;
  }

  else if(x != undefined){
    a = document.getElementById('valueM').value;
    y = parseInt(a)
    z = parseInt(localStorage.vidaM)
    localStorage.vidaM = z - y
  }
  document.getElementById('vidaM').value = localStorage.vidaM
  document.getElementById('labelVM').innerHTML = `${localStorage.vidaM}/46`
}

const healM = () =>{
  let x = localStorage.vidaM;
  var y = document.getElementById('valueM').value;
  if(localStorage.vidaM === undefined){
    localStorage.vidaM = '46'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueM').value;
    y = parseInt(a)
    z = parseInt(localStorage.vidaM)
    localStorage.vidaM = z + y
    document.getElementById('vidaM').value = localStorage.vidaM
    document.getElementById('labelVM').innerHTML = `${localStorage.vidaM}/46`
  }
}

const sanidadeM = () =>{
  let x = localStorage.sanidadeM;
  var y = document.getElementById('valueM').value;
  if(localStorage.sanidadeM === undefined){
    localStorage.sanidadeM = '20'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueM').value;
    y = parseInt(a)
    z = parseInt(localStorage.sanidadeM)
    localStorage.sanidadeM = z - y
  }
  document.getElementById('sanidadeM').value = localStorage.sanidadeM
  document.getElementById('labelSM').innerHTML = `${localStorage.sanidadeM}/20`
}

const felicidadeM = () =>{
  let x = localStorage.sanidadeM;
  var y = document.getElementById('valueM').value;
  if(localStorage.sanidadeM === undefined){
    localStorage.sanidadeM = '20'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueM').value;
    y = parseInt(a)
    z = parseInt(localStorage.sanidadeM)
    localStorage.sanidadeM = z + y
  }
  document.getElementById('sanidadeM').value = localStorage.sanidadeM
  document.getElementById('labelSM').innerHTML = `${localStorage.sanidadeM}/20`
}

const danoN = () =>{
  let x = localStorage.vidaN;
  var y = document.getElementById('valueN').value;
  if(localStorage.vidaN === undefined){
    localStorage.vidaN = '43'
  }
  else if (y === ''){
    return 0;
  }

  else if(x != undefined){
    a = document.getElementById('valueN').value;
    y = parseInt(a)
    z = parseInt(localStorage.vidaN)
    localStorage.vidaN = z - y
  }
  document.getElementById('vidaN').value = localStorage.vidaN
  document.getElementById('labelVN').innerHTML = `${localStorage.vidaN}/43`
}

const healN = () =>{
  let x = localStorage.vidaN;
  var y = document.getElementById('valueN').value;
  if(localStorage.vidaN === undefined){
    localStorage.vidaN = '43'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueN').value;
    y = parseInt(a)
    z = parseInt(localStorage.vidaN)
    localStorage.vidaN = z + y
    document.getElementById('vidaN').value = localStorage.vidaN
    document.getElementById('labelVN').innerHTML = `${localStorage.vidaN}/43`
  }
}

const sanidadeN = () =>{
  let x = localStorage.sanidadeN;
  var y = document.getElementById('valueN').value;
  if(localStorage.sanidadeN === undefined){
    localStorage.sanidadeN = '20'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueN').value;
    y = parseInt(a)
    z = parseInt(localStorage.sanidadeN)
    localStorage.sanidadeN = z - y
  }
  document.getElementById('sanidadeN').value = localStorage.sanidadeN
  document.getElementById('labelSN').innerHTML = `${localStorage.sanidadeN}/20`
}

const felicidadeN = () =>{
  let x = localStorage.sanidadeN;
  var y = document.getElementById('valueN').value;
  if(localStorage.sanidadeN === undefined){
    localStorage.sanidadeN = '20'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueN').value;
    y = parseInt(a)
    z = parseInt(localStorage.sanidadeN)
    localStorage.sanidadeN = z + y
  }
  document.getElementById('sanidadeN').value = localStorage.sanidadeN
  document.getElementById('labelSN').innerHTML = `${localStorage.sanidadeN}/20`
}

const danoZ = () =>{
  let x = localStorage.vidaZ;
  var y = document.getElementById('valueZ').value;
  if(localStorage.vidaZ === undefined){
    localStorage.vidaZ = '64'
  }
  else if (y === ''){
    return 0;
  }

  else if(x != undefined){
    a = document.getElementById('valueZ').value;
    y = parseInt(a)
    z = parseInt(localStorage.vidaZ)
    localStorage.vidaZ = z - y
  }
  document.getElementById('vidaZ').value = localStorage.vidaZ
  document.getElementById('labelVZ').innerHTML = `${localStorage.vidaZ}/64`
}

const healZ = () =>{
  let x = localStorage.vidaZ;
  var y = document.getElementById('valueZ').value;
  if(localStorage.vidaZ === undefined){
    localStorage.vidaZ = '64'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueZ').value;
    y = parseInt(a)
    z = parseInt(localStorage.vidaZ)
    localStorage.vidaZ = z + y
    document.getElementById('vidaZ').value = localStorage.vidaZ
    document.getElementById('labelVZ').innerHTML = `${localStorage.vidaZ}/64`
  }
}

const sanidadeZ = () =>{
  let x = localStorage.sanidadeZ;
  var y = document.getElementById('valueZ').value;
  if(localStorage.sanidadeZ === undefined){
    localStorage.sanidadeZ = '20'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueZ').value;
    y = parseInt(a)
    z = parseInt(localStorage.sanidadeZ)
    localStorage.sanidadeZ = z - y
  }
  document.getElementById('sanidadeZ').value = localStorage.sanidadeZ
  document.getElementById('labelSZ').innerHTML = `${localStorage.sanidadeZ}/20`
}

const felicidadeZ = () =>{
  let x = localStorage.sanidadeZ;
  var y = document.getElementById('valueZ').value;
  if(localStorage.sanidadeZ === undefined){
    localStorage.sanidadeZ = '20'
  }
  else if (y === ''){
    return 0;
  }
  else if(x != undefined){
    a = document.getElementById('valueZ').value;
    y = parseInt(a)
    z = parseInt(localStorage.sanidadeZ)
    localStorage.sanidadeZ = z + y
  }
  document.getElementById('sanidadeZ').value = localStorage.sanidadeZ
  document.getElementById('labelSZ').innerHTML = `${localStorage.sanidadeZ}/20`
}