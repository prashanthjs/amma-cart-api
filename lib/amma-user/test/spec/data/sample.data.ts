let initData = [{
  _id: 'test1',
  name: {
    firstName: 'test1',
    lastName: 'test1'
  },
  password: 'test1',
  email: 'test1@gmail.com',
  contactNumber: '07889286992',
  gender: 'male',
  dob: '1988-01-05',
  address: {
    addressLine1: '150 Paget street',
    addressLine2: '',
    town: 'loughborough',
    county: 'leicestershire',
    country: 'United Kingdom',
    postcode: 'LE11 5DU'
  }
}, {
    _id: 'test2',
    name: {
      firstName: 'test2',
      lastName: 'test2'
    },
    password: 'test2',
    email: 'test2@gmail.com',
    contactNumber: '07889286992',
    gender: 'male',
    dob: '1988-01-05',
    address: {
      addressLine1: '150 Paget street',
      addressLine2: '',
      town: 'loughborough',
      county: 'leicestershire',
      country: 'United Kingdom',
      postcode: 'LE11 5DU'
    }
  }, {
    _id: 'test3',
    name: {
      firstName: 'test3',
      lastName: 'test3'
    },
    password: 'test3',
    email: 'test3@gmail.com',
    contactNumber: '07889286992',
    gender: 'other',
    dob: '1988-01-05',
    address: {
      addressLine1: '150 Paget street',
      addressLine2: '',
      town: 'loughborough',
      county: 'leicestershire',
      country: 'United Kingdom',
      postcode: 'LE11 5DU'
    }
  }
];
let creationData = {
  _id: 'user99',
  name: {
    firstName: 'user99',
    lastName: 'user99'
  },
  password: 'user99',
  email: 'user99@gmail.com',
  contactNumber: '07889286992',
  gender: 'male',
  dob: '1988-01-05',
  address: {
    addressLine1: '150 Paget street',
    addressLine2: 'test',
    town: 'loughborough',
    county: 'leicestershire',
    country: 'United Kingdom',
    postcode: 'LE11 5DU'
  }
};

let updateData = {
  name: {
    firstName: 'user99',
    lastName: 'user99'
  },
  email: 'user99@gmail.com',
};
module.exports = {
  initData: initData,
  creationData : creationData,
  updateData: updateData
};
