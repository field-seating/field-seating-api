const jwtLife = '30d';
const verificationTokenLife = 86400000; //24h
const resendLimitTime = 300000; //5mins

module.exports = { jwtLife, verificationTokenLife, resendLimitTime };
