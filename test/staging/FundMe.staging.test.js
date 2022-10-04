const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChain } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")
developmentChain.includes(network.name)
    ? describe.skip // ? is a one liner if condition
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allows to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw()
              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })
