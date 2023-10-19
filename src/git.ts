import child_process from 'child_process';

export type Commit = {
    hash: string;
    date: string;
    author: string;
    message: string;
};

export function getCommits() {
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

export function checkoutHash(hash: string) {
    child_process.execSync(`git checkout ${hash}`);
}
