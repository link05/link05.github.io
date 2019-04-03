// what if user selects 1 or 2 movies only...
// update questions
// make it responsive

class movie{
    constructor(name, questions, selected) {
        this.name = name;
        this.questions = questions;
        this.selected = false;
        this.idName;
    }
    Updateselected(){
        if(this.selected === true){
            this.selected = false;
            this.StyleUnSelected();
        }
        else{
            this.selected = true;
            this.StyleSelected();
        }
    }

    StyleSelected(){
        document.getElementById(this.idName).style["background-color"] = "green";
    }
    StyleUnSelected(){
        document.getElementById(this.idName).style["background-color"]= null;
    }
}

class movieQuestion{
    constructor(question, optionA, optionB, optionC, optionD, correctAnswer){
        this.question = question;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.correctAnswer = correctAnswer;
    }
}

let allMovies = []; //variable to hold movie objs
AddAllMovies();    //this method adds movies to allMovies  array

// for ea. movie add it to html and if clicked update selected proerty of movie, which would also change styling
allMovies.forEach(movie => {
    console.log(movie.name);
    let movieElement = document.createElement("span");
    movieElement.setAttribute("class","movie");
    movieElement.onclick = () => movie.Updateselected();
    let Idname = movie.name.replace(/\s/g,'-');
    movie.idName = Idname;
    movieElement.setAttribute("id", Idname);
    movieElement.appendChild(document.createTextNode(movie.name));
    let element =  document.getElementById("movieList");
    element.appendChild(movieElement);
});



// contains the funcitonality of presenting questions/answers
let moviesToQuiz = []; //contains all the movies to quiz the user on
let movieOrderToAsk = []; //contains the indexes # for movies to ask on
let questionIndexes = []; //contains question indexes for each movie
let currentQuestion=0;
let userClicked = false;
let usersAnswer; //holds which option user chose: possiable values: optionA, optionB, optionC, optionD
let score = 0;
document.getElementById('playAgain').onclick = ()=>{
    document.location.reload();
}

document.getElementById('movieGeektitle').onclick = ()=>{
    document.location.reload();
}
//when submit gets clicked...
document.getElementById('submitBtn').onclick = () => {

    getSelectedMovies(); //this method adds the movies which user selected to movieToQuiz array
    if(moviesToQuiz.length == 0){
      document.getElementById('noMovieSelected').style.display = 'block';
      document.getElementById('noMovieSelected').innerHTML = 'You must choose atleast 3 movie to play this game!'
    }
    else if(moviesToQuiz.length < 3){
        console.log(moviesToQuiz.length);
        document.getElementById('noMovieSelected').style.display = 'block';
      document.getElementById('noMovieSelected').innerHTML = 'You must choose atleast 3 movie to play this game!'
    }
    else{
     document.getElementById('step1').style.display = 'none';
     //append question area to top right and score to top left of 'welcome to movieGeek title'
     var questionArea = document.createElement("SPAN");
     var text = document.createTextNode("Question: ");
     questionArea.setAttribute("id","questionNumberArea");
     questionArea.append(text);
     document.getElementById('movieGeekArea').appendChild(questionArea);

     var scoreArea = document.createElement("SPAN");
     var text = document.createTextNode("Score:  0");
     scoreArea.setAttribute("id","scoreArea");
     scoreArea.append(text);
     document.getElementById('movieGeekArea').appendChild(scoreArea);
     
     document.getElementById('step2').style.display = 'block';
     document.getElementById('GameArea').style.display='none';
     createMovieQuestionsOrder();
     //for the other questions, call askQuestion method which will ask other questions
    timerCountDown(movieOrderToAsk[0]); //this methods does 3,2,1 and calls the askQuestion method

    }
}

//add movies the user selected to be quized on to moviesToQuiz array
function getSelectedMovies(){
    allMovies.forEach(movie =>{
        if(movie.selected === true)
        {
            //only add movie to the quizzing list if it is not already there
            if(!moviesToQuiz.includes(movie))moviesToQuiz.push(movie);   
        }
    })
}

//which movie should we ask first, second,third....
function createMovieQuestionsOrder(){
    const numberOfQuestions = 10;
    let questionsPerMovie = Math.floor(numberOfQuestions/moviesToQuiz.length);
    let sameMovieQuestions = numberOfQuestions % moviesToQuiz.length;
    let questionIndexes = []; //holds which questions to ask from each movie
    console.log('movies to quiz on');
    console.log(moviesToQuiz);
    moviesToQuiz.forEach(mv =>{
        //generate questionsPerMovie many random numbers between 0 - question.legnth
        questionIndexes = GenerateUniqueNums(questionsPerMovie,mv.questions.length);
        console.log('question indexes:'+questionIndexes);
        questionIndexes.forEach(qIndex =>{
            console.log('movie name is'+mv.name);
            console.log('movie question is '+ mv.questions[qIndex].question);
            var movieQuestionObj = {
                Question: mv.questions[qIndex].question,
                OptionA: mv.questions[qIndex].optionA,
                OptionB: mv.questions[qIndex].optionB,
                OptionC: mv.questions[qIndex].optionC,
                OptionD: mv.questions[qIndex].optionD,
                Answer: mv.questions[qIndex].correctAnswer
            };
            movieOrderToAsk.push(movieQuestionObj); 
            console.log('movie obj is '+movieQuestionObj.Question);
        })
    });
    if(sameMovieQuestions !== 0){
        for(let i=0; i < sameMovieQuestions;i++){
            do{
                let movieIndex = Math.floor(Math.random()*moviesToQuiz.length);
                let questionIndex = Math.floor(Math.random()*moviesToQuiz[movieIndex].questions.length);
                var movieQuestionObj2 = {
                  Question: moviesToQuiz[movieIndex].questions[questionIndex].question,
                  OptionA: moviesToQuiz[movieIndex].questions[questionIndex].optionA,
                  OptionB: moviesToQuiz[movieIndex].questions[questionIndex].optionB,
                  OptionC: moviesToQuiz[movieIndex].questions[questionIndex].optionC,
                  OptionD: moviesToQuiz[movieIndex].questions[questionIndex].optionD,
                  Answer: moviesToQuiz[movieIndex].questions[questionIndex].correctAnswer
                };
            }while(movieOrderToAsk.includes(movieQuestionObj2));
            movieOrderToAsk.push(movieQuestionObj2);
        }
    }

}

function GenerateUniqueNums(howMany,upperbound) {
    uniqueNumbers = []; //so we ask questions from different indexes
    if(howMany > upperbound) {
        console.log('error howMany > upperBound');
        return null;
    }
    else{
        for(let x = 0; x < howMany; x++)
    {
        do{
            index = Math.floor(Math.random()*upperbound);
        }while (uniqueNumbers.includes(index));
        uniqueNumbers.push(index);
    }
    return uniqueNumbers;
    }
}

function updateQuestion(){
    const correctOption = movieOrderToAsk[currentQuestion].Answer;
    if(usersAnswer === correctOption) score =100+ score;
    document.getElementById('scoreArea').innerHTML = 'score: '+score; //show the score field with score value
    let count = 1; //used to time showing the right answer
    let showAnswer = ()=>{
        document.getElementById(correctOption).style.backgroundColor= 'green';
        document.getElementById(correctOption).style.color = 'white';
        count++;
        if(count >3){
            clearInterval(answerTimer);
            document.getElementById(correctOption).style.backgroundColor= '';
            document.getElementById(correctOption).style.color= '';
            if(currentQuestion < movieOrderToAsk.length) startQuestionTimer(movieOrderToAsk[currentQuestion]); //ask more questions if any
            if(currentQuestion >= movieOrderToAsk.length) gameOverSummary(); //if all questions are asked...
        }
    }
    let answerTimer = setInterval(showAnswer,400);
}

function gameOverSummary(){
    console.log('game over!')
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'block';
    document.getElementById('totalScore').innerHTML = score;
}

const clickedOptionA = () =>{
    disableAllOptions(); //to prevent user from changing their answer
    console.log('optionA active');
    userClicked = true;
    usersAnswer='optionA';
}

const clickedOptionB = () =>{
    disableAllOptions();
    console.log('optionB active');
    userClicked = true;
    usersAnswer = 'optionB';
}

const clickedOptionC = () =>{
    disableAllOptions();
    console.log('optionC active');
    userClicked = true;
    usersAnswer = 'optionC';
}

const clickedOptionD = () =>{
    disableAllOptions();
    console.log('optionD active');
    userClicked = true;
    usersAnswer = 'optionD';
}

document.getElementById('optionA').onclick = clickedOptionA;
document.getElementById('optionB').onclick = clickedOptionB;
document.getElementById('optionC').onclick = clickedOptionC;
document.getElementById('optionD').onclick = clickedOptionD;

function disableAllOptions(){
    document.getElementById('optionA').onclick = null;
    document.getElementById('optionB').onclick = null;
    document.getElementById('optionC').onclick = null;
    document.getElementById('optionD').onclick = null;
}

function activateAllOptions(){
    document.getElementById('optionA').onclick = clickedOptionA;
    document.getElementById('optionB').onclick = clickedOptionB;
    document.getElementById('optionC').onclick = clickedOptionC;
    document.getElementById('optionD').onclick = clickedOptionD;
}

/*timerCountDown does the actual count down before the game starts 3,2,1 and calls startQuestionTimer() which
asks the question for the user. in addition to displaying question, startQuesitonTimer also starts timer for
each quesiton.
 */
function timerCountDown(movie){
    //countdown mechanism
  let startCountDown = 5;
  let countdown = () =>
  {
    startCountDown = startCountDown -1;
    //countdown colors
    countDownColors('startCountDown',startCountDown);
    if(startCountDown == 1)startQuestionTimer(movie); //this method asks questions and timer for each question
    else if(startCountDown == 0){
     document.getElementById('GameArea').style.display='block'; //show the question/option format
     document.getElementById('startCountDown').style.display = 'none'; //disable 3,2,1 counter at begining of the game
     document.getElementById('getReady').style.display = 'none'; //hide 'get ready' text
     clearInterval(getReadyTimer); //stop timer
    }
  }
  let getReadyTimer = setInterval(countdown,1000);
}
function countDownColors(elementname, time){
    if(time == 5) document.getElementById(elementname).style.color='limegreen';
    else if(time == 4) document.getElementById(elementname).style.color='darkgreen';
    else if(time == 3) document.getElementById(elementname).style.color='yellow';
    else if(time == 2) document.getElementById(elementname).style.color='orange';
    else if(time == 1) document.getElementById(elementname).style.color='red';
    document.getElementById(elementname).innerHTML = time; //show 3,2,1...
}
function startQuestionTimer(movieQuestionObj){
    let remainingTime = 6;  //time allocated for each question
    let questionTimer = () => {
      remainingTime--;
      countDownColors('questionTimerArea',remainingTime);
      document.getElementById('questionArea').innerHTML = movieQuestionObj.Question;
      document.getElementById('optionA').innerHTML = movieQuestionObj.OptionA;
      document.getElementById('optionB').innerHTML = movieQuestionObj.OptionB;
      document.getElementById('optionC').innerHTML = movieQuestionObj.OptionC;
      document.getElementById('optionD').innerHTML = movieQuestionObj.OptionD;
      document.getElementById('questionNumberArea').innerHTML = 'Question:'+(currentQuestion+1);
      console.log('current question is '+currentQuestion);

      //userClicked: to see if user choose answer before time expired
      //remainingTime: refers to remaining time for the question
      if(remainingTime == 0 || userClicked){ 
          if(userClicked) userClicked = false; //flag used to determine if user clicked before time expired
          clearInterval(timer); //stop timer
          updateQuestion(); //shows right answer and asks next question if any
          currentQuestion++;
      }
    }
    let timer = setInterval(questionTimer,1000); //execute questionTimer every sec. until clearInterval() is called
    activateAllOptions(); //re-engage all buttons
}

function AddAllMovies(){
    let movieQuestions = []; //holds all the movie questions to ask

    movieQuestions[0] = new movieQuestion('This was the main actor in the movie Limitless','Bradley Cooper','Chris Pratt','tony romo','Michael B. Jordan','optionA');
    movieQuestions[2] = new movieQuestion('What was the pill name that made Eddie really intelligent ','Aderall','Focus pill','NZT','enhanced focus supplement','optionC');
    movieQuestions[1] = new movieQuestion('Who introduced Eddie to NZT?',"His ex's brother","His ex","His landlord","His friend",'optionA');
    movieQuestions[3] = new movieQuestion('Which city does the movie take place in?','New York','San Francisco','Vegas','Woodland','optionA');
    let Limitless = new movie('Limitless', movieQuestions);
    allMovies.push(Limitless);

    movieQuestions= [];

    movieQuestions[0] = new movieQuestion('This actor plays the role of Arthur','Henry Cavil','Jackie Chan','Jason momoa','bradley cooper','optionC');
    movieQuestions[1] = new movieQuestion('Why doesnot authur want to go to atlantis in the begining of movie','He wasnot interested','He was imprisioned there','his family died there','he couldnt breathe under water','optionA');
    movieQuestions[2] = new movieQuestion('How was arthur different from other atlantian?','he could swim fast','he could speak english','He could breathe on land as well','he could talk to other marine animals','optionD');
    movieQuestions[3] = new movieQuestion('Why does his brother want to kill him?','Because authur stole something important from atlantis','Authur could speak english','Authur was ilegitmate atlantian','Authur killed his own father','optionC');
    let Aquaman = new movie('Aquaman', movieQuestions);
    allMovies.push(Aquaman);

    movieQuestions= [];
    
    movieQuestions[0] = new movieQuestion('This actor plays Ironman ','Jack black','Robert Downey Jr.','benedict cumberbatch','Peter Dinklage','optionB');
    movieQuestions[1] = new movieQuestion('How does Tony manage to escape from being kidnapped?','By running at night when guards were distraced','By finding a cellphone and using it','retaliating back to his kidnapers','Using local"s help','optionC');
    movieQuestions[2] = new movieQuestion('How does he get the first core in his chest','He had heart issue since he was small and doctors put it there','His friend puts it on him to save him','he builds it and uses it to power his suit','He uses it to talk to jarvis','optionB');
    movieQuestions[3] = new movieQuestion('Who was Jarvis?','voice command like siri','physical robot that helps him','His best friend','His Cousin','optionA');
    let Ironman = new movie('Ironman', movieQuestions);
    allMovies.push(Ironman);

    movieQuestions= [];

    movieQuestions[0] = new movieQuestion('What was the main conflict in this movie ','His uncle trying to kill him','Tony Stark slowly dying','His robot being hacked and someone using it','Someone trying to take his comapny from him','optionB');
    movieQuestions[1] = new movieQuestion('ironman2 q2','Jack black','amit dahal','tony romo','bradley cooper','optionA');
    movieQuestions[2] = new movieQuestion('ironman2 q3','Jack black','amit dahal','tony romo','bradley cooper','optionB');
    movieQuestions[3] = new movieQuestion('ironman2 q4','tony stark','dr.Strange','hulk','thor','optionB');
    let Ironman2 = new movie('Ironman 2', movieQuestions);
    allMovies.push(Ironman2);

    movieQuestions= [];

    movieQuestions[0] = new movieQuestion('ironman3 q1 ','pda','desktop','laptop','phone','optionC');
    movieQuestions[2] = new movieQuestion('ironman3 q3','obito','itachi','sauske','naruto','optionB');
    movieQuestions[3] = new movieQuestion('ironman3 q4','ichigo','rukia','renji','orihime','optionA');
    movieQuestions[1] = new movieQuestion('ironman3 q2','dragon','shark','fish','pegasus','optionA');
    let ironman3 = new movie('Ironman 3', movieQuestions);
    allMovies.push(ironman3);

    movieQuestions= [];

    movieQuestions[0] = new movieQuestion('edge q1 ','Sword','gun','tank','missle','optionC');
    movieQuestions[1] = new movieQuestion('edge q2','rice','beans','daal','chana','optionA');
    movieQuestions[2] = new movieQuestion('edge q3','Tyreke','Tyrone','Joss','miachel','optionB');
    movieQuestions[3] = new movieQuestion('edge q4','jim','micahel','kevin','oscar','optionA');
    let edge = new movie('Edge Of Tomorrow', movieQuestions);
    allMovies.push(edge);

    movieQuestions= [];
    
    movieQuestions[0] = new movieQuestion('bahuballi q1 ','hair','legs','feet','hands','optionC');
    movieQuestions[1] = new movieQuestion('bahuballi q2','table','chair','desk','podium','optionA');
    movieQuestions[2] = new movieQuestion('bahuballi q3','wireless','apple pods','soul','dr.dre','optionB');
    movieQuestions[3] = new movieQuestion('bahuballi q4','asus','samsung','acer','alienware','optionA');
    let bahuballi = new movie('bahubali', movieQuestions);
    allMovies.push(bahuballi);
    
    movieQuestions= [];

    movieQuestions[0] = new movieQuestion('bahuballi2 q1 ','hair','legs','feet','hands','optionC');
    movieQuestions[1] = new movieQuestion('bahuballi2 q2','table','chair','desk','podium','optionA');
    movieQuestions[2] = new movieQuestion('bahuballi2 q3','wireless','apple pods','soul','dr.dre','optionB');
    movieQuestions[3] = new movieQuestion('bahuballi2 q4','asus','samsung','acer','alienware','optionA');
    let bahuballi2 = new movie('babhubali2', movieQuestions);
    allMovies.push(bahuballi2);

    movieQuestions= [];
    
    movieQuestions[0] = new movieQuestion('Dhoom q1 ','hair','legs','feet','hands','optionC');
    movieQuestions[1] = new movieQuestion('Dhoom q2','table','chair','desk','podium','optionA');
    movieQuestions[2] = new movieQuestion('Dhoom q3','wireless','apple pods','soul','dr.dre','optionB');
    movieQuestions[3] = new movieQuestion('Dhoom q4','asus','samsung','acer','alienware','optionA');
    let dhoom = new movie('Dhoom', movieQuestions);
    allMovies.push(dhoom);

    movieQuestions = [];


    movieQuestions[0] = new movieQuestion('shotcaller q1 ','hair','legs','feet','hands','optionC');
    movieQuestions[1] = new movieQuestion('shotcaller q2','table','chair','desk','podium','optionA');
    movieQuestions[2] = new movieQuestion('shotcaller q3','wireless','apple pods','soul','dr.dre','optionB');
    movieQuestions[3] = new movieQuestion('shotcaller q4','asus','samsung','acer','alienware','optionA');
    let shotcaller = new movie('shotcaller', movieQuestions);
    allMovies.push(shotcaller);

}