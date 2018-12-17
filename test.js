const test = require('tape');
const { logic } = require('./logic.js');
const sampleDate = "2018-10-15";
const sampleArray = [
  {date: "", fxRate: 1.4, price: 100},
  {date: "", fxRate: 1.3, price: 120},
  {date: "", fxRate: 1.6, price: 140},
  {date: "", fxRate: 1.6, price: undefined}
];


test('Test Date Functions', function(t) {
  let today = logic.generateDateToday();
  let lastMonth = logic.generateDatePriorMonth();
  let comparator  = logic.compareDateString(today, lastMonth);
  let date = logic.convertToDate(sampleDate);
  t.equal(typeof today, "string" , "today's function should return a string");
  t.equal(typeof lastMonth, "string" , "last month's function should return a string");
  t.equal(today.length, 10 , "today should be 10 characters long");
  t.equal(lastMonth.length, 10 , "last month should be 10 characters long");
  t.equal(typeof comparator, "number" , "date comparator should return a number");
  t.equal(comparator >0, true, "comparator function should return positive for today compared with last month");
  t.equal(date.getDate(), 15, "date converter should correctly record the day");
  t.equal(date.getMonth(), 9, "date converter should correctly record the month");
  t.equal(date.getFullYear(), 2018, "date converter should correctly record the year");
  t.end();
});

test('Test Statistical Functions', function(t)  {
  let fx = logic.avgFxGain(sampleArray);
  let price = logic.avgPriceGain(sampleArray);
  let fxSD = logic.fxStDev(sampleArray);
  let priceSD = logic.priceStDev(sampleArray);
  //let regResult = logic.findLineByLeastSquares(sampleArray);
  let priceGains = logic.priceGains(sampleArray);
  let fxGains = logic.fxGains(sampleArray);
  t.equal(typeof fx, "number", "avg fx gain formula should generate a number");
  t.equal(typeof price, "number", "avg price gain formula should generate a number");
  t.equal(typeof fxSD, "number", "st dev should be a number");
  t.equal(typeof priceSD, "number", "st dev should be a number");
  //t.equal(typeof regResult, "array", "regression should output an array");
  t.equal(priceGains.length, fxGains.length, "both sequences for price and fx should be equal in length");
  t.end();
});
