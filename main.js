const _ = require('lodash');
const BPromise = require('bluebird');

/**
 * Has to transform one object
 * @param {json} - mappings: json object that contain in keys the destination, and in values 
 *                 the path in the specific object to extract
 * @param {json}   operations: json object that contains methods to execute on a particular 
 *                 field during the transformation
 * @param {json} - Data to transform
 */
function _transformOne(mappings, operations, data){
    return _.reduce( mappings, (dataTransformed, path, key) => {
        if(!_.isObject(mappings[key])){
            let operate = _.find(operations, {'on': key});
            dataTransformed[key] = operate?operate.run(_.get(data, path)):_.get(data, path, null);
        }else{
            dataTransformed[key] = _transformOne(mappings[key], operations, data);
        }
        return dataTransformed;
    }, {});
}

/**
 * Check the source of data: array/object, then adapt the transformation
 * @param {json} - mappings: json object that contain in keys the destination, and in values 
 *                 the path in the specific object to extract
 * @param {json}   operations: json object that contains methods to execute on a particular 
 *                 field during the transformation
 * @param {json} - Data to transform
 */
function _transform(mappings, operations, data){
    if(_.isArray(data)){
        return _.reduce( data, (dataTransformed, item) => {
            if(!_.isEmpty(item) && _.isObject(item)){
                dataTransformed.push( _transformOne(mappings, operations, item) );
            }
            return dataTransformed;
        }, []); 
    }
    return _transformOne(mappings, operations, data);
}

/**
 * This public method has to transform data that are in a specific format to an another format
 * @param {json} - A json object that contains two main substructures (mappings, operations) :
 *                 -> mappings: json object that contain in keys the destination, and in values 
 *                 the path in the specific object to extract
 *                 -> operations: array object that contains methods to execute on a particular 
 *                 field during the transformation
 * @param {json} - Data to transform
 */
module.exports.transform = (template, data) => {
    return new BPromise((resolve, reject)=>{
        if(_.isEmpty(template) || _.isEmpty(template.mappings)){
            reject(new Error('Template not provided'));
        }

        if(_.isEmpty(data)){
            reject(new Error('Data not provided'));
        }

        resolve(_transform(template.mappings, template.operations, data));
    });
};