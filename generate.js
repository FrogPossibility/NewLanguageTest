const fs = require("fs").promises;
const { readFileSync } = require("fs");
const path = require("path");
const RUNTIME = readFileSync(path.join(__dirname, "runtime.js")).toString();

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.log("Please provide a file name.")
        return;
    }
    const astCode = (await fs.readFile(filename)).toString();
    const ast = JSON.parse(astCode);
    const jsCode = generate(ast);
    const baseDir = path.dirname(filename);
    const baseName = path.basename(filename, ".mrus.ast");
    const jsFilename = path.join(baseDir, `${baseName}.js`);
    await fs.writeFile(jsFilename, jsCode);
    console.log(`Wrote ${jsFilename}.`);
}

function generate(node) {
    if (node.type === "program") {
        return node.body.map(generate).join(";\n") + ";\n" + RUNTIME;
    } else if (node.type === "assignment") {
        const varName = node.var_name.value;
        const value = generate(node.value);
        return `let ${varName} = ${value}`;
    } else if (node.type === "function_call") {
        const sourceFunName = node.fun_name.value;
        const funName = sourceFunName === "if" ? "$if" : sourceFunName;
        const params = node.parameters.map(generate)
            .join(", ");
        return `${funName}(${params})`;
    } else if (node.type === "identifier") {
        return node.value;
    } else if (node.type === "number") {
        return String(node.value);
    } else if (node.type === "string") {
        return node.value;
    } else if (node.type === "function_definition") {
        const funName = node.fun_name.value;
        return generateFunction(node.body.statements, node.parameters, funName);
    } else if (node.type === "code_block") {
        return generateFunction(node.statements, node.parameters);
    } else if (node.type === "array_literal") {
        const items = node.items.map(generate).join(", ");
        return `[${items}]`;
    } else if (node.type === "set_literal") {
        const items = node.items.map(generate).join(", ");
        return `new Set([${items}])`;
    } else if (node.type === "dict_literal") {
        const entries = node.entries.map((entry) => {
            const [key, value] = entry;
            const keyExpr = generate(key);
            const valueExpr = generate(value);
            return `[${keyExpr}, ${valueExpr}]`;
        }).join(", ");
        return `new Map([${entries}])`;
    } else if (node.type === "if_statement") {
        const conditional = generate(node.conditional);
        const ifStatement = [
            `$if(${conditional}, `,
            `${generateFunction(node.consequent.statements, [])},`,
            `${generateFunction(node.alternate.statements, [])})`
        ].join("");
        return ifStatement;
    } else if (node.type === "regex"){
        return node.value;
    } else if (node.type === "comment") {
        const bodyComments = node.statements.map(statement => statement.value).join(' ');
        return `// ${bodyComments}`;
    } else {
        throw new Error(`Unknown node type: ${node.type}`);
    }
}

function generateBlock(node) {
    const statements = node.statements;
    const body = statements.map((statement, idx) => {
        return generate(statement);
    }).join(";\r\n") + ";";
    const indentedBody = indent(body);
    return `{\r\n${indentedBody}\r\n}`;
}

function generateFunction(statements, parameters, name = "") {
    const body = statements.map((statement, idx) => {
        const js = generate(statement);
        if (idx === statements.length - 1) {
            return `return ${js}`
        } else {
            return js;
        }
    }).join(";\r\n") + ";";
    const indentedBody = indent(body);
    const params = parameters.map(generate).join(", ");
    return `function ${name}(${params}) {\r\n${indentedBody}\r\n}`;
}

function indent(string) {
    return string.split("\r\n").map(line => "\t" + line).join("\r\n");
}

main().catch(err => console.log(err.stack));