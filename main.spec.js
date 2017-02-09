const _ = require('lodash');

const transformer = require('./main');

describe('main.js - test the transformer', () => {

    let givenTemplate = {
        mappings: {
            id: 'identity.id',
            lastname: 'identity.lastname',
            firstname: 'identity.firstname',
            age: 'identity.age',
            goodlooking: 'identity.goodlooking',
            job: 'identity.jobs',
            missingField: 'identity.doesnotexist',
            friends: 'identity.friends',
            address: {
                streetLine: 'identity.address.streetLine',
                zipPostalCode: 'identity.address.zipPostalCode',
                locality: 'identity.address.locality',
                countryCode: 'identity.address.country.code'
            }
        },
        operations: [
            {
                run: jobs => _(jobs).chain().find({type: 'LATEST'}).get('label').value(), on: 'job',
            }
        ]
    };

    it('should not transform when missing data', () => {
        //given
        let givenData = undefined;

        //when
        let transformedData = transformer.transform(givenTemplate, givenData);

        //then
        return transformedData.should.be.rejectedWith(Error, 'Data not provided');
    });

    it('should not transform when empty data', () => {
        //given
        let givenData = {};

        //when
        let transformedData = transformer.transform(givenTemplate, givenData);

        //then
        return transformedData.should.be.rejectedWith(Error, 'Data not provided');
    });

    it('should not transform when missing template', () => {
        //given
        let givenData = { 
            identity: {
                'id': '1',
                'lastname': 'Bon',
                'firstname': 'Jean',
                'age': 30,
                'superflu': 'superflu',
                'goodlooking': true,
                'jobs': [
                    {
                        'label': 'Developper',
                        'type': 'LATEST'
                    }
                ],
                'friends': ['anne','ines'],
                'address': {
                    'streetLine': 'Rue de la boucherie',
                    'zipPostalCode': '59000',
                    'locality': 'Les Weppes',
                    'country': {
                        'code': 'FR'
                    }
                }
            }
        };

        //when
        let transformedData = transformer.transform(undefined, givenData);

        //then
        return transformedData.should.be.rejectedWith(Error, 'Template not provided');
    }); 
    
    it('should not transform when missing template.mappings', () => {
        //given
        let givenData = { 
            identity: {
                'id': '1',
                'lastname': 'Bon',
                'firstname': 'Jean',
                'age': 30,
                'superflu': 'superflu',
                'goodlooking': true,
                'jobs': [
                    {
                        'label': 'Developper',
                        'type': 'LATEST'
                    }
                ],
                'friends': ['anne','ines'],
                'address': {
                    'streetLine': 'Rue de la boucherie',
                    'zipPostalCode': '59000',
                    'locality': 'Les Weppes',
                    'country': {
                        'code': 'FR'
                    }
                }
            }
        };

        //when
        let emptyMappingsTemplate = _.cloneDeep(givenTemplate);
        emptyMappingsTemplate.mappings = undefined;
        let transformedData = transformer.transform(emptyMappingsTemplate, givenData);

        //then
        return transformedData.should.be.rejectedWith(Error, 'Template not provided');
    });
    
    it('should not transform when empty template.mappings', () => {
        //given
        let givenData = { 
            identity: {
                'id': '1',
                'lastname': 'Bon',
                'firstname': 'Jean',
                'age': 30,
                'superflu': 'superflu',
                'goodlooking': true,
                'jobs': [
                    {
                        'label': 'Developper',
                        'type': 'LATEST'
                    }
                ],
                'friends': ['anne','ines'],
                'address': {
                    'streetLine': 'Rue de la boucherie',
                    'zipPostalCode': '59000',
                    'locality': 'Les Weppes',
                    'country': {
                        'code': 'FR'
                    }
                }
            }
        };

        //when
        let emptyMappingsTemplate = _.cloneDeep(givenTemplate);
        emptyMappingsTemplate.mappings = {};
        let transformedData = transformer.transform(emptyMappingsTemplate, givenData);

        //then
        return transformedData.should.be.rejectedWith(Error, 'Template not provided');
    });
    
    it('should not transform when empty array template.mappings', () => {
        //given
        let givenData = { 
            identity: {
                'id': '1',
                'lastname': 'Bon',
                'firstname': 'Jean',
                'age': 30,
                'superflu': 'superflu',
                'goodlooking': true,
                'jobs': [
                    {
                        'label': 'Developper',
                        'type': 'LATEST'
                    }
                ],
                'friends': ['anne','ines'],
                'address': {
                    'streetLine': 'Rue de la boucherie',
                    'zipPostalCode': '59000',
                    'locality': 'Les Weppes',
                    'country': {
                        'code': 'FR'
                    }
                }
            }
        };

        //when
        let emptyMappingsTemplate = _.cloneDeep(givenTemplate);
        emptyMappingsTemplate.mappings = [];
        let transformedData = transformer.transform(emptyMappingsTemplate, givenData);

        //then
        return transformedData.should.be.rejectedWith(Error, 'Template not provided');
    });

    it('should transform when missing template.operations', () => {
        //given
        let givenData = { 
            identity: {
                'id': '1',
                'lastname': 'Bon',
                'firstname': 'Jean',
                'age': 30,
                'superflu': 'superflu',
                'goodlooking': true,
                'jobs': [
                    {
                        'label': 'Developper',
                        'type': 'LATEST'
                    }
                ],
                'friends': ['anne','ines'],
                'address': {
                    'streetLine': 'Rue de la boucherie',
                    'zipPostalCode': '59000',
                    'locality': 'Les Weppes',
                    'country': {
                        'code': 'FR'
                    }
                }
            }
        };

        //when
        let emptyOperationsTemplate = _.cloneDeep(givenTemplate);
        emptyOperationsTemplate.operations = undefined;
        let transformedData = transformer.transform(emptyOperationsTemplate, givenData);

        //expected
        let expected = {
            id: '1',
            lastname: 'Bon',
            firstname: 'Jean',
            age: 30,
            goodlooking: true,
            job: [
                {
                    label: 'Developper',
                    type: 'LATEST'
                }
            ],
            friends: ['anne','ines'],
            address: {
                streetLine: 'Rue de la boucherie',
                zipPostalCode: '59000',
                locality: 'Les Weppes',
                countryCode: 'FR'
            },
            missingField: null
        };

        //then
        return transformedData.should.become(expected);
    });

    it('should transform when empty template.operations', () => {
        //given
        let givenData = { 
            identity: {
                'id': '1',
                'lastname': 'Bon',
                'firstname': 'Jean',
                'age': 30,
                'superflu': 'superflu',
                'goodlooking': true,
                'jobs': [
                    {
                        'label': 'Developper',
                        'type': 'LATEST'
                    }
                ],
                'friends': ['anne','ines'],
                'address': {
                    'streetLine': 'Rue de la boucherie',
                    'zipPostalCode': '59000',
                    'locality': 'Les Weppes',
                    'country': {
                        'code': 'FR'
                    }
                }
            }
        };

        //when
        let emptyOperationsTemplate = _.cloneDeep(givenTemplate);
        emptyOperationsTemplate.operations = {};
        let transformedData = transformer.transform(emptyOperationsTemplate, givenData);

        //expected
        let expected = {
            id: '1',
            lastname: 'Bon',
            firstname: 'Jean',
            age: 30,
            goodlooking: true,
            job: [
                {
                    label: 'Developper',
                    type: 'LATEST'
                }
            ],
            friends: ['anne','ines'],
            address: {
                streetLine: 'Rue de la boucherie',
                zipPostalCode: '59000',
                locality: 'Les Weppes',
                countryCode: 'FR'
            },
            missingField: null
        };

        //then
        return transformedData.should.become(expected);
    });

    it('should transform when empty template.operations', () => {
        //given
        let givenData = { 
            identity: {
                'id': '1',
                'lastname': 'Bon',
                'firstname': 'Jean',
                'age': 30,
                'superflu': 'superflu',
                'goodlooking': true,
                'jobs': [
                    {
                        'label': 'Developper',
                        'type': 'LATEST'
                    }
                ],
                'friends': ['anne','ines'],
                'address': {
                    'streetLine': 'Rue de la boucherie',
                    'zipPostalCode': '59000',
                    'locality': 'Les Weppes',
                    'country': {
                        'code': 'FR'
                    }
                }
            }
        };

        //when
        let emptyOperationsTemplate = _.cloneDeep(givenTemplate);
        emptyOperationsTemplate.operations = [];
        let transformedData = transformer.transform(emptyOperationsTemplate, givenData);

        //expected
        let expected = {
            id: '1',
            lastname: 'Bon',
            firstname: 'Jean',
            age: 30,
            goodlooking: true,
            job: [
                {
                    label: 'Developper',
                    type: 'LATEST'
                }
            ],
            friends: ['anne','ines'],
            address: {
                streetLine: 'Rue de la boucherie',
                zipPostalCode: '59000',
                locality: 'Les Weppes',
                countryCode: 'FR'
            },
            missingField: null
        };

        //then
        return transformedData.should.become(expected);
    });

    it('should transform these data in a new expected format with the template in param', () => {
        //given
        let givenData = { 
            identity: {
                'id': '1',
                'lastname': 'Bon',
                'firstname': 'Jean',
                'age': 30,
                'superflu': 'superflu',
                'goodlooking': true,
                'jobs': [
                    {
                        'label': 'Developper',
                        'type': 'LATEST'
                    }
                ],
                'friends': ['anne','ines'],
                'address': {
                    'streetLine': 'Rue de la boucherie',
                    'zipPostalCode': '59000',
                    'locality': 'Les Weppes',
                    'country': {
                        'code': 'FR'
                    }
                }
            }
        };

        //when
        let transformedData = transformer.transform(givenTemplate, givenData);

        //expected
        let expected = {
            id: '1',
            lastname: 'Bon',
            firstname: 'Jean',
            age: 30,
            goodlooking: true,
            job: 'Developper',
            friends: ['anne','ines'],
            address: {
                streetLine: 'Rue de la boucherie',
                zipPostalCode: '59000',
                locality: 'Les Weppes',
                countryCode: 'FR'
            },
            missingField: null
        };

        //then
        return transformedData.should.become(expected);
    });

    it('should transform when there is an array of data', () => {
        //given
        let givenData = [
            { 
                identity: {
                    'id': '1',
                    'lastname': 'Bon',
                    'firstname': 'Jean',
                    'age': 30,
                    'superflu': 'superflu',
                    'goodlooking': true,
                    'jobs': [
                        {
                            'label': 'Developper',
                            'type': 'LATEST'
                        }
                    ],
                    'friends': ['anne','ines'],
                    'address': {
                        'streetLine': 'Rue de la boucherie',
                        'zipPostalCode': '59000',
                        'locality': 'Les Weppes',
                        'country': {
                            'code': 'FR'
                        }
                    }
                }
            },
            null,
            1,
            'notAnObject',
            {},
            { 
                identity: {
                    'id': '2',
                    'lastname': 'Verger',
                    'firstname': 'Framboise',
                    'age': 99,
                    'superflu': 'superflu',
                    'goodlooking': false,
                    'jobs': [
                        {
                            'label': 'BigBoss',
                            'type': 'LATEST'
                        },
                        {
                            'label': 'Director',
                            'type': 'OTHER'
                        }
                    ],
                    'friends': ['anne','ines','Jean Bon'],
                    'address': {
                        'streetLine': 'Rue de la vieillesse',
                        'zipPostalCode': '59000',
                        'locality': 'Les Weppes',
                        'country': {
                            'code': 'FR'
                        }
                    }
                }
            }
        ];

        //when
        let transformedData = transformer.transform(givenTemplate, givenData);

        //expected
        let expected = [
            {
                id: '1',
                lastname: 'Bon',
                firstname: 'Jean',
                age: 30,
                goodlooking: true,
                job: 'Developper',
                friends: ['anne','ines'],
                address: {
                    streetLine: 'Rue de la boucherie',
                    zipPostalCode: '59000',
                    locality: 'Les Weppes',
                    countryCode: 'FR'
                },
                missingField: null
            },
            {
                id: '2',
                lastname: 'Verger',
                firstname: 'Framboise',
                age: 99,
                goodlooking: false,
                job: 'BigBoss',
                friends: ['anne','ines','Jean Bon'],
                address: {
                    streetLine: 'Rue de la vieillesse',
                    zipPostalCode: '59000',
                    locality: 'Les Weppes',
                    countryCode: 'FR'
                },
                missingField: null
            }
        ];

        //then
        return transformedData.should.become(expected);
    });
});