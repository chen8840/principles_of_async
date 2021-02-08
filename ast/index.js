//babel 核心库，用来实现核心转换引擎
const babel = require('@babel/core')
//类型判断，生成AST零部件
const types = require('babel-types')

const fs = require('fs');

var __generatorCode = `var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
`;

var origin = fs.readFileSync('./input.js', {encoding: 'utf-8'});

let originObj = babel.transform(origin, {ast: true});

let originAst = originObj.ast;

function findGeneratorFunc() {
  if (originAst.program.body[0].generator) {
    return originAst.program.body[0];
  }
  return null;
}

var originGeneratorFunc = findGeneratorFunc();

function generateSwitchCaseStatementsArray() {
  var statements = originGeneratorFunc.body.body;
  var ret = [];
  var entry = [];
  for(let i = 0; i < statements.length; ++i) {
    var statement = statements[i];
    if (statement.type === 'ExpressionStatement') {
      var expression = statement.expression;
      if (expression.type === 'YieldExpression') {
        entry.push(statement);
        ret.push(entry);
        entry = [];
      } else {
        entry.push(statement);
      }
    } else {
      entry.push(statement);
    }
  }
  if (entry.length > 0) {
    ret.push(entry);
  }
  return ret;
}

var switchCaseStatementsArray = generateSwitchCaseStatementsArray();

const genCode = `
function gen() {
  return __generator(this, function (_a) {
    __replace__;
  });
}
`;

let visitor = {
  ExpressionStatement(path) {
    if (path.node.expression.name === '__replace__') {
      var switchExpress = types.memberExpression(
        types.identifier('_a'),
        types.identifier('label')
      );
      var switchCases = [];
      for (let i = 0; i < switchCaseStatementsArray.length; ++i) {
        var consequent = [];
        var entry = switchCaseStatementsArray[i];
        if (i !== 0) {
          entry.unshift(types.expressionStatement(
            types.callExpression(
              types.memberExpression(
                types.identifier('_a'),
                types.identifier('sent')
              ),
              []
            )
          ));
        }

        for (let j = 0; j < entry.length; ++j) {
          var lastStateMent = entry[entry.length - 1];
          var stepType = 2;
          if (lastStateMent.type === 'ExpressionStatement' && lastStateMent.expression.type === 'YieldExpression') {
            var expression = lastStateMent.expression;
            stepType = 4; /*yield*/
            var returnStatement = types.returnStatement(
              types.arrayExpression(
                [
                  types.numericLiteral(stepType),
                  expression.argument
                ]
              )
            );
            consequent = [...entry.slice(0, entry.length - 1), returnStatement];
          } else if (lastStateMent.type === 'ReturnStatement') {
            stepType = 2; /*return*/
            var returnStatement = types.returnStatement(
              types.arrayExpression(
                [
                  types.numericLiteral(stepType),
                  lastStateMent.argument
                ]
              )
            );
            consequent = [...entry.slice(0, entry.length - 1), returnStatement];
          } else {
            stepType = 2; /*return*/
            var returnStatement = types.returnStatement(
              types.arrayExpression(
                [
                  types.numericLiteral(stepType)
                ]
              )
            );
            consequent = [...entry, returnStatement];
          }
        }

        var switchCase = types.switchCase(types.numericLiteral(i), consequent);
        switchCases.push(switchCase);
      }
      var switchStatement = types.switchStatement(switchExpress, switchCases);
      path.replaceWith(switchStatement);
    }
  }
};

let generateFunc = babel.transform(genCode, {
  plugins: [{
    visitor
  }],
  ast: true
});


var beforeGenerateFuncCode = `${__generatorCode}
${origin.substring(0, originGeneratorFunc.start)}
`;

var afterGenerateFuncCode = `
${origin.substring(originGeneratorFunc.end)}
`;

console.log(generateFunc.code);

fs.writeFileSync('./output.js', `${beforeGenerateFuncCode}${generateFunc.code}${afterGenerateFuncCode}`);

