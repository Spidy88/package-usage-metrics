import child_process from 'child_process';
import fs from 'fs';
import { globSync } from 'glob';
import babelParser from '@babel/parser';

function read() {
    
}

// https://github.com/indatawetrust/package-usage-analyzer/blob/main/lib/index.js
function analyzeUsage() {
    const files = globSync('src/**/*.{j,t}{s,sx}', { ignore: 'node_modules' });
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
