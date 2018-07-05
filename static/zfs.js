self.importScripts('eosjs-ecc.js');
var t = (function() {
		var in_arr = function (arr,rep) { 
		　　for (var i in arr) { 
			　　if (arr[i] == rep) { 
			　　	return true; 
				}
			  }
			  return false; 
			};
		var IsUpper = function(code) {
			return code === code.toUpperCase()
		}
		return {
			in_arr : in_arr,
			IsUpper : IsUpper
		}
	})();
var spk = [];	//已验证数组
var ss = function(pkArr_,searchFrom,searchTo,zimu){
		for (var i = searchFrom; i < searchTo; i++) 
		{
			for(var a = 0; a <= 25; a++)
			{
				var pkArr_2 = pkArr_.concat();
				if( a <= 9 && a != 0 )
				{
					pkArr_2.splice(i,1,a);
					if(zimu > 1) {
						ss( pkArr_2, i + 1, searchTo, zimu - 1);
					}
					else {
						ck(pkArr_2.join(''));
					}
				}
				var BigI = String.fromCharCode((65+a));
				if( BigI != 'I' &&  BigI != 'O' ){
					pkArr_2.splice(i,1,BigI);
					if(zimu > 1) {
						ss( pkArr_2, i + 1, searchTo, zimu - 1);
					}
					else {
						ck(pkArr_2.join(''));
					}
				}
				var SmallI = String.fromCharCode((97+a));
				if( SmallI != 'l' ){
					pkArr_2.splice(i,1,SmallI);
					if(zimu > 1) {
						ss( pkArr_2, i + 1, searchTo, zimu - 1);
					}
					else {
						ck(pkArr_2.join(''));
					}
				}
			}
		}
	};
var ck = function(strKey){
		if (!t.in_arr(spk,strKey) && eosjs_ecc.isValidPrivate(strKey)) 
		{
			postMessage(strKey);
			spk.push(strKey);
		}
	};
var uq = function(arr) {
	    var result = [], hash = {};
	    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
	        if (!hash[elem]) {
	            result.push(elem);
	            hash[elem] = true;
	        }
		}
	    return result;
	};
onmessage = function(e){
	if(e.data.length === 0)
	{
		ck('test');
	}
	else
	{
		var arr = e.data;
		var z = parseInt(arr[2]);
		do{
			ss( arr[0].split(''), parseInt(arr[1][0] - 1), parseInt(arr[1][1]) , z);
			z++;
		}
		while(z <= (parseInt(arr[1][1]) - parseInt(arr[1][0]) + 1))
	}
	postMessage("done!");
	self.close();
}