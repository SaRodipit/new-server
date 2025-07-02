const express = require('express');
const app = express();

app.get('/static', function (req, res) {
    res.json({
        header: "Hello",
        body: "Octagon NodeJS Test"
    });
});

app.get('/dynamic', function (req, res) {
    const { a, b, c } = req.query;

    if (a === undefined,  b === undefined,  c === undefined) 
        {
         return res.json({ header: "Error" });
         
    }

    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    if (isNaN(numA) ||  isNaN(numB) || isNaN(numC) 
){
        return res.json({ header: "Error" });
        
    }

    const result = (numA * numB * numC) / 3;

    res.json({
        header: "Calculated",
        body: result.toString()
    });
});

app.listen(3000);