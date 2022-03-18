import replace from "@rollup/plugin-replace"; 
import resolve from "@rollup/plugin-node-resolve"; 
import commonjs from "@rollup/plugin-commonjs"; 
import {terser} from "rollup-plugin-terser"; 
 
export default { 
	input: "./src/algowim/algowim.js", 
	output: { 
		file: "./dist/algowim.js", 
		format: "iife", 
		name: "AlgoWim",
		sourcemap: false
	}, 
	plugins: [ 
		commonjs(), 
		//require("@rollup/plugin-buble")(),  		
		terser({
			safari10: true // SAFARI bug: https://bugs.webkit.org/show_bug.cgi?id=171041, https://webkit.org/blog/7622/release-notes-for-safari-technology-preview-31/
			,keep_classnames:true
			// ,mangle:{		
			// 	// properties:{
			// 		//keep_quoted:true
			// 		// reserved: ["Bridge"]					
			// 	// }
			// }
			// ,output: {
			// 	beautify: true
			// }
		}), 
		replace({ 
			preventAssignment: true,
			"$version": "1.0.0-"+Math.floor((new Date()).getTime() / 1000) // Major.Minor.Patch-Build
		}), 
		resolve({ 
			// moduleDirectories: ["./src/algowim"],
			browser: true 
		}), 
	] 
};
