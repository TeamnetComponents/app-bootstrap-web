// Generated on 2014-12-15 using generator-jhipster 1.10.2
'use strict';

var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

var contextPath = '/tdi';

var MIDDLEWARE_HOST = 'localhost';
var MIDDLEWARE_PORT = 8080;

var useExternalTomcat = false;

function rewriteUrl(backend) {
    var rewrite = {};
    if (useExternalTomcat) {
        rewrite['^/' + backend] = contextPath + '/' + backend;
    }

    console.log('return ' + rewrite);

    return rewrite;
}

function rewriteSetCookie(req, res, next) {

    var isProxyRequest = req.url.lastIndexOf('/', 0) === 0;
    if (isProxyRequest) {
        // we intercept the writeHead function, so that we can exchange headers just before they are written
        var oldWriteHead = res.writeHead;
        res.writeHead = function () {
            var cookie = res.getHeader('Set-Cookie');
            if (cookie) {
                res.setHeader('Set-Cookie', cookie.map(function (item) {
                    // Replace paths in all cookies. The simple string/replace approach might be too naive in some cases, so check before you copy&paste before thinking
                    return item.replace(/\/tdi/, '');
                }));
            }
            oldWriteHead.apply(res, arguments);
        };
    }
    next();
}



module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);


    grunt.initConfig({
        yeoman: {
            // configurable paths
            app: require('./bower.json').appPath || 'app',
            dist: 'src/main/webapp/dist',
            webapp: 'src/main/webapp'
        },
        watch: {
            styles: {
                files: ['src/main/webapp/styles/**/*.css'],
                tasks: ['copy:styles', 'autoprefixer']
            },
            livereload: {
                options: {
                    livereload: 35729
                },
                files: [
                    'src/main/webapp/**/*.html',
                    'src/main/webapp/**/*.json',
                    '.tmp/styles/**/*.css',
                    '{.tmp/,}src/main/webapp/scripts/**/*.js',
                    'src/main/webapp/images/**/*.{png,jpg,jpeg,gif,webp,svg}',

                    '../app-scheduler-ui/src/main/webapp/scheduler/**/*.{html,json,js,css,png,jpg,jpeg,gif,webp,svg}',
                    '../tdi-ui/src/main/webapp/**/*.{html,json,js,css,png,jpg,jpeg,gif,webp,svg}',
                    '../tdi-csvimp-plugin-ui/src/main/webapp/csvimp-plugin/**/*.{html,json,js,css,png,jpg,jpeg,gif,webp,svg}',
                    '../tdi-history-ui/src/main/webapp/history/**/*.{html,json,js,css,png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        autoprefixer: {
            options: ['last 1 version'],
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '**/*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },
        connect: {
            proxies: [
                {
                    context: '/data',
                    host: MIDDLEWARE_HOST,
                    port: MIDDLEWARE_PORT,
                    https: false,
                    changeOrigin: false,
                    rewrite: rewriteUrl('data')
                },
                {
                    context: '/app',
                    host: MIDDLEWARE_HOST,
                    port: MIDDLEWARE_PORT,
                    https: false,
                    changeOrigin: false,
                    rewrite: rewriteUrl('app')

                },

                {
                    context: '/metrics',
                    host: MIDDLEWARE_HOST,
                    port: MIDDLEWARE_PORT,
                    https: false,
                    changeOrigin: false,
                    rewrite: rewriteUrl('metrics')
                },
                {
                    context: '/dictionary',
                    host: MIDDLEWARE_HOST,
                    port: MIDDLEWARE_PORT,
                    https: false,
                    changeOrigin: false,
                    rewrite: rewriteUrl('dictionary')
                },
                {
                    context: '/role',
                    host: MIDDLEWARE_HOST,
                    port: MIDDLEWARE_PORT,
                    https: false,
                    changeOrigin: false,
                    rewrite: rewriteUrl('role')
                },
                {
                    context: '/dump',
                    host: MIDDLEWARE_HOST,
                    port: MIDDLEWARE_PORT,
                    https: false,
                    changeOrigin: false,
                    rewrite: rewriteUrl('dump')
                },
                {
                    context: '/health',
                    host: MIDDLEWARE_HOST,
                    port: MIDDLEWARE_PORT,
                    https: false,
                    changeOrigin: false,
                    rewrite: rewriteUrl('health')
                },
                {
                    context: '/configprops',
                    host: MIDDLEWARE_HOST,
                    port: MIDDLEWARE_PORT,
                    https: false,
                    changeOrigin: false,
                    rewrite: rewriteUrl('configprops')
                },
                {
                    context: '/beans',
                    host: MIDDLEWARE_HOST,
                    port: MIDDLEWARE_PORT,
                    https: false,
                    changeOrigin: false,
                    rewrite: rewriteUrl('beans')
                },
                {
                    context: '/api-docs',
                    host: MIDDLEWARE_HOST,
                    port: MIDDLEWARE_PORT,
                    https: false,
                    changeOrigin: false,
                    rewrite: rewriteUrl('api-docs')
                }
            ],
            options: {
                port: 9999,
                // Change this to 'localhost' to deny access to the server from outside.
                hostname: '0.0.0.0',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        'src/main/webapp'
                    ],
                    middleware: function (connect) {
                        var overlays =[];
                        if(useExternalTomcat){
                            overlays=[rewriteSetCookie, proxySnippet];
                        }else{
                            overlays=[proxySnippet];
                        }

                        overlays.push(connect.static('.tmp'));
                        overlays.push(connect.static('src/main/webapp/'));

                        overlays.push(connect.static('../tdi-ui/src/main/webapp'));
                        overlays.push(connect.static('../app-scheduler-ui/src/main/webapp'));
                        overlays.push(connect.static('../tdi-csvimp-plugin-ui/src/main/webapp'));
                        overlays.push(connect.static('../tdi-history-ui/src/main/webapp'));

                        return overlays;
                    }
                }
            },
            test: {
                options: {
                 port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        'overlays/**/*',
                        'src/main/webapp'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= yeoman.dist %>'
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'src/main/webapp/scripts/{,*/}*.js'
            ]
        },
        coffee: {
            options: {
                sourceMap: true,
                sourceRoot: ''
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/main/webapp/scripts',
                    src: '**/*.coffee',
                    dest: '.tmp/scripts',
                    ext: '.js'
                }]
            },
            test: {
                files: [{
                    expand: true,
                    cwd: 'test/spec',
                    src: '**/*.coffee',
                    dest: '.tmp/spec',
                    ext: '.js'
                }]
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: ['src/main/scss'],
                    cssDir: 'src/main/webapp/styles',
                    environment: 'production',
                    noLineComments: true,
                    outputStyle: 'compressed',
                    force: true
                }
            },
            dev: {
                options: {
                    sassDir: ['src/main/scss'],
                    cssDir: 'src/main/webapp/styles',
                    force: true
                }
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
            dist: {}
        },*/
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/**/*.js',
                        '<%= yeoman.dist %>/styles/**/*.css',
                        '<%= yeoman.dist %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= yeoman.dist %>/fonts/*'
                    ]
                }
            }
        },
        useminPrepare: {
            html: 'src/main/webapp/**/*.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/**/*.html'],
            css: ['<%= yeoman.dist %>/styles/**/*.css'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>/**/'],
                dirs: ['<%= yeoman.dist %>']
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/main/webapp/images',
                src: '**/*.{jpg,jpeg}', // we don't optimize PNG files as it doesn't work on Linux. If you are not on Linux, feel free to use '{,*/}*.{png,jpg,jpeg}'
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/main/webapp/images',
                    src: '**/*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
            // By default, your `index.html` <!-- Usemin Block --> will take care of minification. This option is
            // pre-configured if you do not wish to use Usemin blocks.
            dist: {
                 files: {
                     '<%= yeoman.webapp %>/styles/all.css': [
                         '<%= yeoman.webapp %>/styles/bootstrap.css',
                         '<%= yeoman.webapp %>/bower_components/jquery-ui/themes/base/all.css',
                         '<%= yeoman.webapp %>/bower_components/fontawesome/css/font-awesome.min.css',
                         '<%= yeoman.webapp %>/bower_components/fancybox/source/jquery.fancybox.css',
                         '<%= yeoman.webapp %>/bower_components/fullcalendar/dist/fullcalendar.css',
                         '<%= yeoman.webapp %>/bower_components/ng-xCharts/xcharts.min.css',
                         '<%= yeoman.webapp %>/bower_components/angular-ui-select/dist/select.min.css',
                         '<%= yeoman.webapp %>/bower_components/select2/dist/css/select2.min.css',
                         '<%= yeoman.webapp %>/bower_components/selectize/dist/css/selectize.css',
                         '<%= yeoman.webapp %>/bower_components/Justified-Gallery/dist/css/justifiedGallery.min.css',
                         //'<%= yeoman.webapp %>/bower_components/chartist/dist/chartist.min.css',
                         //'<%= yeoman.webapp %>/bower_components/app-menu/dist/styles/main.css',
                         //'<%= yeoman.webapp %>/bower_components/angular-ui-tree/dist/angular-ui-tree.min.css',
                         //'<%= yeoman.webapp %>/bower_components/app-menu-admin/dist/styles/main.css',
                         //'<%= yeoman.webapp %>/bower_components/angular-material/angular-material.css',
                         //'<%= yeoman.webapp %>/bower_components/angular-ui-grid/ui-grid.css',
                         //'<%= yeoman.webapp %>/bower_components/app-grid/dist/styles/main.css',
                         //'<%= yeoman.webapp %>/bower_components/angular-bootstrap/ui-bootstrap-csp.css',
                         //'<%= yeoman.webapp %>/styles/main.css',
                         //'<%= yeoman.webapp %>/styles/fonts/style.css',
                         //'<%= yeoman.webapp %>/styles/themes/tdi/theme.css',
                         //'<%= yeoman.webapp %>/styles/themes/tdi/tdi.css',
                         //'<%= yeoman.webapp %>/styles/themes/tdi/components.css'
                     ]
                 }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    conservativeCollapse: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['*.html', 'views/**/*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'src/main/webapp',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.html',
                        'views/*.html',
                        'images/**/*.{png,gif,webp}',
                        'fonts/*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: [
                        'generated/*'
                    ]
                }]
            },
            styles: {
                expand: true,
                cwd: 'src/main/webapp/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            },
            generateHerokuDirectory: {
                    expand: true,
                    dest: 'deploy/heroku',
                    src: [
                        'pom.xml',
                        'src/main/**'
                ]
            },
            generateOpenshiftDirectory: {
                    expand: true,
                    dest: 'deploy/openshift',
                    src: [
                        'pom.xml',
                        'src/main/**'
                ]
            }
        },
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        },
        karma: {
            unit: {
                configFile: 'src/test/javascript/karma.conf.js',
                singleRun: true
            }
        },
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
                }]
            }
        },
        replace: {
            dist: {
                src: ['<%= yeoman.dist %>/index.html'],
                    overwrite: true,                                 // overwrite matched source files
                    replacements: [{
                        from: '<div class="development"></div>',
                        to: ''
                    }]
                }
            },
        uglify: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/scripts/scripts.js': [
                        '<%= yeoman.dist %>/scripts/scripts.js'
                    ]
                }
            }
        },
        buildcontrol: {
            options: {
                commit: true,
                push: false,
                connectCommits: false,
                message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
            },
            heroku: {
                options: {
                    dir: 'deploy/heroku',
                    remote: 'heroku',
                    branch: 'master'
                }
            },
            openshift: {
                options: {
                    dir: 'deploy/openshift',
                    remote: 'openshift',
                    branch: 'master'
                }
            }
        }
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer',
            'configureProxies',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'copy:dist',
        'ngAnnotate',
        'cssmin',
        'replace',
        'uglify',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('buildHeroku', [
        'test',
        'build',
        'copy:generateHerokuDirectory'
    ]);

    grunt.registerTask('deployHeroku', [
        'test',
        'build',
        'copy:generateHerokuDirectory',
        'buildcontrol:heroku'
    ]);

    grunt.registerTask('buildOpenshift', [
        'test',
        'build',
        'copy:generateOpenshiftDirectory'
    ]);

    grunt.registerTask('deployOpenshift', [
        'test',
        'build',
        'copy:generateOpenshiftDirectory',
        'buildcontrol:openshift'
    ]);

    grunt.registerTask('default', [
        'test',
        'build'
    ]);
};
