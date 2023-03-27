const { expect } = require("chai");

describe("CarRegistry", function () {
  let contract;

  beforeEach(async () => {
    [account1, account2, account3, ...addrs] = await ethers.getSigners();
    const CarRegistry = await ethers.getContractFactory("CarRegistry");
    contract = await CarRegistry.deploy();
  });

  describe("addCarDetail", () => {
    it("should add car against car number", async function () {
      await contract.deployed();
      await contract.addCarDetail(
        "HB-11",
        account1.address,
        "toyota",
        "hilux",
        2021
      );
      const carDetail = await contract.getCarDetail("HB-11");
      const [address, make, model, year] = carDetail;
      expect(address).to.be.equal(account1.address);
      expect(make).to.be.equal("toyota");
      expect(model).to.be.equal("hilux");
      expect(year).to.be.equal(ethers.BigNumber.from("2021"));
    });

    it("should not add car against car number which is already taken", async function () {
      await contract.deployed();
      await contract.addCarDetail(
        "KB-11",
        account1.address,
        "suzki",
        "mehrann",
        2012
      );
      await expect(
        contract.addCarDetail(
          "KB-11",
          account1.address,
          "toyota",
          "corolla",
          2021
        )
      ).to.be.revertedWith("Car already exists with this car number");
    });
  });
  describe("getCarDetail", () => {
    it("should get car details against car number", async function () {
      await contract.deployed();
      await contract.addCarDetail(
        "SS-999",
        account1.address,
        "suzuki",
        "aulto",
        2022
      );
      const carDetail = await contract.getCarDetail("SS-999");
      const [address, make, model, year] = carDetail;
      expect(address).to.be.equal(account1.address);
      expect(make).to.be.equal("suzuki");
      expect(model).to.be.equal("aulto");
      expect(year).to.be.equal(ethers.BigNumber.from("2022"));
    });

    it("should not get car details against car number when empty car number provided", async function () {
      await contract.deployed();
      await contract.addCarDetail(
        "LB-23",
        account1.address,
        "toyota",
        "yaris",
        2012
      );
      await expect(contract.getCarDetail("")).to.be.revertedWith(
        "Car number can't be empty"
      );
    });
    it("should not get car details against car number when wrong car number provided", async function () {
      await contract.deployed();
      await contract.addCarDetail(
        "SB-89",
        account1.address,
        "suzki",
        "swift",
        2012
      );
      await expect(contract.getCarDetail("SB-88")).to.be.revertedWith(
        "Car does not exists with this car number"
      );
    });
  });
  describe("getCarOwner", () => {
    it("should get car owner against car number", async function () {
      await contract.deployed();
      await contract.addCarDetail(
        "VV-999",
        account1.address,
        "suzuki",
        "picanto",
        2022
      );
      const carOwner = await contract.getCarOwner("VV-999");
      expect(carOwner).to.be.equal(account1.address);
    });

    it("should not get car owner against car number when empty car number provided", async function () {
      await contract.deployed();
      await contract.addCarDetail(
        "LLB-23",
        account1.address,
        "suzki",
        "cultus",
        2012
      );
      await expect(contract.getCarOwner("")).to.be.revertedWith(
        "Car number can't be empty"
      );
    });
    it("should not get car owner against car number when wrong car number provided", async function () {
      await contract.deployed();
      await contract.addCarDetail(
        "SSB-89",
        account1.address,
        "toyota",
        "camry",
        2012
      );
      await expect(contract.getCarOwner("SSB-88")).to.be.revertedWith(
        "Car does not exists with this car number"
      );
    });
  });
  describe("transferCarOwnership", () => {
    it("should transfer car ownership to another account", async function () {
      await contract.deployed();
      await contract.addCarDetail(
        "VSS-999",
        account1.address,
        "toyota",
        "prius",
        2015
      );
      await expect(contract.transferCarOwnership("VSS-999", account2.address))
        .to.emit(contract, "OwnershipTransferred")
        .withArgs(account1.address, account2.address);
      const carOwner = await contract.getCarOwner("VSS-999");
      expect(carOwner).to.be.equal(account2.address);
    });

    it("should not transfer car ownership to another account because only car owner can change ownership", async function () {
      await contract.deployed();
      await contract.addCarDetail(
        "VDS-89",
        account2.address,
        "suzuki",
        "wagonr",
        2015
      );

      await expect(
        contract.transferCarOwnership("VDS-89", account3.address)
      ).to.be.revertedWith("You are not owner of a car");
    });

    it("should not transfer car ownership to another account because of wrong car number provided", async function () {
      await contract.deployed();
      await contract.addCarDetail(
        "FHD-89",
        account1.address,
        "suzuki",
        "dzire",
        2015
      );

      await expect(
        contract.transferCarOwnership("FHD-99", account3.address)
      ).to.be.revertedWith("Car does not exists with this car number");
    });
  });
});
