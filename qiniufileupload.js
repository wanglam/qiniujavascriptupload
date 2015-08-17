var QiniuFileUploader;

(function(){
    var doRequest = function(url,method,data,headers){
        var promise = new RSVP.Promise(function(resolve,reject){
            var client = new XMLHttpRequest();
            if(method.toUpperCase() === "POST"){
                client.open(method,url,true);   
            }else{
                client.open(method,url);
            }

            client.onreadystatechange = function(){
                if(this.readyState === this.DONE){
                    if(this.status === 200){
                        resolve(this.response); 
                    }else{
                        reject(this);
                    }
                }
            };

            client.responseType = "json";
            
            for(var key in headers){
                client.setRequestHeader(key,headers[key]);
            }
            client.send(data);
        });
        return promise;
    }

    var getUptoken = function(downtoken_url,uptoken){
        if(uptoken!==undefined){
            return new RSVP.Promise(function(resolve,reject){
                resolve(uptoken)
            })    
        }else{
            return doRequest(downtoken_url,"GET",{},{"Content-type":"application/x-www-form-urlencoded"}).then(function(data){
                return data.uptoken;
            },function(error){
                throw error;
            });
        }
    }

    var doFileUpload = function(filedata,token){
        var url = "http://up.qiniu.com/putb64/-1";
        var headers = {
            "Content-Type":"application/octet-stream",
            "Authorization":"UpToken "+token
        }
        return doRequest(url,"POST",filedata,headers).then(function(ret){
            return ret;
        },function(error){
            throw error;
        });
    }

    QiniuFileUploader = function(options){
        this.downtokenUrl = options === undefined ? "":options.downtokenUrl;
    }

    QiniuFileUploader.prototype.upload = function(file,uptoken){
        var successFunc = function(filedata){
            return function(uptoken){
                return doFileUpload(filedata,uptoken);
            }
        }
        return getUptoken(this.downtokenUrl,uptoken)
                .then(successFunc(file));
    }
})();