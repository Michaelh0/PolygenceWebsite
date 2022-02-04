//const funcClosematches = require("./editdistance")
require(["./editDistance folder/levenshtein"], function(levenshtein){


window.addEventListener('load', function () {
  document.querySelector('input[type="file"]').addEventListener('change', function () {
    // fix this line above

    if (this.files && this.files[0]) {
      var img = document.querySelector('img');
      img.onload = () => {
        URL.revokeObjectURL(img.src); // no longer needed, free memory
      }

      img.src = URL.createObjectURL(this.files[0]); // set src to blob url
    }
  });
});

var promiseDict = (fetch("housing_dictionary/index.json")
  .then(response => response.json())
  .then(json => {
    //document.getElementById('main').innerHTML = JSON.stringify(json);

    var dictionaryInside = new Set(json);

    console.log(json);
    console.log(dictionaryInside);
    return dictionaryInside;
  }));

const  doesItExist = async (word) => {
  //var WordWithExistance;
  var dictionary = await promiseDict;
  
  
  
  //document.getElementById("outputTesseract").innerHTML = WordWithExistance;
  //
  /*if(!(dictionary.has(word)))
      funcClosematches(word);
  */
  // want to return the string wordWithExistance

  //replace returning a string into returning bool true or false

  //WordWithExistance = word + " exists: " + (dictionary.has(word)).toString();
  //return WordWithExistance;

  return dictionary.has(word);

};

const alternativeWords = async (word) => {
  var dictionary = await promiseDict;
  for (var i = 0; i < (dictionary.length); i += 1) {

    var stringA = word;
    var stringB = dictionary[i];
    var insert = remove = function(char) { return 1; };
    var update = function(charA, charB) { return charA !== charB ? 1 : 0; };
    if (levenshtein(stringA, stringB, insert, remove, update).distance <= MAX)
      console.log(stringB);
  }
}


function output_image(val) {
  var src = val;
  show_image(src, 276, 110, "Google Logo");
}

function tesseract(val) {
  //'img/a01-000u-1.1.png'
  Tesseract.recognize(
    val,
    'eng', {
      logger: m => {
        if (m.status == "recognizing text") {
          console.log(m);
          jump(m.progress * 100);
        }

      }
    }
    // here is where i should access the logger information
  ).then(async({
    data
  }) => {
    console.log(data.words);
    var element = document.getElementById("outputTesseract");
    element.innerHTML = "";
    for (let i = 0; i < data.words.length; i++) {
      //var outputText = i.toString();
      var existanceResult = await doesItExist(clean_up_word(data.words[i].text));
      var tag;
      if(!existanceResult){
        //alternativeWords(data.words[i]);
        tag = document.createElement("select");
        var text;
        for (let j = 0; j < 4; j++) // number of options is currently hard coded
        {
          var option = document.createElement("option");
          if(!j)
            text = document.createTextNode(data.words[i].text);
          else 
            text = document.createTextNode("alternative word" + (j+1));
          option.appendChild(text);
          tag.appendChild(option);
        }
      }
      else{
        tag = document.createElement("span");
      } 
        var text = document.createTextNode(data.words[i].text + " ");
        tag.appendChild(text);
      if(!existanceResult)
        tag.classList.add("false");
      element.appendChild(tag);

      //https://www.tutorialspoint.com/how-to-add-a-new-element-to-html-dom-in-javascript
      // need to create an array to hold all of the strings of existence and output it here

      //this calls exist function and lowercases the word to fit the dictionary
    }
  })
}

/*function output_array(array,size)
{
    for (let i = 0; i < size; i++) {
        array[i];

}
*/

function show_image(src, width, height, alt) {
  var img = document.createElement("img");
  img.src = src;
  img.width = width;
  img.height = height;
  img.alt = alt;
  document.body.appendChild(img);
}

function clean_up_word(word) {
  var updatedWord = word.toLowerCase();

  var finalString, firstWord, secondWord;
  var posOfDash = 0;

  if (/[\-]/.test(updatedWord)) {
    posOfDash = updatedWord.indexOf("-");
    //https://stackoverflow.com/questions/22553586/javascript-string-contains-commas-and-dashes
    firstWord = updatedWord.slice(0, posOfDash);
    secondWord = updatedWord.slice(posOfDash + 1);
    console.log(updatedWord + " is made up of two other words.");
    doesItExist(firstWord);
    doesItExist(secondWord);
  }

  var punctuationless = updatedWord.replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, ""); //removed /- from list to only focus on end punctutation - .,;!' etc.
  finalString = punctuationless.replace(/\s{2,}/g, " ");
  //took these two lines of code from website - https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex

  return finalString;

}

// took all this from website https://www.w3schools.com/howto/howto_js_progressbar.asp to create progress bar

var i = 0;

function move(val) {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("myBar");
    var width = 1;
    var id = setInterval(frame, val);

    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }
}

function jump(val) {
  var elem = document.getElementById("myBar");
  elem.style.width = val + "%";
}

document.getElementById("tesseractBut").addEventListener("click",function(){
  tesseract(document.getElementById('tesseract').value);
});

document.getElementById("imageBut").addEventListener("click",function(){
  output_image(document.getElementById('image').value);
});

});