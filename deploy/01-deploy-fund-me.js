// function deployFunc() {
//     console.log("Hi!")
// }
// module.exports.default = deployFunc
const { network } = require("hardhat")
const { TASK_DEPLOY_RUN_DEPLOY } = require("hardhat-deploy")
const {
    networkConfig,
    developmentChain,
    DECIMALS,
    INITIAL_ANSWER
} = require("../helper-hardhat-config")

const { verify } = require("../utils/verify")

// module.exports = async (hre) => {
//     //hre hardhat runtime env
//     const { getNamedAccounts, deployments } = hre
//     // same as hre.getNamedAccounts and hre.deployments
// }

//same as above line
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (developmentChain.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    //when going for locathost or hardhart we want to use a mock
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, //price feed address here
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })

    if (
        !developmentChain.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        //verify
        await verify(fundMe.address, args)
    }
    log("_______________________________")
}

module.exports.tags = ["all", "fundme"]
