module.exports = function(grunt) {
	'use strict';

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-includes');
	grunt.loadNpmTasks('grunt-notify');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ['js', 'styles', './*.html'],
		concat: {
			dist: {
				src: ['src/**/*.js'],
				dest: 'js/base.js'
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'index.html': 'index.html'
				}
			}
		},
		jshint: {
			files: ['gruntfile.js', 'src/**/*.js'],
			options: {
				globals: {
					bitwise: true,
					browser: true,
					camelcase: true,
					curly: true,
					eqeqeq: true,
					eqnull: true,
					forin: true,
					immed: true,
					indent: 1,
					latedef: true,
					newcap: true,
					noarg: true,
					noempty: true,
					strict: true,
					undef: true,
					trailing: true,
					unused: true
				}
			}
		},
		less: {
			dev: {
				options: {
					paths: ["src/styles"],
					yuicompress: false
				},
				files: {
					"styles/style.css": "src/styles/style.less"
				}
			},
			prod: {
				options: {
					paths: ["src/styles"],
					yuicompress: true
				},
				files: {
					"styles/style.css": "src/styles/style.less"
				}
			}
		},
		includes: {
			files: {
				src: ['src/**/*.html', '!src/**/partials/*.html'],
				dest: '.',
				flatten: true,
				cwd: '.'
			}
		},
		uglify: {
			dist: {
				files: {
					'js/base.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		watch: {
			include: {
				files: ['src/**/*.html'],
				tasks: ['includes']
			},
			less: {
				files: ['src/**/*.less'],
				tasks: ['less:dev']
			},
			javascripts: {
				files: ['src/**/*.js'],
				tasks: ['jshint', 'concat']
			}
		}
	});

	grunt.registerTask('dev', ['includes', 'jshint', 'concat', 'less:dev']);
	grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'less:prod', 'includes', 'htmlmin']);
};