# Read me

## Goal

This project *node-data-transformer* is useful when you have to transform data that you have received but in a format that does not suit
your needs.

## How it works

The main method transform (in main.js) take two paramaters, the first is a template that looks like :

```
let givenTemplate = {
        mappings: {
            id: 'source.id',
            totransform: 'source.totransform',
            subdata: {
                subfield: 'source.subfield'
            }
        },
        operations: [
            {
                run: (data) => data.toLowerCase(), on: 'totransform',
            }
        ]
    };
```

On it you could see two substructures :

* mappings: json object that contain in keys the destination, and in values the path in the specific object to extract
* operations: an array that contains objects with specifice methods to execute on particular fields during the transformation

And take another parameter that are the data to transform in the new format:

```
let givenData = { 
    source: {
        id: '1',
        totransform: 'BON',
        subdata: {
            subfield: 'subfieldvalue'
        }
    }
}
```

The method will produce this:

```
let actual = { 
    id: '1',
    totransform: 'bon',
    subdata: {
        subfield: 'subfieldvalue'
    }
}
```

For information, the main.transform() returns a bluebird promise.

## How to launch the tests ?

* npm run build: launch eslint, the mocha tests and istanbul for the coverage.
* npm run eslint: run the lint check
* npm run test: launch the mocha tests
* npm run istanbul: compute the coverage

## Dependencies

* lodash - https://lodash.com/: the used fonction from this lib are :

    1. reduce: in order to aggregate the result from the transformation process
    2. get: in order to retrieve the value from the source
    3. isObject: in order to check on the type of data we work: simple field with a simple value or an object
    4. find: in order to make a link between an operation and a field in the source
    5. isArray: check if we work on an array
    6. isEmpty: check if we have to do the transformation or if we have the compulsory paramaters in order to make the job

* mocha - https://mochajs.org/: in order to launch the tests from the main.spec.js, be careful of the *configureMocha.js* that permits to launch chai/chai as promised.