var AppBranding = (function(){

    var block = false;
    var form = [ 'cmonth', 'cyear', 'name', 'umonth', 'uyear', 'version' ];
    var template = [ 'html-badge', 'html-cdate', 'html-udate', 'html-initials', 'html-name', 'html-version' ];

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
                html2canvas(
                    elems.template['html-badge'], {
                        backgroundColor: 'rgb(255, 255, 255, 0)'
                    }
                ).then( canvas => {
                    var svg = document.createElement( 'img' );
                    // get base64 encoded png data url from Canvas
                    svg.src = canvas.toDataURL("image/png");

                	document.getElementById('canvas-brand').innerHTML = '';
                	document.getElementById('canvas-brand').appendChild( canvas );
                	document.getElementById('svg-brand').innerHTML = '';
                	document.getElementById('svg-brand').appendChild( svg );
                } );
            }

            block = false;
        }
    };

    /** **/
    domReady( initialize );

    return {};
})();
