export class Helpers {
    // min and max included
    public static getRandom(min:number, max:number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public static getNumericDifferences<T>(change: T, orig:T){
        var cd = new Object() as T;
        if (!this.isObject(change))
        {
            Object.keys(change).forEach(key => {
                if (!isNaN(Number(change[key]))) {
                    cd[key] = //Math.abs(
                        change[key] - (orig[key] || 0) || 0; //PREVENT UNDEFINED, FFS
                    //);
                }
            });
        }
        return cd;
    }

    public static extractToDictionary(obj:any, dict:any[] = null, rootStr:string = ""):{name:string, value:any}[] {
        Object.keys(obj).forEach(key => {
            var value = obj[key];
            if (this.isObject(value)) {
                this.extractToDictionary(value, dict, rootStr + "." + key);
            }
            else {
            var objDict = Object.keys(value).map(
                key => ({
                name: rootStr.length != 0 ? rootStr + "." + key : key,
                value: obj[key],
            }));
            if (!dict)
                dict = new Array<{name:string, value:any}>();
            objDict.forEach(p => {
                dict.push(p)
            });
        }
        });

        return dict;
    }

    private static isObject(o: any) {
        return o instanceof Object && o.constructor === Object;
    }
}
