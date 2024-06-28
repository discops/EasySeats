const { expect } = require("chai");

const NAME = "EasySeats"; // Updated contract name
const SYMBOL = "ES"; // Updated symbol

const OCCASION_NAME = "ETH Texas";
const OCCASION_COST = ethers.utils.parseUnits('1', 'ether');
const OCCASION_MAX_TICKETS = 100;
const OCCASION_DATE = "Apr 27";
const OCCASION_TIME = "10:00AM CST";
const OCCASION_LOCATION = "Austin, Texas";

describe("EasySeats", () => { // Updated contract name
  let easySeats; // Updated contract instance
  let deployer, buyer;

  beforeEach(async () => {
    // Setup accounts
    [deployer, buyer] = await ethers.getSigners();

    // Deploy contract
    const EasySeats = await ethers.getContractFactory("EasySeats"); // Updated contract name
    easySeats = await EasySeats.deploy(NAME, SYMBOL);

    const transaction = await easySeats.connect(deployer).list(
      OCCASION_NAME,
      OCCASION_COST,
      OCCASION_MAX_TICKETS,
      OCCASION_DATE,
      OCCASION_TIME,
      OCCASION_LOCATION
    );

    await transaction.wait();
  });

  describe("Deployment", () => {
    it("Sets the name", async () => {
      expect(await easySeats.name()).to.equal(NAME);
    });

    it("Sets the symbol", async () => {
      expect(await easySeats.symbol()).to.equal(SYMBOL);
    });

    it("Sets the owner", async () => {
      expect(await easySeats.owner()).to.equal(deployer.address);
    });
  });

  describe("Occasions", () => {
    it('Returns occasions attributes', async () => {
      const occasion = await easySeats.getOccasion(1);
      expect(occasion.id).to.be.equal(1);
      expect(occasion.name).to.be.equal(OCCASION_NAME);
      expect(occasion.cost).to.be.equal(OCCASION_COST);
      expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS);
      expect(occasion.date).to.be.equal(OCCASION_DATE);
      expect(occasion.time).to.be.equal(OCCASION_TIME);
      expect(occasion.location).to.be.equal(OCCASION_LOCATION);
    });

    it('Updates occasions count', async () => {
      const totalOccasions = await easySeats.totalOccasions();
      expect(totalOccasions).to.be.equal(1);
    });
  });

  describe("Minting", () => {
    const ID = 1;
    const SEAT = 50;
    const AMOUNT = ethers.utils.parseUnits('1', 'ether');

    beforeEach(async () => {
      const transaction = await easySeats.connect(buyer).mint(ID, SEAT, { value: AMOUNT });
      await transaction.wait();
    });

    it('Updates ticket count', async () => {
      const occasion = await easySeats.getOccasion(1);
      expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS - 1);
    });

    it('Updates buying status', async () => {
      const status = await easySeats.hasBought(ID, buyer.address);
      expect(status).to.be.equal(true);
    });

    it('Updates seat status', async () => {
      const owner = await easySeats.seatTaken(ID, SEAT);
      expect(owner).to.equal(buyer.address);
    });

    it('Updates overall seating status', async () => {
      const seats = await easySeats.getSeatsTaken(ID);
      expect(seats.length).to.equal(1);
      expect(seats[0]).to.equal(SEAT);
    });

    it('Updates the contract balance', async () => {
      const balance = await ethers.provider.getBalance(easySeats.address);
      expect(balance).to.be.equal(AMOUNT);
    });
  });

  describe("Withdrawing", () => {
    const ID = 1;
    const SEAT = 50;
    const AMOUNT = ethers.utils.parseUnits("1", 'ether');
    let balanceBefore;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      let transaction = await easySeats.connect(buyer).mint(ID, SEAT, { value: AMOUNT });
      await transaction.wait();

      transaction = await easySeats.connect(deployer).withdraw();
      await transaction.wait();
    });

    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it('Updates the contract balance', async () => {
      const balance = await ethers.provider.getBalance(easySeats.address);
      expect(balance).to.equal(0);
    });
  });
});
