var obj=new Promise(function (reslove,reject) {
    var obj=new XMLHttpRequest();
    obj.open("get","url");
    obj.onload=function () {
        reslove(obj.response);
    };
    obj.onerror=function () {
        reject("error");
    };
    obj.send();
});
obj.then(function (data) {

},function (error) {

});
//prams={
// url:
// method:
// data:
//
// }
function http(prams) {

}