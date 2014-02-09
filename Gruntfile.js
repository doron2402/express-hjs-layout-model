module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            css: {
                src: [
                    'public/components/foundation/css/normalize.css',
                    'public/components/foundation/css/foundation.css',
                    'public/components/jqplot/css/jquery.jqplot.min.css',
                    'public/stylesheets/lib/*.css'
                ],
                dest: 'public/stylesheets/style.css'
            },
            js: {
                src: [
                    'public/components/jquery/jquery.js',
                    'public/components/jquery-placeholder/jquery.placeholder.js',
                    'public/components/jquery.cookie/jquery.cookie.js',
                    'public/components/foundation/foundation.js',
                    'public/components/angular/angular.js',
                    'public/components/jqplot/jquery.jqplot.min.js',

                    /* !!!!!!!!!!! jqplot plugins !!!!!!!!!!!!*/

                    'public/components/jqplot/plugins/*'

                ],
                dest: 'public/javascripts/main.js'
            },
            jqplot:{
                /* !!!!!!!!!!! jqplot plugins (adding all plugins into one file) !!!!!!!!!!!!*/
                src:[
                    'public/components/jqplot/plugins/*'
                ],
                dest: 'public/javascripts/jqplot-plugins.js'
            },
            js_app: {
                src: [
                    'public/javascripts/controllers/*',
                    'public/javascripts/models/*',
                    'public/javascripts/routes/*',
                    'public/javascripts/main-jqplot.js'
                ],
                dest: 'public/javascripts/app.js'
            },
            js_admin: {
                src: [
                    'public/secure_app/main.js',
                    'public/secure_app/controllers/*.js',
                    'public/secure_app/models/*.js',
                    'public/secure_app/routes/*.js'
                ],
                dest: 'public/javascripts/admin_app.js'
            }
        },
        cssmin: {
            css: {
                src: [
                    'public/stylesheets/style.css'
                ],
                dest: 'public/stylesheets/mainStyle.min.css'
            }
        },
        uglify: {
            js: {
                files: {
                    'public/javascripts/main.min.js': ['public/javascripts/main.js']
                }
            }
        },
        watch: {
    		files: ['public/stylesheets/lib/*', 'public/javascripts/lib/*'],
      		tasks: ['concat', 'cssmin', 'uglify']
   		},
        nodemon: {
            dev: {
                script: 'app.js',
                tasks: ['nodemon','watch'],
                options: {
                  args: ['dev'],
                  nodeArgs: ['--debug'],
                  logConcurrentOutput: true,
                  env: {
                    PORT: '3000'
                  },
                  cwd: __dirname,
                  ignore: ['node_modules/**'],
                  ext: 'js',
                  watch: ['server'],
                  delayTime: 1,
                  legacyWatch: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-nodemon');

    //Defualt
    grunt.registerTask('default', ['concat','cssmin','nodemon:dev','watch']);
    //CSS
    grunt.registerTask('css', ['concat:css','cssmin:css']);
    //JS
    grunt.registerTask('js', ['concat:js','uglify:js']);
};