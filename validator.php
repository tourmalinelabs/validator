<?php
// // The Validator
// // https://github.com/DubFriend/validator

// class ValidatorException extends Exception {}

// class ValidatorTestWrapper {
//     //tests are of the format
//     //    array('name:value' => 'message');
//     //(value is optional in some cases)
//     private $test;
//     function __construct($test) {
//         $this->test = $test;
//     }

//     //message if test fails
//     function message() {
//         return array_values($this->test)[0];
//     }

//     // just 'name:value' stuck together
//     function description() {
//         return array_keys($this->test)[0];
//     }

//     //name of the test (required, regex, etc.)
//     function name() {
//         return explode(':', $this->description())[0];
//     }

//     //value associated with test, (regex:/abc/) (not the value of the
//     //data to be tested)
//     function value() {
//         $pieces = explode(':', $this->description());
//         if(count($pieces) > 1) {
//             array_shift($pieces);
//             return implode(':', $pieces);
//         }
//     }
// }

// class Validator {
//     private $schema;
//     function __construct($schema) {
//         $this->schema = $this->wrapSchema($schema);
//     }

//     private function wrapSchema($schema) {
//         $wrapped = array();
//         foreach($schema as $fieldName => $tests) {
//             $wrapped[$fieldName] = array();
//             foreach($tests as $test) {
//                 $wrapped[$fieldName][] = new ValidatorTestWrapper($test);
//             }
//         }
//         return $wrapped;
//     }

//     private function isTestPass($valueToTest, $testObject) {
//         $testSymbolMap = array(
//             '==' => 'equalTo',
//             '<' => 'lessThan',
//             '<=' => 'lessThanOrEqualTo',
//             '>' => 'greaterThan',
//             '>=' => 'greaterThanOrEqualTo'
//         );

//         $methodName = in_array($testObject->name(), array_keys($testSymbolMap)) ?
//                 $testSymbolMap[$testObject->name()] :
//                 $testObject->name();

//         return $this->{$methodName}($valueToTest, $testObject->value());
//     }

//     // TEST FUNCTIONS START
//     private function required($valueToTest) {
//         return $valueToTest || $valueToTest === '0';
//     }

//     private function sometimes($valueToTest) {
//         return $this->required($valueToTest);
//     }

//     private function type($valueToTest, $testValue) {
//         $type = gettype($valueToTest);
//         switch($testValue) {
//             case 'number':
//                 return $type === 'integer' || $type === 'double';
//             case 'string':
//                 return $type === 'string';
//             case 'boolean':
//                 return $type === 'boolean';
//             case 'object':
//                 return $type === 'array';
//             case 'null':
//                 return $type === 'NULL';
//             default:
//                 throw new ValidatorException('invalid type ' . $testValue);
//         }
//     }

//     private function email($valueToTest) {
//         return filter_var($valueToTest, FILTER_VALIDATE_EMAIL);
//     }

//     private function minimumLength($valueToTest, $testValue) {
//         return strlen($valueToTest) >= $testValue;
//     }

//     private function maximumLength($valueToTest, $testValue) {
//         return strlen($valueToTest) <= $testValue;
//     }

//     private function regex($valueToTest, $testValue) {
//         //preg_match() returns 1 if the pattern matches given subject,
//         //0 if it does not, or FALSE if an error occurred.
//         $result = preg_match($testValue, $valueToTest);
//         if($result === false) {
//             throw new ValidatorException('regular expression error');
//         }
//         else {
//             return $result === 1;
//         }
//     }

//     private function lessThan($valueToTest, $testValue) {
//         return $valueToTest < $testValue;
//     }

//     private function lessThanOrEqualTo($valueToTest, $testValue) {
//         return $valueToTest <= $testValue;
//     }

//     private function greaterThan($valueToTest, $testValue) {
//         return $valueToTest > $testValue;
//     }

//     private function greaterThanOrEqualTo($valueToTest, $testValue) {
//         return $valueToTest >= $testValue;
//     }

//     private function equalTo($valueToTest, $testValue) {
//         return $valueToTest == $testValue;
//     }

//     private function match($valueToTest) {
//         if(!is_array($valueToTest) || count($valueToTest) !== 2) {
//             throw new ValidatorException('match must recieve an array with two values');
//         }
//         else {
//             return $valueToTest[0] == $valueToTest[1];
//         }
//     }

//     private function enumerated($valueToTest, $testValue) {
//         return in_array($valueToTest, explode(',', $testValue));
//     }

//     private function numeric($valueToTest) {
//         return preg_match('/^[0-9]*\.?[0-9]*$/', $valueToTest);
//     }

//     private function integer($valueToTest) {
//         return preg_match('/^[0-9]*$/', $valueToTest);
//     }

//     private function alphabetical($valueToTest) {
//         return preg_match('/^[a-zA-Z]*$/', $valueToTest);
//     }

//     private function alphanumeric($valueToTest) {
//         return preg_match('/^[a-zA-Z0-9]*$/', $valueToTest);
//     }
//     // TEST FUNCTIONS END


//     function test(array $dataToTest) {
//         $errors = array();

//         $runTestsOnName = function ($tests, $name) use (&$errors, $dataToTest) {
//             foreach($tests as $testObject) {
//                 if(!$this->isTestPass($dataToTest[$name], $testObject)) {
//                     $errors[$name] = $testObject->message();
//                     break;
//                 }
//             }
//         };

//         foreach($this->schema as $name => $tests) {
//             if($tests[0]->name() === 'illegalField') {
//                 if(array_key_exists($name, $dataToTest)) {
//                     $errors[$name] = $tests[0]->message();
//                 }
//             }
//             else if(
//                 array_key_exists($name, $dataToTest) &&
//                 $dataToTest[$name] !== '' ||
//                 array_key_exists($name, $dataToTest) &&
//                 $dataToTest[$name] === '0'
//             ) {
//                 $runTestsOnName($tests, $name);
//             }
//             else if(
//                 $tests[0]->name() === 'sometimes' &&
//                 array_key_exists($name, $dataToTest)
//             ) {
//                 $runTestsOnName($tests, $name);
//             }
//             else if($tests[0]->name() === 'required') {
//                 $errors[$name] = $tests[0]->message();
//             }
//         }

//         return $errors;
//     }
// }
?>
