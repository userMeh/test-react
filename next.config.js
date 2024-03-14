module.exports = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/home',
      },
      // {
      //   source: '/:path*',
      //   destination: '/pages/:path*'
      // },
    ];
  },
};
