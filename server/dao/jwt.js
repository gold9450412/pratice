//token  類似cookie 可以不用重新登入  直到token過期
var jwt = require('jsonwebtoken');
var secret = 'abcde';
exports.generateToken = function(id,res){
	let payload = {id:id,time:new Date()};
	
	let token = jwt.sign(payload,secret, {expiresIn: 60*60*24*120}); //120天更新token
	return token;

}

//驗證token
exports.verifyToken = function(e){

 let payload=-1;
	jwt.verify(e,secret,(err,result)=>{
		
		if(err){

			payload=0;
			 
			
		}else{

			payload=1;
			
			
		}
	});return payload;
	//return payload;
}