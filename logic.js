

var logic = {
  //return today's date in format suitable for XMLHttpRequest
  generateDateToday: function() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();
    if(dd<10) {dd = '0'+dd;}
    if(mm<10) {mm = '0'+mm;}
    today = yyyy + '-' + mm + '-' + dd;
    return today;
  },
  //return last month's date in format suitable for XMLHttpRequest
  generateDatePriorMonth: function()  {
    let lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth()-1);
    let dd2 = lastMonth.getDate();
    let mm2 = lastMonth.getMonth()+1; //January is 0!
    let yyyy2 = lastMonth.getFullYear();
    if(dd2<10) {dd2 = '0'+dd2;}
    if(mm2<10) {mm2 = '0'+mm2;}
    lastMonth = yyyy2 + '-' + mm2 + '-' + dd2;
    return lastMonth;
  },
  //convert XMLHttpRequest response text to Date
  convertToDate: function(item) {
    let date = new Date();
    date.setYear(item.slice(0, 4));
    date.setMonth(item.slice(5, 7)-1);
    date.setDate(item.slice(8, 10))
    return date;
  },
  //comparator function for sorting data array by date
  compareDateString: function (a, b)  {
    aDate = new Date();
    bDate = new Date();
    aDate.setYear(a.slice(0, 4));
    bDate.setYear(b.slice(0, 4));
    aDate.setMonth(a.slice(5, 7)-1);
    bDate.setMonth(b.slice(5, 7)-1);
    aDate.setDate(a.slice(8, 10));
    bDate.setDate(b.slice(8, 10));
    return aDate - bDate;
  },
  compareDateArray: function (a, b) {
    return a.date-b.date;
  },
  avgPriceGain: function(inputArray)  {
    let tempArray = inputArray.filter(function(item)  {
      return item.price!=undefined;
    });
    let priceGainArray = tempArray.map(function(item, index, arr)  {
      if (arr[index+1]) {return (arr[index+1].price-item.price)/item.price ;}
    }).filter(function(item)  {return item!=undefined;});
    return priceGainArray.reduce(function(a, b) {
      return a+b;
    })
  },
  avgFxGain: function(inputArray) {
    let fxGainArray = inputArray.map(function(item, index, arr)  {
      if (arr[index+1]) {return (arr[index+1].fxRate-item.fxRate)/item.fxRate ;}
    }).filter(function(item)  {return item!=undefined;});
    return fxGainArray.reduce(function(a, b) {
      return a+b;
    })
  },
  priceStDev: function(inputArray){
    let tempArray = inputArray.filter(function(item)  {
      return item.price!=undefined;
    });
    let values = tempArray.map(function(item, index, arr)  {
      if (arr[index+1]) {return (arr[index+1].price-item.price)/item.price ;}
    }).filter(function(item)  {return item!=undefined;});

    let avg = logic.average(values);

    let squareDiffs = values.map(function(value){
      let diff = value - avg;
      let sqrDiff = diff * diff;
      return sqrDiff;
    });

    let avgSquareDiff = logic.average(squareDiffs);

    let stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
  },
  fxStDev: function(inputArray){
    let tempArray = inputArray.filter(function(item)  {
      return item.price!=undefined;
    });
    let values = tempArray.map(function(item, index, arr)  {
      if (arr[index+1]) {return (arr[index+1].fxRate-item.fxRate)/item.fxRate ;}
    }).filter(function(item)  {return item!=undefined;});

    let avg = logic.average(values);

    let squareDiffs = values.map(function(value){
      let diff = value - avg;
      let sqrDiff = diff * diff;
      return sqrDiff;
    });

    let avgSquareDiff = logic.average(squareDiffs);

    let stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
  },
  average: function(data) {
    var sum = data.reduce(function(sum, value){
      return sum + value;
    }, 0);

    var avg = sum / data.length;
    return avg;
  },

  priceGains: function(inputArray)  {
    let tempArray = inputArray.filter(function(item)  {
      return item.price!=undefined && item.fxRate!=undefined;
    });
    return tempArray.map(function(item, index, arr)  {
         if (arr[index+1]) {return (arr[index+1].price-item.price)/item.price ;}
       }).filter(function(item)  {return item!=undefined;});
  },
  fxGains: function(inputArray)  {
    let tempArray = inputArray.filter(function(item)  {
      return item.price!=undefined && item.fxRate!=undefined;
    });
    return tempArray.map(function(item, index, arr)  {
         if (arr[index+1]) {return (arr[index+1].fxRate-item.fxRate)/item.fxRate ;}
       }).filter(function(item)  {return item!=undefined;});
  },

  // findLineByLeastSquares: function(inputArray) {
  //   let tempArray = inputArray.filter(function(item)  {
  //     return item.price!=undefined && item.fxRate!=undefined;
  //   });
  //
  //   let values_x = tempArray.map(function(item, index, arr)  {
  //     if (arr[index+1]) {return (arr[index+1].fxRate-item.fxRate)/item.fxRate ;}
  //   }).filter(function(item)  {return item!=undefined;});
  //
  //   let values_y = tempArray.map(function(item, index, arr)  {
  //     if (arr[index+1]) {return (arr[index+1].price-item.price)/item.price ;}
  //   }).filter(function(item)  {return item!=undefined;});
  //
  //
  //   values_x, values_y
  //   var sum_x = 0;
  //   var sum_y = 0;
  //   var sum_xy = 0;
  //   var sum_xx = 0;
  //   var count = 0;
  //
  //   /*
  //    * We'll use those variables for faster read/write access.
  //    */
  //   var x = 0;
  //   var y = 0;
  //   var values_length = values_x.length;
  //
  //   if (values_length != values_y.length) {
  //       throw new Error('The parameters values_x and values_y need to have same size!');
  //   }
  //
  //   /*
  //    * Nothing to do.
  //    */
  //   if (values_length === 0) {
  //       return [ [], [] ];
  //   }
  //
  //   /*
  //    * Calculate the sum for each of the parts necessary.
  //    */
  //   for (var v = 0; v < values_length; v++) {
  //       x = values_x[v];
  //       y = values_y[v];
  //       sum_x += x;
  //       sum_y += y;
  //       sum_xx += x*x;
  //       sum_xy += x*y;
  //       count++;
  //   }
  //
  //   /*
  //    * Calculate m and b for the formular:
  //    * y = x * m + b
  //    */
  //   var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
  //   var b = (sum_y/count) - (m*sum_x)/count;
  //
  //   /*
  //    * We will make the x and y result line now
  //    */
  //   var result_values_x = [];
  //   var result_values_y = [];
  //
  //   for (var v = 0; v < values_length; v++) {
  //       x = values_x[v];
  //       y = x * m + b;
  //       result_values_x.push(x);
  //       result_values_y.push(y);
  //   }
  //   console.log("test start");
  //   console.log([result_values_x, result_values_y]);
  //   console.log("test end");
  //   return [result_values_x, result_values_y];
  // }


};


if (typeof module !== 'undefined') {
  module.exports = { logic }
};
