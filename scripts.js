(function() {
 var elements = {
    pagination : document.getElementById('widget-pagination'),
    widgetData : document.getElementById("widget-data"),
    firstWidgetPage: document.getElementById('1st-pag')
  };

  var methods = {
    // split data into multiple arrays,
    // nr is representing the number of news showing in a page widget
    splitData : function(obj, nr) {
      var a = [];
      var counter = nr;
      for(var i=0; i<obj.news.length; i+=nr) {
        a.push(obj.news.slice(i,counter));
        counter += nr;
      }
      counter = nr;
      return a;
    },
    // create the number of pages after the length of splitData().length
    createAndPopulateDivs: function(dataArray) {
      elements.widgetData.innerHTML = "";
      nrOfPages = dataArray.length;
      for (var i=0;i<dataArray.length;i++) {
        elements.widgetData.innerHTML += "<div id='pag"+ i +"'></div>";
        for(var j=0; j<dataArray[i].length; j++){
          document.getElementById("pag"+i).innerHTML += "<div class='data'><p><b>" + dataArray[i][j].title +
              "</b></p><p>"+ dataArray[i][j].details +"</p></div>";
        }
      }
      // create bullets after the pages number
      methods.createPaginationAfterPagesNr(nrOfPages);

      // show only the first page of the widget and make hover first bullet
      for(var i = 0; i < elements.widgetData.children.length; i++) {
        if(i !== 0) {
          elements.widgetData.children[i].style.display = "none";
        } else {
          elements.pagination.children[i].className += " active";
        }
      }
      this.showActualPageOnClick();
    },
    createPaginationAfterPagesNr : function (pagesNr) {
      elements.pagination.innerHTML = "";
      for(var e=0; e<pagesNr; e++) {
        elements.pagination.innerHTML += "<div class='pag1'></div>";
      }
    },
    showActualPageOnClick : function () {
      for(var l=0; l<elements.pagination.children.length; l++) {
        elements.pagination.children[l].addEventListener("click", function (e) {
          for(var o=0; o<elements.pagination.children.length; o++) {
            elements.pagination.children[o].className = "pag1";
            elements.widgetData.children[o].style.display = "none";
            if (e.target === elements.pagination.children[o]) {
              elements.widgetData.children[o].style.display = "inherit";
            }
          }
          e.target.className += " active";
        })
      }
    },
    changePagesTimer: function (sec) {
      sec = sec * 1000;
      setInterval(function () {
        for(var u=0; u<elements.pagination.children.length; u++) {
          if(elements.pagination.children[u].classList.contains("active")) {
            if(u === (elements.pagination.children.length-1)){
              elements.pagination.children[u].classList.remove("active");
              elements.pagination.children[0].className += " active";
              elements.widgetData.children[u].style.display = "none";
              elements.widgetData.children[0].style.display = "inherit";

            } else {
              elements.pagination.children[u].classList.remove("active");
              elements.pagination.children[u+1].className += " active";
              elements.widgetData.children[u].style.display = "none";
              elements.widgetData.children[u+1].style.display = "inherit";
            }
            break;
          }
        }
      },sec);
    },
    doAPIRequest : function () {
        $.getJSON('http://www.mocky.io/v2/5979b14311000053029edc22', function(data){
            methods.createAndPopulateDivs(methods.splitData(data, 5));
          });
    }
  };

  // do first api request
  methods.doAPIRequest();

  // change page timer - add time in seconds
  methods.changePagesTimer(15);

  // fetch data at every 3 min
  setInterval(function(){
   methods.doAPIRequest();
   }, 180000);
})();
