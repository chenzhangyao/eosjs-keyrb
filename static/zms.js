self.importScripts('eosjs-ecc.js');
var t = (function() {
		var in_arr = function (arr,rep) { 
		　　for (let i in arr) { 
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
var qf = [];	//筛选数组
var ss = function(pkArr_,searchFrom,searchTo){
		for (var i = searchFrom; i < searchTo; i++) 
		{
			if(t.in_arr(qf,pkArr_[i].toUpperCase()))
			{
				if(i < searchTo - 1) ss(pkArr_, i + 1 , searchTo);
				
				if(t.IsUpper(pkArr_[i]))
				{
					var pkArr_ = pkArr_.concat();
					pkArr_.splice(i,1,pkArr_[i].toLowerCase());
					ck(pkArr_.join(''));
				}
				else
				{
					var pkArr_ = pkArr_.concat();
					pkArr_.splice(i,1,pkArr_[i].toUpperCase());
					ck(pkArr_.join(''));
				}
			}
		}
	};
var tn = 0;
var ck = function(strKey){
		if(++tn % 1421 == 0)
		{
			postMessage(tn);
		}
		if (eosjs_ecc.isValidPrivate(strKey)) 
		{
			postMessage(strKey);
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
		qf = uq(arr[2].toUpperCase().split(''));
		this.ss( arr[0].split(''), parseInt(arr[1][0] - 1), parseInt(arr[1][1]) );
	}
	postMessage("done!");
	self.close();
}