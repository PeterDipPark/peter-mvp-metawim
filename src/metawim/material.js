import {		
			StandardMaterial,
			Color,
			CULLFACE_NONE,
			// TEST
			BLEND_PREMULTIPLIED,
			BLEND_NORMAL,
			BLEND_ADDITIVE,
			BLEND_SCREEN,
			FRESNEL_NONE,
			SPECULAR_PHONG,
			BLEND_MULTIPLICATIVE,
			Texture,
			PIXELFORMAT_R8_G8_B8_A8,
			BLENDMODE_ONE_MINUS_SRC_ALPHA,
			BLENDMODE_SRC_ALPHA
		} from 'playcanvas';

import { fixFloat } from './utils';

export default class Material {


	////////////////////////
	// CONSTRUCTOR
	////////////////////////
	
		/**
		 * [constructor description]
		 * @param  {...[type]} options.props [description]
		 * @return {[type]}                  [description]
		 */
		constructor({...props}) {
			
			// Super
			const { color, depth, graphicsDevice } = props;
	    	
			// Props
			this.color = new Color(fixFloat(color.r/255),fixFloat(color.g/255),fixFloat(color.b/255)); // rgb values in 0.0-1.0 scale
			this.depth = depth;
			this.graphicsDevice = graphicsDevice;

			// Init
			this.init();
	        
		}

		

	////////////////////////
	// INITIALIZE
	////////////////////////

		/**
		 * [init description]
		 * @return {[type]} [description]
		 */
		init() {

			// Create Material
			this.createMaterial();

		}

	////////////////////////
	// GETTERS / SETTERS
	////////////////////////
	
		/**
		 * [getMaterial description]
		 * @return {[type]} [description]
		 */
		getMaterial() {
			return this.material;
		}

		updateMaterial() {
			this.material.update();
		}

	////////////////////////
	// METHODS
	////////////////////////


		/**
		 * [createMaterial description]
		 * @return {[type]} [description]
		 */
		createMaterial() {

			this.material = new StandardMaterial();


			
			// ORIG:
				// this.material.emissive = this.color;
			// NEW 
				

					// DIFFUSE COLOR and OPACITV
					
						
						//this.material.opacity = 0.5; // opacity doesn't work with depthWrite/Test
						
						this.material.id = this.material.name = "blade"+this.depth;
						this.material.diffuse = this.color;
						this.material.depthTest = true; //true;
						this.material.depthWrite = true; //true;
						
						// this.material.instancingCount = 1;
						// this.material.onUpdateShader = function(options) {
						//     options.useInstancing = true;
						//     return options;
						// };

// this.material.onUpdateShader = function(options) {
//         options.useInstancing = true;
//         return options;
//     };
    
//     const transformVS = `

// out vec4 color;

// mat4 getModelMatrix() {
//     color = vec4(instance_line1.w, instance_line2.w, instance_line3.w, instance_line4.w);
//     return mat4(
//         vec4(instance_line1.xyz, 0.0), 
//         vec4(instance_line2.xyz, 0.0), 
//         vec4(instance_line3.xyz, 0.0), 
//         vec4(instance_line4.xyz, 1.0)
//     );
// }

// vec4 getPosition() {
//     dModelMatrix = getModelMatrix();
//     vec3 localPos = vertex_position;
//     vec4 posW = dModelMatrix * vec4(localPos, 1.0);
//     dPositionW = posW.xyz;
//     vec4 screenPos = matrix_viewProjection * posW;
//     return screenPos;
// }
// vec3 getWorldPosition() {
//     return dPositionW;
// }
// `;
    
//     const emissivePS = `

// in vec4 color;

// vec3 getEmission() {
//     return color.rgb;
// }
// `;
//     this.material.chunks.transformVS = transformVS;
//     this.material.chunks.emissivePS = emissivePS;

						// this.material.alphaToCoverage = true;
						// this.material.alphaTest = 0; //false; //true;

						// this.material.opacityFadesSpecular = false; // set if you want to set alphaFade instead of opacity

						// this.material.depthBias = 10*this.depth;
						// 
						// this.material.useMorphPosition = true;
						// this.material.useMorphNormal = true;
						// this.material.useInstancing = true;

					// TEXTURE
						
						/*
						// Create a 8x8x24-bit texture
							var texture = new Texture(this.graphicsDevice, {
							    width: 8,
							    height: 8,
							    format: PIXELFORMAT_R8_G8_B8_A8,
							    // premultiplyAlpha: true
							});
						// Fill the texture with a gradient
							// var pixels = texture.lock();
							// var count = 0;
							// for (var i = 0; i < 8; i++) {
							//     for (var j = 0; j < 8; j++) {
							//         pixels[count++] = i * 32;
							//         pixels[count++] = j * 32;
							//         pixels[count++] = 255;
							//     }
							// }
							// texture.unlock();
						// Set from IMG
							texture.setSource(document.getElementById("texture"));
							texture.diffuseMapChannel = "rgba";
						// Add to material
							this.material.diffuseMap = texture;
						*/
					
				// this.material.alphaToCoverage = true;
				// this.material.slopeDepthBias = 10*this.depth;
				
				//this.material.redWrite=this.material.greenWrite=this.material.blueWrite=this.material.alphaWrite=false;

				// this.material.alphaFade = 0.5;
				// this.material.opacityFadesSpecular = false;
				// this.material.blend = false;
				// this.material.blendSrc = BLENDMODE_SRC_ALPHA;
				// this.material.blendDst = BLENDMODE_ONE_MINUS_SRC_ALPHA;
				

				// this.material.emissiveTint = true;
				// this.material.emissive = this.color;
				// this.material.opacityTint = true;
				// slot.materials[name].opacity = 0; // use non-1 value so that opacity is included
				// slot.materials[name].opacityMap = texture;
				// slot.materials[name].opacityMapChannel = "a";
				// slot.materials[name].depthWrite = false;
				// slot.materials[name].cull = pc.CULLFACE_NONE;
				// slot.materials[name].blendType = pc.BLEND_PREMULTIPLIED;

			this.material.cull = CULLFACE_NONE; // front and back face visible (https://developer.playcanvas.com/en/api/pc.Material.html#cull)

			// OLD - not depth test/write
				// this.material.depthTest = false;
				// this.material.depthWrite = false;

			// NEW - render depth
				
				// // this.material.alphaToCoverage = true; ???				
				// this.material.slopeDepthBias = 10*this.depth;
				// this.material.depthBias = this.depth/10000;
									this.material.blendType = BLEND_PREMULTIPLIED; //BLEND_NORMAL;
				// this.material.alphaTest = true;
				// this.material.alphaWrite = true;
				// this.material.alphaToCoverage = false;

			// this.material.specular.set(1, 1, 1);			
			// this.material.bumpiness = 0;
			// this.material.shininess = 50;
			// this.material.metalness = 0.3;
			// this.material.useMetalness = true;
			
			this.material.update();

			// this.material.alphaTest = false;
			// this.material.blend = true;
			// 	this.material.blendSrc = BLENDMODE_SRC_ALPHA;
			// 	this.material.blendDst = BLENDMODE_ONE_MINUS_SRC_ALPHA;

			// 	this.material.update();

			return;

			// this.material.diffuse = this.color;
			// // This will disable blending (other option is to use layers: https://forum.playcanvas.com/t/solved-layer-problem-trying-to-put-and-entity-on-top-of-an-another/9153/15)
			// // this.material.depthTest = false;
			// // this.material.depthWrite = false;

			// this.material.specular.set(1, 1, 1);
			// this.material.blendType = BLEND_NORMAL;
			// this.material.fresnelModel = FRESNEL_NONE;
			// this.material.shadingModel = SPECULAR_PHONG;
			// this.material.bumpiness = 0;
			// this.material.shininess = 50;
			// this.material.metalness = 0.3;
			// this.material.useMetalness = true;
			// this.material.cull = CULLFACE_NONE; // front and back face visible (https://developer.playcanvas.com/en/api/pc.Material.html#cull)
			// this.material.update();

		}
	
}