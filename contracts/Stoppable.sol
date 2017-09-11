pragma solidity ^0.4.6;

import "./Ownable.sol";

contract Stoppable is Ownable {
    
    bool public running;
    
    event LogRunSwitch(address sender, bool switchSetting);
        
    modifier onlyIfRunning { 
        require(running); 
        _;
    }
        
    function Stoppable() {
        running = true;
    }
        
    function runSwitch(bool onOff)
        onlyOwner
        returns(bool success)
    {
        running = onOff;
        LogRunSwitch(msg.sender, onOff);
        return true;
    }
        
}