

(function()  {


/*******************************************/
/*    SET UP DATA RECEIVER OBJECT      */
/*******************************************/

  var sharexArray = [];
  var virtualConsole = document.getElementById("console");

/*******************************************/
/*    FX REQUEST OBJECT      */
/*******************************************/

  var start_at = logic.generateDatePriorMonth();
  var end_at = logic.generateDateToday();

  var symbol = "USD";
  var url = "https://api.exchangeratesapi.io/history?start_at="+ start_at +"&end_at="+ end_at +"&symbols=" + symbol;

  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         virtualConsole.textContent += "request 1 working";
         let responseObj = JSON.parse(request.responseText);
         var rateList = [];

         for (let item in responseObj.rates)  {

           let date = logic.convertToDate(item);
           let rate = responseObj.rates[item][symbol];
           let sharexDatapoint = {
             date: date,
             fxRate: rate,
           };
           sharexArray.push(sharexDatapoint);

           let rateEntry = item + ": " + rate + " $ per €";
           rateList.push(rateEntry);
         }

         var company = document.getElementById("inputName").value;
         var url_sp_comp = "https://api.iextrading.com/1.0/stock/"+ company +"/company";
         var url_sp_price = "https://api.iextrading.com/1.0/stock/"+ company +"/chart/1m";

         request2.open("GET", url_sp_comp , true);
         request2.send();
         request3.open("GET", url_sp_price , true);
         request3.send();
      }
  };

  document.getElementById("submit").addEventListener("click", function()  {
    document.getElementById("console").innerText += "click worked";
    request.open("GET", url , true);
    request.send();
  });

  /*******************************************/
  /*    SHARE PRICE REQUEST OBJECT      */
  /*******************************************/

  //var company = document.getElementById("inputName").value;

  var request2 = new XMLHttpRequest();
  request2.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         virtualConsole.textContent += "request 2 working";
         let responseObj = JSON.parse(request2.responseText);
         document.getElementById("comp-name").textContent = responseObj.companyName;
         document.getElementById("comp-exchange").textContent = responseObj.exchange;
      }
  };

  var request3 = new XMLHttpRequest();
  request3.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         virtualConsole.textContent += "request 3 working \r\n";
         let responseArr = JSON.parse(request3.responseText);
         let fxDates = sharexArray.map(function(a) {return ""+ a.date.getYear()+a.date.getMonth()+a.date.getDate()});

         for (let i in responseArr)  {
           let date = logic.convertToDate(responseArr[i].date);
           let price = responseArr[i].vwap;

           let dateIndex = fxDates.indexOf(""+ date.getYear()+date.getMonth()+date.getDate());
           date.getTime() + " index: " + dateIndex + "\r\n"
           if (dateIndex!=-1) {
             sharexArray[dateIndex].price = price;
           }
           else {
             let sharexDatapoint = {
               date: date,
               price: price,
             };
             sharexArray.push(sharexDatapoint);
           }

         }
         sharexArray.sort(logic.compareDateArray);

         for (let i in sharexArray) {
           let listItem = document.createElement("li");
           listItem.id = sharexArray[i].date;
           listItem.textContent = "Date: " +
            (sharexArray[i].date.getMonth()+1) + "-" +
            sharexArray[i].date.getDate() + "; Fx: " +
            sharexArray[i].fxRate +
            " $/€; Share Price: " +
            sharexArray[i].price;
           document.getElementById("share-price").appendChild(listItem);
         }

         document.getElementById("delta-price").textContent = Math.round(1000*logic.avgPriceGain(sharexArray))/10 + "%";
         document.getElementById("delta-fx").textContent = Math.round(1000*logic.avgFxGain(sharexArray))/10 + "%";
         document.getElementById("stdev-price").textContent = Math.round(10000*logic.priceStDev(sharexArray))/100 + "%";
         document.getElementById("stdev-fx").textContent = Math.round(10000*logic.fxStDev(sharexArray))/100 + "%";

         //select most recent defined price/fx rate for table:
         var index = sharexArray.length-1;
         while (sharexArray[index].price==undefined)  {
           index--;
         }
         document.getElementById("curr-price").textContent = Math.round(100*sharexArray[index].price)/100;
         document.getElementById("curr-fx").textContent = sharexArray[sharexArray.length-1].fxRate;
      }
  };




})();
