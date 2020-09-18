module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ?
        '/apps/auditoria-aeropuerto/app-aeropuerto/' : '/',
    pwa: {
        workboxOptions: {
            skipWaiting: true
        }
    }
}