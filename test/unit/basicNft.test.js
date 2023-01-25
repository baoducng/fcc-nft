const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("basicNFT test", function () {
          let deployer, basicNFT
          const tokenURI =
              "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json"
          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["main"])

              basicNft = await ethers.getContract("BasicNft") // Returns a new connection to the Raffle contract
          })
          describe("constructor", function () {
              it("initializes the basic nft correctly", async () => {
                  assert.equal((await basicNft.name()).toString(), "Doggie")
                  assert.equal((await basicNft.symbol()).toString(), "DOG")
                  assert.equal((await basicNft.getTokenCounter()).toString(), "0")
              })
          })
          describe("tokenURI", function () {
              it("should have the correct token URI", async () => {
                  assert.equal((await basicNft.tokenURI("0")).toString(), tokenURI)
                  assert.equal((await basicNft.tokenURI("10000")).toString(), tokenURI)
              })
          })
          describe("mintNFT", function () {
              let mintTx
              beforeEach(async () => {
                  mintTx = await basicNft.mintNFT()
                  await mintTx.wait(1)
              })

              it("should mint NFT to the owner and increasement token counter", async () => {
                  //how do I call this mint shit
                  assert.equal((await basicNft.getTokenCounter()).toString(), "1")
                  assert.equal(
                      (await basicNft.tokenURI("0")).toString(),
                      await basicNft.TOKEN_URI()
                  )
              })
              it("Show the correct balance and owner of an NFT", async function () {
                  const deployerAddress = deployer.address
                  const deployerBalance = await basicNft.balanceOf(deployerAddress)
                  const owner = await basicNft.ownerOf("0")

                  assert.equal(deployerBalance.toString(), "1")
                  assert.equal(owner, deployerAddress)
              })
          })
      })
