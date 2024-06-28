EasySeats - Web3 Ticket Booking WebApp
EasySeats is a decentralized ticket booking application built on Ethereum blockchain using Web3 technologies. It allows users to buy event tickets securely and transparently.

Features
Event Listing: Browse and view upcoming events with details like name, cost, date, time, and location.
Ticket Purchase: Purchase tickets using Ethereum cryptocurrency.
Seat Selection: Select available seats for events.
Blockchain Transparency: Utilizes Ethereum blockchain for transparency and security in ticket management.
Technologies Used
Solidity: Smart contract language for Ethereum.
Hardhat: Ethereum development environment.
React: Frontend framework for building the user interface.
Ethers.js: JavaScript library for interacting with Ethereum.
Ethereum Attestation Service:For Attestation
Setup Instructions
Prerequisites
Node.js
Hardhat (for Ethereum development)
Metamask (or similar Ethereum wallet)
Installation
Clone the repository:

bash
Copy code
git clone 
cd easy-seats
Install dependencies:

bash
Copy code
npm install
Usage
Compile smart contracts:

bash
Copy code
npx hardhat compile
Deploy contracts to a local Ethereum network (Hardhat):

bash
Copy code
npx hardhat node # Start local Ethereum node
npx hardhat run scripts/deploy.js --network localhost
Start the frontend application:

bash
Copy code
npm start
Connect Metamask to your local Ethereum network and import accounts for testing.

Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

License
This project is licensed under the MIT License - see the LICENSE file for details.

