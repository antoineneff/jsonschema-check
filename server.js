const fs        = require('fs');
const ajv       = require('ajv');
const express   = require('express');
const app       = express();
const checker   = new ajv({ allErrors: true });

// Import schema
const jsonSchema = require('./datamodelSchema.json');

// Add schema to json checker
checker.addSchema(jsonSchema, 'schema');

function checkJsonData (callback) {
    fs.readFile('./datamodel.json', (err, data) => {
        if (err) {
            throw err;
        }
        let valid = checker.validate('schema', JSON.parse(data));
        if (!valid) {
            callback(checker.errors);
        } else {
            callback();
        }
    });
}

app.get('/datamodel/check', (req, res) => {
    checkJsonData(err => {
        if (err) {
            res.json({
                errors: err
            });
        } else {
            res.json({
                success: true
            });
        }
    });
});

app.listen(3000, () => {
    console.log('Server start on port 3000 (http://localhost:3000)');
    checkJsonData(err => {
        if (err) {
            console.log(err);
        } else {
            console.log('Valid json');
        }
    });
});