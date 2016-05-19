operators=['+','-','*','/','^','%'];
legalOperands = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'A', 'B',
                  'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
                  'O', 'P', 'R', 'S', 'T', 'U', 'W', 'X', 'Y', 'Z'];

// ================== FUNKCJE INFIX -> SOMETHING I WALIDATOR ======================
function inToPost(a){
  solution=''
  var stack=new Array();

  //Lecimy po wszystkich znakach
  for(i=0;i<a.length;i++){  
    //Znaleziono operand
    if(isInTable(a[i], legalOperands)){ 
      solution+=a[i];

      if(i+1<a.length){
        //Dalej tez moga byc cyfry ktore tworza liczbe
        while(isInTable(a[i+1], legalOperands)){ 
          solution+=a[i+1];
          i++;
        }
      }
      solution+=' ';
     }

     //Znaleziono operator
     if(isInTable(a[i],operators)){  
      //Pierwszy operator mozna spokojnie pushowac kolejne juz trzeba sprawdzac
      if(stack.length>0){ 
        tempChar=stack.pop();
        //Pierwszy operator po otwierajacy nawiasie wiec mozna pushnac spokojnie
        if(tempChar=='('){ 
          stack.push(tempChar);
          stack.push(a[i]);
        }

        else{
          //Sprawdz wagi operatorow na stosie i wywalaj dopoki sa wieksze niz aktualny znak badz kaniec stosu lub znajdziesz nawias otwierajacy
          while(operatorValue(tempChar)>=operatorValue(a[i]) && tempChar!=undefined && tempChar!='('){ 
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

     //nawias zamykajacy popuje wszystko do otwierajacego na stosie
     if(a[i]==')'){ 
        tempChar=stack.pop();
        while(tempChar!=undefined && tempChar!='('){
          if(tempChar!='(')
            solution+=tempChar
          tempChar=stack.pop();
        }
     }
   }

  //wywal wszystko ze stosuna koniec i gitara
  while(stack.length>0){ 
    solution+=stack.pop();
  }

  return solution
}

function inToPre(a){
  b=a.split("").reverse().join("").replace(/\(/g, "$").replace(/\)/g, "(").replace(/\$/g, ")"); 
  return inToPost(b).split("").reverse().join("");
}

function infixValidator(a){
  correct=true;

  for(i=0;i<a.length;i++){ 
    if(!isInTable(a[i],legalOperands) && !isInTable(a[i],operators) && a[i]!='('  && a[i]!=')' && a[i]!=' ')
      correct=false;
  }

  if(isInTable(a[0],operators)) return false;
  parenthesisCounter=0;
  phase=1; // 1-operator/parenthesis 2-operand

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

// ========================= FUNKCJE POSTFIX -> SOMETHING =========================

function postToPre(a){
  return inToPre(postToIn(a));
}

function postToIn(a){
	for(i=0;i<a.length;i++){ 
    	if(!isInTable(a[i],legalOperands) && !isInTable(a[i],operators) && a[i]!='('  && a[i]!=')' && a[i]!=' ')
      		return-1;
  	}
  stack=new Array();
  solutionEnd='';

  for(i=0;i<a.length;i++){
    solution='';

    if(isInTable(a[i], legalOperands)){ 
      solution+=a[i];
      if(i+1<a.length){
        while(isInTable(a[i+1], legalOperands)){
          solution+=a[i+1];
          i++;
        }
      }

      stack.push(solution);
    }

    //Znaleziono operator
    if(isInTable(a[i],operators)){  
      if(stack.length>=2){
        temp1=stack.pop();
        temp2=stack.pop();
        solutionEnd='('+temp2+''+a[i]+temp1+')';
        stack.push(solutionEnd);
      } else return -1;
    }
  }

  if(stack.length != 1) return -1;
  else return stack.pop();
}

// ========================= FUNKCJE PREFIX -> SOMETHING =========================

function preToPost(a){
	for(i=0;i<a.length;i++){ 
    	if(!isInTable(a[i],legalOperands) && !isInTable(a[i],operators) && a[i]!='('  && a[i]!=')' && a[i]!=' ')
      		return-1;
  	}
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

// ==================================== MAIN ==================================

function mainFunction() {   
    formula = document.getElementById("input").value;
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

    // Wybrano konwersje z prefixa
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

    // Wybrano konwersje z infixa
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

    // Wybrano konwersje z postfixa
    if(rad1==2){
      toInResult = postToIn(formula)
      
      if(toInResult != -1)
      {
        document.getElementById("button").style.background='#7BCC70';

        if(rad2==0){
           document.getElementById("output").value=postToPre(formula);
        }
        if(rad2==1){
          document.getElementById("output").value=toInResult;
        }
        if(rad2==2){
          document.getElementById("output").value=formula;
        }
      } else{
        document.getElementById("button").style.background='#EE3B3B';
      }
    }
}



// =============================== FUNKCJE POMOCNICZE ============================

function isInTable(el, tab) {
    isIt = false;
    for(j=0;j<tab.length;j++){
      if(tab[j]==el)
      {    
        isIt=true;
        break;
      }
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