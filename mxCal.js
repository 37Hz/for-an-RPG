/*軽い説明
a = new Matrix([[1,2],[3,4]]);  //新たな行列クラスの要素を作成します。
a.me()                          //行列クラスの要素を2次元配列として表示します。
a.t()                           //aの転置行列を返します。
a.det()                         //aの行列式の値を返します。
a.cof()                         //aの余因子行列を返します。
a.inv()                         //aの逆行列を返します。
a.pinv()                        //aの(ムーア·ペンローズの)疑似逆行列を返します。
mxImul(a,2)                     //aの2倍を返します。
mxSum(a,b)                      //aとbの和を返します。
mxMul(a,b)                      //aとbの行列積を返します。
dot(a,b)                        //aとbのドット積を返します。
cross(a,b)                      //aとbのクロス積を返します。
*/

//分数クラスで使用しました。
function gcd(num1, num2) {return Math.abs((num2 ===0) ? num1 : gcd(num2, num1 % num2))};
function lcm(num1, num2) {return Math.abs(num1*num2/gcd(num1,num2))};

//計算誤差軽減用の分数クラスです。i,piを含む記号には未対応です。
class Fraction{
    constructor(value){
        if (value instanceof Fraction) {
            [this.valNum, this.valDenom] = [value.valNum, value.valDenom]
        } else if (String(value).includes("/")) {
            [this.valNum, this.valDenom] = String(value).split("/",2)} 
        else {
            [this.valNum, this.valDenom] = [String(value),"1"]
        };
        this.reduction()
        };

    //myself及びmeを使うことで分数を文字列として表示します。
    myself(notation = 0) {
        if (notation === 0) {return Number(this.valNum/this.valDenom)}
        else {return `${this.valNum}/${this.valDenom}`};
    };
    me(notation){return this.myself(notation)};

    //通分です。
    reduction() {
    if (this.valNum.toString().includes(".") || this.valDenom.toString().includes(".")) {
        const tDpl = Math.max((this.valNum.toString().split(".")[1] || "").length,(this.valDenom.toString().split(".")[1] || "").length);
        [this.valNum, this.valDenom] = [this.valNum, this.valDenom].map(val =>String(Number(val) * 10 ** tDpl));
    };
    [this.valNum, this.valDenom] = [this.valNum, this.valDenom].map(val => String(Number(val)/gcd(this.valNum, this.valDenom)));
    };

    //逆数です。
    reciprocal() {
        return new Fraction(`${this.valDenom}/${this.valNum}`)
    };

    abs() {
        return new Fraction(`${Math.abs(this.valNum)}/${Math.abs(this.valDenom)}`)
    };
};

//分数クラス用の四則演算です。
function fractCal(fraction1, fraction2, operator = "+"){
    if (!(fraction1 instanceof Fraction && fraction2 instanceof Fraction)) {return fractCal(new Fraction(fraction1),new Fraction(fraction2),operator);};
    if (!["+","-","*","/"].includes(operator)) {throw new Error("無効な演算子")};
    let [num, denom] = [0,0]
    if (operator === "+") {denom = lcm(fraction1.valDenom,fraction2.valDenom); num = fraction1.valNum * (denom / fraction1.valDenom) + fraction2.valNum * (denom / fraction2.valDenom);
    }else if (operator === "-") {denom = lcm(fraction1.valDenom,fraction2.valDenom); num = fraction1.valNum * (denom / fraction1.valDenom) - fraction2.valNum * (denom / fraction2.valDenom);        
    }else if (operator === "*") {denom = fraction1.valDenom * fraction2.valDenom; num = fraction1.valNum * fraction2.valNum;
    }else if (operator === "/") {denom = fraction1.valDenom * fraction2.valNum; num = fraction1.valNum * fraction2.valDenom;};
    [num, denom] = [num, denom].map(val => val / gcd(num, denom))
    return new Fraction(`${num}/${denom}`);
};

//行列クラスです。
class Matrix{
    constructor(matrix){
        if (matrix instanceof Matrix) {this.matrix = matrix.matrix.map(row => row.map(val => val));return void(0)};
        if (matrix[0] === undefined) {this.matrix = [[new Fraction("0")]];return void(0)};
        if (!(Array.isArray(matrix) && Array.isArray(matrix[0]))) {throw new Error("入力は2次元配列である必要があります。")};
        if (!matrix.every(row => Array.isArray(row) && row.length === matrix[0].length)) {throw new Error("入力が行列になりません。")}
        this.matrix = matrix.map(row => row.map(val => new Fraction(val)));
    };

    //myself及びmeを使うことで行列を2次元配列として表示します。
    myself(notation = 0){
        return this.matrix.map(row => row.map(val => val.myself(notation)))
    };
    me(notation){return this.myself(notation)};

    //転置行列です。
    transpose(){
        return new Matrix(this.matrix[0].map((_, i) => this.matrix.map(row => row[i])));
    };
    t(){return this.transpose()};

    //行列式です。
    determinant(){  
        if (this.matrix.length !== this.matrix[0].length) {throw new Error("入力は正方行列であるべきです。");};
        if (this.matrix.length === 1) {return this.matrix[0][0];};
        if (this.matrix.length === 2) {return fractCal(fractCal(this.matrix[0][0],this.matrix[1][1],"*"),fractCal(this.matrix[0][1],this.matrix[1][0],"*"),"-")};
        return this.matrix[0].reduce((sum, val, col) => {
        const sgn = new Fraction((col % 2 === 0 ? 1 : -1))
        const subMatrix = new Matrix(this.matrix.slice(1).map(row => row.filter((_, j) => j !== col)));
        return (val.valNum === 0) ? sum : fractCal(sum,fractCal(sgn,fractCal(val,subMatrix.determinant(),"*"),"*"),"+")
        }, 0);
    };
    det(){return this.determinant().myself()};

    //余因子です。
    cofactor(row, col){
        const sgn = new Fraction(((row + col) % 2 === 0) ? 1 :-1);
        const subMatrix = new Matrix(this.matrix
        .filter((_, i) => i !== row)
        .map((row => row.filter((_, j) => j !== col))));
        return fractCal(sgn,subMatrix.determinant(),"*");
    };

    //余因子行列です。
    cofactorMatrix(){
        if (this.matrix.length !== this.matrix[0].length) {throw new Error("入力は正方行列であるべきです。")};
        return new Matrix(this.matrix.map((row, i) => row.map((_, j) => new Matrix(this.matrix).cofactor(i, j)))).transpose();
    };
    cof(){return this.cofactorMatrix()};

    //逆行列です。
    inverseMatrix(){
        if (this.matrix.length !== this.matrix[0].length) {throw new Error("入力が正方行列であるべきです。")};
        if (this.matrix.length == 1) {return new Matrix([[this.matrix[0][0].reciprocal()]])};
        const det = this.determinant()
        if (det.valNum === "0") {return void(0);};
        return new Matrix(this.cofactorMatrix().matrix.map(row => row.map(val => fractCal(new Fraction(val),det,"/"))));
    };
    inv(){return this.inverseMatrix()};

    //ムーア·ペンローズの疑似逆行列です。
    pseudoInverseMatrix(){
        const tmx = matrixMultiply(this,this.transpose());
        if (tmx.determinant().valNum === "0") {return void(0);};
        return matrixMultiply(this.transpose(),tmx.inverseMatrix());
    };
    pinv(){return this.pseudoInverseMatrix()};
};

//行列の実数倍です。
function matrixIntegralMultiply(matrix, constNum = 1){
    if (!matrix instanceof Matrix || isNaN(constNum)) {throw new Error("行列と実数を入力してください。");};
    return new Matrix(matrix.matrix.map(row => row.map(val => fractCal(val,new Fraction(constNum),"*"))))};
function mxImul(matrix, constNum){return matrixIntegralMultiply(matrix, constNum)};

//行列の足し算です(噓)。
function matrixSum(matrix1, matrix2, operator = "+"){
    if(!(matrix1 instanceof Matrix && matrix2 instanceof Matrix)) {throw new Error("あの、少なくとも、行列を入れてください。");};
    if(!(matrix1.matrix.length === matrix2.matrix.length && matrix1.matrix[0].length === matrix2.matrix[0].length)) {throw new Error(`matrix1の大きさ(${matrix1.matrix.length},${matrix1.matrix[0].length})とmatrix2の大きさ(${matrix2.matrix.length},${matrix2.matrix[0].length})が一致しません。`);};
    return new Matrix(matrix1.matrix.map((row1,i1) => row1.map((val1,j1) => fractCal(val1,matrix2.matrix[i1][j1],operator))))
};
function mxSum(matrix1, matrix2, operator){return matrixSum(matrix1, matrix2, operator)};

//行列積です。
function matrixMultiply(matrix1, matrix2){
    if (!(matrix1 instanceof Matrix && matrix2 instanceof Matrix)) {return new Error("行列を入れてください。");};
    if (matrix1.matrix[0].length !== matrix2.matrix.length) {return new Error(`matrix1の列数(${matrix1.matrix[0].length})とmatrix2の行数(${matrix2.matrix.length})が違います!!!`);};
    return new Matrix(matrix1.matrix.map(row => matrix2.matrix[0].map((_, j) => 
    row.reduce((sum, val, i) => (val.valNum === 0) ? sum : fractCal(sum,fractCal(val,matrix2.matrix[i][j],"*"),"+"), 0))))
};
function mxMul(matrix1, matrix2){return matrixMultiply(matrix1, matrix2)};

//内積です。
function innerProduct(matrix1, matrix2){
    if (!(matrix1 instanceof Matrix && matrix2 instanceof Matrix)) {return new Error("行列を入れてください。");};
    if(!(matrix1.matrix.length === matrix2.matrix.length && matrix1.matrix[0].length === matrix2.matrix[0].length)) {throw new Error(`matrix1の大きさ(${matrix1.matrix.length},${matrix1.matrix[0].length})とmatrix2の大きさ(${matrix2.matrix.length},${matrix2.matrix[0].length})が一致しません。`);};
    return matrix1.matrix.reduce((sum,row,i) => 
        fractCal(sum,row.reduce((rowSum, val,j) => 
        (val.valNum === 0) ? rowSum : fractCal(rowSum,fractCal(val,matrix2.matrix[i][j],"*"),"+"),0),"+"),0)
};
function dot(matrix1, matrix2){return innerProduct(matrix1, matrix2).myself()};

//外積のようなものか何かです。
function outerProduct(...args){
    if(!(args.every(mx => mx instanceof Matrix))) {throw new Error("引数は行列クラスである必要があります。")};
    if (!(args.every(mx => mx.matrix.length === 1))) {throw new Error("1行の行列(即ち横ベクトル)にしか対応してません。")}
    if(!(args.every(mx => mx.matrix[0].length === args[0].matrix[0].length))) {throw new Error(`ベクトルの長さ(${args.map(mx => mx.matrix[0].length)})を揃えてください。`)};
    if (!(args[0].matrix[0].length === args.length + 1)) {throw new Error("ベクトルの長さを(ベクトルの数+1)にしてください。")};
    const mx = new Matrix(args.map(arg => arg.matrix[0])).transpose();
    return new Matrix([mx.matrix.map((row,i) => mx.cofactor(i,args.length))]);
};
function outer(...args){return outerProduct(...args).myself()[0]};

//クロス積です。
function crossProduct(...args){
    if(!(args.every(mx => mx instanceof Matrix))) {throw new Error("引数は行列クラスである必要があります。")};
    if (!(args.every(mx => mx.matrix.length === 1))) {throw new Error("1行の行列(即ち横ベクトル)にしか対応してません。")}
    if (!(args.every(mx => mx.matrix[0].length === args[0].matrix[0].length))) {throw new Error(`ベクトルの長さ(${args.map(mx => mx.matrix[0].length)})を揃えてください。`)};
    if (args[0].matrix[0].length === args.length) {
        return outerProduct(...args.map(arg => new Matrix([arg.matrix[0].concat(new Fraction("0"))]))).myself()[0].splice(-1)[0]
    } else if(args[0].matrix[0].length === args.length + 1){
        return outerProduct(...args).myself()[0].splice(-1)[0]
    }
    else {throw new Error("ベクトルの長さをベクトルの数、又は(ベクトルの数+1)にしてください。")};
};
function cross(...args){return outerProduct(...args)}