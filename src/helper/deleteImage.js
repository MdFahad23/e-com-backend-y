const fs = require("fs").promises

module.exports.deleteImage = async (userImagePath) => {
    try {
        await fs.access(userImagePath)
        await fs.unlink(userImagePath)
        console.log('user iamge was deleted')
    } catch (error) {
        console.error('user image does not exist')
    }
}