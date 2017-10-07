module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        
        files: [
          { src:"less/common.less", dest: "css/common.css" },
          { src:"less/home.less", dest: "css/home.css" },
          { src:"less/my-account.less", dest: "css/my-account.css" },

          // { src:"less/new/profile-detail.less", dest: "css/profile-detail.css" },
          // { src:"less/new/search.less", dest: "css/search.css" },
          // { src:"less/new/party-detail.less", dest: "css/party-detail.css" },
          // { src:"less/new/static-pages.less", dest: "css/static-pages.css" },
          // { src:"less/new/myprofile.less", dest: "css/myprofile.css" },
          { src:"less/claimprofiletype.less", dest: "css/claimprofiletype.css" },
          //{ src:"less/new/signup-page.less", dest: "css/signup-page.css" },
          { src:"less/blog.less", dest: "css/blog.css" },
          { src:"less/blog-inner.less", dest: "css/blog-inner.css" },
          { src:"less/rd-profile.less", dest: "css/rd-profile.css" },
          { src:"less/rd-party.less", dest: "css/rd-party.css" },
          { src:"less/rdsearch.less", dest: "css/rdsearch.css" },
          { src:"less/orderid.less", dest: "css/orderid.css" },
          { src:"less/onboard.less", dest: "css/onboard.css" },
          { src:"less/client-panel.less", dest: "css/client-panel.css" },
          { src:"less/career.less", dest: "css/career.css" },
          { src:"admin/less/external.less", dest: "admin/css/external.css" },
          { src:"business-purposal/less/common.less", dest: "business-purposal/css/common.css" },
          // { src:"client-details/less/client-panel.less", dest: "client-details/css/client-panel.css" },
          { src:"payment/less/payment-panel.less", dest: "payment/css/payment-panel.css" },
          { src:"less/artist-profile.less", dest: "css/artist-profile.css" },

        ],
      },

    },
    watch: {
      styles: {
        // files:['less/**/*.less'], // which files to watch
        files:['less/**/*.less','admin/less/**/*.less','business-purposal/less/**/*.less','client-details/less/**/*.less','payment/less/**/*.less'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.registerTask('default', ['less', 'watch']);
};