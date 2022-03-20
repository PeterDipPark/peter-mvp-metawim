
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

/**
 * [objectMap description]
 * @param  {[type]}   obj [description]
 * @param  {Function} fn  [description]
 * @return {[type]}       [description]
 */
export const objectMap = function(obj, fn) {
  return Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )
}

/**
 * [exportJson description]
 * @param  {[type]} name [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export const exportJson = function(name, data) {
    const hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
    hiddenElement.target = '_blank';
    hiddenElement.download = name+".json";
    hiddenElement.click();
}

/**
 * [description]
 * @return {[type]} [description]
 */
export const importJson = async function() {

    return new Promise(async function(resolve, reject) {
        
        let inputFile = document.createElement("input");
        inputFile.type = "file";
        inputFile.multiple = false;
        inputFile.style.display = "none";
        document.body.appendChild(inputFile);               
    
        // Input Change listener
        inputFile.addEventListener("change", function(e) {
          var file = e.currentTarget.files[0];
    
          // Read File
          if (file.type && file.type !== "application/json") {
            console.log('File is not supported.', file.type, file);
            reject("File is not supported.");
            return;
          }
    
          const reader = new FileReader();
          reader.addEventListener('load', (event) => {
            const dataSource = event.target.result;
    
            try {
              inputFile.parentNode.removeChild(inputFile);
              const dataObject = JSON.parse(dataSource);               
              resolve({
                name: file.name
                ,data: dataObject
              });
            } catch(error) {
              console.error("Faild to parse the file.", error);
              reject("Failed to parse the file.");
            }
            
          });
          reader.readAsText(file);      
          
        }); 
        // open dialog              
        inputFile.click(); 
    
    });

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