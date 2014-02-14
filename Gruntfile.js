module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            css: {
                src: [
                    'public/components/foundation/css/normalize.css',
                    'public/components/foundation/css/foundation.css',
                    'public/stylesheets/lib/*.css'
                ],
                dest: 'public/stylesheets/style.css'
            },
            js_main: {
                src: [
                    'public/components/jquery/jquery.js',
                    'public/components/angular/angular.js',
                    'public/components/angular-cookies/angular-cookies.js',
                    'public/components/angular-route/angular-route.js',
                    'public/components/angular-google-chart/ng-google-chart.js',
                    'public/components/foundation/foundation.js',
                    'public/components/angular-google-chart/ng-google-chart.js'
                ],
                dest: 'public/javascripts/public_main.js'
            },
            js_app: {
                src: [
                    'public/javascripts/controllers/*',
                    'public/javascripts/models/*',
                    'public/javascripts/routes/*',
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