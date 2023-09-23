import child_process from 'child_process';
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import babelParser from '@babel/parser';
import { ImportDeclaration, is, isType, isImportDeclaration, Statement, VariableDeclaration, isVariableDeclaration, CallExpression } from '@babel/types';

function read() {
    
}

// https://github.com/indatawetrust/package-usage-analyzer/blob/main/lib/index.js
function analyzeUsage() {
    const allPackages = new Map<string, number>();
    const files = globSync('src/**/*.{j,t}{s,sx}', { ignore: '**/node_modules/**' });
    for (const file of files) {
        const contents = fs.readFileSync(file, 'utf-8');
        const ast = babelParser.parse(contents, {
            errorRecovery: true,
            sourceType: "unambiguous",
            plugins: [
              "jsx"
            ]
        });

        const importDeclarations = ast.program.body.filter<ImportDeclaration>((node: Statement): node is ImportDeclaration => isImportDeclaration(node));
        const varDeclarations = ast.program.body.filter<VariableDeclaration>((node: Statement): node is VariableDeclaration => isVariableDeclaration(node));
        varDeclarations[0].declarations[0].type === 'VariableDeclarator'
varDeclarations[0].declarations[0].id.type === 'Identifier' || 'ObjectPattern'
varDeclarations[0].declarations[0].init?.type === 'CallExpression'
const callExpression = varDeclarations[0].declarations[0].init as unknown as CallExpression;
callExpression.callee.type === 'Identifier'
callExpression.callee?.name === 'require';
callExpression.arguments[0].type === 'StringLiteral';
callExpression.arguments[0].value == 'fs';

        for (let i of importDeclarations) {
            let packageName = i.source.value
            const usagePackages = i.specifiers.map(i => i.imported ? i.imported.name : i.local.name)
            const usageCount = usagePackages.length;

            if (packageName.match(/^[\.\\]/)) {
                packageName = path.relative(currentDir, path.join(path.dirname(file), packageName))
            }
        }
    }
}

type Commit = {
    hash: string;
    date: string;
    author: string;
    message: string;
};

function getCommits() {
    const result = child_process.execSync('git rev-list --first-parent --no-merges --date=short --format="%H|%cd|%an|%s" ac5a8');
    const lines = result.toString().split(/[\r\n]+/);
    const commits = lines.reduce<Commit[]>((result, commit) => {
        commit = commit.trim();
        if (commit.startsWith('commit') || commit === '') {
            return result;
        }

        const [hash, date, author, ...message] = commit.split('|');
        result.push({
            hash,
            date,
            author,
            message: message.join('|')
        });
        return result;
    }, []);

    return commits;
}

function checkoutHash(hash: string) {
    child_process.execSync(`git checkout ${hash}`);
}

function run() {
    const commits = getCommits();
    for (const commit of commits) {
        console.log(`(${commit.hash.substring(0, 5)}): On ${commit.date}, ${commit.author} committed ${commit.message}`);
        checkoutHash(commit.hash);
        const report = analyzeUsage();
    }
}

run();
