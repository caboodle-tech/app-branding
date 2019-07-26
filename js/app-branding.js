var AppBranding = (function(){

    var block = false;
    var form = [ 'cmonth', 'cyear', 'name', 'umonth', 'uyear', 'version' ];
    var template = [ 'html-badge', 'html-cdate', 'html-udate', 'html-initials', 'html-name', 'html-version', 'html-badge-black', 'html-cdate-black', 'html-udate-black', 'html-initials-black', 'html-name-black', 'html-version-black' ];

    var elems = {
        'form': {},
        'template':  {}
    };

    var addEvent = function( type, elem, callback ){
        if( elem.addEventListener ) {
            // Modern browsers
            console.log( elem.addEventListener( type, callback ) );
        } else if( elem.attachEvent ) {
            // IE
            elem.attachEvent( 'on' + type, callback );
        } else {
            // Unsupported browser
            console.error('AppBranding will not work with the browser you are using.');
        }
    }

    /**
    * Vanilla Javascript DOM Ready function supporting IE 8+.
    *
    * @param {function} fn A function to call when the DOM is ready.
    * @see {@link http://youmightnotneedjquery.com/>}
    * @author adamfschwartz
    * @author zackbloom
    */
    var domReady = function( fn ) {
        if (document.readyState != 'loading'){
            fn();
        } else if (document.addEventListener) {
            document.addEventListener( 'DOMContentLoaded', fn );
        } else {
            document.attachEvent( 'onreadystatechange', function(){
                if (document.readyState != 'loading'){
                    fn();
                }
            });
        }
    };

    var getElement = function( id ){
        var elem = document.getElementById( id );
        if( elem ){ return elem; }
        return null;
    };

    var initialize = function(){

        var len = form.length;
        for( var x = 0; x < len; x++ ){
            elems.form[ form[ x ] ] = getElement( form[ x ]  );
            if( !elems.form[ form[ x ] ] ){
                // The form is missing something
                block = true;
                console.error('AppBranding will not work because there is an error with the badge data form. It is missing an input.');
            } else {
                addEvent( 'keyup', elems.form[ form[ x ] ], renderHtmlBrand );
            }
        }

        len = template.length;
        var id = '';
        for( x = 0; x < len; x++ ){
            elems.template[ template[ x ] ] = getElement( template[ x ]  );
            if( !elems.template[ template[ x ] ] ){
                // The HTML template is missing something
                block = true;
                console.error('AppBranding will not work because there is an error with the HTML template. It is missing something.');
            }
        }
    };

    var renderHtmlBrand = function(){
        if( !block ){
            block = true;

            var values = {};
            var ready = true;

            var len = form.length;
            for( var x = 0; x < len; x++ ){
                values[ form[ x ] ] = elems.form[ form[ x ] ].value;
                if( !values[ form[ x ] ] ){
                    ready = false;
                }
            }

            if( ready ){

                // Update the HTML example and then use it to build the PNG and SVG
                var cmonth = elems.form['cmonth'].value;
                var cyear = elems.form['cyear'].value;
                var name = elems.form['name'].value;
                var tmpInitials = name;
                tmpInitials = tmpInitials.replace(/\[[^)]*\]/g, '');
                tmpInitials = tmpInitials.split(' ');
                console.log( tmpInitials );
                var initials = '';
                var counter = 0;
                for( var x = 0; x < tmpInitials.length; x++ ){
                    if( counter > 2 ){
                        break;
                    }
                    if( tmpInitials[x][0] ){
                        initials += tmpInitials[x][0];
                        counter++;
                    }
                }
                initials = initials.toLowerCase();
                console.log( initials );
                initials = initials.charAt(0).toUpperCase() + initials.slice(1);
                name = name.replace(/\[|\]/g, '');
                var umonth = elems.form['umonth'].value;
                var uyear = elems.form['uyear'].value;
                var tmpVersion = elems.form['version'].value;
                tmpVersion = tmpVersion.split('.');
                if( tmpVersion.length == 3 ){
                    if( parseInt( tmpVersion[0] ) > 0 ){
                        version = tmpVersion[0] + '.' + tmpVersion[1] + '.' + tmpVersion[2];
                    } else if ( parseInt( tmpVersion[1] ) > 0 ) {
                        version = 'Beta: ' + tmpVersion[1];
                    } else {
                        version = 'Alpha: ' + tmpVersion[2];
                    }
                } else {
                    version = '???';
                }

                // TODO: add validation!

                elems.template['html-cdate'].innerHTML = cmonth + cyear;
                elems.template['html-udate'].innerHTML = umonth + uyear;
                elems.template['html-initials'].innerHTML = initials;
                elems.template['html-name'].innerHTML = name;
                elems.template['html-version'].innerHTML = version;

                domtoimage.toPng( elems.template['html-badge'] ).then(function (dataUrl) {
                    var img = new Image();
                    img.src = dataUrl;
                    document.getElementById('canvas-brand').innerHTML = '';
                	document.getElementById('canvas-brand').appendChild( img );
                })
                .catch(function (error) {
                    console.error('oops, something went wrong!', error);
                });

                domtoimage.toSvg( elems.template['html-badge'] ).then(function (dataUrl) {
                    var img = new Image();
                    img.src = dataUrl;
                    document.getElementById('svg-brand').innerHTML = '';
                	document.getElementById('svg-brand').appendChild( img );
                })
                .catch(function (error) {
                    console.error('oops, something went wrong!', error);
                });

                elems.template['html-cdate-black'].innerHTML = cmonth + cyear;
                elems.template['html-udate-black'].innerHTML = umonth + uyear;
                elems.template['html-initials-black'].innerHTML = initials;
                elems.template['html-name-black'].innerHTML = name;
                elems.template['html-version-black'].innerHTML = version;

                domtoimage.toPng( elems.template['html-badge-black'] ).then(function (dataUrl) {
                    var img = new Image();
                    img.src = dataUrl;
                    document.getElementById('canvas-brand-black').innerHTML = '';
                	document.getElementById('canvas-brand-black').appendChild( img );
                })
                .catch(function (error) {
                    console.error('oops, something went wrong!', error);
                });

                domtoimage.toSvg( elems.template['html-badge-black'] ).then(function (dataUrl) {
                    var img = new Image();
                    img.src = dataUrl;
                    document.getElementById('svg-brand-black').innerHTML = '';
                	document.getElementById('svg-brand-black').appendChild( img );
                })
                .catch(function (error) {
                    console.error('oops, something went wrong!', error);
                });
            }

            block = false;
        }
    };

    domReady( initialize );

    return {};
})();
