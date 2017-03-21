pragma solidity ^0.4.9;
contract HelloWorld {
    /* define variable of the type string */
    string message;

    /* this runs when the contract is executed */
    function HelloWorld() public {
        message = "HelloWorld";
    }

    /* main function */
    function sayHello() constant returns (string) {
        return message;
    }
}
