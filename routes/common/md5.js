function md5(str) {
    const crpto=require('crypto');
    const hash=crpto.createHash("md5");
    hash.update(str);
    return (hash.digest('hex'));
}
module.exports=md5;

