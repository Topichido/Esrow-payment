const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Escrow Contract', function () {
  let Escrow;
  let escrow;
  let owner;
  let arbiter;
  let beneficiary;

  beforeEach(async function () {
    [owner, arbiter, beneficiary] = await ethers.getSigners();

    Escrow = await ethers.getContractFactory('Escrow');
    escrow = await Escrow.connect(owner).deploy(arbiter.address, beneficiary.address);
    await escrow.deployed();
  });

  it('Should set the correct initial state', async function () {
    expect(await escrow.arbiter()).to.equal(arbiter.address);
    expect(await escrow.beneficiary()).to.equal(beneficiary.address);
    expect(await escrow.depositor()).to.equal(owner.address);
  });

  it('Should approve and transfer funds to the beneficiary', async function () {
    const depositAmount = ethers.utils.parseEther('1.0');
    await owner.sendTransaction({ to: escrow.address, value: depositAmount });

    await expect(escrow.connect(arbiter).approve())
      .to.emit(escrow, 'Approved')
      .withArgs(depositAmount);

    const beneficiaryBalanceBefore = await ethers.provider.getBalance(beneficiary.address);
    await escrow.connect(arbiter).approve();
    const beneficiaryBalanceAfter = await ethers.provider.getBalance(beneficiary.address);

    expect(beneficiaryBalanceAfter.sub(beneficiaryBalanceBefore)).to.equal(depositAmount);
  });

  it('Should revert if non-arbiter tries to approve', async function () {
    await expect(escrow.connect(beneficiary).approve()).to.be.revertedWith('NotAuthorized');
  });
});

