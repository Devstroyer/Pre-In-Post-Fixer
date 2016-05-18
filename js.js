operators=['+','-','*','/','^','%'];
legalOperands = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'A', 'B',
                  'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
                  'O', 'P', 'R', 'S', 'T', 'U', 'W', 'X', 'Y', 'Z'];


function inToPost(a){
  solution=''
  var stack=new Array();
  for(i=0;i<a.length;i++){  //Lecimy po wszystkich znakach
    if(a.charCodeAt(i)>=48 && a.charCodeAt(i)<=57){ //Znaleziono cyfre
      solution+=a[i];
      if(i+1<a.length){
        while(a.charCodeAt(i+1)>=48 && a.charCodeAt(i+1)<=57){ //Dalej tez moga byc cyfry ktore tworza liczbe
          solution+=a[i+1];
          i++;
        }
      }
      solution+=' ';
     }
     if(isInTable(a[i],operators)){  //Znaleziono operator
      if(stack.length>0){ //Pierwszy operator mozna spokojnie pushowac kolejne juz trzeba sprawdzac
        tempChar=stack.pop();
        if(tempChar=='('){ //Pierwszy operator po otwierajacy nawiasie wiec mozna pushnac spokojnie
          stack.push(tempChar);
          stack.push(a[i]);
        }
        else{
          while(operatorValue(tempChar)>=operatorValue(a[i]) && tempChar!=undefined && tempChar!='('){ //Sprawdz wagi operatorow na stosie i wywalaj dopoki sa wieksze niz aktualny znak badz kaniec stosu lub znajdziesz nawias otwierajacy
            solution+=tempChar;
            tempChar=stack.pop();
          }
          if(tempChar!=undefined && tempChar!='(')
            stack.push(tempChar);
          stack.push(a[i]);
        }
      }
      else{
        stack.push(a[i]);
      }   
     }
     if(a[i]=='('){
        stack.push(a[i]);
     }
     if(a[i]==')'){ //nawias zamykajacy popuje wszystko do otwierajacego na stosie
        tempChar=stack.pop();
        while(tempChar!=undefined && tempChar!='('){
          if(tempChar!='(')
            solution+=tempChar
          tempChar=stack.pop();
        }
     }
   }
  while(stack.length>0){ //wywal wszystko ze stosuna koniec i gitara
    solution+=stack.pop();
  }
  return solution
}

function inToPre(a){
  b=a.split("").reverse().join("").replace(/\(/g, "$").replace(/\)/g, "(").replace(/\$/g, ")"); 
  return inToPost(b).split("").reverse().join("");
}

function postToPre(a){
  return inToPre(postToIn(a));
}

function postToIn(a){
  stack=new Array();
  solutionEnd='';
  for(i=0;i<a.length;i++){  //Postfix to Infix
    solution='';
    if(a.charCodeAt(i)>=48 && a.charCodeAt(i)<=57){ 
      solution+=a[i];
      if(i+1<a.length){
        while(a.charCodeAt(i+1)>=48 && a.charCodeAt(i+1)<=57){
          solution+=a[i+1];
          i++;
        }
      }
      stack.push(solution);
    }
    if(isInTable(a[i],operators)){  //Znaleziono operator
      if(stack.length>=2){
        temp1=stack.pop();
        temp2=stack.pop();
        solutionEnd='('+temp2+''+a[i]+temp1+')';
        stack.push(solutionEnd);
      }
    }
  }
  return stack.pop();
}
function preToPost(a){
  foundSpace = false;
  stack = [];

  // Rozpatrujac wejscie od tylu
  for(i = a.length-1; i >= 0; --i)
  {
    console.log(a[i] + ", spacja: " + foundSpace);
    // Znaleziono operator, mozna stworzyc wyrazenie
    if(isInTable(a[i], operators))
    {
      if(stack.length < 2) return -1;

      operand1 = stack.pop();
      operand2 = stack.pop();
      stack.push(operand1 + " " + operand2 + a[i]);

      // Markuj znalezienie spacji, zeby oznaczyc koniec
      // obecnej liczby
      foundSpace = true;
    }

    // Znaleziono dopuszczalny operand
    else if(isInTable(a[i], legalOperands))
    {
      // Jesli wczesniej wystapila stacja, push
      if(foundSpace)
      {
        foundSpace = false;
        stack.push(a[i]);
      }

      // W przeciwnym wypadku, doklej do ostatniego operandu
      // jesli istnieje (spacja mogla byc na koncu)
      else stack.push(a[i] + (stack.length > 0 ? stack.pop() : ''));
    }

    // Znaleziono spacje
    else if(a[i] == ' ')
    {
      foundSpace = true;
    }
    console.log(stack);
  }

  if(stack.length != 1) return -1;
  else return stack.pop();
}

function mainFunction() {   
    formula =document.getElementById("input").value;
    var radios = document.getElementsByName('from');
    var rad1;
    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        rad1=i;
        break;
      }
    }
    var radios = document.getElementsByName('to');
    var rad2;
    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        rad2=i;
        break;
      }
    }
    if(rad1==0){
      toPostResult = preToPost(formula)
      if(toPostResult != -1)
      {
        document.getElementById("button").style.background='#7BCC70';

        if(rad2==0){
          document.getElementById("output").value=formula;
        }
        if(rad2==1){
          document.getElementById("output").value=postToIn(toPostResult);
        }
        if(rad2==2){
          document.getElementById("output").value=toPostResult;
        }
      } else{
        document.getElementById("button").style.background='#EE3B3B';
      }   
    }
    if(rad1==1){
      if(infixValidator(formula)){
        document.getElementById("button").style.background='#7BCC70';
        if(rad2==0){
        document.getElementById("output").value=inToPre(formula);
        }
        if(rad2==1){
          document.getElementById("output").value=formula;
        }
        if(rad2==2){
          document.getElementById("output").value=inToPost(formula);
        }
      }
      else{
        document.getElementById("button").style.background='#EE3B3B';
      }     
    }
    if(rad1==2){
      if(rad2==0){
         document.getElementById("output").value=postToPre(formula);
      }
      if(rad2==1){
        document.getElementById("output").value=postToIn(formula);
      }
      if(rad2==2){
        document.getElementById("output").value=formula;
      }
    }
}

function infixValidator(a){
  correct=true;
  for(i=0;i<a.length;i++){ 
    if(!isInTable(a[i],legalOperands) && !isInTable(a[i],operators) && a[i]!='('  && a[i]!=')')
      correct=false;
  }
  parenthesisCounter=0;
  phase=1; //1-operator/parenthesis 2-operand
  for(i=0;i<a.length;i++){
    if(isInTable(a[i],legalOperands)){
      while(a[i+1]==' '){
        i++
      }
      if(a[i+1]=='('){
        //window.alert("Blad")
        correct=false;
      }
    }
    if(isInTable(a[i],operators)){
      while(a[i+1]==' '){
        i++;
      }
      if(!isInTable(a[i+1],legalOperands) && a[i+1]!='('){
        //window.alert("Blad")
        correct=false;
      }
    }
    if(a[i]==')'){
      parenthesisCounter--;
      while(a[i+1]==' '){
        i++
      }
      if(a[i+1]=='(' || isInTable(a[i+1],legalOperands)){
        //window.alert("Blad")
        correct=false;
      }
    }
    if(a[i]=='('){
      parenthesisCounter++;
      while(a[i+1]==' '){
        i++
      }
      if(!isInTable(a[i+1],legalOperands) && a[i+1]!='('){
        window.alert("Blad")
        correct=false;
      }
    }
  }
  if(parenthesisCounter!=0)
    correct=false;
  return correct;
}


function isInTable(el, tab) {
    isIt = false;
    for(j=0;j<tab.length;j++){
      if(tab[j]==el)    
        isIt=true;
    }
    return isIt;
}

function operatorValue(el) {
    if(el=='+' || el=='-')
      return 1;
    if(el=='/' || el=='*')
      return 2;
     if(el=='^' || el=='%')
      return 3;
}