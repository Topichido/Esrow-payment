async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const Escrow = await ethers.getContractFactory('Escrow');
  const escrow = await Escrow.deploy(deployer.address, deployer.address); // Set initial beneficiary as deployer for testing

  console.log('Escrow contract address:', escrow.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

