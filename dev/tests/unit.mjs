/// <reference path="../../src/jsstp.d.ts" />
import jsstp from "../../src/jsstp.mjs";
//
jsstp.then(async ()=>{
	console.log("jsstp test");
	console.log((await jsstp.get_fmo_infos()).to_string());

	console.log((await jsstp.OnTest()).to_string());
	console.log(await jsstp.has_event("OnTest"));

	jsstp.On_ShioriEcho.GetName.then(({GhostName})=>
		GhostName=="Taromati2"?
			console.log("cool Taromati2!"):
			console.log(GhostName||"ghost not support On_ShioriEcho.GetName")
	);

	console.log(JSON.stringify(await jsstp.On_ShioriEcho('1000-7'),null,'\t'));
}).catch((e)=>
	e?
		console.error(e):
		console.log("none ghost was found")
);
