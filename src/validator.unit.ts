import Validator from "./validator";
const testData = require("./signup.example.json");
const slugid = require("slugid");

var foreach = function (collection, callback) {
  for (var i in collection) {
    if (collection.hasOwnProperty(i)) {
      callback(collection[i], i, collection);
    }
  }
};

var union = function (...args: any[]) {
  var united = {};
  foreach(arguments, function (object) {
    foreach(object, function (value, key) {
      united[key] = value;
    });
  });
  return united;
};

exports.customMessageMaps = {
  testRequired: function (test) {
    test.deepEqual(
      new Validator(
        {
          foo: ["required"]
        },
        {
          customMessageMaps: {
            required: function (name, testValue) {
              return {
                name: name,
                testValue: testValue
              };
            }
          }
        }
      ).test({}),
      {
        foo: [
          {
            name: "foo",
            testValue: undefined
          }
        ]
      }
    );
    test.done();
  },
  testLessThen: function (test) {
    test.deepEqual(
      new Validator(
        {
          foo: ["<:5"]
        },
        {
          customMessageMaps: {
            "<": function (name, testValue) {
              return {
                name: name,
                testValue: testValue
              };
            }
          }
        }
      ).test({
        foo: 6
      }),
      {
        foo: [
          {
            name: "foo",
            testValue: "5"
          }
        ]
      }
    );
    test.done();
  }
};
exports.customMessageTests = {
  setUp: function (done) {
    this.validator = new Validator(testData);

    this.validateExtended = function (extraData) {
      return this.validator.test(
        union(
          {
            username: "pass"
          },
          extraData || {}
        )
      );
    };

    done();
  },
  testUserNamePass: function (test) {
    test.deepEqual(
      this.validator.test({
        username: "user"
      }),
      {}
    );
    test.done();
  },
  testFailRequiredEmptyString: function (test) {
    test.deepEqual(
      this.validator.test({
        username: ""
      }),
      {
        username: ["username required", "3 minimum"]
      }
    );
    test.done();
  },
  testPassRequiredNumberZero: function (test) {
    var validator = new Validator({
      foo: ["type:number", "required"]
    });
    test.deepEqual(
      validator.test({
        foo: 0
      }),
      {}
    );
    test.done();
  },
  testRequiredCanOccurAnywhere: function (test) {
    var validator = new Validator({
      foo: ["type:number", "required"]
    });
    test.deepEqual(
      validator.test({
        foo: 5
      }),
      {}
    );
    test.deepEqual(validator.test({}), {
      foo: ["foo must be of type number", "foo is required"]
    });
    test.done();
  },
  testFailRequiredKeyNotPresent: function (test) {
    test.deepEqual(this.validator.test({}), {
      username: ["username required", "3 minimum", "10 maximum"]
    });
    test.done();
  },
  testUsernameMinimumLengthFail: function (test) {
    test.deepEqual(
      this.validator.test({
        username: "ab"
      }),
      {
        username: ["3 minimum"]
      }
    );
    test.done();
  },
  testUsernameMaximumLengthFail: function (test) {
    test.deepEqual(
      this.validator.test({
        username: "12345678901"
      }),
      {
        username: ["10 maximum"]
      }
    );
    test.done();
  },
  testUsernameMaximumLengthPass: function (test) {
    test.deepEqual(
      this.validator.test({
        username: "1234567890"
      }),
      {}
    );
    test.done();
  },
  testIllegalField: function (test) {
    test.deepEqual(
      this.validateExtended({
        illegalField: ""
      }).illegalField,
      ["illegal field"]
    );
    test.done();
  },
  testRegexFail: function (test) {
    test.deepEqual(
      this.validator.test({
        username: "f@il"
      }),
      {
        username: ["alphanumeric only"]
      }
    );
    test.done();
  },
  testRegexContainsForwardSlash: function (test) {
    var validator = new Validator({
      foo: [
        {
          "regex:/^beggining/end$/": "fail"
        }
      ]
    });
    test.deepEqual(
      validator.test({
        foo: "beggining/end"
      }),
      {},
      "pass ok"
    );
    test.deepEqual(
      validator.test({
        foo: "wrong"
      }),
      {
        foo: ["fail"]
      },
      "fail ok"
    );
    test.done();
  },
  testLessThanPass: function (test) {
    test.deepEqual(
      this.validateExtended({
        lessThan: -1
      }),
      {}
    );
    test.done();
  },
  testLessThanFail: function (test) {
    test.deepEqual(
      this.validateExtended({
        lessThan: 0
      }),
      {
        lessThan: ["must be less than zero"]
      }
    );
    test.done();
  },
  testLessThanOrEqualToPass: function (test) {
    test.deepEqual(
      this.validateExtended({
        lessThanOrEqualTo: 0
      }),
      {}
    );
    test.done();
  },
  testDoesNotModifyTheInput: function (test) {
    var input = {
      lessThanOrEqualTo: 0
    };
    this.validateExtended({
      lessThanOrEqualTo: 0
    });
    test.deepEqual(input, {
      lessThanOrEqualTo: 0
    });
    test.done();
  },
  testLessThanOrEqualToFail: function (test) {
    test.deepEqual(
      this.validateExtended({
        lessThanOrEqualTo: 1
      }),
      {
        lessThanOrEqualTo: ["must be less than or equal to zero"]
      }
    );
    test.done();
  },
  testGreaterThanPass: function (test) {
    test.deepEqual(
      this.validateExtended({
        greaterThan: 1
      }),
      {}
    );
    test.done();
  },
  testGreaterThanFail: function (test) {
    test.deepEqual(
      this.validateExtended({
        greaterThan: 0
      }),
      {
        greaterThan: ["must be greater than zero"]
      }
    );
    test.done();
  },
  testGreaterThanOrEqualToPass: function (test) {
    test.deepEqual(
      this.validateExtended({
        greaterThanOrEqualTo: "0"
      }),
      {}
    );
    test.done();
  },
  testGreaterThanOrEqualToFail: function (test) {
    test.deepEqual(
      this.validateExtended({
        greaterThanOrEqualTo: -1
      }),
      {
        greaterThanOrEqualTo: ["must be greater than or equal to zero"]
      }
    );
    test.done();
  },
  testEqualToPass: function (test) {
    test.deepEqual(
      this.validateExtended({
        equalTo: "0"
      }),
      {}
    );
    test.done();
  },
  testEqualToFail: function (test) {
    test.deepEqual(
      this.validateExtended({
        equalTo: 1
      }),
      {
        equalTo: ["must be equal to zero"]
      }
    );
    test.done();
  },
  testAsciiPass: function (test) {
    test.deepEqual(
      this.validateExtended({
        ascii: "aB0@# "
      }),
      {}
    );
    test.done();
  },
  testAsciiFail: function (test) {
    test.deepEqual(
      this.validateExtended({
        ascii: "Σ"
      }),
      {
        ascii: ["must be ascii characters only"]
      }
    );
    test.done();
  },
  testEmailPass: function (test) {
    test.deepEqual(
      this.validateExtended({
        email: "email@email.com"
      }),
      {}
    );
    test.done();
  },
  testEmailAllowPlusCharacter: function (test) {
    test.deepEqual(
      this.validateExtended({
        email: "email+foo@email.com"
      }),
      {}
    );
    test.done();
  },
  testEmailFail: function (test) {
    test.deepEqual(
      this.validateExtended({
        email: "wrong"
      }),
      {
        email: ["bad email format"]
      }
    );
    test.done();
  },
  testURLPass: function (test) {
    test.deepEqual(
      this.validateExtended({
        url: "http://foo.bar.us"
      }),
      {}
    );
    test.done();
  },
  testURLFail: function (test) {
    test.deepEqual(
      this.validateExtended({
        url: "wrong"
      }),
      {
        url: ["bad url format"]
      }
    );
    test.done();
  },
  testSlugidPass: function (test) {
    test.deepEqual(
      this.validateExtended({
        slugid: slugid.v4()
      }),
      {}
    );
    test.done();
  },
  testSlugidFail: function (test) {
    test.deepEqual(
      this.validateExtended({
        slugid: "wrong"
      }),
      {
        slugid: ["must be a valid slugid"]
      }
    );
    test.done();
  },
  testUUIDPass: function (test) {
    test.deepEqual(
      this.validateExtended({
        uuid: "cc93a8ce-cb34-426f-b4d3-2480127f3c6c"
      }),
      {},
      "lowercase"
    );
    test.deepEqual(
      this.validateExtended({
        uuid: "CC93A8CE-CB34-426F-B4D3-2480127F3C6C"
      }),
      {},
      "uppercase"
    );
    test.deepEqual(
      this.validateExtended({
        uuid: "Cc93A8cE-cb34-426F-b4d3-2480127f3c6C"
      }),
      {},
      "mixedcase"
    );
    test.done();
  },
  testUUIDFail: function (test) {
    test.deepEqual(
      this.validateExtended({
        uuid: "c93a8ce-cb34-426f-b4d3-2480127f3c6c"
      }),
      {
        uuid: ["bad uuid format"]
      }
    );
    test.deepEqual(
      this.validateExtended({
        uuid: "CC93A8CE-CB34-426F-B4D3-2480127F3C6Ce"
      }),
      {
        uuid: ["bad uuid format"]
      }
    );
    test.done();
  },
  testMatchPass: function (test) {
    test.deepEqual(
      this.validateExtended({
        match: "10",
        fieldToMatch: 10
      }),
      {}
    );
    test.done();
  },
  testMatchFail: function (test) {
    test.deepEqual(
      this.validateExtended({
        match: 1,
        fieldToMatch: 2
      }),
      {
        match: ["values must match"]
      }
    );
    test.done();
  },
  testEnumerated: function (test) {
    test.deepEqual(
      this.validateExtended({
        enumerated: "a"
      }),
      {}
    );
    test.deepEqual(
      this.validateExtended({
        enumerated: "b"
      }),
      {}
    );
    test.deepEqual(
      this.validateExtended({
        enumerated: "c"
      }),
      {
        enumerated: ["value not in enumerated set"]
      }
    );
    test.done();
  },
  testUseColonInValue: function (test) {
    test.deepEqual(
      this.validateExtended({
        colonOnly: ":"
      }),
      {}
    );
    test.done();
  },
  testNumericPass: function (test) {
    test.deepEqual(
      this.validateExtended({
        numeric: "123"
      }),
      {}
    );
    test.deepEqual(
      this.validateExtended({
        numeric: "123.456"
      }),
      {}
    );
    test.deepEqual(
      this.validateExtended({
        numeric: ".45"
      }),
      {}
    );
    test.deepEqual(
      this.validateExtended({
        numeric: "1."
      }),
      {}
    );
    test.deepEqual(
      this.validateExtended({
        numeric: "01"
      }),
      {}
    );
    test.deepEqual(
      this.validateExtended({
        numeric: "-1"
      }),
      {}
    );
    test.deepEqual(
      this.validateExtended({
        numeric: "-1.2"
      }),
      {}
    );
    test.done();
  },
  testNumericFail: function (test) {
    test.ok(
      this.validateExtended({
        numeric: "1a2"
      }).numeric
    );
    test.ok(
      this.validateExtended({
        numeric: "123 "
      }).numeric
    );
    test.ok(
      this.validateExtended({
        numeric: "1.2.3 "
      }).numeric
    );
    test.done();
  },
  testIntegerPass: function (test) {
    test.deepEqual(
      this.validateExtended({
        integer: "123"
      }),
      {}
    );
    test.deepEqual(
      this.validateExtended({
        integer: "0001"
      }),
      {}
    );
    test.deepEqual(
      this.validateExtended({
        integer: "-1"
      }),
      {}
    );
    test.deepEqual(
      this.validateExtended({
        integer: 1
      }),
      {}
    );
    test.deepEqual(
      this.validateExtended({
        integer: 0
      }),
      {}
    );
    test.deepEqual(
      this.validateExtended({
        integer: -1
      }),
      {}
    );
    test.done();
  },
  testIntegerFail: function (test) {
    test.ok(
      this.validateExtended({
        integer: "1.2"
      }).integer
    );
    test.ok(
      this.validateExtended({
        integer: "1a2"
      }).integer
    );
    test.done();
  },
  testAlphabeticalPass: function (test) {
    test.deepEqual(
      this.validateExtended({
        alphabetical: "aBc"
      }),
      {}
    );
    test.done();
  },
  testAlphabeticalFail: function (test) {
    test.ok(
      this.validateExtended({
        alphabetical: "a1c"
      }).alphabetical
    );
    test.ok(
      this.validateExtended({
        alphabetical: " ac"
      }).alphabetical
    );
    test.done();
  },
  testAlphanumericPass: function (test) {
    test.deepEqual(
      this.validateExtended({
        alphanumeric: "a1B"
      }),
      {}
    );
    test.done();
  },
  testAlphanumericFail: function (test) {
    test.ok(
      this.validateExtended({
        alphanumeric: "a 1b"
      }).alphanumeric
    );
    test.done();
  },
  testAutoGeneratedMessages: function (test) {
    var validator = new Validator({
      foo: ["required", "minimumLength:3"]
    });
    test.deepEqual(
      validator.test({
        foo: ""
      }),
      {
        foo: ["foo is required", "foo must be at least 3 characters long"]
      }
    );
    test.done();
  },
  testAutoGeneratedMessagesSingleString: function (test) {
    var validator = new Validator({
      foo: "required"
    });
    test.deepEqual(validator.test({}), {
      foo: ["foo is required"]
    });
    test.done();
  },
  testStrictMode: function (test) {
    var validator = new Validator(
      {
        foo: "required"
      },
      {
        strict: true
      }
    );
    test.deepEqual(
      validator.test({
        foo: 5
      }),
      {},
      "pass"
    );
    test.deepEqual(
      validator.test({
        foo: 5,
        extra: 0
      }),
      {
        extra: ["extra is an illegal field"]
      },
      "fail"
    );
    test.done();
  },
  testAny: function (test) {
    var validator = new Validator({
      foo: "any"
    });
    test.deepEqual(
      validator.test({
        foo: 5
      }),
      {}
    );
    test.deepEqual(
      validator.test({
        foo: 0
      }),
      {}
    );
    test.deepEqual(validator.test({}), {});
    test.deepEqual(
      validator.test({
        foo: "asdf"
      }),
      {}
    );
    test.done();
  },
  testTypeNumber: function (test) {
    var validator = new Validator({
      foo: "type:number"
    });
    test.deepEqual(
      validator.test({
        foo: 5
      }),
      {}
    );
    test.deepEqual(
      validator.test({
        foo: "5"
      }),
      {
        foo: ["foo must be of type number"]
      }
    );
    test.done();
  },
  testTypeString: function (test) {
    var validator = new Validator({
      foo: "type:string"
    });
    test.deepEqual(
      validator.test({
        foo: "5"
      }),
      {}
    );
    test.deepEqual(
      validator.test({
        foo: 5
      }),
      {
        foo: ["foo must be of type string"]
      }
    );
    test.done();
  },
  testTypeObject: function (test) {
    var validator = new Validator({
      foo: "type:object"
    });
    test.deepEqual(
      validator.test({
        foo: {}
      }),
      {}
    );
    test.deepEqual(
      validator.test({
        foo: []
      }),
      {
        foo: ["foo must be of type object"]
      }
    );
    test.done();
  },
  testTypeArray: function (test) {
    var validator = new Validator({
      foo: "type:array"
    });
    test.deepEqual(
      validator.test({
        foo: []
      }),
      {}
    );
    test.deepEqual(
      validator.test({
        foo: {}
      }),
      {
        foo: ["foo must be of type array"]
      }
    );
    test.done();
  },
  testTypeBoolean: function (test) {
    var validator = new Validator({
      foo: "type:boolean"
    });
    test.deepEqual(
      validator.test({
        foo: true
      }),
      {}
    );
    test.deepEqual(
      validator.test({
        foo: null
      }),
      {
        foo: ["foo must be of type boolean"]
      }
    );
    test.deepEqual(
      validator.test({
        foo: 0
      }),
      {
        foo: ["foo must be of type boolean"]
      }
    );
    test.done();
  },
  testTypeFunction: function (test) {
    var validator = new Validator({
      foo: "type:function"
    });
    test.deepEqual(
      validator.test({
        foo: {}
      }),
      {
        foo: ["foo must be of type function"]
      }
    );
    test.deepEqual(
      validator.test({
        foo: function () {}
      }),
      {}
    );
    test.done();
  },
  testTypeRegex: function (test) {
    var validator = new Validator({
      foo: "type:regex"
    });
    test.deepEqual(
      validator.test({
        foo: {}
      }),
      {
        foo: ["foo must be of type regex"]
      }
    );
    test.deepEqual(
      validator.test({
        foo: /bar/
      }),
      {}
    );
    test.done();
  },
  testTypeDate: function (test) {
    var validator = new Validator({
      foo: "type:date"
    });
    test.deepEqual(
      validator.test({
        foo: {}
      }),
      {
        foo: ["foo must be of type date"]
      }
    );
    test.deepEqual(
      validator.test({
        foo: new Date()
      }),
      {}
    );
    test.done();
  },
  testAllowNull: function (test) {
    var validator = new Validator({
      foo: ["type:number", "allowNull"]
    });
    test.deepEqual(validator.test({}), {});
    test.deepEqual(
      validator.test({
        foo: 5
      }),
      {}
    );
    test.deepEqual(
      validator.test({
        foo: null
      }),
      {}
    );
    test.done();
  }
};
