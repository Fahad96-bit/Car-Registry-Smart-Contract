/**
 *Submitted for verification at Etherscan.io on 2023-03-20
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
import "hardhat/console.sol";

contract CarRegistry {
   mapping(string => Car)  carRegistry;

   struct Car {
       address owner;
       string make;
       string model;
       uint256 year;
       string carNumber;
   }

    constructor() {
        console.log("Deployed CarRegistry by '%s'", msg.sender);
    }

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

     modifier onlyCarOwner(string memory _carNumber){
     require( getCarOwner(_carNumber) == msg.sender , "You are not owner of a car");
     _;
    }

     modifier checkIfCarNumberEmpty(string memory _carNumber){
    bytes memory carNumber = bytes(_carNumber);
    require(carNumber.length != 0, "Car number can't be empty");
     _;
    }

     modifier checkIfAlreadyCarExists(string memory _carNumber){
        bytes memory carNumber = bytes(carRegistry[_carNumber].carNumber);
        require(carNumber.length == 0, "Car already exists with this car number");
     _;
    }
         modifier checkIfCarExists(string memory _carNumber){
        bytes memory carNumber = bytes(carRegistry[_carNumber].carNumber);
        require(carNumber.length != 0, "Car does not exists with this car number");
     _;
    }


    function addCarDetail(string memory _carNumber ,address _owner, string memory _carMake,string memory _carModel,uint256 _carYear) public checkIfAlreadyCarExists(_carNumber){
        carRegistry[_carNumber] = Car(_owner,_carMake,_carModel,_carYear,_carNumber);
    }

    function getCarDetail(string memory _carNumber) public checkIfCarNumberEmpty(_carNumber) checkIfCarExists(_carNumber) view returns(address owner,string memory make,string memory model,uint256 year){
    return (carRegistry[_carNumber].owner,carRegistry[_carNumber].make,carRegistry[_carNumber].model,carRegistry[_carNumber].year);
    }
    function getCarOwner(string memory _carNumber) public checkIfCarNumberEmpty(_carNumber) checkIfCarExists(_carNumber) view returns(address owner){
    return (carRegistry[_carNumber].owner); 
    }

     function transferCarOwnership(string memory _carNumber,address _newOwner ) public checkIfCarExists(_carNumber) onlyCarOwner(_carNumber){
     Car memory car = carRegistry[_carNumber];
     address _oldOwner = car.owner;
     car.owner = _newOwner ;
     carRegistry[_carNumber] = car;
     emit OwnershipTransferred(_oldOwner, _newOwner);
    }


}