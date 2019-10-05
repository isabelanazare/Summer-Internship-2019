export default class ParameterParser {
    constructor(){

    }

    TryParseInt(str, defaultValue) {
        var retValue = defaultValue;
        if(str !== null) {
            if(str.length > 0) {
                if (!isNaN(str)) {
                    retValue = parseInt(str);
                }
            }
        }
        return retValue;
   }

   isJSON(str) {
       try {
           JSON.parse(str);
       } catch(ex){
           return false;
       }
       return true;
   }

   parseJSON(str){
       return JSON.parse(str);
   }

    TryParseIntParams(params) {

        if(params === null)
            return [];

        let result = [];
        params.forEach(param => {
            let intParam = this.TryParseInt(param, param);
            result.push(intParam);

        });

        return result;

    }
}