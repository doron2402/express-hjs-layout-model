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
            js: {
                src: [
                    'public/components/jquery/jquery.js',
                    'public/components/jquery-placeholder/jquery.placeholder.js',
                    'public/components/jquery.cookie/jquery.cookie.js',
                    'public/components/lodash/dist/lodash.js',
                    'public/components/fastclick/lib/fastclick.js',
                    'public/components/modernizr/modernizr.js',
                    'public/components/foundation/foundation.js'
                ],
                dest: 'public/javascripts/main.js'
            }
        },
        cssmin: {
            css: {
                src: [
                    'public/components/foundation/css/normalize.css',
                    'public/components/foundation/css/foundation.css',
                	'public/stylesheets/lib/*.css'
                ],
                dest: 'public/stylesheets/style.min.css'
            }
        },
        uglify: {
            js: {
                files: {
                    'public/javascripts/main.min.js': ['public/javascripts/main.js']
                }
            },
            css: {
                files: {
                  'public/stylesheets/style.min.css': ['public/stylesheets/style.css']  
                }
            }
        },
        watch: {
    		files: ['public/stylesheets/lib/*', 'public/javascripts/lib/*'],
      		tasks: ['concat', 'cssmin', 'uglify']
   		}
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    
    //Defualt
    grunt.registerTask('default', ['concat:css', 'cssmin:css', 'concat:js', 'uglify:js']);
    //CSS
    grunt.registerTask('css', ['concat:css','cssmin:css']);
    //JS
    grunt.registerTask('js', ['concat:js','uglify:js']);
};