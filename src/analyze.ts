
import fs from 'fs';
import { globSync } from 'glob';
import { parse } from '@babel/parser';
import { ImportDeclaration, is, isType, isImportDeclaration, Statement, VariableDeclaration, isVariableDeclaration, CallExpression, ObjectPattern, isImportSpecifier, isImportDefaultSpecifier, isImportNamespaceSpecifier, isStringLiteral, isIdentifier, ExportDeclaration, isExportDeclaration } from '@babel/types';

// const allPackages = new Map<string, number>();
// const files = globSync('src/**/*.{j,t}{s,sx}', { ignore: '**/node_modules/**' });
// for (const file of files) {
//     const contents = fs.readFileSync(file, 'utf-8');

// https://github.com/indatawetrust/package-usage-analyzer/blob/main/lib/index.js
export function analyzeUsage(contents: string) {
    const ast = parse(contents, {
        errorRecovery: true,
        sourceType: "unambiguous",
        plugins: [
            "jsx",
            "typescript"
        ]
    });

    const importDeclarations = ast.program.body.filter<ImportDeclaration>((node: Statement): node is ImportDeclaration => isImportDeclaration(node));
    for (let importDec of importDeclarations) {
        const packageName = importDec.source.value;
        console.log('Import declaration: ', packageName);
        for (let specifier of importDec.specifiers) {
            console.log('Type: ', specifier.type);
            console.log('Local: ', specifier.local.name);
            
            if (isImportSpecifier(specifier)) {
                console.log('Kind: ', specifier.importKind);
                console.log('Imported Type: ', specifier.imported.type);
                
                if (isStringLiteral(specifier.imported)) {
                    console.log('Imported Value: ', specifier.imported.value);
                }
                else if (isIdentifier(specifier.imported)) {
                    console.log('Imported Identifier: ', specifier.imported.name);
                }
            }
        }
    }

    const exportDeclarations = ast.program.body.filter<ExportDeclaration>((node: Statement): node is ExportDeclaration => isExportDeclaration(node));

    const varDeclarations = ast.program.body.filter<VariableDeclaration>((node: Statement): node is VariableDeclaration => isVariableDeclaration(node));
//         varDeclarations[0].declarations[0].type === 'VariableDeclarator'
// varDeclarations[0].declarations[0].id.type === 'Identifier' || 'ObjectPattern'
// const objPattern = (varDeclarations[0].declarations[0].id as ObjectPattern);
// objPattern.properties[0].type === 'ObjectProperty';
// objPattern.properties[0].key // type: "Identifier", name: "a"
// varDeclarations[0].declarations[0].init?.type === 'CallExpression'
// const callExpression = varDeclarations[0].declarations[0].init as unknown as CallExpression;
// callExpression.callee.type === 'Identifier'
// callExpression.callee?.name === 'require';
// callExpression.arguments[0].type === 'StringLiteral';
// callExpression.arguments[0].value == 'fs';

    // for (let i of importDeclarations) {
    //     let packageName = i.source.value
    //     const usagePackages = i.specifiers.map(i => i.imported ? i.imported.name : i.local.name)
    //     const usageCount = usagePackages.length;

    //     if (packageName.match(/^[\.\\]/)) {
    //         packageName = path.relative(currentDir, path.join(path.dirname(file), packageName))
    //     }
    // }
}

const contents = fs.readFileSync('./sample/index.ts');
try {
    analyzeUsage(contents.toString());
}
catch(e) {
    console.error(e);
    process.exit(1);
}
