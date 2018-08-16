import Web3 from 'web3';
// assuming metamask is installed for this one application
// metamask will automatically add web3 to browser as global
// web3 provider from metamask stores our personal keys
// our app will use a newwer version of web3 from yarn
// we want to use metamask provider and yarn web3 for everything else

// course wants web3 1.0.0-beta.26

const web3 = new Web3(window.web3.currentProvider); // use our provider from metaMask taken from global web3 var

export default web3;
