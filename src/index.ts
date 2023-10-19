import { getCommits, checkoutHash } from './git';
import { analyzeUsage } from './analyze';

const commits = getCommits();
for (const commit of commits) {
    console.log(`(${commit.hash.substring(0, 5)}): On ${commit.date}, ${commit.author} committed ${commit.message}`);
    checkoutHash(commit.hash);
    const report = analyzeUsage('');
}
