// file stuff
const fs = require("fs");
const { parse } = require('csv-parse');
const { stringify } = require("csv-stringify");

const ogFile = 'Aeromexico_reviews';

// comment analyzer
var Sentiment = require('sentiment');
var sentiment = new Sentiment();


function getScore(score) {
    if (score > 3) return 'positive';
    if (score < -3) return 'negative';
    return 'neutral';
}

const stringifier = stringify({ header: true, columns: ["comment", "score", "sentiment"], trim: true })
fs.createReadStream(`${ogFile}.csv`)
    .pipe(parse({ trim: true }))
    .on("data", function (data) {
        const comment = data.toString();
        const result = sentiment.analyze(comment);
        const row = [comment, result.score, getScore(result.score)];
        stringifier.write(row)
    })
    .on("end", function () {
        console.log("finished");
    })
    .on("error", function (error) {
        console.log(error.message);
    });

const writeable = fs.createWriteStream(`${ogFile}_analyzed.csv`);

stringifier.pipe(writeable);
console.log('finished writing stream');
