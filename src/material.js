import {		
			StandardMaterial,
			Color,
			CULLFACE_NONE,
			BLEND_NORMAL,
			FRESNEL_NONE,
			SPECULAR_PHONG
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
			const { color } = props;
	    	
			// Props
			this.color = new Color(fixFloat(color.r/255),fixFloat(color.g/255),fixFloat(color.b/255)); // rgb values in 0.0-1.0 scale

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
			this.material.emissive = this.color;
			this.material.cull = CULLFACE_NONE; // front and back face visible (https://developer.playcanvas.com/en/api/pc.Material.html#cull)
			this.material.update();

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