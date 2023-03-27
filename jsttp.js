//构建一个包装器与http://localhost:9801/api/sstp/v1通信。
//发信方法：Content-Type: text/plain HTTP/1.1でPOST
//收信方法：HTTP/1.1 200 OKのContent-Type: text/plain

//定义sttp报文类
/*
sttp报文格式：
SEND SSTP/1.1
Charset: UTF-8
Sender: SSTPクライアント
Script: \h\s0テストー。\u\s[10]テストやな。
Option: notranslate
由一行固定的报文头和一组可选的报文体组成，以\r\n换行，结尾以\r\n\r\n结束。
*/
class sttp_info_t {
	#head;
	#unknown_lines;

	//构造函数
	constructor(info_head, info_body, unknown_lines) {
		this.set_head(info_head);
		this.#unknown_lines = unknown_lines;
		if(info_body){
			if(info_body.keys)
				for(var key of info_body.keys())
					this[key] = info_body.get(key);
			else if(typeof(info_body) == "object")
				for(var key in info_body)
					this[key] = info_body[key];	
			//否则记录错误
			else
				console.error("sttp_info_t: info_body is not a Map or object: " + typeof(info_body));
		}
	}
	//自字符串报文构造
	static from_string(str) {
		var thehead = str.split("\r\n")[0];
		var thebody = new Map();
		var body = str.split("\r\n");
		body.shift();
		var unknown_lines = [];
		var spliter_list = [": ", String.fromCharCode(1)];
		for (var i = 0; i < body.length; i++) {
			var line=body[i];
			if(line == "")
				continue;
			var spliter = "";
			for (var j = 0; j < spliter_list.length; j++)
				if (line.indexOf(spliter_list[j]) != -1) {
					spliter = spliter_list[j];
					break;
				}
			if (spliter != "") {
				var key = line.split(spliter)[0];
				var value = line.replace(key + spliter, "");
				thebody.set(key, value);
			}
			else{
				unknown_lines.push(body[i]);
			}
		}
		return new sttp_info_t(thehead, thebody, unknown_lines);
	}
	//设置报文头
	set_head(head) {
		if(head == undefined)
			head = "NOTIFY SSTP/1.1";
		this.#head = head;
	}
	//获取报文体
	get_body() {
		var body = new Map();
		for(var key in this)
			body.set(key, this[key]);
		return body;
	}
	//获取未知行
	get_unknown_lines() {
		return this.#unknown_lines;
	}
	//获取报文头
	get_head() {
		return this.#head;
	}
	//获取报文
	to_string() {
		var str = this.#head + "\r\n";
		for (var key in this)
			str += `${key}: ${this[key]}\r\n`;
		str += "\r\n";
		return str;
	}
	//获取报头返回码
	return_code() {
		//比如：SSTP/1.4 200 OK，返回200
		var code_table = this.#head.split(" ");
		for(var i = 0; i < code_table.length; i++)
			if(!isNaN(code_table[i]))
				return parseInt(code_table[i]);
		return -1;
	}
};
//定义一个包装器
class jsttp_t {
	#headers;
	#default_info;
	#host;
	#server_url;

	constructor(sendername,host) {
		this.#headers = new Map();
		//初始化默认的host
		this.set_host(host);
		this.set_RequestHeader("Content-Type", "text/plain");
		//初始化默认的报文
		this.#default_info = new Map();
		this.set_default_info("Charset","UTF-8");
		this.set_sendername(sendername);
	}
	//set_RequestHeader
	set_RequestHeader(key, value) {
		if(value == null)
			delete this.#headers[key];
		else
			this.#headers[key] = value;
	}
	//设置默认报文
	set_default_info(info) {
		this.#default_info = info;
	}
	set_default_info(key, value) {
		if(value == null)
			delete this.#default_info[key];
		else
			this.#default_info[key] = value;
	}
	//修改host
	set_host(host) {
		if(host == undefined)
			host = "http://localhost:9801/api/sstp/v1";
		this.#host = host;
		this.#server_url = host.split("api/sstp")[0];
		this.set_RequestHeader("Origin", this.#server_url);
	}
	//修改sendername
	set_sendername(sendername) {
		if(sendername == undefined)
			sendername = "jsstp-client";
		this.#default_info["Sender"] = sendername;
	}
	#base_post(data, callback) {
		//使用fetch发送数据
		const param = {
			method: 'POST',
			headers: this.#headers,
			body: data
		};
		var call_base=(resolve, reject) => {
			fetch(this.#host, param).then(function(response) {
				if(response.status != 200)
					reject(response.status);
				else
					response.text().then(function(text) {
						resolve(sttp_info_t.from_string(text));
					});
			});
		}
		if(callback)
			call_base(callback, function(){});
		//如果callback不存在，返回一个promise
		if(callback == undefined)
			return new Promise(call_base);
	}
	//发送报文
	costom_send(sttphead, info, callback) {
		if (typeof (info) == "object") {
			//获取报文
			var data = new sttp_info_t();
			data.set_head(sttphead);
			for (var key in this.#default_info)
				data[key]=this.#default_info[key];
			for (var key in info)
				data[key]= info[key];
			//使用base_post发送
			return this.#base_post(data.to_string(), callback);
		}
		//否则记录错误
		else
			console.error("jsttp.send: wrong type of info: " + typeof(info));
	}
	//发送报文
	//SEND SSTP/1.4
	SEND(info, callback) {
		return this.costom_send("SEND SSTP/1.4", info, callback);
	}
	//NOTIFY SSTP/1.1
	NOTIFY(info, callback) {
		return this.costom_send("NOTIFY SSTP/1.1", info, callback);
	}
	//COMMUNICATE SSTP/1.1
	COMMUNICATE(info, callback) {
		return this.costom_send("COMMUNICATE SSTP/1.1", info, callback);
	}
	//EXECUTE SSTP/1.2
	EXECUTE(info, callback) {
		return this.costom_send("EXECUTE SSTP/1.2", info, callback);
	}
	//GIVE SSTP/1.1
	GIVE(info, callback) {
		return this.costom_send("GIVE SSTP/1.1", info, callback);
	}
	//根据type发送报文
	by_type(type) {
		return eval("this."+type).bind(this);
	}
};

var jsttp = new jsttp_t();
