/* globals module, require */

module.exports = function(grunt) {

  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    sass: {
      global: {
        options: {
          style: "compressed"
        },
        files: {
          "css/global.css": "scss/global.scss"
          // "css/global-unprefixed.css": "scss/global.scss"
        }
      }
    },

    // autoprefixer: {
    //   global: {
    //     src: "css/global-unprefixed.css",
    //     dest: "css/global.css"
    //   }
    // },

    shell: {
      jekyllServe: {
        command: "jekyll serve --baseurl="
      },
      jekyllBuild: {
        command: "jekyll build --config _config-dev.yml"
      }
    },

    watch: {
      options: {
        livereload: true
      },
      site: {
        files: [
          "*.md",
          "*.html",
          "*/*.md",
          "*/*.html",
          "_layouts/*.html",
          "_includes/*.html"
        ],
        tasks: ["shell:jekyllBuild"]
      },
      css: {
        files: ["scss/*.scss"],
        tasks: [
          "sass",
          // "autoprefixer",
          "shell:jekyllBuild"
        ]
      }
    }

  });

  require("load-grunt-tasks")(grunt);

  grunt.registerTask("serve", ["shell:jekyllServe"]);
  grunt.registerTask(
    "default",
    [
      "sass",
      // "autoprefixer",
      "shell:jekyllBuild",
      "watch"
    ]
  );
};
