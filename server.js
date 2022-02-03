const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// enable cors, for fCC remote testing
const cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));

// static assets
app.use(express.static(__dirname + '/public'));

// initial page
app.get('/', (req, res) => {
   res.sendFile(__dirname + '/views/index.html')
});

// respond with timestamp microservice API on GET requests
app.get('/api/:inputDate?', (req, res) => {
   timestamp_ms(req, res)
})

// port listener
app.listen(port, () => {
   console.log(`App listening at http://localhost:${port}`);
})


// timestamp microservice function
function timestamp_ms(request, response) {
   const input = request.params.inputDate;
   // empty date param, returns current unix timestamp and UTC
   if (input === undefined) {
      response.json({
         unix: Date.now(), // ms (number)
         utc:  new Date().toUTCString()
      })
   } else {
      // test if input is a dateString or a unix timestamp
      const regex = /[\s-/.:]/;
      // if input is a date string create a Date object...
      if (regex.test(input)) {
         const dateObj = new Date(input);
         // ...and test its validity (invalid if date.valueOf() is NaN, which is not equal to itself)
         if (dateObj.valueOf() !== dateObj.valueOf()) {
            response.json({
               error: "Invalid Date"
            })
         } else {
         // valid date string
            response.json({
               unix: dateObj.getTime(),
               utc: dateObj.toUTCString()
            })
         }
      } else {
         // input is a unix timestamp
         response.json({
            unix: Number(input),
            utc: new Date(Number(input)).toUTCString()
         })
      }
   }
}
/*
Date.now(): returns the number of ms elapsed since the Unix Epoch;
Date(): returns a string representation of current date and time (= new Date().toString());
new Date(): returns a new Date object (current time);
[Date].getTime(): returns the number of ms since the Unix Epoch;
*/