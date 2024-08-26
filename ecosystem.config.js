module.exports = {
    apps : [{
        name: 'sockets',
        cwd: '/home/master/applications/sockets/public_html',
        script: 'npm',
        args: 'start',
        watch: '.',
        env: {
            PORT: 3015,
    NODE_OPTIONS: "--openssl-legacy-provider"
        }
    }],
}