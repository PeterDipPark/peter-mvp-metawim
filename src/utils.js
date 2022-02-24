
/**
 * [fixFloat description]
 * @param  {[type]} n [description]
 * @return {[type]}   [description]
 */
export const fixFloat = function(n) {
	return (Math.round((n)*1000)/1000);
}

/**
 * [sortObjectArrayByKey description]
 * @param  {[type]} array     [description]
 * @param  {[type]} key       [description]
 * @param  {[type]} direction [description]
 * @return {[type]}           [description]
 */
export const sortObjectArrayByKey = function(array, key, direction) {
  const sort =  direction.toLowerCase() === "desc" ? -1 : 1; 
  return array.sort((a, b) => (a[key] > b[key]) ? sort*1 : sort*-1);
}


/**
 * [sortArrayByNumericValue description]
 * @param  {[type]} array     [description]
 * @param  {[type]} direction [description]
 * @return {[type]}           [description]
 */
export const sortArrayByNumericValue = function(array, direction) {
  const sort =  direction.toLowerCase() === "desc" ? -1 : 1; 
  return array.sort((a, b) => (a > b) ? sort*1 : sort*-1);
}

/**
 * [normalizeRotationInputValue description]
 * @param  {[type]} pc_rot    [description]
 * @param  {[type]} pc_offset [description]
 * @return {[type]}           [description]
 */
export const normalizeRotationInputValue = function(pc_rot, pc_offset) {
  //return (pc_rot===0)?pc_offset:((pc_rot===360)?0:fixFloat(pc_offset-pc_rot));
  return (pc_rot===0||pc_rot===360)?pc_offset:fixFloat(pc_offset-pc_rot);
}

export const objectMap = function(obj, fn) {
  return Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )
}

/**
 * [htmlToDomFragment description]
 * @param  {[type]} s [description]
 * @return {[type]}   [description]
 */
export const htmlToDomFragment = function(s) {
  var t = document.createElement('div');
  //if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
  if (isIE()) {
    t.innerHTML = '<br>' + s;
    t.removeChild(t.firstChild);
  } else {
    t.innerHTML = s;
  }
  if (t.childNodes.length == 1) {
    return (t.removeChild(t.firstChild));
  } else {
    var fragment = document.createDocumentFragment();
    while (t.firstChild) {
      fragment.appendChild(t.firstChild);
    }
    return fragment;
  }
}

/**
 * [isIE description]
 * @return {Boolean} [description]
 */
const isIE = function(){
  var ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object
  var msie = ua.indexOf('MSIE '); // IE 10 or older
  var trident = ua.indexOf('Trident/'); //IE 11
  return (msie > 0 || trident > 0);
}