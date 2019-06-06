//MODEL, CONTROLLER, VIEW
var intakeList = {
  caffeineLevel: 0,
  intakes: [],
  addIntake: function(intakeText,caffeineAmount,quantity,units,dateTime) {
    this.intakes.push({
      intakeText: intakeText,
      caffeineAmount: caffeineAmount,
      quantity: quantity,
      units: units,
      dateTime: dateTime
    });
  },
  changeIntake: function(position, intakeText,caffeineAmount,quantity,units,dateTime) {
    this.intakes[position].intakeText = intakeText;
    this.intakes[position].caffeineAmount = caffeineAmount;
    this.intakes[position].quantity = quantity;
    this.intakes[position].units = units;
    if(this.intakes[position].dateTime == null){
      this.intakes[position].dateTime = dateTime;
    };
    //If this.intakes[position].dateTime datestring = displayedDate;
      //get time (hour, minutes, seconds) of passed in dateTime, change time of dateTime.
    var currentIntakeDate = this.intakes[position].dateTime.getFullYear() + "-" + this.intakes[position].dateTime.getMonth()+ "-" + this.intakes[position].dateTime.getDate();
    var newIntakeDate = dateTime.getFullYear() + "-" + dateTime.getMonth()+ "-" + dateTime.getDate();
    if(currentIntakeDate === newIntakeDate){
      this.intakes[position].dateTime = dateTime;
    };

  },
  deleteIntake: function(position) {
    this.intakes.splice(position, 1);
  },
  toggleDeleted: function(position) {
    var intake = this.intakes[position];
    intake.deleted = !intake.deleted;
  },
  toggleAll: function() {
    var totalintakes = this.intakes.length;
    var deletedintakes = 0;

    //Get number of deleted intakes.
    this.intakes.forEach(function(intake){
      if (intake.deleted === true) {
        deletedintakes++;
      };
    });

    this.intakes.forEach(function(intake){
      // Case 1: if everything's true, make everything false
      if(deletedintakes === totalintakes){
        intake.deleted = false;
      // Case 2: otherwise, make everything true
      } else {
        intake.deleted = true;
      };
    });
  },
  changeCaffeineLevel: function(passedInCaf){
    this.caffeineLevel = passedInCaf;
  }
};

var intakePosition = intakeList.intakes.length || 0;

var handlers = {
  addIntake: function(){
    intakePosition++;
    view.addIntakeListItemUI();
    handlers.changeOrAddIntake(intakePosition);
  },
  changeOrAddIntake: function(currentIntakePosition) {
    //get the intakeItem list object to change
    var currentIntakePosition = currentIntakePosition;
    var currentId = "intakeItem" + currentIntakePosition;
    var currentIntakeItem = document.getElementById(currentId);

    //get the current field values for intakeItem
    var intakeText = currentIntakeItem.querySelector('.intakeText', '.smallWidth').value || 0;
    var caffeineAmount = currentIntakeItem.querySelector('.smallInput', '.boldText').value || 0;
    var quantity = currentIntakeItem.querySelector('.quantityInput').value || 0;
    var units = currentIntakeItem.querySelector("select").value || 0;
    var time = currentIntakeItem.querySelector("[type=time]").value || 0;
    var date = document.getElementById('currentDate').value || 0;

    //create dateTime object
    var dateString = date + " " + time +":00";
    var currentDate = new Date(dateString);

    //add data validation here
    //or...add empty list item, validate for graphing only-->user may want to keep track of an empty item, unless they delete it.


    //add new object to intakeList
    if(currentIntakePosition===intakePosition){
      intakeList.addIntake(intakeText,caffeineAmount,quantity,units,currentDate);
    }
    //change object in intakeList
    else{
      intakeList.changeIntake(currentIntakePosition,intakeText,caffeineAmount,quantity,units,currentDate);
    }
  },
  deleteIntake: function(deletedIntakeItemId){
    var intakeListItem = deletedIntakeItemId.charAt(deletedIntakeItemId.length-1);
    intakeList.deleteIntake(intakeListItem);
    var intakeToBeDeleted = document.getElementById(deletedIntakeItemId);
    intakeToBeDeleted.parentNode.removeChild(intakeToBeDeleted);
    var intakesLeft = document.querySelectorAll(".list-group-item",".container");
    intakePosition--;

    //reset the id's of each intakeItem
    var intakeIdCounter = intakesLeft.length-1;
    intakesLeft.forEach(function(intakeItem){
      intakeItem.id = 'intakeItem'+intakeIdCounter;
      intakeIdCounter--;
    });
  },
  updateIntakes: function(){
    //get list of intakeItems on screen
    var intakesOnScreen = document.querySelectorAll(".list-group-item",".container");

    //use changeOrAddIntake to update model with view information
    intakesOnScreen.forEach(function(intakeItem){
      handlers.changeOrAddIntake(intakeItem.id.charAt(intakeItem.id.length-1));
    });
  },

  calculateCaffeineLevel: function(){
    var timeForCalculation = document.getElementById('calculateCaffeineTimeInput');
    var dateForCalculation = document.getElementById('currentDate');
    var dateString = dateForCalculation.value + " " + timeForCalculation.value +":00";
    var dateTimeCafCalculation = new Date(dateString);
    intakeList.changeCaffeineLevel(getBodyCaffeineLevel(intakeList.intakes,dateTimeCafCalculation));
    view.displayCaffeineLevel();
  },

  saveIntakeData: function(){
    var intakeListString = document.getElementById("intakeList").innerHTML;
    document.getElementById("id_divString").value = intakeListString;
  }
}

var view = {
  addIntakeListItemUI: function(){
    //update the number of intake items

    //get the current intake list
    var currentIntakeList = document.getElementById('intakeList');
    var newListItem = '<li class="list-group-item container" id="intakeItem'
      + intakePosition
      +'">'
      +'                <div class="row">'
      +'                  <div class="col-6 pr-1 mr-3">'
      +'                  <input type="text" placeholder="Drink" class="intakeText smallWidth" >'
      +'              </div>'
      +'            <div class="col-1 pt-2 pl-0 pr-0">'
      +'                    <input type="number" class="smallInput boldText" id="caffeineAmount">'
      +'                  </div>'
      +'                  <div class="col-4 pt-2 pl-1 pr-0">'
      +'                    <small class="smallWrap">mg caffeine per quanitity</small>'
      +'                  </div>'
      +'                </div>'
      +'                '
      +'                <div class="row mt-2 mb-1">'
      +'                  <div class="col">'
      +'                    <small class="mb-0">Quantity</small>'
      +'                  </div>'
      +'                  <div class="col ">'
      +'                    <small class="mb-0">Time</small>'
      +'                  </div>'
      +'                </div>'
      +'                '
      +'                <div class="row">'
      +'                  <div class="col-2 pr-0">'
      +'                    <input type="number" class="smallInput smallWidth quantityInput" id="intakeQuantity">'
      +'                  </div>'
      +'                  <div class="col-3 pr-0 pl-0">'
      +'                    <select id="intakeUnits">'
      +'                      <option value="cups">cups</option>'
      +'                      <option value="oz">oz</option>'
      +'                      <option value="ml">ml</option>'
      +'                    </select>'
      +'                  </div>'
      +'                  <div class="col-1 pl-0">'
      +'                    '
      +'                  </div>'
      +'                  <div class="col-3">'
      +'                    <input type="time" id="intakeTime">'
      +'                  </div>'
      +'                  <div class="col-3">'
      +'                    <button type="button" class="btn btn-danger ml-1">X</button>'
      +'                  </div>'
      +'                </div>'
      +'              </li>';
    //append a new blank item to the input list
    currentIntakeList.insertAdjacentHTML('afterbegin',newListItem);
  },

  setUpEventListeners: function(){
    var intakeList = document.getElementById('intakeList');
    var myCaffeinePg = document.getElementById('myCaffeinePg');
    var trendsPg = document.getElementById('trendsPg');
    var myAccountPg = document.getElementById('myAccountPg');

    intakeList.addEventListener('click', function(event){
      //get the element that was clicked on.
      var elementClicked = event.target;

      //check if elementClicked is a delete button
      if(elementClicked.className === "btn btn-danger ml-1"){
        //handlers.deleteTodo(parseInt(elementClicked.parentNode.id));
        handlers.deleteIntake(elementClicked.parentNode.parentNode.parentNode.id);
      };
    });

    myCaffeinePg.addEventListener('click', function(event){
      //get the element that was clicked on.
      var elementClicked = event.target;
      elementClicked.className = "nav-item nav-link navLinkStyle navStyleClicked";

      //check if elementClicked is a delete button
      if(elementClicked.id === "myCaffeinePg"){
        document.getElementById("myCaffeineRow").style.display = 'flex';
        document.getElementById("trendsRow").style.display = 'none';
        document.getElementById("trendsPg").classList.remove("navStyleClicked");
        document.getElementById("myAccountRow").style.display = 'none';
        document.getElementById("myAccountPg").classList.remove("navStyleClicked");
      };
    });

    trendsPg.addEventListener('click', function(event){
      //get the element that was clicked on.
      var elementClicked = event.target;
      elementClicked.className = "nav-item nav-link navLinkStyle navStyleClicked";

      //check if elementClicked is a delete button
      if(elementClicked.id === "trendsPg"){
        document.getElementById("myCaffeineRow").style.display = 'none';
        document.getElementById("myCaffeinePg").classList.remove("navStyleClicked");
        document.getElementById("trendsRow").style.display = 'flex';
        document.getElementById("myAccountRow").style.display = 'none';
        document.getElementById("myAccountPg").classList.remove("navStyleClicked");
      };
    });

    myAccountPg.addEventListener('click', function(event){
      //get the element that was clicked on.
      var elementClicked = event.target;
      elementClicked.className = "nav-item nav-link navLinkStyle navStyleClicked";

      //check if elementClicked is a delete button
      if(elementClicked.id === "myAccountPg"){
        document.getElementById("myCaffeineRow").style.display = 'none';
        document.getElementById("myCaffeinePg").classList.remove("navStyleClicked");
        document.getElementById("trendsRow").style.display = 'none';
        document.getElementById("trendsPg").classList.remove("navStyleClicked");
        document.getElementById("myAccountRow").style.display = 'flex';
      };
    });
  },

  displayCaffeineLevel: function(){
    var calculationDestination = document.querySelector('#calculateCaf');
    calculationDestination.innerHTML = '';
    var calculatedCafNumber = document.createElement('p');
    calculationDestination.appendChild(calculatedCafNumber);
    calculatedCafNumber.textContent = intakeList.caffeineLevel;
  },

  displayIntakeItems: function(){
    var counter = 0;
    intakeList.intakes.forEach(function(intakeItem){
      var intakeDate = intakeItem.dateTime.getFullYear() + "-" + intakeItem.dateTime.getMonth() + "-" + intakeItem.dateTime.getDate();
      var displayDate = dateDisplayed.getFullYear() + "-" + dateDisplayed.getMonth() + "-" + dateDisplayed.getDate();
      if(intakeDate === displayDate ){
        document.getElementById("intakeItem" + counter).style.display = 'block';
      }
      else{
        document.getElementById("intakeItem" + counter).style.display = 'none';
      }
      counter++
    });
  }

  /*updateIntakeListString: function(){
    var intakeListString = document.getElementById("intakeListString");
    intakeList.intakes.forEach(function(intake){

    });
  }*/
}


//CAFFEINE CALCULATION FUNCTIONS
function dateToHourNumber(dateObject){
  var hourNumber = 0;
  hourNumber = dateObject.getHours()+(dateObject.getMinutes()/60);
  return hourNumber;
};

function getDrinkCafLevel(elapsedTime, drinkCafLevel, quantity){
  var caffeineInSystem = 0;
  if(elapsedTime<.75){
    caffeineInSystem = (elapsedTime/.75)*(drinkCafLevel*quantity);
    return caffeineInSystem;
  }
  else{
    caffeineInSystem = (drinkCafLevel*quantity)*((1-.5)**((elapsedTime-.75)/5));
    return caffeineInSystem;
  };
};

function getBodyCaffeineLevel(intakeList,dateObject){
  var bodyCaffeineLevel = 0;
  intakeList.forEach(function(intakeItem){
    var intakeDate = intakeItem.dateTime.getFullYear() + "-" + intakeItem.dateTime.getMonth() + "-" + intakeItem.dateTime.getDate();
    var displayDate = dateDisplayed.getFullYear() + "-" + dateDisplayed.getMonth() + "-" + dateDisplayed.getDate();
    if((intakeDate === displayDate)){
      var currentTime = dateToHourNumber(dateObject);
      var consumedTime = dateToHourNumber(intakeItem.dateTime);
      if(consumedTime <= currentTime){
        var elapsedTime = currentTime - consumedTime;
        bodyCaffeineLevel += getDrinkCafLevel(elapsedTime,intakeItem.caffeineAmount,intakeItem.quantity);
      };
    };
  });
  return bodyCaffeineLevel || 0;
};

function getAvgCaffeine(date){
  var counter = 0;
  var caffeineTotal = 0;
  intakeList.intakes.forEach(function(intakeItem){
    var dateDiff = dateDiffInDays(new Date(date), new Date(intakeItem.dateTime)) - 1;
    if(dateDiff===0){
      caffeineTotal = caffeineTotal + parseInt(intakeItem.caffeineAmount*intakeItem.quantity);
      counter++;
    };
  });
  //var avg = caffeineTotal/(counter) || 0;
  return caffeineTotal;
};

var newLabelArray = [0];
var newDataArray = [1];
var lastLength = 0;
function getFavoriteDrinks(){
  var labelArray = [];
  var dataArray = [];
  intakeList.intakes.forEach(function(intakeItem){
    var labelCounter = 0;
    var alreadyExists = false;
    if(dataArray.length!=0){
      dataArray.forEach(function(dataCounter){
        if(labelArray[labelCounter]===intakeItem.intakeText.toString().toLowerCase().trim()){
          dataArray[labelCounter] = dataCounter + 1;
          alreadyExists = true;
        };
        labelCounter++;
      });
      if(alreadyExists===false){
        labelArray.push(intakeItem.intakeText.toString().toLowerCase().trim());
        dataArray.push(1);
      };
    }
    else{
      labelArray.push(intakeItem.intakeText.toString().toLowerCase().trim());
      dataArray.push(1);
    };
  });
  lastLength = intakeList.intakes.length;
  return [labelArray,dataArray];
};


//GRAPH JS, ASSOCIATED DATA
var bodyCafChart = document.getElementById('myChart').getContext('2d');
var averageCafChart = document.getElementById('averageCafChart').getContext('2d');
var favoriteDrinkChart = document.getElementById('favoriteDrinkChart').getContext('2d');

//my caffeine: set the default date to today, store date
document.getElementById('currentDate').valueAsDate = new Date();
var dateDisplayed = new Date();

//trends dates: set the default date to today, one week ago, store date
var dateWeekAgo = new Date();
dateWeekAgo.setDate(dateWeekAgo.getDate()-7);
document.getElementById('trendsDate0').valueAsDate = dateWeekAgo;
var trendsDate0 = document.getElementById('trendsDate0').valueAsDate;

document.getElementById('trendsDate1').valueAsDate = new Date();
var trendsDate1 = document.getElementById('trendsDate1').valueAsDate;

//My caffeine:Set, initialize chart data, update chart data function
var chartData = [];

function initializeChartData(){
  for(var i=0;i<25;i++){
    chartData[i] = 0;
  };
};

initializeChartData();

function updateChartData(){
  var time = 0;
  var newChartData = chartData;
  chartData.forEach(function(dataItem){
    var chartDateString = dateDisplayed.getFullYear() + "-" + (dateDisplayed.getMonth()+1) + "-" + dateDisplayed.getDate() + " " + time + ":00" + ":00";
    var dateX = new Date(chartDateString);
    dataItem = getBodyCaffeineLevel(intakeList.intakes,dateX);
    newChartData[time] = dataItem;
    time++;
  });
  chartData = newChartData;
};

//Trends average caffeine:Set, initialize avgCafChart data, update chart data function
var avgCafData = [];
var avgCafLabels = [];

//subtracts two dates
const _MS_PER_DAY = 1000 * 60 * 60 * 24;
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

var difference = dateDiffInDays(new Date(trendsDate0), new Date(trendsDate1));

function initializeAvgCafData(){
  avgCafLabels = [];
  for(var i=0;i<=difference+1;i++){
    avgCafData[i] = 0;
    var dateForLabel = new Date(trendsDate0);
    dateForLabel.setDate(dateForLabel.getDate()+i);
    avgCafLabels[i] = (dateForLabel.getMonth()+1)+"/"+(dateForLabel.getDate()+1);
  };
};

function updateAvgCafData(){
  avgCafData = [];
  avgCafData[0] = 0;
  for(var i=0;i<avgCafLabels.length-1;i++){
    avgCafData[i+1] = getAvgCaffeine(trendsDate0.setDate(trendsDate0.getDate()+1));
  };
};

initializeAvgCafData();
updateAvgCafData();

//create chart objects
var myChart = new Chart(bodyCafChart, {
    type: 'line',
    data: {
        labels: ['12 am', '1', '2', '3', '4', '5', '6', '7', '8','9','10','11','12 pm','1', '2', '3', '4', '5', '6', '7', '8','9','10','11','12 am'],
        datasets: [{
            label: '',
            data: chartData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
      tooltips: {
        enabled: false
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Caffeine (mg)'
          },
          ticks: {
              beginAtZero: true
          }
        }]
      }
    }
});

var averageCafChart = new Chart(averageCafChart, {
    type: 'line',
    data: {
        labels: avgCafLabels,
        datasets: [{
            label: '',
            data: avgCafData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
      tooltips: {
        enabled: false
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Caffeine (mg)'
          },
          ticks: {
              beginAtZero: true
          }
        }]
      }
    }
});

var favoriteDrinkChart = new Chart(favoriteDrinkChart, {
  type: 'doughnut',
  data: {
    datasets: [{
      data: newDataArray,
      backgroundColor: [
        'rgba(255, 99, 132)',
        'rgba(54, 162, 235)',
        'rgba(255, 206, 86)',
        'rgba(75, 192, 192)',
        'rgba(153, 102, 255)'
      ],
      label: 'Dataset 1'
    }],
    labels: newLabelArray,
    options: {
      tooltips: {
        enabled: false
      },
      responsive: true,
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Favorite Drinks'
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  }
});

//FUNCTIONS TO RUN AT START
//add the first intake item to the list
handlers.changeOrAddIntake(intakePosition);

//initialize chart data
initializeChartData();

//update intakes, dates/difference, graph.js
setTimeout(setInterval(handlers.updateIntakes,500), 500);
setInterval(handlers.saveIntakeData(),0);
setTimeout(setInterval(function(){
  if(dateDisplayed != document.getElementById('currentDate').value){
    dateDisplayed = document.getElementById('currentDate').valueAsDate;
    dateDisplayed.setDate(dateDisplayed.getDate()+1);
  };
  if(trendsDate1 != document.getElementById('trendsDate1').value){
    trendsDate1 = document.getElementById('trendsDate1').valueAsDate;
  };
  if(trendsDate0 != document.getElementById('trendsDate0').value){
    trendsDate0 = document.getElementById('trendsDate0').valueAsDate;
  };
  difference = dateDiffInDays(new Date(trendsDate0), new Date(trendsDate1));


  updateChartData();
  myChart.update();
  view.displayIntakeItems();
  handlers.saveIntakeData();

},500), 500);
setTimeout(setInterval(function(){
  initializeAvgCafData();
  updateAvgCafData();
  averageCafChart.data.labels = avgCafLabels;
   averageCafChart.data.datasets[0].data = avgCafData;
  averageCafChart.update();
},500), 750);
setTimeout(setInterval(function(){
  favoriteDrinkChart.data.datasets[0].data = getFavoriteDrinks()[1];
  favoriteDrinkChart.data.labels = getFavoriteDrinks()[0];
  /*favoriteDrinkChart.data.datasets[0].backgroundColor = favoriteDrinkChart.data.datasets[0].backgroundColor + 'rgba(255, 99, 132)',
      'rgba(54, 162, 235)',
      'rgba(255, 206, 86)',
      'rgba(75, 192, 192)',
      'rgba(153, 102, 255)';*/
  favoriteDrinkChart.update();
},500), 600);

//set up nav bar, delete button event listeners
view.setUpEventListeners();
