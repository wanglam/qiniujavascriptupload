# 七牛文件上传
参照[七牛JSSDK](https://github.com/qiniu/js-sdk)代码实现上传base64格式的文件，依赖于RSVP Promise。
## Usage
```javascript
var options = {
	downtokenUrl:"down token url"	
};
var file = "JFKDLSJKAJKD/fsadf="
var fileuploader = new QiniuFileUploader(options);
fileuploader.upload(file,[uptoken]).then(function(ret){
	//upload success
},function(){
	//upload error
})
```
